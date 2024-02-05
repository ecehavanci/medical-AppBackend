const AppError = require("../utils/appError");
const conn = require("../services/db");
const config = require("../config.js");
const currentYear = config.app.year;
const currentSeason = config.app.season;
const currentDate = config.app.date;
const verifyToken = require('../utils/verifyToken');

exports.getAllCourses = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
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
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.filterCourseByID = (req, res, next) => {

    try {
        verifyToken(req, res, () => {
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
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

//öğrencinin şuanki kurs ismini verir
exports.getCourseName = (req, res, next) => {

    try {
        verifyToken(req, res, () => {
            if (!req.params.stdID) {
                return next(new AppError("Blank student ID", 404));
            }

            const queryString = `
            SELECT c.*
            FROM student AS s
                    JOIN enrollment AS e ON s.ID = e.std_id
                    JOIN rotations AS r ON e.rotation_id = r.id
                    JOIN rotation_courses AS rc
                        ON r.id = rc.rotation_id
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
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

//öğrencinin bağlı olduğu rotasyonların ders, sınıf ve grup bilgilerini getirir
exports.listStudentSemesterInfos = (req, res, next) => { //add, order by courses end date
    try {
        verifyToken(req, res, () => {
            const query = `
            SELECT DISTINCT c.*,ro.group_id,ro.class
            FROM enrollment e
                    LEFT JOIN rotation_courses rc ON e.rotation_id = rc.rotation_id
                    left join rotations ro on rc.rotation_id = ro.id
                    LEFT JOIN intervals i ON rc.interval_id = i.ID
                    LEFT JOIN courses c ON rc.course_id = c.ID
            WHERE e.std_id = ?
            order by i.start;`;
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
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

//doktorun bağlı olduğu rotasyonların şimdiki ve ve geçmişteki kurs bilgileri gösterir
exports.listPhysicianSemesterCourses = (req, res, next) => { //add, order by courses end date
    try {
        verifyToken(req, res, () => {
            //if needed make it *SELECT DISTINCT rc.rotation_id ...
            const query = `
            SELECT DISTINCT rc.rotation_id,rc.course_id as ID,c.code,c.description
            FROM enrollment_physician e
                    LEFT JOIN rotation_courses rc ON e.rotationNo = rc.rotation_id and rc.course_id = e.courseID
                    left join rotations ro on rc.rotation_id = ro.id
                    LEFT JOIN courses c ON rc.course_id = c.ID
                    left join intervals i on i.ID = rc.interval_id
            WHERE e.physicianID = ?
            and i.year = ?
            
            and i.season = ?
            order by i.start;`;
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
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

//öğrencinin o tarihte bağlı olduğu veya seçtiği kursun gerekli form sayılarını getirir
exports.requiredReportCountsOfCourse = async (req, res, next) => {

    try {
        verifyToken(req, res, () => {
            const stdID = req.params.stdID;
            let courseID = req.params.courseID !== undefined ? parseInt(req.params.courseID) : null;

            if (!stdID) {
                return next(new AppError("No student with this ID found", 404));
            }

            let query;
            let values;

            if (courseID) {
                query = `
            SELECT c.patient_count as patientReportCount, c.procedure_count as procedureReportCount
            FROM courses c
            WHERE ID = ?;
             `;
                values = [courseID];
            } else {

                query = `
            SELECT c.patient_count as patientReportCount, c.procedure_count as procedureReportCount
            FROM enrollment e
            LEFT JOIN rotation_courses rc ON e.rotation_id = rc.rotation_id
            LEFT JOIN rotations ro ON rc.rotation_id = ro.id
            LEFT JOIN intervals i ON rc.interval_id = i.ID
            LEFT JOIN courses c ON rc.course_id = c.ID
            WHERE ? BETWEEN i.start AND i.end
            AND i.year = ?
            AND i.season = ?
            AND e.std_id = ?;
            `;

                values = [currentDate, currentYear, currentSeason, stdID];
            }

            conn.query(
                query,
                values,
                function (err, data, fields) {
                    if (err) return next(new AppError(err, 500));

                    console.log(data);
                    res.status(200).json({
                        status: "success",
                        length: data?.length,
                        data: data,
                    });
                }
            );
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

};


exports.getPeriodData = async (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            const stdID = req.params.stdID;
            if (!stdID) {
                return next(new AppError("No student with this ID found", 404));
            }

            const query = `
            SELECT i.year,
                i.season,
                c.ID        as courseID,
                i.end,
                c.patient_count        as patientCount,
                c.procedure_count      as procedureCount,
                (SELECT COUNT(*)
                    FROM patientreports pr
                    WHERE pr.courseID = c.ID
                    AND pr.year = i.year
                    AND pr.season = i.season
                    AND pr.studentID = e.std_id
                    AND pr.isSent = 1)  AS patientCounter,
                (SELECT COUNT(*)
                    FROM procedurereports pro
                    WHERE pro.courseID = c.ID
                    AND pro.year = i.year
                    AND pro.season = i.season
                    AND pro.studentID = e.std_id
                    AND pro.isSent = 1) AS procedureCounter
            FROM enrollment e
                    LEFT JOIN rotation_courses rc ON e.rotation_id = rc.rotation_id
                    LEFT JOIN rotations ro ON rc.rotation_id = ro.id
                    LEFT JOIN intervals i ON rc.interval_id = i.ID
                    LEFT JOIN courses c ON rc.course_id = c.ID
            WHERE ? BETWEEN i.start AND i.end
            AND i.year = ?
            AND i.season = ?
            AND e.std_id = ?;
          `;

            conn.query(
                query,
                [currentDate, currentYear, currentSeason, stdID],
                function (err, data, fields) {
                    if (err) return next(new AppError(err, 500));
                    res.status(200).json({
                        status: "success",
                        length: data?.length,
                        data: data,
                    });
                }
            );
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};