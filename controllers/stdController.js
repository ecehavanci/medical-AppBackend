const AppError = require("../utils/appError");
const conn = require("../services/db");
var axios = require('axios');
var qs = require('qs');
require('dotenv').config();

exports.insertStd = (req, res, next) => {
    //we check if the client is sending an empty form "and return a 404 error message.
    if (!req.body)
        return next(new AppError("No form data found", 404));

    const values = [req.body.ID, req.body.name, req.body.surname,
    req.body.courses, req.body.rotationNo, req.body.previousRotationNo];

    console.log(req.body);

    conn.query(
        "INSERT INTO student (ID,name, surname, courses, rotationNo, previousRotationNo) VALUES(?)",
        [values],
        function (err, data, fields) {
            if (err)
                return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "New student added!",
            });
        }
    );
};

exports.filterStdByID = (req, res, next) => {
    //ID is the TC of student
    if (!req.params.ID) {
        return next(new AppError("No student found with the ID: " + req.params.ID, 404));
    }
    var epoc = round(microtime(true) * 1000);
    const apiKey = process.env.OASIS_APIKEY;
    const secretKey = process.env.OASIS_SECRETKEY;
    var signature = strtoupper(md5(apiKey + secretKey + epoc));

    var data = qs.stringify({
        'signature': signature,
        'epoch': epoc,
        'stu_id': req.params.ID
    });

    const token = `${process.env.OASIS_API_USER}:${process.env.OASIS_API_PASSWORD}`;
    const encodedToken = Buffer.from(token).toString('base64');
    const headers = { 'Authorization': 'Basic ' + encodedToken };
    //body
    var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://oasis.izmirekonomi.edu.tr/oasis_api/mobil/mobil/get-stuinfo',
        headers: headers,
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            var filteredData = JSON.stringify(response.data);
            res.status(200).json({
                status: "200",
                length: data?.length,
                data: filteredData,
            });
        })
        .catch(function (error) {
            console.log(error);
        });


    /*conn.query(
        "SELECT * FROM student WHERE ID = ?",
        [req.params.ID],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));

            if (data?.length !== 0) {
                res.status(200).json({
                    status: "medical student",
                    length: data?.length,
                    data: data,
                });
*/
    /*if(data[0]["branch"] === "medical" ){//"branch" and "medical" are placeholders
        //Code in the above
    }
    else{
        res.status(200).json({
            status: "not medical student",
        });
    }*/
    /*
                }
                else {
                    res.status(200).json({
                        status: "no student found",
                        //length: data?.length,
                        //data: data,
                    });
                }
    
            }
        );*/
};

exports.getAllStudents = (req, res, next) => {
    conn.query(
        "SELECT * FROM student",
        [req.params.ID],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
            });
        }
    );
};

exports.updateStdByID = (req, res, next) => {
    if (!req.params.ID) {
        return next(new AppError("No student id found", 404));
    }
    if (!req.params.colName) {
        return next(new AppError("No student column with this name found", 404));
    }
    if (!req.params.value) {
        return next(new AppError("No value", 404));
    }

    conn.query(
        "UPDATE student SET " + req.params.colName + "=? WHERE ID=?",
        [req.params.value, req.params.ID],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "student updated!",
            });
        }
    );
};

exports.deleteStdByID = (req, res, next) => {
    if (!req.params.ID) {
        return next(new AppError("No todo id found", 404));
    }
    conn.query(
        "DELETE FROM student WHERE ID=?",
        [req.params.ID],
        function (err, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "student deleted!",
            });
        }
    );
}