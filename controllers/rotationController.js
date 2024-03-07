const AppError = require("../utils/AppError");
const conn = require("../services/db");

exports.updateStdRotation = async (req, res, next) => {
    try {
        if (!req.params.stdID || !req.params.rotationNo) {
            return next(new AppError("No id found", 404));
        }

        const query = `UPDATE enrollment SET rotation_id = ? WHERE std_id = ?;`;
        const values = [req.params.rotationNo, req.params.stdID];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        if (results.affectedRows > 0) {
            res.status(201).json({
                status: "success",
                message: "Rotation updated!",
            });
        } else {
            // No rows were affected, possibly because the student or rotation was not found
            res.status(404).json({
                status: "error",
                message: "Student or rotation not found or no changes made",
            });
        }
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.deleteStdRotation = async (req, res, next) => {
    try {
        if (!req.params.stdID) {
            return next(new AppError("No id found", 404));
        }

        const query = `UPDATE enrollment SET rotation_id = NULL WHERE std_id = ?;`;
        const values = [req.params.stdID];


        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        if (results.affectedRows > 0) {
            res.status(201).json({
                status: "success",
                message: "Rotation deleted!",
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Student enrollment not found or no changes made",
            });
        }

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}
