const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getApprovedDiffDiagnoses = (req, res, next) => {

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
}
exports.getDiffDiagnosesByDiagnoseID = (req, res, next) => {

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
}
exports.insert = (req, res, next) => {
    if (!req.body || !req.body.description || !req.body.tier || !req.body.relatedReport) {
        return next(new AppError("Invalid data provided", 400));
    }

    const { description,tier, relatedReport } = req.body;

    const values = [description,tier,relatedReport];

    conn.query(
        "INSERT INTO differentialdiagnoses (description,tier, relatedReport) VALUES (?, ?, ?)",
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

