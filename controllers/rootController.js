// const AppError = require("../utils/appError");
// const conn = require("../services/db");
// var https = require('follow-redirects').https;
// const crypto = require('crypto');
// var fs = require('fs');
// const axios = require('axios');
// // const rootCas = require('ssl-root-cas').create();

// exports.login = (req, res2, next) => {
//     if (!req.body) {
//         return next(new AppError('Invalid credentials', 404));
//     }

//     const { stu_id, paswd } = req.body;
//     const apiKey = process.env.OASIS_APIKEY;
//     const secretKey = process.env.OASIS_SECRETKEY;
//     const epoch = calculateEpoch();
//     const signature = calculateSignature(apiKey, secretKey, epoch);

//     const Authusername = stu_id;
//     const Authpassword = paswd;

//     console.log('Username:', Authusername);
//     console.log('Password:', Authpassword);

//     const basicAuth = base64Encode(Authusername + Authpassword);
//     console.log("basicAuth: ", basicAuth);

//     // const certificateFile = fs.readFileSync('ca/certificate.crt');
//     // const privateKeyContent = fs.readFileSync('ca/private.key', 'utf-8');
//     // const certificateContent = fs.readFileSync('ca/certificate.crt', 'utf-8');
//     // const combinedCertAndKey = privateKeyContent + '\n' + certificateContent;

//     rootCas.addFile(path.resolve(__dirname, 'intermediate.pem'));

//     var postData = JSON.stringify({
//         "signature": signature,
//         "epoch": epoch,
//         "stu_id": stu_id
//     });

//     const agent = new https.Agent({ ca: rootCas });

//     const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': 'Basic ' + basicAuth,
//     };

//     axios.post(
//         "https://oasis.izmirekonomi.edu.tr/oasis_api/mobil/mobil/get-stuinfo",
//         postData,
//         {
//             headers, httpsAgent: agent
//         }
//     ).then(response => {
//         // Handle the response
//         console.log(response.data);
//         res2.status(200).json({
//             status: "success",
//             data: response.data,
//         });
//     }).catch(error => {
//         // Handle errors
//         console.error(error);
//     });


//     // var options = {
//     //     'method': 'POST',
//     //     'hostname': 'oasis.izmirekonomi.edu.tr',
//     //     'path': '/oasis_api/mobil/mobil/get-stuinfo',
//     //     'headers': {
//     //         'Content-Type': 'application/json',
//     //         'Content-Length': Buffer.byteLength(postData, 'utf8'),
//     //         'Authorization': 'Basic ' + basicAuth,
//     //     },
//     //     'maxRedirects': 20,
//     //     ca: [certificateFile],
//     //     rejectUnauthorized: false,
//     // };
//     // var chunks = []; // Move the declaration outside the request callback
//     //url,data,header

//     // var req = https.request(options, function (res) {
//     //     res.on("data", function (chunk) {
//     //         chunks.push(chunk);
//     //     });

//     //     res.on("end", function () {
//     //         // No need to do anything in this block, you can handle it in the 'finish' event
//     //     });

//     //     res.on("error", function (error) {
//     //         return next(new AppError(error, 404));
//     //     });
//     // });

//     // req.write(postData);

//     // req.on('end', function () {
//     //     // The 'finish' event indicates that the request has been sent
//     //     var body = Buffer.concat(chunks);
//     //     var responseBody = JSON.parse(body.toString());

//     //     res2.status(200).json({
//     //         status: "success",
//     //         data: responseBody,
//     //     });
//     // });

//     // req.on('error', function(error) {
//     //     console.error('Error sending request:', error);
//     //     return next(new AppError(error, 404));
//     // });

//     // req.end();

//     function calculateEpoch() {
//         const epoch = Math.round(new Date().getTime());
//         console.log(epoch);
//         return epoch;
//     }

//     function calculateSignature(apiKey, secretKey, epoch) {
//         const dataToHash = `${apiKey}${secretKey}${epoch}`;
//         const hashedData = crypto.createHash('md5').update(dataToHash).digest('hex');
//         console.log(hashedData.toUpperCase());
//         return hashedData.toUpperCase();
//     }

//     function base64Encode(str) {
//         const buffer = Buffer.from(str, 'utf-8');
//         const base64Encoded = buffer.toString('base64');
//         return base64Encoded;
//     }

// }



// // var bodyData = JSON.stringify({
// //     "signature": signature,
// //     "epoch": epoch,
// //     "stu_id": stu_id
// // });
// // axios.post(`https://${options.hostname}${options.path}`, bodyData, {
// //     headers: options.headers,
// //     maxRedirects: options.maxRedirects,
// //     ca: [certificateFile],
// //     rejectUnauthorized: options.rejectUnauthorized,
// // })
// //     .then(response => {
// //         console.log('Response:', response.data);

// //         // Assuming response.data is already a string or Buffer
// //         var responseBody = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

// //         res2.status(200).json({
// //             status: "success",
// //             data: responseBody,
// //         });
// //     })
// //     .catch(error => {
// //         console.error('Error:', error);

// //         // Better error handling, check the type of error
// //         if (error.response) {
// //             // The request was made and the server responded with a status code
// //             return res2.status(error.response.status).json({
// //                 status: "error",
// //                 message: error.response.data.message, // Adjust this based on your API response structure
// //             });
// //         } else if (error.request) {
// //             // The request was made but no response was received
// //             return res2.status(500).json({
// //                 status: "error",
// //                 message: "No response received from the server.",
// //             });
// //         } else {
// //             // Something happened in setting up the request that triggered an Error
// //             return res2.status(500).json({
// //                 status: "error",
// //                 message: error.message,
// //             });
// //         }
// //     });