const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getAllCourses = (req, res, next) => {
    conn.query(
        "SELECT * FROM courses order by code ASC",
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

exports.filterCourseByID = (req, res, next) => {
    //check if the id is specified in the request parameter,
    if (!req.params.ID) {
        return next(new AppError("No attending physician with this ID found", 404));
    }
    conn.query(
        "SELECT * FROM courses WHERE ID = ?",
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
};

exports.getCourseName = (req, res, next) => {
    if (!req.params.ID) {
        return next(new AppError("No object with this ID found", 404));
    }
    conn.query(
        "Select course from studentgroups where ID = (Select groupNo from rotations where ID = (Select rotationNo from student where ID = ? ));",
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
};