const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getApprovedProcedures = (req, res, next) => {

    conn.query(
        "select * from procedures WHERE isApproved = 1",
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
        "select * from procedures WHERE relatedReport = ?",
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
    if (!req.body)
        return next(new AppError("No data found", 404));

    let values = [];
    if (req.body.ID !== undefined) values.unshift(req.body.ID);
    if (req.body.description !== undefined) values.unshift(req.body.description);
    if (req.body.relatedReport !== undefined) values.unshift(req.body.relatedReport);
    if (req.body.isApproved !== undefined) values.unshift(req.body.isApproved);

    var str = "UPDATE procedures SET " + xvgc 
        (req.body.description !== undefined ? "description = ?, " : "") +
        (req.body.relatedReport !== undefined ? "relatedReport = ?, " : "") +
        (req.body.isApproved !== undefined ? "isApproved = ?, " : "");

    var pos = str.lastIndexOf(",");
    str = str.substring(0, pos) + str.substring(pos + 1);
    str = str + " WHERE relatedReport = " + req.params.relatedReport + ";";

    conn.query(
        str, values,
        function (err, data, fields) {
            if (err)
                return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "Procedure data successfully altered",
            });
        }
    );
}

exports.insertProcedure = (req, res, next) => {
    if (!req.body)
        return next(new AppError("No data found", 404));

    const values = [
        req.body.description,
        req.body.relatedReport,
        0, // Assuming this is a default value for isApproved
    ];

    console.log(values);

    conn.query(
        "INSERT INTO patientreports (description, relatedReport, isApproved) VALUES (?, ?, ?)",
        values, // Pass the array of values directly
        function (err, data, fields) {
            if (err) {
                console.error(err); // Log the error for debugging
                return next(new AppError(err.message, 500)); // Handle the error with a 500 status response and provide the error message
            }
            res.status(201).json({
                status: "success",
                message: "New procedure added!",
            });
        }
    );
}

