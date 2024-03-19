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
// const FormData = require('form-data');

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
                // console.log(user);
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
            siteURL: "https://oasis.izmirekonomi.edu.tr/oasis_api/general/general/login-medsis",
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

        ////////////////// 2- check if user is enrolled in LDAP 

        if (st.code == 200 && st.token) {
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
        } else if (st.code != 200 && userType == 1) {

            const md5Pswd = crypto.createHash('md5').update(password).digest('hex');
            console.log(md5Pswd);

            const formData = axios.toFormData({
                'app_token': 'APPMEDSIS',
                'user_type': userType,
                'username': eko_id,
                'password': md5Pswd
            });
            console.log(formData);

            let options = {
                method: "POST",
                headers: { "content-type": "application/x-www-form-urlencoded" },
                data: formData,
                url: "https://oasis.izmirekonomi.edu.tr/oasis_api/general/general/login-medsis",
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            };

            await axios(options).then(async (response) => {
                console.log(response);
                // // console.log("response");
                // // console.log(response);
                // const oasisSt = response;
                // // console.log("oasisSt");
                // console.log(oasisSt.status);
                // console.log(formData);

                // if (oasisSt.status == 200) {

                //     const physicianID = oasisSt["ID"];//tc kimlik no

                //     //generate a new token to user
                //     const { token, expirationDate } = generateAccessToken({
                //         username: physicianID.toString()
                //     });

                //     const query = `UPDATE attendingphysicians SET token = ? WHERE ID = ?;`;
                //     const value = [token, physicianID];
                //     const [tokenInsertion] = await connection.execute(query, value);

                //     if (tokenInsertion && tokenInsertion.affectedRows > 0) {

                //         const returnedData = {
                //             fullName: oasisSt.fullName, //username 
                //             email: oasisSt.email, //mail
                //             ekoid: oasisSt.ekoid, //ekoid
                //             ID: physicianID, //physician ID
                //             token: token, //token
                //             expirationDate: expirationDate, //token
                //         };

                //         return res.status(200).json(returnedData);
                //     }
                // }
                // else {
                //     return res.status(400).json({ message: "User could not be find in the system." });
                // }

            }).catch((error) => {
                // console.log(error);

                return res.status(400).json({ message: "User could not be authenticatedddddddddd." });
            });

        } else {
            return res.status(400).json({ message: "User could not be authenticated11111111." });
        }

        connection.release();
    } catch (error) {
        connection.release();
        return res.status(500).json({ message: "Wrong username or password." });
    }

}
