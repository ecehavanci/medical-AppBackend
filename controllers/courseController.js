const AppError = require("../utils/appError");
const conn = require("../services/db");
const currentYear = config.app.year;
const currentSeason = config.app.season;
const currentDate = config.app.date;

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
        return next(new AppError("No course with this ID found", 404));
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

//öğrencinin şuanki kurs ismini verir
exports.getCourseName = (req, res, next) => {
    if (!req.params.stdID) {
        return next(new AppError("Blank student ID", 404));
    }

    const queryString = `
    SELECT c.*
    FROM student AS s
            JOIN enrollment AS e ON s.ID = e.std_id
            JOIN rotations AS r ON e.rotation_id = r.rotation_id
            JOIN rotation_courses AS rc
                ON r.rotation_id = rc.rotation_id
            JOIN courses AS c ON rc.course_id = c.ID
            JOIN intervals AS i ON rc.interval_id = i.ID
    WHERE s.ID = ?
    and i.year = ?
    and i.season = ?
    AND ? BETWEEN i.start AND i.end;
        `;

    conn.query(
        queryString,
        [req.params.stdID, currentYear, currentSeason, currentDate],
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

//öğrencinin bağlı olduğu rotasyonların ders, sınıf ve grup bilgilerini getirir
exports.listStudentSemesterInfos = (req, res, next) => { //add, order by courses end date
    const query = `
    SELECT DISTINCT c.*,ro.group_id,ro.class
    FROM enrollment e
             LEFT JOIN rotation_courses rc ON e.rotation_id = rc.rotation_id
             left join rotations ro on rc.rotation_id = ro.rotation_id
             LEFT JOIN intervals i ON rc.interval_id = i.ID
             LEFT JOIN courses c ON rc.course_id = c.ID
    WHERE e.std_id = ?
    order by rc.course_order;`;
    conn.query(
        query,
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

//doktorun bağlı olduğu rotasyonların şimdiki ve ve geçmişteki kurs bilgileri gösterir
exports.listPhysicianSemesterCourses = (req, res, next) => { //add, order by courses end date
    const query = `
    SELECT DISTINCT rc.rotation_id,rc.course_id,c.code
    FROM enrollment_physician e
            LEFT JOIN rotation_courses rc ON e.rotationNo = rc.rotation_id and rc.course_id = e.courseID
            left join rotations ro on rc.rotation_id = ro.rotation_id
            LEFT JOIN courses c ON rc.course_id = c.ID
            left join intervals i on i.ID = rc.interval_id
    WHERE e.physicianID = ?
    and i.year = ?
    and i.season = ?
    order by rc.course_order;`;
    conn.query(
        query,
        [req.params.physicianID, currentYear, currentSeason],
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

//öğrencinin o tarihte bağlı olduğu kursun gerekli form sayılarını getirir
exports.requiredReportCountsOfCourse = (req, res, next) => {
    if (!req.params.stdID) {
        return next(new AppError("No student with this ID found", 404));
    }
    const query = `
    SELECT c.patient_count as patientReportCount, c.procedure_count as procedureReportCount
    FROM enrollment e
            LEFT JOIN rotation_courses rc ON e.rotation_id = rc.rotation_id
            left join rotations ro on rc.rotation_id = ro.rotation_id
            LEFT JOIN intervals i ON rc.interval_id = i.ID
            LEFT JOIN courses c ON rc.course_id = c.ID
    where ? between i.start and i.end
    and i.year = ?
    and i.season = ?
    and e.std_id = ?;`;

    conn.query(
        query,
        [currentDate, currentYear, currentSeason, req.params.stdID],
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