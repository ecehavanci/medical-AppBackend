const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getApprovedDiffDiagnoses = (req, res, next) => {

    conn.query(
        "select * from differentialdiagnoses WHERE isApproved = 1",
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
