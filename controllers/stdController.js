const AppError = require("../utils/AppError");
const conn = require("../services/db");
require('dotenv').config();
const generateAccessToken = require('../utils/generateToken');

exports.insertStd = async (req, res, next) => {
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

        const connection = await conn.getConnection();
        const [results] = await connection.execute("INSERT INTO student (ID,name, surname,token) VALUES(?)", values);
        connection.release();

        if (results.insertId) {
            res.status(201).json({
                status: "success",
                message: "New student added!",
            });
        } else {
            res.status(500).json({
                status: "error",
                message: "Failed to add new student",
            });
        }

    } else {
        console.log('Token is invalid.');
    }
};

exports.filterStdByID = async (req, res, next) => {
    try {
        // Verify the token using the middleware
        if (!req.params.ID) {
            return next(new AppError("No student found with the ID: " + req.params.ID, 404));
        }

        const query = "SELECT ID, name, surname FROM student WHERE ID = ?";
        const values = [req.params.ID];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        res.status(200).json({
            status: "success",
            length: results?.length,
            data: results,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


exports.getAllStudents = async (req, res, next) => {
    try {

        const query = "SELECT ID, name, surname FROM student";

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query);
        connection.release();

        res.status(200).json({
            status: "success",
            length: results.length,
            data: results,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

exports.updateStdByID = async (req, res, next) => {
    try {
        const { name, surname } = req.body;

        const query = 'UPDATE student SET name = ?, surname = ? WHERE ID = ?';
        const values = [name, surname, req.params.ID];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();


        res.status(201).json({
            status: "success",
            message: "Student updated!",
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


exports.deleteStdByID = async (req, res, next) => {

    try {
        if (!req.params.ID) {
            return next(new AppError("No todo id found", 404));
        }

        const query = "DELETE FROM student WHERE ID=?";
        const values = [req.params.ID];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        res.status(201).json({
            status: "success",
            message: "student deleted!",
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}