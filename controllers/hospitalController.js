const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getAllHospitals = (req, res, next) => {

    try {
        conn.query(
            `select * from hospitals;`,
            [],
            function (err, data, fields) {
                if (err) {
                    return next(new AppError(err, 500));
                }
                res.status(201).json({
                    status: "success",
                    data: data
                });
            }
        );
    } catch (error) {
        return next(new AppError(error, 500));
    }
};

exports.getHospitalByID = (req, res, next) => {
    if (!req.params.hospitalID)
        return next(new AppError("No Hospital ID specified", 404));

    const hospitalID = req.params.hospitalID;

    try {
        conn.query(
            `select * from hospitals WHERE ID = ?;`,
            [hospitalID],
            function (err, data, fields) {
                if (err) {
                    return next(new AppError(err, 500));
                }
                res.status(201).json({
                    status: "success",
                    data: data
                });
            }
        );
    } catch (error) {
        return next(new AppError(error, 500));
    }
};