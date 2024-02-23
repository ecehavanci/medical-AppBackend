const AppError = require("../utils/appError");
const conn = require("../services/db");
const courseHelper = require("./currentCourse");

exports.getApprovedProcedures = async (req, res, next) => {
    try {

        const query = "select * from procedures WHERE isApproved = 1 ORDER BY description ASC";

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

exports.getApprovedProceduresByCourseID = async (req, res, next) => {
    try {
        const courseID = req.params.courseID;

        if (!courseID) {
            return next(new AppError("Course ID required.", 400));
        }

        const query = "select * from procedures WHERE isApproved = 1 && courseID = ? || ID = -1  ORDER BY description ASC;";
        const values = [courseID];

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

exports.getProceduresByID = async (req, res, next) => {
    try {

        const query = "select * from procedures WHERE ID = ?";
        const values = [req.params.procedureID];

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

exports.getProcedureByRelatedReportID = async (req, res, next) => {
    try {
        const query = "SELECT * FROM procedures WHERE relatedReport = ?";
        const values = [req.params.relatedReport];

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

exports.currentCourseProcedures = (req, res, next) => {
    try {
        const studentID = req.params.stdID;

        if (!studentID) {
            return next(new AppError("No student ID found", 404));
        }

        courseHelper.getCurrentCourse(studentID)
            .then(async (finalCourseID) => {

                const query = "select * from procedures where courseID = ? && procedures.isApproved = 1 || ID = -1 order by description;";
                const values = [finalCourseID];

                const connection = await conn.getConnection();
                const [results] = await connection.execute(query, values);
                connection.release();

                res.status(200).json({
                    status: "success",
                    length: results?.length,
                    data: results,
                });
            })
            .catch((error) => {
                return next(new AppError(error, 500));
            });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.updateProcedure = async (req, res, next) => {

    try {
        const ID = req.params.procedureID;
        const { description, relatedReport, isApproved } = req.body;

        if (!ID || (!description && !relatedReport && !isApproved)) {
            return next(new AppError("Invalid request data", 400));
        }

        const updateValues = {};
        if (description !== undefined) {
            updateValues.description = description;
        }
        if (relatedReport !== undefined) {
            updateValues.relatedReport = relatedReport;
        }
        if (isApproved !== undefined) {
            updateValues.isApproved = isApproved;
        }

        const query = "UPDATE procedures SET ? WHERE ID = ?";
        const values = [updateValues, ID];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        if (results.affectedRows > 0) {
            res.status(201).json({
                status: "success",
                message: "Procedure data successfully updated",
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Procedure not found or no changes made",
            });
        }

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


exports.insertProcedure = async (req, res, next) => {
    try {
        if (!req.body || !req.body.description || !req.body.relatedReport) {
            return next(new AppError("Invalid data provided", 400));
        }

        const { description, relatedReport } = req.body;

        const query = "INSERT INTO procedures (description, relatedReport) VALUES (LOWER(?), ?)";
        const values = [description, relatedReport];

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


