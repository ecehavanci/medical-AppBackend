const AppError = require("../utils/AppError");
const conn = require("../services/db");

exports.getAllHospitals = async (req, res, next) => {
    try {
        const query = `select * from hospitals;`;

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query);
        connection.release();

        res.status(201).json({
            status: "success",
            data: results,
            length: results?.length,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

exports.getHospitalByID = async (req, res, next) => {
    try {
        if (!req.params.hospitalID)
            return next(new AppError("No Hospital ID specified", 404));

        const hospitalID = req.params.hospitalID;

        const query = `select * from hospitals WHERE ID = ?;`;
        const values = [hospitalID];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        res.status(201).json({
            status: "success",
            data: results,
            length: results?.length,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};