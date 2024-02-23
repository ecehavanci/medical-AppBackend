const express = require("express");
const AppError = require("../utils/appError");
const conn = require("../services/db");
const config = require("../config");
const currentYear = config['app']["year"];
const currentSeason = config.app.season;
const currentDate = config.app.date;

// Create a function to get the current course of the student
exports.getCurrentCourse = (studentID) => {

    const query = `SELECT c.ID
    FROM student s
             LEFT JOIN enrollment e ON e.std_id = s.ID
             LEFT JOIN rotation_courses rc ON rc.rotation_id = e.rotation_id
             LEFT JOIN intervals i ON i.ID = rc.interval_id
             LEFT JOIN courses c ON c.ID = rc.course_id
    WHERE ? BETWEEN i.start AND i.end
      AND s.ID = ?;
    `;

    const values = [currentDate, studentID];

    return new Promise(async (resolve, reject) => {
        try {
            const connection = await conn.getConnection();
            const [results] = await connection.execute(query, values);
            connection.release();

            if (results.length > 0) {
                resolve(results[0].ID);
            }
            else {
                reject();
            }

        } catch (error) {
            reject(new Error("Student is not currently enrolled in any course."));
        }
    });
};


// Create a function to get the current course of the student
exports.getCurrentCourseDoctor = (physicianID) => {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT DISTINCT rc.rotation_id, rc.course_id, c.code
        FROM enrollment_physician e
                 LEFT JOIN rotation_courses rc ON e.rotationNo = rc.rotation_id and rc.course_id = e.courseID
                 left join rotations ro on rc.rotation_id = ro.id
                 LEFT JOIN courses c ON rc.course_id = c.ID
                 left join intervals i on i.ID = rc.interval_id
        WHERE e.physicianID = ?
          and i.year = ?
          and i.season = ?
          and ? between i.start and i.end
        order by i.start;
        `;

        const values = [physicianID, currentYear, currentSeason, currentDate];

        try {
            const connection = await conn.getConnection();
            const [results] = await connection.execute(query, values);
            connection.release();

            if (results.length > 0) {
                resolve(results[0].course_id);
            }
            else {
                reject();
            }

        } catch (error) {
            reject(new Error("Student is not currently enrolled in any course."));
        }
    });
};