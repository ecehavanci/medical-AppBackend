const AppError = require("../utils/AppError");
const conn = require("../services/db");
const courseHelper = require("./currentCourse");

exports.getApprovedDiffDiagnoses = async (req, res, next) => {

    try {
        const query = "select * from differentialdiagnoses WHERE isApproved = 1 ORDER BY description ASC";
        const connection = await conn.getConnection();
        const [results] = await connection.execute(query);
        connection.release();

        res.status(200).json({
            status: "success",
            length: results?.length,
            data: results,
        });

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
            .then(async (finalCourseID) => {
                const query = `select ID,description from differentialdiagnoses WHERE courseID = ? && isApproved = ? ORDER BY description ASC`;
                const values = [finalCourseID, isApproved];

                const connection = await conn.getConnection();
                const [results] = await connection.execute(query, values);
                connection.release();

                res.status(200).json({
                    status: "success",
                    length: results?.length,
                    data: results,
                });

            });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

}

exports.getDiffDiagnosesByDiagnoseID = async (req, res, next) => {

    try {

        const query = "select * from differentialdiagnoses WHERE ID = ?";
        const values = [req.params.diagnoseID];

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
}

exports.insert = async (req, res, next) => {
    try {
        if (!req.body || !req.body.description || !req.body.relatedReport || !req.body.courseID) {
            return next(new AppError("Invalid data provided", 400));
        }

        const { description, relatedReport, courseID } = req.body;

        const values = [courseID, description, relatedReport];
        const query = "INSERT INTO differentialdiagnoses (courseID, description, relatedReport) VALUES (?, ?, ?)";

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        if (results.insertId) {
            res.status(201).json({
                status: "success",
                message: "New procedure added!",
                insertedId: results.insertId,
            });
        } else {
            res.status(500).json({
                status: "error",
                message: "Failed to add new procedure",
            });
        }

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


exports.updateApprovalStatus = async (req, res, next) => {
    try {
        if (!req.params.diagnoseID || !req.body.isApproved) {
            return next(new AppError("Invalid request data", 400));
        }

        const { diagnoseID } = req.params;
        const { isApproved } = req.body;

        const updateQuery = "UPDATE differentialdiagnoses SET isApproved = ? WHERE ID = ?";
        const values = [isApproved, diagnoseID];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(updateQuery, values);
        connection.release();

        if (results.affectedRows > 0) {
            res.status(200).json({
                status: "success",
                message: "Diagnosis approval status updated successfully",
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Diagnosis not found or no changes made",
            });
        }

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};
