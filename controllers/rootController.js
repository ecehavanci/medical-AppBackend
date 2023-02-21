const AppError = require("../utils/appError");
const conn = require("../services/db");

//attending physc
exports.login = (req, res, next) => {
    if (!req.params.phoneOrID) {
        return next(new AppError("No attending physician with this ID found", 404));
    }
    conn.query(
        "SELECT * FROM attendingphysicians WHERE ID = ?",
        [req.params.ID],
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