const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getApprovedProcedures = (req, res, next) => {

    conn.query(
        "select * from procedures WHERE isApproved = 1 ORDER BY description ASC",
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
            });
        }
    );
}
exports.getProceduresByID = (req, res, next) => {

    conn.query(
        "select * from procedures WHERE ID = ?",
        [req.params.procedureID],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
            });
        }
    );
}

exports.getProcedureByRelatedReportID = (req, res, next) => {
    conn.query(
        "SELECT * FROM procedures WHERE relatedReport = ?",
        [req.params.relatedReport],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
            });
        }
    );
}

exports.updateProcedure = (req, res, next) => {
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

    conn.query(query, [updateValues, ID], (err, data) => {
        if (err) {
            console.error("Update Error:", err);
            return next(new AppError(err.message, 500));
        }

        console.log("Updated Data:", data);

        res.status(201).json({
            status: "success",
            message: "Procedure data successfully updated",
        });
    });
};


exports.insertProcedure = (req, res, next) => {
    if (!req.body || !req.body.description || !req.body.relatedReport) {
        return next(new AppError("Invalid data provided", 400));
    }

    const { description, relatedReport } = req.body;

    const values = [description, relatedReport];

    conn.query(
        "INSERT INTO procedures (description, relatedReport) VALUES (LOWER(?), ?)",
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
};


