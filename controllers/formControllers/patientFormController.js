import { config } from './config.js';
const AppError = require("../../utils/appError");
const conn = require("../../services/db");
const { query } = require("express");
const config = require("../../config");
const currentYear = config.year;
const currentSeason = config.season;

exports.insertPatientForm = (req, res, next) => {
    //we check if the client is sending an empty form "and return a 404 error message.
    if (!req.body)
        return next(new AppError("No form data found", 404));

    const values = [
        req.body.studentID,
        req.body.courseID,
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

    conn.query(
        "INSERT INTO patientreports (studentID," +
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
        "VALUES(?)",
        [values],
        async function (err, data, fields) {
            if (err) {
                return next(new AppError(err, 500));
            }

            if (data.affectedRows > 0) {
                var insertedTier1 = null;
                var insertedTier2 = null;
                var insertedTier3 = null;
                var insertedTier4 = null;

                if (req.body.isSent === 1) {
                    insertedTier1 = await checkAndInsertTierData(req.body.tier1ID, req.body.tier1.toLowerCase().trim(), data.insertId, res, next);
                    insertedTier2 = await checkAndInsertTierData(req.body.tier2ID, req.body.tier2.toLowerCase().trim(), data.insertId, res, next);
                    insertedTier3 = await checkAndInsertTierData(req.body.tier3ID, req.body.tier3.toLowerCase().trim(), data.insertId, res, next);
                    insertedTier4 = await checkAndInsertTierData(req.body.tier4ID, req.body.tier4.toLowerCase().trim(), data.insertId, res, next);
                }

                res.status(201).json({
                    status: "success",
                    message: "Patient form data successfully inserted",
                    insertedIds: [insertedTier1, insertedTier2, insertedTier3, insertedTier4],
                });
            } else {
                // Handle the case where no rows were updated (e.g., student data didn't change)
                res.status(200).json({
                    status: "success",
                    message: "No patient form data inserted",
                });
            }
        }
    );
};
exports.updatePatientForm = (req, res, next) => {
    console.log("updating started");
    //we check if the client is sending an empty form "and return a 404 error message.
    if (!req.body)
        return next(new AppError("No form data found", 404));

    console.log("req body found: student ID: " + req.body.studentID);

    let values = [];
    if (req.body.studentID !== undefined) values.unshift(req.body.studentID);
    if (req.body.courseID !== undefined) values.unshift(req.body.courseID);
    if (req.body.specialtyID !== undefined) values.unshift(req.body.specialtyID);
    if (req.body.attendingPhysicianID !== undefined) values.unshift(req.body.attendingPhysicianID);
    if (req.body.patientHospitalID !== undefined) values.unshift(req.body.patientHospitalID);
    if (req.body.isObserved !== undefined) values.unshift(req.body.isObserved);
    if (req.body.isAssisted !== undefined) values.unshift(req.body.isAssisted);
    if (req.body.isPerformed !== undefined) values.unshift(req.body.isPerformed);
    if (req.body.isSimulated !== undefined) values.unshift(req.body.isSimulated);
    if (req.body.isHistory !== undefined) values.unshift(req.body.isHistory);
    if (req.body.isTreatment !== undefined) values.unshift(req.body.isTreatment);
    if (req.body.isPhysicalExamination !== undefined) values.unshift(req.body.isPhysicalExamination);
    if (req.body.isDifferentialDiagnosis !== undefined) values.unshift(req.body.isDifferentialDiagnosis);
    if (req.body.setting !== undefined) values.unshift(req.body.setting);
    if (req.body.illnessScript !== undefined) values.unshift(req.body.illnessScript.trim());
    if (req.body.tier1ID !== undefined) values.unshift(req.body.tier1ID);
    if (req.body.tier1 !== undefined) values.unshift(req.body.tier1.toLowerCase().trim());
    if (req.body.tier2ID !== undefined) values.unshift(req.body.tier2ID);
    if (req.body.tier2 !== undefined) values.unshift(req.body.tier2.toLowerCase().trim());
    if (req.body.tier3ID !== undefined) values.unshift(req.body.tier3ID);
    if (req.body.tier3 !== undefined) values.unshift(req.body.tier3.toLowerCase().trim());
    if (req.body.tier4ID !== undefined) values.unshift(req.body.tier4ID);
    if (req.body.tier4 !== undefined) values.unshift(req.body.tier4.toLowerCase().trim());
    if (req.body.saveEpoch !== undefined) values.unshift(req.body.saveEpoch);
    if (req.body.sentEpoch !== undefined) values.unshift(req.body.sentEpoch);
    if (req.body.isSent !== undefined) values.unshift(req.body.isSent);
    if (req.body.isApproved !== undefined) values.unshift(req.body.isApproved);
    if (req.body.comment !== undefined) values.unshift(req.body.comment);
    console.log("values: " + values.reverse().toString());


    console.log(req.body);

    var str = "UPDATE patientreports SET " +
        (req.body.studentID !== undefined ? "studentID = ?, " : "") +
        (req.body.courseID !== undefined ? "courseID = ?, " : "") +
        (req.body.specialtyID !== undefined ? "specialtyID = ?, " : "") +
        (req.body.attendingPhysicianID !== undefined ? "attendingPhysicianID = ?, " : "") +
        (req.body.patientHospitalID !== undefined ? "patientHospitalID = ?, " : "") +
        (req.body.isObserved !== undefined ? "isObserved = ?, " : "") +
        (req.body.isAssisted !== undefined ? "isAssisted = ?, " : "") +
        (req.body.isPerformed !== undefined ? "isPerformed = ?, " : "") +
        (req.body.isSimulated !== undefined ? "isSimulated = ?, " : "") +
        (req.body.isHistory !== undefined ? "isHistory = ?, " : "") +
        (req.body.isTreatment !== undefined ? "isTreatment = ?, " : "") +
        (req.body.isPhysicalExamination !== undefined ? "isPhysicalExamination = ?, " : "") +
        (req.body.isDifferentialDiagnosis !== undefined ? "isDifferentialDiagnosis = ?, " : "") +
        (req.body.setting !== undefined ? "setting = ?, " : "") +
        (req.body.illnessScript !== undefined ? "illnessScript = ?, " : "") +
        (req.body.tier1ID !== undefined ? "tier1ID = ?, " : "") +
        (req.body.tier1 !== undefined ? "tier1 = ?, " : "") +
        (req.body.tier2ID !== undefined ? "tier2ID = ?, " : "") +
        (req.body.tier2 !== undefined ? "tier2 = ?, " : "") +
        (req.body.tier3ID !== undefined ? "tier3ID = ?, " : "") +
        (req.body.tier3 !== undefined ? "tier3 = ?, " : "") +
        (req.body.tier4ID !== undefined ? "tier4ID = ?, " : "") +
        (req.body.tier4 !== undefined ? "tier4 = ?, " : "") +
        (req.body.saveEpoch !== undefined ? "saveEpoch = ?, " : "") +
        (req.body.sentEpoch !== undefined ? "sentEpoch = ?, " : "") +
        (req.body.isSent !== undefined ? "isSent = ?, " : "") +
        (req.body.isApproved !== undefined ? "isApproved = ?, " : "") +
        (req.body.comment !== undefined ? "comment = ?, " : "");

    var pos = str.lastIndexOf(",");
    str = str.substring(0, pos) + str.substring(pos + 1);

    str = str + " WHERE ID = " + req.params.ID + ";";

    conn.query(
        str, values,
        async function (err, data, fields) {
            if (err) {
                return next(new AppError(err, 500));
            }

            // Check if any rows were actually updated
            if (data.affectedRows > 0) {

                var insertedTier1 = null;
                var insertedTier2 = null;
                var insertedTier3 = null;
                var insertedTier4 = null;

                if (req.body.isSent === 1) {
                    insertedTier1 = await checkAndInsertTierData(req.body.tier1ID, req.body.tier1.toLowerCase().trim(), req.params.ID, res, next);
                    insertedTier2 = await checkAndInsertTierData(req.body.tier2ID, req.body.tier2.toLowerCase().trim(), req.params.ID, res, next);
                    insertedTier3 = await checkAndInsertTierData(req.body.tier3ID, req.body.tier3.toLowerCase().trim(), req.params.ID, res, next);
                    insertedTier4 = await checkAndInsertTierData(req.body.tier4ID, req.body.tier4.toLowerCase().trim(), req.params.ID, res, next);
                }

                res.status(201).json({
                    status: "success",
                    message: "Patient form data successfully updated",
                    insertedIds: [insertedTier1, insertedTier2, insertedTier3, insertedTier4],
                });
            } else {
                // Handle the case where no rows were updated (e.g., student data didn't change)
                res.status(200).json({
                    status: "success",
                    message: "No patient form data updated",
                });
            }
        }
    );
};

//counts student's form count for specified course && approval status
exports.getCountPatientFormsForDashboardAccordingToApproval = (req, res, next) => {
    const studentID = req.params.studentID;
    const approvalCode = req.params.approvalCode;
    let courseID = parseInt(req.query.courseID) || 1; // Default courseID

    if (!req.query.courseID) {
        // Use getCurrentCourse to get the courseID
        getCurrentCourse(studentID)
            .then((finalCourseID) => {
                executeMainQuery(finalCourseID);
            })
            .catch((error) => {
                // Handle errors from getCurrentCourse
                return next(new AppError(error, 500));
            });
    } else {
        // If courseID is provided in the query, proceed directly with the main query
        executeMainQuery(courseID);
    }

    function executeMainQuery(finalCourseID) {
        const query = `
        select count(ID)
        from patientreports
        where studentID = ?
                && courseID = ?
                && isApproved = ? && year = ? && season = ?;`;

        const values = [
            studentID,
            finalCourseID,
            approvalCode,
            currentYear,
            currentSeason
        ];

        conn.query(
            query, values,
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
};

//for student home dropdown just list 5 reports for the current course
exports.listSent5ReportForStudent = (req, res, next) => {
    const studentID = req.params.studentID;
    const isSent = req.params.isSent;
    const courseID = getStudentCurrentCourse(studentID);

    conn.query(
        "SELECT * FROM patientreports WHERE studentID = ? AND isSent = ? AND courseID = ? AND year = ? AND season = ? ORDER BY saveEpoch DESC LIMIT 5 ",
        [studentID, isSent, courseID, currentYear, currentSeason],
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

//list sent forms for doctor accepted & rejected page with filtering fuctionality with student name
exports.searchSentPatientFormsWithDocIDAccordingToApproveDate = (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const physicianID = req.params.attendingPhysicianID;
    const approvement = req.params.isApproved;
    let courseID = parseInt(req.query.courseID) || 1; // Default courseID

    if (!req.query.courseID) {
        // Use getCurrentCourse to get the courseID
        getCurrentCourse(studentID)
            .then((finalCourseID) => {
                executeMainQuery(finalCourseID);
            })
            .catch((error) => {
                // Handle errors from getCurrentCourse
                return next(new AppError(error, 500));
            });
    } else {
        // If courseID is provided in the query, proceed directly with the main query
        executeMainQuery(courseID);
    }

    function executeMainQuery(finalCourseID) {
        const query = `
        SELECT pa.*
        FROM patientreports pa
                LEFT JOIN student std ON pa.studentID = std.ID
        WHERE pa.attendingPhysicianID = ?
        AND pa.isSent = 1
        AND pa.isApproved = ?
        AND UPPER(std.name) LIKE ?
        AND pa.courseID = ?
        AND pa.year = ?
        AND pa.season = ?
        ORDER BY pa.sentEpoch DESC
        LIMIT ? OFFSET ?;`;
        const values = [
            physicianID,
            approvement,
            `%${input.toUpperCase()}%`,
            finalCourseID,
            currentYear,
            currentSeason,
            pageSize,
            offset
        ];

        conn.query(
            query,
            values,
            function (err, data, fields) {
                if (err) return next(new AppError(err, 500));
                res.status(200).json({
                    status: "success",
                    currentPage: page,
                    pageSize: pageSize,
                    length: data?.length,
                    data: data,
                });
            }
        );
    }
};

//no need for filtering by course ID because it only gets *waiting reports*, lists att. physc. waiting reports
exports.listWaitingReports = (req, res, next) => {
    const searchInput = req.params.searchInput === "|" ? "" : req.params.searchInput;
    const attPhysicianID = req.params.physicianID;
    const isApproved = req.params.isApproved;

    let courseID = req.query.courseID || null; // Default courseID

    // Check if courseID is not specified, then find the current course for the physician
    if (!courseID) {
        getCurrentCourse(studentID)
            .then((finalCourseID) => {
                executeMainQuery(finalCourseID);
            })
            .catch((error) => {
                // Handle errors from getCurrentCourse
                return next(new AppError(error, 500));
            });
    } else {
        // If courseID is provided in the query, proceed directly with the main query
        executeMainQuery();
    }
    function executeMainQuery() { //now query doesnt have courseID filter
        conn.query(
            `SELECT pa.*
            FROM patientreports pa
            WHERE pa.attendingPhysicianID = ?
              AND pa.isSent = 1
              AND pa.isApproved = ?
              AND pa.year = ?
              AND pa.season = ?
            ORDER BY saveEpoch DESC;`,
            [attPhysicianID, isApproved, courseID, `%${searchInput.toUpperCase()}%`],
            function (err, data, fields) {
                if (err) return next(new AppError(err, 500));
                res.status(200).json({
                    status: "success",
                    length: data.length,
                    data: data,
                });
            }
        );
    }
};

//list sent forms for student to show on student sent page with ability to filter by procedure name & an input
exports.searchPatientFormsForStudent = (req, res, next) => { //for student sent page pagination && filtering
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const searchInput = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const studentID = req.params.studentID;
    const isSent = req.params.isSent;

    let courseID = parseInt(req.query.courseID) || null; // Default courseID

    // Check if courseID is not specified, then find the current course for the student
    if (!courseID) {
        // Use getCurrentCourse to get the courseID
        getStudentCurrentCourse(studentID)
            .then((finalCourseID) => {
                executeMainQuery(finalCourseID);
            })
            .catch((error) => {
                // Handle errors from getCurrentCourse
                return next(new AppError(error, 500));
            });
    } else {
        // If courseID is provided in the query, proceed directly with the main query
        executeMainQuery(courseID);
    }

    function executeMainQuery(finalCourseID) {
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

        conn.query(
            query,
            values,
            function (err, data, fields) {
                if (err) return next(new AppError(err, 500));
                res.status(200).json({
                    status: "success",
                    currentPage: page,
                    pageSize: pageSize,
                    length: data.length,
                    data: data,
                });
            }
        );
    }
};

exports.searchPatientFormsByAcceptance = (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const searchInput = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const studentID = req.params.studentID;
    const isSent = req.params.isSent;
    const isApproved = req.params.isApproved;

    let courseID = parseInt(req.query.courseID) || null; // Default courseID

    // Check if courseID is not specified, then find the current course for the student
    if (!courseID) {
        // Use getCurrentCourse to get the courseID
        getStudentCurrentCourse(studentID)
            .then((finalCourseID) => {
                executeMainQuery(finalCourseID);
            })
            .catch((error) => {
                // Handle errors from getCurrentCourse
                return next(new AppError(error, 500));
            });
    } else {
        // If courseID is provided in the query, proceed directly with the main query
        executeMainQuery(courseID);
    }

    function executeMainQuery(finalCourseID) {
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

        conn.query(
            query,
            values,
            function (err, data, fields) {
                if (err) return next(new AppError(err, 500));
                res.status(200).json({
                    status: "success",
                    currentPage: page,
                    pageSize: pageSize,
                    length: data.length,
                    data: data,
                });
            }
        );
    }
};

exports.searchPatientFormsByMultipleAcceptance = (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const searchInput = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const studentID = req.params.studentID;
    const isSent = req.params.isSent;
    const isApproved1 = req.params.isApproved1;
    const isApproved2 = req.params.isApproved2;

    let courseID = parseInt(req.query.courseID) || 1; // Default courseID

    if (!courseID) {
        // Use getCurrentCourse to get the courseID
        getStudentCurrentCourse(studentID)
            .then((finalCourseID) => {
                executeMainQuery(finalCourseID);
            })
            .catch((error) => {
                // Handle errors from getCurrentCourse
                return next(new AppError(error, 500));
            });
    } else {
        // If courseID is provided in the query, proceed directly with the main query
        executeMainQuery(courseID);
    }

    function executeMainQuery(finalCourseID) {
        const query = `
        SELECT *
        FROM patientreports
        WHERE studentID = ?
        AND isSent = ?
        AND courseID = ?
        AND (isApproved = ? OR isApproved = ?)
        AND year = ?
        AND season = ?
        AND UPPER(illnessScript) LIKE ?
        ORDER BY saveEpoch DESC
        LIMIT ? OFFSET ?;`;

        const values = [studentID, isSent, finalCourseID, isApproved1, isApproved2, `%${searchInput.toUpperCase()}%`, pageSize, offset];

        conn.query(
            query,
            values,
            function (err, data, fields) {
                if (err) return next(new AppError(err, 500));
                res.status(200).json({
                    status: "success",
                    currentPage: page,
                    pageSize: pageSize,
                    length: data.length,
                    data: data,
                });
            }
        );
    }
};

//to see if there is a report in remote DB with a specified local storage ID
exports.getIDofPatientForm = (req, res, next) => {
    if (!req.params.studentID) {
        return next(new AppError("No patient with this student ID found", 404));
    }
    if (!req.params.localStorageID) {
        return next(new AppError("No patient with this local storage ID found", 404));
    }
    conn.query(
        "select ID from patientreports WHERE studentID =  ? AND localStorageID = ? AND year = ? AND season = ? order by ID ASC LIMIT 1",
        [req.params.studentID, req.params.localStorageID, currentYear, currentSeason],
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


exports.deletePatientFormWithID = (req, res, next) => { //find the form by local storage ID && related student and delete that form
    const studentID = req.params.stdID;
    const localStorageID = req.params.localStorageID;

    if (!studentID || !localStorageID) {
        return next(new AppError("Both studentID and localStorageID are required.", 400));
    }

    conn.query(
        "DELETE FROM patientreports WHERE studentID = ? && localStorageID = ?",
        [studentID, localStorageID],
        function (err, result) {
            if (err) {
                console.error("Error deleting patient form:", err);
                return next(new AppError("Internal server error", 500));
            }
            // Check if any rows were affected to determine if a record was deleted
            if (result.affectedRows === 0) {
                return next(new AppError("Patient form not found", 404));
            }
            res.status(200).json({
                status: "success",
                message: "Patient form deleted!",
            });
        }
    );
};

const checkAndInsertTierData = (
    tierID,
    tierText,
    relatedReport,
    res,
    next
) => {
    return new Promise((resolve, reject) => {
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

            conn.query(
                similarProcedureQuery,
                [tierText, tierText],
                (err, results) => {
                    if (err) {
                        console.error("Error searching for similar procedure:", err);
                        reject(err);
                    }

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

                        conn.query(
                            "INSERT INTO differentialdiagnoses (description, relatedReport) VALUES (?, ?)",
                            values,
                            function (err, data, fields) {
                                if (err) {
                                    console.error("INSERT procedure Error:", err);
                                    reject(err);
                                }

                                console.log("Inserted Data2222:", data);
                                resolve(data.insertId);
                            }
                        );
                    } else {
                        resolve(null); // Indicate that no insertion was needed
                        console.log("No insertion was needed.");

                    }
                }
            );
        } else {
            resolve(null); // If tierID is not -1, resolve with null to indicate no insertion was needed
            console.log("Related Tier is not -1");

        }
    });
};

exports.getAllSentPatientForms = (req, res, next) => { //list of specified course && student
    const query = `SELECT * FROM patientreports WHERE isSent = 1 AND studentID = ? AND courseID = ?`;

    conn.query(
        query,
        [req.params.studentID, req.params.courseID],
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

exports.getRequiredCountPatientFormsForDashboard = (req, res, next) => { //get required form count for specified course
    const query = `select patient_count from courses where ID = ?`;

    conn.query(
        query,
        [req.params.courseID],
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

exports.getAllCountPatientFormsForDashboard = (req, res, next) => {  //counts student's form for specified course
    const query = `select count(ID) from patientreports where studentID = ? && courseID = ? && isSent = 1;`;

    conn.query(
        query,
        [req.params.studentID, req.params.courseID],
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

exports.getRotationCountPatientFormsForDashboard = (req, res, next) => { //gets different course IDs within patientreports DB 
    conn.query(
        "select distinct courseID from patientreports where studentID = ?;",
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
};

// Create a function to get the current course of the student
const getStudentCurrentCourse = (studentID) => {
    return new Promise((resolve, reject) => {
        conn.query(
            "SELECT c.ID " +
            "FROM student s " +
            "LEFT JOIN enrollment e ON e.std_id = s.ID " +
            "LEFT JOIN rotation_courses rc ON rc.rotation_id = e.rotation_id " +
            "LEFT JOIN intervals i ON i.ID = rc.interval_id " +
            "LEFT JOIN courses c ON c.ID = rc.course_id " +
            "WHERE current_date BETWEEN i.end AND i.start " +
            "AND s.ID = ?",
            [studentID],
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


exports.getPatientFormWithID = (req, res, next) => { //returns specific patientreports with ID
    if (!req.params.ID) {
        return next(new AppError("No patient with this ID found", 404));
    }
    conn.query(
        "SELECT * FROM patientreports WHERE ID = ?",
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

exports.listAllPatientReportsAccSentDateForDoc = (req, res, next) => {
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    conn.query("select * from patientreports WHERE attendingPhysicianID = ? AND isSent = 1 AND isApproved = ? AND " +
        "UPPER(studentName) LIKE '%" + input.toUpperCase().trim() + "%' order by saveEpoch DESC",
        [req.params.attphyscID, req.params.isApproved],
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


