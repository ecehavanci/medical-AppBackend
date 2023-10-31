const AppError = require("../utils/appError");
const conn = require("../services/db");
const { currentYear, currentSeason, date } = require("../config");

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
    if (!req.params.stdID) {
        return next(new AppError("Blank student ID", 404));
    }

    const queryString = `
        SELECT c.name AS course_name
        FROM student AS s
        JOIN enrollment AS e ON s.ID = e.std_id
        JOIN rotations AS r ON e.rotation_id = r.rotation_id""
        JOIN rotation_courses AS rc ON r.rotation_id = rc.rotation_id
        JOIN courses AS c ON rc.course_id = c.ID
        JOIN intervals AS i ON rc.interval_id = i.ID
        WHERE s.ID = ?
        AND CURDATE() BETWEEN i.start AND i.end;
        `;

    conn.query(
        queryString,
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
};

//öğrencinin bağlı olduğu rotasyonların şimdiki ve ve geçmişteki kurs bilgileri
exports.listStudentSemesterCourses = (req, res, next) => { //add, order by courses end date
    const query = `SELECT DISTINCT c.ID,c.code,c.description
    FROM enrollment e
    LEFT JOIN rotation_courses rc ON e.rotation_id = rc.rotation_id
    LEFT JOIN intervals i ON rc.interval_id = i.ID
    LEFT JOIN courses c ON rc.course_id = c.ID
    WHERE
        e.std_id = ? 
        AND ? > i.start order by i.start desc;`;
    conn.query(
        query,
        [req.params.stdID, date],
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
    const query = `SELECT DISTINCT c.ID, c.code,c.description
    FROM attendingphysicians ap
             LEFT JOIN enrollment_physician ep ON ap.ID = ep.physicianID
             LEFT JOIN rotation_courses rc ON rc.rotation_id = ep.rotationNo
             LEFT JOIN intervals i ON i.ID = rc.interval_id
             LEFT JOIN courses c ON c.ID = rc.course_id
    WHERE ap.ID = ?
      AND ? > i.start;`;
    conn.query(
        query,
        [req.params.physicianID, date],
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
    const query = `select c.patient_count as patientReportCount, c.procedure_count as procedureReportCount
    from student s
             left join enrollment e on e.std_id = s.ID
             left join rotation_courses rc on rc.rotation_id = e.rotation_id
             left join intervals i on i.ID = rc.interval_id
             left join courses c on c.ID = rc.course_id
    where current_date between i.end and i.start
      and s.ID = ?`;

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