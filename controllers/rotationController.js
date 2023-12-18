const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.updateStdRotation = (req, res, next) => {
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
}

exports.deleteStdRotation = (req, res, next) => {
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
}

exports.changeRotationCourseOrder = (req, res, next) => {
    if (!req.body.rotation_id || !req.body.course_id || !req.body.course_order || !req.body.interval_id) {
        return next(new AppError("No required info found.", 404));
    }

    const query = `UPDATE rotation_courses rc 
    SET rc.course_order = ?, rc.interval_id = ? 
    WHERE rc.rotation_id = ? AND rc.course_id = ?;`;

    const { rotation_id, course_id, course_order, interval_id } = req.body;

    conn.query(
        query,
        [course_order, interval_id, rotation_id, course_id],
        function (err, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "Rotation course order updated!",
            });
        }
    );
}
