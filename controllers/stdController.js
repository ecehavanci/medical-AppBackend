const AppError = require("../utils/appError");
const conn = require("../services/db");
var axios = require('axios');
var qs = require('qs');
const https = require('https');
require('dotenv').config();
const verifyToken = require('../utils/verifyToken');
const generateAccessToken = require('../utils/generateToken');

exports.insertStd = (req, res, next) => {
    //we check if the client is sending an empty form "and return a 404 error message.
    if (!req.body)
        return next(new AppError("No form data found", 404));

    const token = generateAccessToken({
        username: req.body.name + " " + req.body.surname
    }); //temp data
    req.body.token = token;

    const verifiedUser = verifyToken(req, res, next);

    if (verifiedUser) {
        console.log('Token is valid. Decoded payload:', verifiedUser);

        const values = [req.body.ID, req.body.name, req.body.surname, token];

        conn.query(
            "INSERT INTO student (ID,name, surname,token) VALUES(?)",
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
    } else {
        console.log('Token is invalid.');
    }
};

exports.filterStdByID = async (req, res, next) => {
    try {
        // Verify the token using the middleware
        verifyToken(req, res, () => {
            if (!req.params.ID) {
                return next(new AppError("No student found with the ID: " + req.params.ID, 404));
            }

            conn.query(
                "SELECT ID, name, surname FROM student WHERE ID = ?",
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
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


exports.getAllStudents = (req, res, next) => {
    try {
        verifyToken(req, res, () => {

            conn.query(
                "SELECT ID, name, surname FROM student",
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
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

exports.updateStdByID = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            const { name, surname } = req.body;

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
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


exports.deleteStdByID = (req, res, next) => {

    try {
        verifyToken(req, res, () => {
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
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}