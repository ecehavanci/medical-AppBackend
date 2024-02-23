const AppError = require("../../utils/appError");
const conn = require("../../services/db");
const { query } = require("express");
const config = require("../../config");
const logController = require("../logController");
const courseHelper = require("../currentCourse");
const currentYear = config['app']["year"];
const currentSeason = config.app.season;
const currentDate = config.app.date;

exports.insertPatientForm = (req, res, next) => {
    //we check if the client is sending an empty form "and return a 404 error message.

    try {

        if (!req.body)
            return next(new AppError("No form data found", 404));
        else if (!req.body.studentID)
            return next(new AppError("No student data provided", 404));

        const studentID = req.body.studentID;

        courseHelper.getCurrentCourse(studentID)
            .then(async (finalCourseID) => {
                const values = [
                    req.body.studentID,
                    finalCourseID,
                    req.body.specialtyID,
                    req.body.attendingPhysicianID,
                    req.body.patientHospitalID,
                    req.body.isObserved,
                    req.body.isAssisted,
                    req.body.isPerformed,
                    req.body.isSimulated,
                    req.body.isHistory,
                    req.body.isTreatment,
                    req.body.isPhysicalExamination,
                    req.body.isDifferentialDiagnosis,
                    req.body.setting,
                    req.body.illnessScript.toLowerCase().trim(),
                    req.body.tier1ID,
                    req.body.tier1.toLowerCase().trim(),
                    req.body.tier2ID,
                    req.body.tier2.toLowerCase().trim(),
                    req.body.tier3ID,
                    req.body.tier3.toLowerCase().trim(),
                    req.body.tier4ID,
                    req.body.tier4.toLowerCase().trim(),
                    req.body.saveEpoch,
                    req.body.sentEpoch,
                    req.body.isSent,
                    req.body.isApproved,
                    req.body.comment.trim(),
                    req.body.localStorageID,
                    currentYear,
                    currentSeason
                ];

                console.log(req.body);

                const query = "INSERT INTO patientreports (studentID," +
                    "courseID," +
                    "specialtyID," +
                    "attendingPhysicianID," +
                    "patientHospitalID," +
                    "isObserved," +
                    "isAssisted," +
                    "isPerformed," +
                    "isSimulated," +
                    "isHistory," +
                    "isTreatment," +
                    "isPhysicalExamination," +
                    "isDifferentialDiagnosis," +
                    "setting," +
                    "illnessScript," +
                    "tier1ID," +
                    "tier1," +
                    "tier2ID," +
                    "tier2," +
                    "tier3ID," +
                    "tier3," +
                    "tier4ID," +
                    "tier4," +
                    "saveEpoch," +
                    "sentEpoch," +
                    "isSent," +
                    "isApproved," +
                    "comment," +
                    "localStorageID, " +
                    "year, " +
                    "season) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                const connection = await conn.getConnection();
                const [results] = await connection.execute(query, values);
                connection.release();

                if (results.affectedRows > 0) {
                    var insertedTier1 = null;
                    var insertedTier2 = null;
                    var insertedTier3 = null;
                    var insertedTier4 = null;

                    if (req.body.isSent === 1) {
                        insertedTier1 = await checkAndInsertTierData(req.body.tier1ID, req.body.tier1.toLowerCase().trim(), results.insertId, res, next);
                        insertedTier2 = await checkAndInsertTierData(req.body.tier2ID, req.body.tier2.toLowerCase().trim(), results.insertId, res, next);
                        insertedTier3 = await checkAndInsertTierData(req.body.tier3ID, req.body.tier3.toLowerCase().trim(), results.insertId, res, next);
                        insertedTier4 = await checkAndInsertTierData(req.body.tier4ID, req.body.tier4.toLowerCase().trim(), results.insertId, res, next);
                    }

                    const primaryID = results.insertId;

                    res.status(200).json({
                        status: "success",
                        message: "Patient form data successfully inserted",
                        insertedIds: [insertedTier1, insertedTier2, insertedTier3, insertedTier4],
                        primaryID: primaryID
                    });
                } else {
                    // Handle the case where no rows were updated (e.g., student data didn't change)
                    res.status(200).json({
                        status: "success",
                        message: "No patient form data inserted",
                    });
                }

            })
            .catch((error) => {
                // Handle errors from getCurrentCourse
                return next(new AppError(error, 404));
            });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

exports.updatePatientForm = async (req, res, next) => { ////////////!!!!!!!!!!!!!!!!!!!
    if (!req.body) {
        return next(new AppError("No form data found", 404));
    }

    let query = "UPDATE patientreports SET ";
    const setClauses = [];
    const selectClauses = [];
    const values = [];

    const updateFields = [
        "studentID",
        "courseID",
        "specialtyID",
        "attendingPhysicianID",
        "patientHospitalID",
        "isObserved",
        "isAssisted",
        "isPerformed",
        "isSimulated",
        "isHistory",
        "isTreatment",
        "isPhysicalExamination",
        "isDifferentialDiagnosis",
        "setting",
        "illnessScript",
        "tier1ID",
        "tier1",
        "tier2ID",
        "tier2",
        "tier3ID",
        "tier3",
        "tier4ID",
        "tier4",
        "saveEpoch",
        "sentEpoch",
        "isSent",
        "isApproved",
        "comment",
    ];

    for (const field of updateFields) {
        if (req.body[field] !== undefined) {
            values.push(req.body[field]);
            setClauses.push(`${field} = ?`);
            selectClauses.push(field);
        }
    }

    if (setClauses.length === 0) {
        return res.status(200).json({
            status: "success",
            message: "No patient form data updated",
        });
    }

    query += setClauses.join(", ");
    query += " WHERE ID = ?;";
    values.push(parseInt(req.params.ID));

    console.log(query);
    console.log(...values);

    try {
        if (req.body.isSent === 1) {
            const res3 = await logController.updatePatientFormLog(selectClauses, values);
            // console.log("res3");
            console.log(res3);
        }

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        if (results.affectedRows === 0) {
            return res.status(200).json({
                status: "success",
                message: "No patient form data updated",
            });
        }

        const insertedIds = [];
        if (req.body.isSent === 1) {
            for (let i = 1; i <= 4; i++) {
                const tierID = req.body[`tier${i}ID`];
                const tierValue = req.body[`tier${i}`];
                console.log(tierID, tierValue);

                const insertedTier = await checkAndInsertTierData(
                    tierID,
                    tierValue,
                    req.params.ID,
                    res,
                    next
                );
                insertedIds.push(insertedTier);
            }
        }

        res.status(200).json({
            status: "success",
            message: "Form data successfully altered",
            insertedId: insertedIds || "No new tier data inserted",
        });

    } catch (err) {
        return next(new AppError(err, 500));
    }
};

//counts student's form count for specified course && approval status
exports.getCountPatientFormsForDashboardAccordingToApproval = async (req, res, next) => {
    try {
        const studentID = req.params.studentID;
        let courseID = parseInt(req.params.courseID) || null; // Default courseID

        if (!courseID) {
            // Use getCurrentCourse to get the courseID
            courseHelper.getCurrentCourse(studentID)
                .then(async (finalCourseID) => {
                    console.log(finalCourseID);
                    await executeMainQuery(finalCourseID);
                })
                .catch((error) => {
                    // Handle errors from getCurrentCourse
                    return next(new AppError(error, 500));
                });
        } else {
            // If courseID is provided in the query, proceed directly with the main query
            await executeMainQuery(courseID);
        }

        async function executeMainQuery(finalCourseID) {
            const query = `
                SELECT COALESCE(COUNT(pa.ID), 0) AS count_value,
                    appr.isApproved
                FROM (SELECT 0 AS isApproved
                    UNION
                    SELECT 1
                    UNION
                    SELECT 2) appr
                        LEFT JOIN (select *
                                    from patientreports
                                    where studentID = ?
                                            && courseID = ?
                                            && isSent = 1
                                            && year = ?
                                            && season = ?) pa ON appr.isApproved = pa.isApproved
                GROUP BY appr.isApproved;`;

            const values = [
                studentID,
                finalCourseID,
                currentYear,
                currentSeason
            ];

            const connection = await conn.getConnection();
            const [results] = await connection.execute(query, values);
            connection.release();

            res.status(200).json({
                status: "success",
                length: results?.length,
                data: results,
            });

        }
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

};

//for student home dropdown just list 5 reports for the current course
exports.listSent5ReportForStudent = (req, res, next) => {
    try {
        const studentID = req.params.studentID;
        const isSent = req.params.isSent;

        courseHelper.getCurrentCourse(studentID).then(async (courseID) => {
            const query = `SELECT *
                FROM patientreports
                WHERE studentID = ?
                  AND isSent = ?
                  AND courseID = ?
                  AND year = ?
                  AND season = ?
                ORDER BY saveEpoch DESC
                LIMIT 5;`;

            const values = [studentID, isSent, courseID, currentYear, currentSeason];

            const connection = await conn.getConnection();
            const [results] = await connection.execute(query, values);
            connection.release();

            res.status(200).json({
                status: "success",
                length: results?.length,
                data: results,
            });

        }).catch((error) => {
            return next(new AppError(error, 500));
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

//list sent forms for doctor accepted & rejected page with filtering fuctionality with student name
exports.searchSentPatientFormsWithDocIDAccordingToApproveDate = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const physicianID = req.params.attendingPhysicianID;
    const approvement = req.params.isApproved;
    let courseID = parseInt(req.params.courseID) || null; // Default courseID
    let rotationID = parseInt(req.params.rotationID) || null; // Default rotationID
    let specialtyID = parseInt(req.params.specialtyID) || null; // Default courseID

    try {
        if (!rotationID && !courseID) { //if course id and retation no is NOT specified return physians all coming reports

            const query = `
            SELECT pa.*
            FROM patientreports pa
                    LEFT JOIN student std ON pa.studentID = std.ID
            WHERE pa.attendingPhysicianID = ?
            AND pa.isSent = 1
            AND pa.isApproved = ?
            AND (UPPER(std.name) LIKE ? OR UPPER(std.surname) LIKE ?)
            AND pa.year = ?
            AND pa.season = ?
            ORDER BY pa.sentEpoch DESC
            LIMIT ? OFFSET ?;`

            const values = [
                physicianID,
                approvement,
                `%${input.toUpperCase()}%`,
                `%${input.toUpperCase()}%`,
                currentYear,
                currentSeason,
                pageSize,
                offset
            ];

            const connection = await conn.getConnection();
            const [results] = await connection.execute(query, values);
            connection.release();

            res.status(200).json({
                status: "success",
                currentPage: page,
                pageSize: pageSize,
                length: results?.length,
                data: results,
            });

        } else {
            // If courseID is provided in the query, proceed directly with the main query
            await executeMainQuery(rotationID, courseID, specialtyID);
        }
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

    async function executeMainQuery(rotationID, finalCourseID, specialtyID) {
        let query = '';
        let values = [];

        if (specialtyID) { //if rotation and course and also *specialty* is provided
            query = `
            SELECT pa.*
            FROM patientreports pa
                     LEFT JOIN enrollment e ON e.std_id = pa.studentID
                     LEFT JOIN rotation_courses r ON r.rotation_id = e.rotation_id AND r.course_id = pa.courseID
                     LEFT JOIN student std ON std.ID = e.std_id AND std.ID = pa.studentID
            WHERE r.rotation_id = ?
              AND r.course_id = ?
              AND pa.specialtyID = ?
              AND pa.attendingPhysicianID = ?
              AND pa.isSent = 1
              AND pa.isApproved = ?
              AND (UPPER(std.name) LIKE ? OR UPPER(std.surname) LIKE ?)
              AND pa.year = ?
              AND pa.season = ?
            ORDER BY pa.sentEpoch DESC
            LIMIT ? OFFSET ?;`;

            values = [
                rotationID,
                finalCourseID,
                specialtyID,
                physicianID,
                approvement,
                `%${input.toUpperCase()}%`,
                `%${input.toUpperCase()}%`,
                currentYear,
                currentSeason,
                pageSize,
                offset
            ];

        }
        else {
            query = `
            SELECT pa.*
            FROM patientreports pa
                     LEFT JOIN enrollment e ON e.std_id = pa.studentID
                     LEFT JOIN rotation_courses r ON r.rotation_id = e.rotation_id AND r.course_id = pa.courseID
                     LEFT JOIN student std ON std.ID = e.std_id AND std.ID = pa.studentID
            WHERE r.rotation_id = ?
              AND r.course_id = ?
              AND pa.attendingPhysicianID = ?
              AND pa.isSent = 1
              AND pa.isApproved = ?
              AND (UPPER(std.name) LIKE ? OR UPPER(std.surname) LIKE ?)
              AND pa.year = ?
              AND pa.season = ?
            ORDER BY pa.sentEpoch DESC
            LIMIT ? OFFSET ?;`;

            values = [
                rotationID,
                finalCourseID,
                physicianID,
                approvement,
                `%${input.toUpperCase()}%`,
                `%${input.toUpperCase()}%`,
                currentYear,
                currentSeason,
                pageSize,
                offset
            ];

        }

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        res.status(200).json({
            status: "success",
            currentPage: page,
            pageSize: pageSize,
            length: results?.length,
            data: results,
        });

    }
};

//no need for filtering by course ID because it only gets *waiting reports*, lists att. physc. waiting reports
exports.listWaitingReports = async (req, res, next) => {
    const attPhysicianID = req.params.physicianID;
    const isApproved = 0;

    let courseID = req.query.courseID || null; // Default courseID

    try {

        const query = `SELECT pa.*
            FROM patientreports pa
            WHERE pa.attendingPhysicianID = ?
              AND pa.isSent = 1
              AND pa.isApproved = ?
              AND pa.year = ?
              AND pa.season = ?
            ORDER BY saveEpoch DESC;`;

        const values = [attPhysicianID, isApproved, currentYear, currentSeason];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        res.status(200).json({
            status: "success",
            length: results.length,
            data: results,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

//list sent forms for student to show on student sent page with ability to filter by procedure name & an input
exports.searchPatientFormsForStudent = async (req, res, next) => { //for student sent page pagination && filtering
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const searchInput = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const studentID = req.params.studentID;
    const isSent = req.params.isSent;

    let courseID = parseInt(req.params.courseID) || null; // Default courseID

    // Check if courseID is not specified, then find the current course for the student

    try {
        if (!courseID) {
            // Use getCurrentCourse to get the courseID
            courseHelper.getCurrentCourse(studentID)
                .then(async (finalCourseID) => {
                    await executeMainQuery(finalCourseID);
                })
                .catch((error) => {
                    // Handle errors from getCurrentCourse
                    return next(new AppError(error, 500));
                });
        } else {
            // If courseID is provided in the query, proceed directly with the main query
            await executeMainQuery(courseID);
        }
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

    async function executeMainQuery(finalCourseID) {
        const query = `
        SELECT *
        FROM patientreports
        WHERE studentID = ?
        AND isSent = ?
        AND courseID = ?
        AND year = ?
        AND season = ?
        AND UPPER(illnessScript) LIKE ?
        ORDER BY saveEpoch DESC
        LIMIT ? OFFSET ?`;

        const values = [
            studentID,
            isSent,
            finalCourseID,
            currentYear,
            currentSeason,
            `%${searchInput.toUpperCase().trim()}%`,
            pageSize,
            offset
        ];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        res.status(200).json({
            status: "success",
            currentPage: page,
            pageSize: pageSize,
            length: results.length,
            data: results,
        });

    }
};

//search if student id enrolled in any course, if yes count the requ


exports.searchPatientFormsByAcceptance = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const searchInput = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const studentID = req.params.studentID;
    const isSent = req.params.isSent;
    const isApproved = req.params.isApproved;

    let courseID = parseInt(req.params.courseID) || null; // Default courseID

    // Check if courseID is not specified, then find the current course for the student
    try {
        if (!courseID) {
            // Use getCurrentCourse to get the courseID
            courseHelper.getCurrentCourse(studentID)
                .then(async (finalCourseID) => {
                    await executeMainQuery(finalCourseID);
                })
                .catch((error) => {
                    // Handle errors from getCurrentCourse
                    return next(new AppError(error, 500));
                });
        } else {
            // If courseID is provided in the query, proceed directly with the main query
            await executeMainQuery(courseID);
        }
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

    async function executeMainQuery(finalCourseID) {
        const query = `
        SELECT *
        FROM patientreports
        WHERE studentID = ?
        AND isSent = ?
        AND courseID = ?
        AND isApproved = ?
        AND year = ?
        AND season = ?
        AND UPPER(illnessScript) LIKE ?
        ORDER BY saveEpoch DESC
        LIMIT ? OFFSET ?`;

        const values = [studentID, isSent, finalCourseID, isApproved, currentYear, currentSeason, `%${searchInput.toUpperCase()}%`, pageSize, offset];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        res.status(200).json({
            status: "success",
            currentPage: page,
            pageSize: pageSize,
            length: results.length,
            data: results,
        });
    }
};

exports.searchPatientFormsByMultipleAcceptance = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const searchInput = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const studentID = req.params.studentID;
    const isSent = req.params.isSent;
    const isApproved1 = req.params.isApproved1;
    const isApproved2 = req.params.isApproved2;

    let courseID = parseInt(req.params.courseID) || null; // Default courseID

    try {
        if (!courseID) {
            // Use getCurrentCourse to get the courseID
            courseHelper.getCurrentCourse(studentID)
                .then(async (finalCourseID) => {
                    await executeMainQuery(finalCourseID);
                })
                .catch((error) => {
                    // Handle errors from getCurrentCourse
                    return next(new AppError(error, 500));
                });
        } else {
            // If courseID is provided in the query, proceed directly with the main query
            await executeMainQuery(courseID);
        }
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

    async function executeMainQuery(finalCourseID) {
        const query = `
        SELECT *
        FROM patientreports
        WHERE studentID = ?
        AND isSent = ?
        AND courseID = ?
        AND (isApproved IN (?, ?))
        AND year = ?
        AND season = ?
        AND UPPER(illnessScript) LIKE ?
        ORDER BY saveEpoch DESC
        LIMIT ? OFFSET ?;`;

        const values = [studentID, isSent, finalCourseID,
            isApproved1, isApproved2, currentYear, currentSeason,
            `%${searchInput.toUpperCase()}%`, pageSize, offset];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        res.status(200).json({
            status: "success",
            currentPage: page,
            pageSize: pageSize,
            length: results.length,
            data: results,
        });

    }
};

//to see if there is a report in remote DB with a specified local storage ID
exports.getIDofPatientForm = async (req, res, next) => {
    if (!req.params.studentID) {
        return next(new AppError("No patient with this student ID found", 404));
    }

    if (!req.params.localStorageID) {
        return next(new AppError("No patient with this local storage ID found", 404));
    }

    try {
        const values = [req.params.studentID, req.params.localStorageID, currentYear, currentSeason];
        const query = "select ID from patientreports WHERE studentID =  ? AND localStorageID = ? AND year = ? AND season = ? order by ID ASC LIMIT 1";

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


exports.deletePatientFormWithID = async (req, res, next) => { //find the form by local storage ID && related student and delete that form
    const studentID = req.params.stdID;
    const localStorageID = req.params.localStorageID;

    if (!studentID || !localStorageID) {
        return next(new AppError("Both studentID and localStorageID are required.", 400));
    }

    try {
        const query = "DELETE FROM patientreports WHERE studentID = ? && localStorageID = ?";
        const values = [studentID, localStorageID];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        if (results.affectedRows === 0) {
            return next(new AppError("Patient form not found", 404));
        }
        res.status(200).json({
            status: "success",
            message: "Patient form deleted!",
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }

};

const checkAndInsertTierData = ( ///????????????????
    tierID,
    tierText,
    relatedReport,
    res,
    next
) => {
    return new Promise(async (resolve, reject) => {
        // Check if tierID is -1, the "other" choice
        if (tierID === -1) {
            // find the most similar tier description to a given input string by calculating the Levenshtein 
            //distance-based similarity percentage and filtering for tiers. The closest match is returned as a result.
            const similarProcedureQuery = `
            SELECT description,
            ((1 - levenshtein(?, description, 1) / GREATEST(CHAR_LENGTH(?), CHAR_LENGTH(description))) * 100) AS similarity
            FROM differentialdiagnoses
            HAVING similarity < 20
            ORDER BY similarity DESC
            LIMIT 1`;
            const values = [tierText, tierText];

            const connection = await conn.getConnection();
            const [results] = await connection.execute(similarProcedureQuery, values);
            connection.release();

            console.log("result " + results[0].similarity);

            // If a similar tier is found with a similarity percentage <20 , insert the tier text coming from the form
            if (results[0].similarity < 20) {
                const similarProcedure = results[0];
                console.log("most similar tier", similarProcedure.description);

                // Handle the insertion logic here
                console.log(tierText);
                console.log(relatedReport);
                if (!tierText || !relatedReport) {
                    reject(new AppError("Invalid data provided", 400));
                }

                const values = [tierText, relatedReport];
                const query2 = "INSERT INTO differentialdiagnoses (description, relatedReport) VALUES (?, ?)";

                const connection = await conn.getConnection();
                const [result2] = await connection.execute(query2, values);
                connection.release();
                if (result2) {
                    console.log("Inserted Data2222:", result2);

                    resolve(result2.insertId);
                }

            } else {
                resolve(null); // Indicate that no insertion was needed
                console.log("No insertion was needed.");

            }
        } else {
            resolve(null); // If tierID is not -1, resolve with null to indicate no insertion was needed
            console.log("Related Tier is not -1");

        }
    });
};

exports.getPatientFormWithID = async (req, res, next) => { //returns specific patientreports with ID
    if (!req.params.ID) {
        return next(new AppError("No patient with this ID found", 404));
    }

    try {
        const query = "SELECT * FROM patientreports WHERE ID = ?";
        const values = [req.params.ID];

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
};

exports.getLastLocalStorageID = async (req, res, next) => { //returns last localstorage id of the reports
    if (!req.params.studentID) {
        return next(new AppError("No student with this ID found", 404));
    }

    try {
        const query = "select localStorageID from patientreports where studentID =  ? order by localStorageID DESC  limit 1;";
        const values = [req.params.studentID];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        res.status(200).json({
            status: "success",
            data: results,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

exports.checkDraftIsSent = (req, res, next) => { //checks if the previously drafted report is sent by LS id and std number
    if (!req.params.studentID) {
        return next(new AppError("No student with this ID found", 404));
    }
    const studentID = req.params.studentID;
    const localStorageID = req.params.localStorageID;

    try {
        const query = `select isSent
        from patientreports
        where studentID = ?
          and localStorageID = ?
          and courseID = ?;`;


        courseHelper.getCurrentCourse(studentID)
            .then(async (finalCourseID) => {
                const values = [studentID, localStorageID, finalCourseID];

                const connection = await conn.getConnection();
                const [results] = await connection.execute(query, values);
                connection.release();

                res.status(200).json({
                    status: "success",
                    data: results,
                });

            })
            .catch((error) => {
                // Handle errors from getCurrentCourse
                return next(new AppError(error, 500));
            });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

exports.checkSaveEpoch = (req, res, next) => { //returns draft reports save epoch value from DB
    if (!req.params.studentID) {
        return next(new AppError("No student with this ID found", 404));
    }
    const studentID = req.params.studentID;
    const localStorageID = req.params.localStorageID;

    try {

        const query = `select saveEpoch
            from patientreports
            where studentID = ?
              and localStorageID = ?
              and courseID = ?;`;

        courseHelper.getCurrentCourse(studentID)
            .then(async (finalCourseID) => {
                const values = [studentID, localStorageID, finalCourseID];

                const connection = await conn.getConnection();
                const [results] = await connection.execute(query, values);
                connection.release();

                res.status(200).json({
                    status: "success",
                    data: results,
                });

            })
            .catch((error) => {
                // Handle errors from getCurrentCourse
                return next(new AppError(error, 500));
            });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

exports.draftReportToUpdateLocal = (req, res, next) => { //returns draft report to Update local draft
    if (!req.params.studentID) {
        return next(new AppError("No student with this ID found", 404));
    }
    const studentID = req.params.studentID;
    const localStorageID = req.params.localStorageID;

    try {
        const query = `select *
            from patientreports
            where studentID = ?
              and localStorageID = ?
              and courseID = ?;`;

        courseHelper.getCurrentCourse(studentID)
            .then(async (finalCourseID) => {
                const values = [studentID, localStorageID, finalCourseID];

                const connection = await conn.getConnection();
                const [results] = await connection.execute(query, values);
                connection.release();

                res.status(200).json({
                    status: "success",
                    data: results,
                });

            })
            .catch((error) => {
                // Handle errors from getCurrentCourse
                return next(new AppError(error, 500));
            });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


//for physician Student Progress Page counts student's form count for specified course, rotation && approval status
exports.getDoctorCountPatientFormsForDashboardAccordingToApproval = async (req, res, next) => {
    const studentID = req.params.studentID;
    const physicianID = req.params.physicianID;
    const courseID = parseInt(req.params.courseID);
    const rotationID = parseInt(req.params.rotationID);


    if (!studentID || !physicianID || !courseID || !rotationID) {
        return next(new AppError("Lack of needed parameters", 404));
    }

    const query = `
    SELECT COALESCE(COUNT(pro.ID), 0) AS count_value,
        appr.isApproved
    FROM (SELECT 0 AS isApproved
        UNION
        SELECT 1
        UNION
        SELECT 2) appr
            LEFT JOIN (SELECT *
                        FROM patientreports
                        WHERE studentID = ?
                        AND isSent = 1
                        AND year = ?
                        AND season = ?
                        AND courseID = ?
                        AND attendingPhysicianID = ?) pro ON appr.isApproved = pro.isApproved
            LEFT JOIN enrollment e ON e.std_id = pro.studentID AND e.rotation_id = ?
            LEFT JOIN rotation_courses rc ON rc.course_id = pro.courseID AND rc.rotation_id = e.rotation_id

    GROUP BY appr.isApproved;`;

    const values = [
        studentID,
        currentYear,
        currentSeason,
        courseID,
        physicianID,
        rotationID,
    ];

    try {

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
};

//for physician Student ttoal progress counts student's form count for specified course, rotation && approval status
exports.getLinearTotalProgressBarData = async (req, res, next) => {
    const physicianID = req.params.physicianID;
    const courseID = parseInt(req.params.courseID);
    const rotationID = parseInt(req.params.rotationID);

    if (!physicianID) {
        return next(new AppError("Lack of needed parameters", 404));
    }

    try {
        if (!rotationID || !courseID) {//if rotation and course is not provided return all the rotation courses sums

            //return all
            const query = `
                SELECT COALESCE(COUNT(pr.ID), 0)           AS report_count,
                    COALESCE(SUM(pr.isApproved = 1), 0) AS approved_count,
                    COALESCE(SUM(pr.isApproved = 0), 0) AS waiting_count,
                    COALESCE(SUM(pr.isApproved = 2), 0) AS rejected_count
                FROM patientreports pr
                        left join attendingphysicians att on att.ID = pr.attendingPhysicianID and pr.courseID = att.courseID
                WHERE att.ID = ? && pr.year = ? && pr.season = ? && pr.isSent;
                `;

            const values = [
                physicianID,
                currentYear,
                currentSeason,
            ];

            const connection = await conn.getConnection();
            const [results] = await connection.execute(query, values);
            connection.release();

            res.status(200).json({
                status: "success",
                length: results?.length,
                data: results,
            });

        } else { //return that rotation courses sum

            const query = `
                SELECT COUNT(pr.ID)           AS report_count,
                    COALESCE(SUM(pr.isApproved = 1), 0) AS approved_count,
                    COALESCE(SUM(pr.isApproved = 2), 0) AS rejected_count,
                    COALESCE(SUM(pr.isApproved = 0), 0) AS waiting_count
                FROM enrollment e
                        INNER JOIN
                    rotation_courses rc ON e.rotation_id = rc.rotation_id
                        LEFT JOIN
                    attendingphysicians att ON att.courseID = rc.course_id
                        LEFT JOIN
                    patientreports pr ON pr.attendingPhysicianID = att.ID AND pr.studentID = e.std_id AND pr.courseID = rc.course_id
                WHERE rc.rotation_id = ?
                AND rc.course_id = ?
                AND att.ID = ?
                and pr.year = ?
                and pr.season = ?;`;

            const values = [
                rotationID,
                courseID,
                physicianID,
                currentYear,
                currentSeason,
            ];

            const connection = await conn.getConnection();
            const [results] = await connection.execute(query, values);
            connection.release();

            res.status(200).json({
                status: "success",
                length: results?.length,
                data: results,
            });

        }
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

};