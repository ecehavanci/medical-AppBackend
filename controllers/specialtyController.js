const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getSpecialtiesOfCurrentRotation = (req, res, next) => {

    conn.query("SELECT * from specialties where course = (Select course from " +
        "studentgroups where ID = (Select groupNo from rotations where ID " +
        "= (Select rotationNo from student where ID = $ID)));",
        [req.params.studentID],
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

exports.getSpecialtiesOfPreviousRotation = (req, res, next) => {

    conn.query("SELECT * from specialties where course = (Select course from " +
        "studentgroups where ID = (Select groupNo from rotations where ID " +
        "= (Select previousRotationNo from student where ID = ?)));",
        [req.params.studentID],
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