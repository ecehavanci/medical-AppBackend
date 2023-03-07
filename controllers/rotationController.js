const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.requiredReportCountsOfRotation = (req, res, next) => {
      //check if the id is specified in the request parameter, 
      if (!req.params.ID) {
        return next(new AppError("No student with this ID found", 404));
    }
    conn.query(
        "select patientReportCount, procedureReportCount from rotations where ID = (Select rotationNo from student where ID = ?)",
        [req.params.stdID],
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