const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.updateStdRotation = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            if (!req.params.stdID || !req.params.rotationNo) {
                return next(new AppError("No id found", 404));
            }

            const query = `UPDATE enrollment SET rotation_id = ? WHERE std_id = ?;`;

            conn.query(
                query,
                [req.params.rotationNo, req.params.stdID],
                function (err, fields) {
                    if (err) return next(new AppError(err, 500));
                    res.status(201).json({
                        status: "success",
                        message: "Rotation updated!",
                    });
                }
            );
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.deleteStdRotation = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            if (!req.params.stdID) {
                return next(new AppError("No id found", 404));
            }

            const query = `UPDATE enrollment SET rotation_id = NULL WHERE std_id = ?;`;

            conn.query(
                query,
                [req.params.stdID], // Correct the parameter name to req.params.stdID
                function (err, fields) {
                    if (err) return next(new AppError(err, 500));
                    res.status(201).json({
                        status: "success",
                        message: "Rotation deleted!",
                    });
                }
            );
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}
