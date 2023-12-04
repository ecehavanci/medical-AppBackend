const AppError = require("../utils/appError");
const conn = require("../services/db");
var axios = require('axios');
var qs = require('qs');
const https = require('https');
require('dotenv').config();

exports.insertStd = (req, res, next) => {
    //we check if the client is sending an empty form "and return a 404 error message.
    if (!req.body)
        return next(new AppError("No form data found", 404));

    const values = [req.body.ID, req.body.name, req.body.surname];

    console.log(req.body);

    conn.query(
        "INSERT INTO student (ID,name, surname) VALUES(?)",
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
    if (!req.params.ID) {
        return next(new AppError("No student found with the ID: " + req.params.ID, 404));
    }
    conn.query(
        "SELECT * FROM student WHERE ID = ?",
        [req.params.ID],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));


            res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
            }
            );
        }
    );
}


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
    const { name, surname } = req.body; 1

    conn.query(
        'UPDATE student SET name = ?, surname = ? WHERE ID = ?',
        [name, surname, req.params.ID],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "Student updated!",
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