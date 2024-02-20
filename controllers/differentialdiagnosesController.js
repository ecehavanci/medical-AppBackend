const AppError = require("../utils/appError");
const conn = require("../services/db");
const courseHelper = require("./currentCourse");
const verifyToken = require('../utils/verifyToken');

exports.getApprovedDiffDiagnoses = (req, res, next) => {

    try {
        conn.query(
            "select * from differentialdiagnoses WHERE isApproved = 1 ORDER BY description ASC",
            function (err, data, fields) {
                if (err) return next(new AppError(err, 500));
                res.status(200).json({
                    status: "success",
                    length: data?.length,
                    data: data,
                });
            }
        );
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.getApprovedCourseDiagnosis = (req, res, next) => {

    try {
        const studentID = req.params.studentID;
        const isApproved = 1;

        if (!studentID)
            return next(new AppError("No student data provided", 404));

        courseHelper.getCurrentCourse(studentID)
            .then((finalCourseID) => {
                const values = [finalCourseID, isApproved];

                conn.query(
                    `select ID,description from differentialdiagnoses WHERE courseID = ? && isApproved = ? ORDER BY description ASC`,
                    values,
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

}

exports.getDiffDiagnosesByDiagnoseID = (req, res, next) => {

    try {
        conn.query(
            "select * from differentialdiagnoses WHERE ID = ?",
            [req.params.diagnoseID],
            function (err, data, fields) {
                if (err) return next(new AppError(err, 500));
                res.status(200).json({
                    status: "success",
                    length: data?.length,
                    data: data,
                });
            }
        );
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.insert = (req, res, next) => {
    try {
        if (!req.body || !req.body.description || !req.body.relatedReport && !req.body.courseID) {
            return next(new AppError("Invalid data provided", 400));
        }

        const { description, relatedReport, courseID } = req.body;

        const values = [description, relatedReport, courseID];

        conn.query(
            "INSERT INTO differentialdiagnoses (courseID, description, relatedReport) VALUES (?, ?)",
            values,
            function (err, data, fields) {
                if (err) {
                    console.error("INSERT Error:", err);
                    return next(new AppError(err.message, 500));
                }

                console.log("Inserted Data:", data);

                res.status(201).json({
                    status: "success",
                    message: "New procedure added!",
                    insertedId: data.insertId,
                });
            }
        );
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

exports.updateApprovalStatus = (req, res, next) => {
    try {
        if (!req.params.diagnoseID || !req.body.isApproved) {
            return next(new AppError("Invalid request data", 400));
        }

        const { diagnoseID } = req.params;
        const { isApproved } = req.body;

        const updateQuery = "UPDATE differentialdiagnoses SET isApproved = ? WHERE ID = ?";
        const values = [isApproved, diagnoseID];

        conn.query(updateQuery, values, function (err, data, fields) {
            if (err) {
                console.error("Update Error:", err);
                return next(new AppError(err.message, 500));
            }

            console.log("Updated Data:", data);

            res.status(200).json({
                status: "success",
                message: "Diagnosis approval status updated successfully",
            });
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};