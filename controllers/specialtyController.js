const AppError = require("../utils/appError");
const conn = require("../services/db");
const config = require("../config.js");
const currentYear = config.app.year;
const currentSeason = config.app.season;
const currentDate = config.app.date;

exports.getAllSpecialties = async (req, res, next) => { //all specialties in DB
    try {
        const query = "select * from specialties";
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

exports.getCourseSpecialties = async (req, res, next) => { //current course specialty
    try {
        const query = `
            select sp.ID, sp.description
            from student s
                    left join enrollment e on e.std_id = s.ID
                    left join rotation_courses rc on rc.rotation_id = e.rotation_id
                    left join intervals i on i.ID = rc.interval_id
                    left join specialties sp on sp.course_ID = rc.course_id or sp.ID = -1
            where i.year = ?
            and i.season = ?
            and s.ID = ?
            and ? between i.start and i.end;
            `;

        const values = [currentYear, currentSeason, req.params.studentID, currentDate];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        console.log(results);
        res.status(200).json({
            status: "success",
            length: results?.length,
            data: results,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}
exports.getCourseSpecialtiesByCourseID = async (req, res, next) => { //current course specialty by course ID
    try {
        if (!req.params.courseID)
            return next(new AppError("Course ID specified", 404));

        const courseID = req.params.courseID;

        const query = `
            select sp.ID, sp.description
            from specialties sp
            where sp.course_ID = ?;
            `;
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

exports.getSpecialtyName = async (req, res, next) => { //specialty description according to its ID
    try {

        const query = "SELECT * from specialties where ID = ?;";
        const values = [req.params.specialtyNo];

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
