const AppError = require("../utils/AppError");
const conn = require("../services/db");
var https = require('follow-redirects').https;
const axios = require('axios');
const dotenv = require('dotenv').config();
const util = require('util');
const dater = require(".././config");
const currentDate = dater.app.date;
const generateAccessToken = require('../utils/generateToken');
const crypto = require('crypto');
const FormData = require('form-data');

exports.login = async (req, res, next) => {
    const { eko_id, password, userType } = req.body;
    //eko_id is the eko ID for physicians bu student mail for the student
    //userTypes => 0: öğrenci,1: idari

    var user;

    if (!req.body) {
        return next(new AppError("No login data found", 404));
    }
    const connection = await conn.getConnection();

    try {

        //////////////////// 1- check if user is in my db
        if (userType == 0) { //if the user is student

            const query = `select * from student s where s.eko_id = ? && s.is_active = 1;`;
            const value = [eko_id]; //actually the mail of the std

            const [results] = await connection.execute(query, value);

            if (results && results.length > 0) {
                user = results[0];
                // console.log("first pass std: ");
                console.log(user);
            } else {
                return res.status(404).json({ message: "Student permissions are not setted." });

            }

        } else if (userType == 1) { //if the user is physician

            const query = `select * from attendingphysicians att where att.eko_id = ? && is_active = 1`;
            const value = [eko_id];

            const [results] = await connection.execute(query, value);

            if (results && results.length > 0) {
                user = results[0];
                // console.log("first pass phy: ");
                // console.log(user);
            } else {
                return res.status(404).json({ message: "Physician permissions are not setted." });

            }
        }

        const config = {
            siteURL: "https://emax.ieu.edu.tr/auth/default/index",
            userAgent: "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.204 Safari/534.16"
        };

        const encodedPassword = encodeURIComponent(password);
        const postFields = `username=${eko_id}&password=${encodedPassword}&user_type=${userType}&ip=0&app_token=APPMEDSIS`;

        const response = await axios.post(config.siteURL, postFields, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': config.userAgent,
                'Referer': config.siteURL
            },
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        const st = response.data;

        if (st.status == 400 && st.code == 0) {
            // Handle the scenario where it's not an error but a specific response
            // For example, you might log this, or handle it differently based on your application's logic
            console.log("Response indicates a special case, not an error.");
        } else {
            // Proceed with your error handling as before
            if ((st.status == 400 || st.code == 0) && userType == 1) {
                // Rest of your error handling logic for physicians
            } else if (st.code == 200 && st.token) {
                // Rest of your logic for successful responses
            } else {
                // Handle other cases
            }
        }

        console.log("st");
        console.log(st.code);

        if ((st.status == 400 || st.code == 0) && userType == 1) {

            const md5Pswd = crypto.createHash('md5').update(password).digest('hex');

            let formData = new FormData();
            formData.append('app_token', 'APPMEDSIS');
            formData.append('user_type', userType);
            formData.append('username', eko_id);
            formData.append('password', md5Pswd);

            let options = {
                method: "POST",
                headers: { "Content-Type": "multipart/form-data" },
                data: formData,
                url: "https://oasis.izmirekonomi.edu.tr/oasis_api/general/general/login-medsis",
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            };

            await axios(options).then(async (response) => {

                const { fullName2, email2, ekoid2, ID2, status2 } = response.data;

                console.log(response.data);

                if (status2 == 200) {

                    const physicianID = ID2;//tc kimlik no

                    //generate a new token to user
                    const { token, expirationDate } = generateAccessToken({
                        username: ID2.toString()
                    });

                    const query = `UPDATE attendingphysicians SET token = ? WHERE ID = ?;`;
                    const value = [token, physicianID];
                    const [tokenInsertion] = await connection.execute(query, value);

                    if (tokenInsertion && tokenInsertion.affectedRows > 0) {

                        const returnedData = {
                            fullName: fullName2, //username 
                            email: email2, //mail
                            ekoid: ekoid2, //ekoid
                            ID: physicianID, //physician ID
                            token: token, //token
                            expirationDate: expirationDate, //token
                        };

                        return res.status(200).json(returnedData);
                    }
                }
                else {
                    return res.status(400).json({ message: "User could not be found in the system." });
                }

            }).catch((error) => {
                return res.status(400).json({ message: "User could not be authenticatedddddddddd." });
            });

        } else if (st.code == 200 && st.token) {
            if (userType == 0) { //if user is a student and required info is handled
                const value = [user["ID"], currentDate]; //actually the mail of the std

                const query = `SELECT
                    s.ID AS student_id,
                    s.name AS student_name,
                    r.id AS rotation_id,
                    rc.course_id,
                    i.start AS interval_start,
                    i.end AS interval_end
                FROM
                    student s
                JOIN
                    enrollment e ON s.ID = e.std_id
                JOIN
                    rotations r ON e.rotation_id = r.id
                LEFT JOIN
                    rotation_courses rc ON r.id = rc.rotation_id
                LEFT JOIN
                    intervals i ON rc.interval_id = i.ID
                WHERE
                    s.ID = ? 
                    AND r.id IS NOT NULL 
                    AND ? BETWEEN i.start AND i.end;`;


                const [controllEnrollment] = await connection.execute(query, value);

                if (controllEnrollment && controllEnrollment.length > 0) {

                    const stdID = controllEnrollment[0]["student_id"];
                    //generate a new token to user
                    const { token, expirationDate } = generateAccessToken({
                        username: stdID.toString()
                    });

                    const query = `UPDATE student SET token = ? WHERE ID = ?;`;
                    const value = [token, stdID];
                    const [tokenInsertion] = await connection.execute(query, value);

                    if (tokenInsertion && tokenInsertion.affectedRows > 0) {

                        const returnedData = {
                            fullName: st.data.displayname, //username 
                            email: st.data.email, //msil
                            ekoid: st.data.ekoid, //ekoid
                            ID: user.ID, //student ID
                            token: token,
                            expirationDate: expirationDate
                        };

                        return res.status(200).json(returnedData);
                    }

                } else {
                    return res.status(404).json({ message: "Student currently doesn't have course in time interval or is not enrolled in any rotation." });

                }
            }
            else {//if user is a physician and required info is handled

                const physicianID = user["ID"];
                //generate a new token to user
                const { token, expirationDate } = generateAccessToken({
                    username: physicianID.toString()
                });

                const query = `UPDATE attendingphysicians SET token = ? WHERE ID = ?;`;
                const value = [token, physicianID];
                const [tokenInsertion] = await connection.execute(query, value);

                if (tokenInsertion && tokenInsertion.affectedRows > 0) {

                    const returnedData = {
                        fullName: st.data.displayname, //username 
                        email: st.data.email, //mail
                        ekoid: st.data.ekoid, //ekoid
                        ID: user.ID, //physician ID
                        token: token, //token
                        expirationDate: expirationDate, //token
                    };

                    return res.status(200).json(returnedData);
                }
            }
            ////////////////// 2- check if PHYSICIAN is enrolled in OASIS 
        } else {
            return res.status(200).json({ message: "No user data found." });
        }

        connection.release();
    } catch (error) {
        // Handle any errors that occur during the request
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Server responded with status:', error.response.status);
            console.error('Response data:', error.response.data);

            // Check if the error code is 439
            if (error.response.status === 439) {
                console.error('Handling error code 439...');
                // Handle error code 439 here
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from server:', error.request);
        } else {
            // Something else went wrong
            console.error('Error during request:', error.message);
        }

        // Check for TLS certificate validation error
        if (error.message && error.message.includes('ERR_TLS_CERT_ALTNAME_INVALID')) {
            console.error('TLS certificate validation error:', error.message);
            // Handle TLS certificate validation error here
        }
        connection.release();
        return res.status(500).json({ message: "Wrong username or password1." });
    }

}
