const AppError = require("../utils/appError");
const conn = require("../services/db");
var https = require('follow-redirects').https;
const axios = require('axios');
const dotenv = require('dotenv').config();
const util = require('util');
const promisify = util.promisify;
const queryAsync = promisify(conn.query).bind(conn);
const dater = require(".././config");
const currentDate = dater.app.date;
const jwt = require('jsonwebtoken');

function generateAccessToken(username) {
    const secretKey = process.env.TOKEN_SECRET;

    return jwt.sign(username, secretKey);
}

exports.login = async (req, res, next) => {
    const { eko_id, password, userType } = req.body;
    //eko_id is the eko ID for physicians bu student mail for the student
    //userTypes => 0: öğrenci,1: idari

    var user;

    if (!req.body) {
        return next(new AppError("No login data found", 404));
    }

    try {
        if (userType == 0) { //if the user is student

            const query = `select * from student s where s.eko_id = ? && s.is_active = 1;`;
            const value = [eko_id]; //actually the mail of the std

            const data = await queryAsync(query, value);

            if (data && data.length > 0) {
                user = data[0];
                console.log(user);
            } else {
                return res.status(404).json({ message: "Student permissions are not setted." });

            }

        } else if (userType == 1) { //if the user is physician

            const query = `select * from attendingphysicians att where att.eko_id = ? && is_active = 1`;
            const value = [eko_id];

            const data = await queryAsync(query, value);

            if (data && data.length > 0) {
                user = data[0];
                console.log(user);
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



                const controllEnrollment = await queryAsync(query, value);

                if (controllEnrollment && controllEnrollment.length > 0) {

                    const stdID = controllEnrollment[0]["student_id"];
                    //generate a new token to user
                    const token = generateAccessToken({
                        username: stdID.toString()
                    });

                    const query = `UPDATE student SET token = ? WHERE ID = ?;`;
                    const value = [token, stdID];
                    const tokenInsertion = await queryAsync(query, value);

                    console.log(stdID);
                    console.log(token);
                    console.log(tokenInsertion);

                    if (tokenInsertion && tokenInsertion.affectedRows > 0) {
                        console.log("in!");
                        const returnedData = {
                            fullName: st.data.displayname, //username 
                            email: st.data.email, //msil
                            ekoid: st.data.ekoid, //ekoid
                            ID: user.ID, //student ID
                            token: token
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
                const token = generateAccessToken({
                    username: physicianID.toString()
                });

                const query = `UPDATE attendingphysicians SET token = ? WHERE ID = ?;`;
                const value = [token, physicianID];
                const tokenInsertion = await queryAsync(query, value);

                if (tokenInsertion && tokenInsertion.affectedRows > 0) {

                    const returnedData = {
                        fullName: st.data.displayname, //username 
                        email: st.data.email, //mail
                        ekoid: st.data.ekoid, //ekoid
                        ID: user.ID, //physician ID
                        token: token, //token
                    };

                    return res.status(200).json(returnedData);
                }
            }

        } else {
            return res.status(400).json({ message: "User could not be authenticated." });
        }

    } catch (error) {
        return res.status(500).json({ message: "Wrong username or password." });
    }

}
