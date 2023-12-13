const AppError = require("../utils/appError");
const conn = require("../services/db");
var https = require('follow-redirects').https;
const crypto = require('crypto');
var fs = require('fs');
const axios = require('axios');
require('dotenv').config();
const util = require('util');
const promisify = util.promisify;
const queryAsync = promisify(conn.query).bind(conn);
const CryptoJS = require("crypto-js");

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

            const query = `select * from student s where s.email = ?;`;
            const value = [eko_id]; //actually the mail of the std

            const data = await queryAsync(query, value);

            if (data && data.length > 0) {
                user = data[0];
                console.log(user);
            } else {
                return res.status(200).json("Student permissions are not setted.");

            }

        } else if (userType == 1) { //if the user is physician

            const query = `select * from attendingphysicians att where att.eko_id = ?`;
            const value = [eko_id];

            conn.query(
                query, value,
                function (err, data, fields) {
                    if (err) return next(new AppError(err, 500));

                    if (data && data.length > 0) { //if user is in the db
                        user = data[0];

                    } else {
                        // User with the provided eko_id not found, return false
                        return res.status(200).json({ "message": "Physician permissions are not setted." });

                    }
                }
            );
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
        // $decryptedToken = openssl_decrypt($encryptedToken, "AES-256-CBC", $secretKey, 0,generateHashSubstring());
        if (st.code == 200 && st.token) {
            const encryptedToken = st.token;
            const secretKey = process.env.LDAP_SECRETKEY;

            const decryptedToken = decryptToken(encryptedToken, secretKey);

            const checkTokenURL = "https://emax.ieu.edu.tr/auth/default/check-token";
            const checkTokenPostFields = `token=${decryptedToken}&appToken=APPMEDSIS&ip=0`;

            const checkTokenResponse = await axios.post(checkTokenURL, checkTokenPostFields, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': config.userAgent,
                    'Referer': config.siteURL
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });

            const userData = checkTokenResponse.data;

            if (userData.process && userData.user && userData.user.username) {

                console.log(userData + "aaaaaaaa");
                res.status(200).json({
                    ekoID: userData.user.username,
                    fullName: userData.user.displayname,
                    email: userData.user.mail
                });
            } else {
                res.status(404).json({ message: "User information not found." });
            }
        } else {
            res.status(401).json({ message: "User could not be authenticated." });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

function generateHashSubstring(secretKey) {
    const md5Hash = CryptoJS.MD5(secretKey).toString();
    // Ensure the key is 32 bytes (256 bits) by repeating or padding as needed
    const key = md5Hash.padEnd(32, '0').substring(0, 32);
    return key;
}


async function decryptToken(encryptedToken, secretKey) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(generateHashSubstring(secretKey)), Buffer.alloc(16));
    
    let decrypted = decipher.update(encryptedToken, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}

