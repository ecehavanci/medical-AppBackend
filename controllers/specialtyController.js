const AppError = require("../utils/appError");
const conn = require("../services/db");
const config = require("../config.js");
const currentYear = config.app.year;
const currentSeason = config.app.season;
const currentDate = config.app.date;

exports.getAllSpecialties = (req, res, next) => { //all specialties in DB
    try {
        conn.query(
            "select * from specialties",
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
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.getCourseSpecialties = (req, res, next) => { //current course specialty
    try {
        const queryString = `
            select sp.ID, sp.description
            from student s
                    left join enrollment e on e.std_id = s.ID
                    left join rotation_courses rc on rc.rotation_id = e.rotation_id
                    left join intervals i on i.ID = rc.interval_id
                    left join specialties sp on sp.course_ID = rc.course_id or sp.ID = -1
            where i.year = ?
            and i.season = ?
            and s.ID = ?
            and current_date between i.start and i.end;
            `;

        conn.query(
            queryString,
            [currentYear, currentSeason, req.params.studentID, currentDate],
            function (err, data, fields) {
                if (err) return next(new AppError(err, 500));
                res.status(200).json({
                    status: "success",
                    length: data?.length,
                    data: data,
                });
            }
        );
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}
exports.getCourseSpecialtiesByCourseID = (req, res, next) => { //current course specialty by course ID
    try {
        if (!req.params.courseID)
            return next(new AppError("Course ID specified", 404));

        const courseID = req.params.courseID;

        const queryString = `
            select sp.ID, sp.description
            from specialties sp
            where sp.course_ID = ?;
            `;

        conn.query(
            queryString,
            [courseID],
            function (err, data, fields) {
                if (err) return next(new AppError(err, 500));
                res.status(200).json({
                    status: "success",
                    length: data?.length,
                    data: data,
                });
            }
        );
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.getSpecialtyName = (req, res, next) => { //specialty description according to its ID
    try {
        conn.query("SELECT * from specialties where ID = ?;",
            [req.params.specialtyNo],
            function (err, data, fields) {
                if (err) return next(new AppError(err, 500));
                res.status(200).json({
                    status: "success",
                    length: data?.length,
                    data: data,
                });
            }
        );
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

}
