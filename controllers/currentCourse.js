const express = require("express");
const AppError = require("../utils/appError");
const conn = require("../services/db");
const config = require("../config");
const currentYear = config['app']["year"];
const currentSeason = config.app.season;
const currentDate = config.app.date;

// Create a function to get the current course of the student
exports.getCurrentCourse = (studentID) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT c.ID
            FROM student s
                     LEFT JOIN enrollment e ON e.std_id = s.ID
                     LEFT JOIN rotation_courses rc ON rc.rotation_id = e.rotation_id
                     LEFT JOIN intervals i ON i.ID = rc.interval_id
                     LEFT JOIN courses c ON c.ID = rc.course_id
            WHERE ? BETWEEN i.start AND i.end
              AND s.ID = ?;
            `,
            [currentDate, studentID],
            (err, data) => {
                if (err) {
                    reject(err);
                } else if (data.length > 0) {
                    resolve(data[0].ID);
                } else {
                    // Handle the case where the student is not enrolled in any course
                    reject(new Error("Student is not currently enrolled in any course."));
                }
            }
        );
    });
};


// Create a function to get the current course of the student
exports.getCurrentCourseDoctor = (physicianID) => {
    return new Promise((resolve, reject) => {
        conn.query(
            `SELECT DISTINCT rc.rotation_id, rc.course_id, c.code
            FROM enrollment_physician e
                     LEFT JOIN rotation_courses rc ON e.rotationNo = rc.rotation_id and rc.course_id = e.courseID
                     left join rotations ro on rc.rotation_id = ro.rotation_id
                     LEFT JOIN courses c ON rc.course_id = c.ID
                     left join intervals i on i.ID = rc.interval_id
            WHERE e.physicianID = ?
              and i.year = ?
              and i.season = ?
              and ? between i.start and i.end
            order by rc.course_order;
            `,
            [physicianID, currentYear, currentSeason, currentDate],
            (err, data) => {
                if (err) {
                    reject(err);
                } else if (data.length > 0) {
                    resolve(data[0].course_id);
                } else {
                    // Handle the case where the student is not enrolled in any course
                    reject(new Error("Physician is not currently enrolled in any course."));
                }
            }
        );
    });
};