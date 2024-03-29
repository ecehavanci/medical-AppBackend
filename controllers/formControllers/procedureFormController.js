const AppError = require("../../utils/appError");
const conn = require("../../services/db");
const procedureController = require("../procedureController");
const logController = require("../logController");
const courseHelper = require("../currentCourse");
const config = require("../../config");
const { Console } = require("console");
const currentYear = config.app.year;
const currentSeason = config.app.season;
const currentDate = config.app.date;


exports.insertProcedureForm = (req, res, next) => {
    //we check if the client is sending an empty form "and return a 404 error message.
    try {
        if (!req.body)
            return next(new AppError("No form data found", 404));
        else if (!req.body.studentID)
            return next(new AppError("No student data provided", 404));

        const studentID = req.body.studentID;
        courseHelper.getCurrentCourse(studentID)
            .then((finalCourseID) => {
                const values = [
                    req.body.studentID,
                    finalCourseID,
                    req.body.specialtyID,
                    req.body.attendingPhysicianID,
                    req.body.procedureID,
                    req.body.procedureText.toLowerCase().trim(),
                    req.body.isObserved,
                    req.body.isAssisted,
                    req.body.isPerformed,
                    req.body.isSimulated,
                    req.body.setting,
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
                    "INSERT INTO procedurereports (studentID," +
                    "courseID," +
                    "specialtyID," +
                    "attendingPhysicianID," +
                    "procedureID," +
                    "procedureText," +
                    "isObserved," +
                    "isAssisted," +
                    "isPerformed," +
                    "isSimulated," +
                    "setting," +
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

                            var inserted = null;

                            if (req.body.isSent === 1) {
                                inserted = await checkAndUpdateProcedure(req.body.procedureID, req.body.procedureText.toLowerCase().trim(), data.insertId, res, next);
                            }

                            const primaryID = data.insertId;

                            res.status(201).json({
                                status: "success",
                                message: "Student data successfully altered",
                                insertedId: inserted,
                                primaryID: primaryID
                            });
                        } else {
                            // Handle the case where no rows were updated (e.g., student data didn't change)
                            res.status(200).json({
                                status: "success",
                                message: "No student data updated",
                            });
                        }
                    }
                );

            });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

};

exports.updateProcedureForm = async (req, res, next) => { //!!!!!!!!!!!!!!!!!!!!!
    if (!req.body) {
        return next(new AppError("No form data found", 400));
    }

    let query = "UPDATE procedurereports SET ";

    const setClauses = [];
    const values = [];
    const selectClauses = [];

    const updateFields = [
        "studentID", "specialtyID", "courseID", "attendingPhysicianID", "procedureID",
        "procedureText", "isObserved", "isAssisted", "isPerformed", "isSimulated",
        "setting", "saveEpoch", "sentEpoch", "isSent", "isApproved", "comment"
    ];

    for (const field of updateFields) {
        if (req.body[field] !== undefined) {
            setClauses.push(`${field} = ?`);
            values.push(req.body[field]);
            selectClauses.push(field);
        }
    }

    if (setClauses.length === 0) {
        return res.status(200).json({
            status: "success",
            message: "No procedure form data updated",
        });
    }

    query += setClauses.join(", ");
    query += " WHERE ID = ?;";
    values.push(parseInt(req.params.ID));

    try {
        if (req.body.isSent === 1) {
            await logController.updateProcedureFormLog(selectClauses, values);

        }

        conn.query(query, values, async (err, data) => {
            if (err) {
                console.error("Update Error:", err);
                return next(new AppError(err.message, 500));
            }

            // Handle the case where no rows were updated
            if (data.affectedRows === 0) {
                return res.status(200).json({
                    status: "success",
                    message: "No student data updated",
                });
            }

            let inserted = null;
            if (req.body.isSent === 1) {

                inserted = await checkAndUpdateProcedure(req.body.procedureID, req.body.procedureText, req.params.ID, res, next);
            }

            res.status(201).json({
                status: "success",
                message: "Student data successfully altered222",
                insertedId: inserted || "No new procedure data inserted",
            });
        });


    } catch (err) {
        return next(new AppError(err, 500));
    }
};


const checkAndUpdateProcedure = (
    procedureID,
    procedureText,
    relatedReport,
    res,
    next
) => {
    return new Promise((resolve, reject) => {
        // Check if procedureID is -1, the "other" choice
        if (procedureID === -1 && procedureText != undefined) {
            // find the most similar procedure description to a given input string by calculating the Levenshtein 
            //distance-based similarity percentage and filtering for procedures. The closest match is returned as a result.
            console.log(procedureText);
            procedureText = procedureText.toLowerCase().trim();

            const similarProcedureQuery = `
                SELECT
                    description,
                    ((1 - levenshtein(?, description, 0) / GREATEST(CHAR_LENGTH(?), CHAR_LENGTH(description))) * 100) AS similarity
                FROM
                    procedures
                ORDER BY
                    similarity DESC
                LIMIT 1`;

            conn.query(
                similarProcedureQuery,
                [procedureText, procedureText],
                (err, results) => {
                    if (err) {
                        console.error("Error searching for similar procedure:", err);
                        reject(err);
                    }

                    console.log("result " + results[0].similarity);

                    // If a similar procedure is found with a similarity percentage <20 , insert the procedure text coming from the form
                    if (results[0].similarity < 20) {
                        const similarProcedure = results[0];
                        console.log("most similar procedure", similarProcedure.description);

                        // Handle the insertion logic here
                        console.log(procedureText);
                        console.log(relatedReport);
                        if (!procedureText || !relatedReport) {
                            reject(new AppError("Invalid data provided", 400));
                        }

                        const values = [procedureText, relatedReport];

                        conn.query(
                            "INSERT INTO procedures (description, relatedReport) VALUES (?, ?)",
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
            resolve(null); // If procedureID is not -1, resolve with null to indicate no insertion was needed
            console.log("ProcedureID is not -1");

        }
    });
};

exports.searchProcedureReportsByAcceptance = (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const studentID = req.params.studentID;
    const isSent = req.params.isSent;
    const isApproved = req.params.isApproved;

    let courseID = parseInt(req.params.courseID) || null; // Default courseID

    try {
        if (!courseID) {
            // Use getCurrentCourse to get the courseID
            courseHelper.getCurrentCourse(studentID)
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
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

    function executeMainQuery(finalCourseID) {
        const query = `
        SELECT pr.*
        FROM procedurereports pr
                 INNER JOIN procedures p ON pr.procedureID = p.ID
        WHERE pr.studentID = ?
          AND pr.isSent = ?
          AND pr.courseID = ?
          AND pr.isApproved = ?
          AND (UPPER(p.description) LIKE ? OR UPPER(pr.procedureText) LIKE ?)
          AND year = ?
          AND season = ?
        ORDER BY pr.saveEpoch DESC
        LIMIT ? OFFSET ?;
        `;

        const values = [studentID, isSent, finalCourseID, isApproved, `%${input.toUpperCase()}%`, `%${input.toUpperCase()}%`, currentYear, currentSeason, pageSize, offset];

        conn.query(
            query,
            values,
            (err, data) => {
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



//list sent forms for student to show on student sent page with ability to filter by procedure name & 2 approvements & input
exports.searchProcedureReportsByMultipleAcceptance = (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const studentID = req.params.studentID;
    const isSent = req.params.isSent;
    const isApproved1 = req.params.isApproved1;
    const isApproved2 = req.params.isApproved2;
    let courseID = parseInt(req.params.courseID) || null; // Default courseID

    try {
        if (!courseID) {
            // Use getCurrentCourse to get the courseID
            courseHelper.getCurrentCourse(studentID)
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
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

    function executeMainQuery(finalCourseID) {
        const query = `
        SELECT pr.*
        FROM procedurereports pr
                INNER JOIN procedures p ON pr.procedureID = p.ID
        WHERE pr.studentID = ?
        AND pr.isSent = ?
        AND pr.courseID = ?
        AND (pr.isApproved IN (?, ?))
        AND (UPPER(p.description) LIKE ? OR UPPER(pr.procedureText) LIKE ?)
        AND year = ?
        AND season = ?
        ORDER BY pr.saveEpoch DESC
        LIMIT ? OFFSET ?;`;
        const values = [
            studentID,
            isSent,
            finalCourseID,
            isApproved1, isApproved2,
            `%${input.toUpperCase()}%`,
            `%${input.toUpperCase()}%`,
            currentYear, currentSeason,
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

//for student home dropdown just list 5 reports for the current course
exports.list5ProcedureFormsWithStudentID = (req, res, next) => {
    const stdID = req.params.studentID;
    const isSent = req.params.isSent;

    try {
        courseHelper.getCurrentCourse(stdID).then((courseID) => {
            const query = `SELECT * FROM procedurereports 
                WHERE studentID = ? AND isSent = ? AND courseID = ? AND year = ? AND season = ? 
                ORDER BY saveEpoch DESC LIMIT 5`;
            conn.query(
                query, [stdID, isSent, courseID, currentYear, currentSeason],
                function (err, data, fields) {
                    if (err) return next(new AppError(err, 500));
                    res.status(200).json({
                        status: "success",
                        length: data?.length,
                        data: data,
                    });
                }
            );

        }).catch((error) => {
            return next(new AppError(error, 500));
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

//no need for filtering by course ID because it only gets *waiting reports*, lists att. physc. waiting reports
exports.listWaitingReports = (req, res, next) => {
    const physicianID = req.params.physicianID;
    const isApproved = 0;

    const query = `
        SELECT pr.*, p.description as getteredDesc
        FROM procedurereports pr
        INNER JOIN procedures p ON pr.procedureID = p.ID
        WHERE pr.attendingPhysicianID = ? 
            AND pr.isSent = 1 
            AND pr.isApproved = ? 
            AND pr.year = ?
            AND pr.season = ?
        ORDER BY pr.saveEpoch DESC;
    `;

    const values = [physicianID, isApproved, currentYear, currentSeason];

    try {
        conn.query(query, values, (err, data, fields) => {
            if (err) {
                return next(new AppError(err, 500));
            }
            res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
            });
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


//list sent forms for doctor accepted & rejected page with filtering fuctionality with student name
exports.searchSentProcedureFormsWithDocIDAccordingToApproveDate = (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const physicianID = req.params.attendingPhysicianID;
    const approvement = req.params.isApproved;
    let courseID = parseInt(req.params.courseID) || null; // Default courseID
    let rotationID = parseInt(req.params.rotationID) || null; // Default rotationID
    let specialtyID = parseInt(req.params.specialtyID) || null; // Default courseID
    let procedureID = parseInt(req.params.procedureID) || null; // Default courseID

    try {
        if (!rotationID && !courseID) {  //if rotation and course NOT is provided
            conn.query(
                `
                    SELECT pr.*
                    FROM procedurereports pr
                    LEFT JOIN procedures p ON pr.procedureID = p.ID
                    LEFT JOIN student std ON pr.studentID = std.ID
                    WHERE pr.attendingPhysicianID = ?
                      AND pr.isSent = 1
                      AND pr.isApproved = ?
                      AND (UPPER(std.name) LIKE ? OR UPPER(std.surname) LIKE ?)
                      AND pr.year = ?
                      AND pr.season = ?
                    ORDER BY pr.sentEpoch DESC
                    LIMIT ? OFFSET ?;`,
                [
                    physicianID,
                    approvement,
                    `%${input.toUpperCase()}%`,
                    `%${input.toUpperCase()}%`,
                    currentYear,
                    currentSeason,
                    pageSize,
                    offset
                ],
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

        } else {
            // If courseID is provided in the query, proceed directly with the main query
            executeMainQuery(rotationID, courseID, specialtyID, procedureID);
        }
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

    function executeMainQuery(rotationID, finalCourseID, specialtyID, procedureID) {
        let query = '';
        let values = [];

        query = `
        SELECT pr.*, p.description AS gettedProcedure
        FROM procedurereports pr
                LEFT JOIN enrollment e ON e.std_id = pr.studentID
                LEFT JOIN rotation_courses r ON r.rotation_id = e.rotation_id AND r.course_id = pr.courseID
                LEFT JOIN student std ON std.ID = e.std_id AND std.ID = pr.studentID
                LEFT JOIN procedures p ON pr.procedureID = p.ID
        WHERE r.rotation_id = ?
            AND r.course_id = ?
            AND pr.attendingPhysicianID = ?
            AND pr.isSent = 1
            AND pr.isApproved = ?
            AND (UPPER(std.name) LIKE ? OR UPPER(std.surname) LIKE ?)
            AND pr.year = ?
            AND pr.season = ?
            ${specialtyID ? 'AND pr.specialtyID = ?' : ''}
            ${procedureID ? 'AND pr.procedureID = ?' : ''}
        ORDER BY pr.sentEpoch DESC
        LIMIT ? OFFSET ?;`

        values = [
            rotationID,
            finalCourseID,
            physicianID,
            approvement,
            `%${input.toUpperCase()}%`,
            `%${input.toUpperCase()}%`,
            currentYear,
            currentSeason,
        ];

        if (specialtyID) {
            values.push(specialtyID);
        }

        if (procedureID) {
            values.push(procedureID);
        }

        values.push(pageSize, offset);

        conn.query(query, values, function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(200).json({
                status: "success",
                currentPage: page,
                pageSize: pageSize,
                length: data?.length,
                data: data,
            });
        });
    }

};


//list sent forms for student to show on student sent page with ability to filter by procedure name & an input
exports.searchProcedureFormsForStudent = (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const studentID = req.params.studentID;
    const isSent = req.params.isSent;
    let courseID = parseInt(req.params.courseID) || null; // Default courseID

    try {
        if (!courseID) {
            // Use getCurrentCourse to get the courseID
            courseHelper.getCurrentCourse(studentID)
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
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

    function executeMainQuery(finalCourseID) {
        const query = `
        SELECT pr.*
        FROM procedurereports pr
                INNER JOIN procedures p ON pr.procedureID = p.ID
        WHERE pr.studentID = ?
        AND pr.isSent = ?
        AND pr.courseID = ?
        AND pr.year = ?
        AND pr.season = ?
        AND (UPPER(p.description) LIKE ? OR UPPER(pr.procedureText) LIKE ?)
        ORDER BY pr.saveEpoch DESC
        LIMIT ? OFFSET ?;`;
        const values = [
            studentID,
            isSent,
            finalCourseID,
            currentYear,
            currentSeason,
            `%${input.toUpperCase()}%`,
            `%${input.toUpperCase()}%`,
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

//list sent forms for student to show on student sent page with ability to filter by procedure name & an approvement & input
exports.searchProcedureFormsForStudentByAcceptance = (req, res, next) => {
    const input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    const studentID = req.params.studentID;
    const isSent = req.params.isSent;
    const isApproved = req.params.isApproved;
    let courseID = parseInt(req.params.courseID) || null; // Default courseID

    try {
        if (!courseID) {
            // Use getCurrentCourse to get the courseID
            courseHelper.getCurrentCourse(studentID)
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
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

    function executeMainQuery(finalCourseID) {
        const query = `
        SELECT pr.*
        FROM procedurereports pr
                INNER JOIN procedures p ON pr.procedureID = p.ID
        WHERE pr.studentID = ?
        AND pr.isSent = ?
        AND pr.isApproved = ?
        AND pr.courseID = ?
        AND pr.year = ?
        AND pr.season = ?
        AND UPPER(p.description) LIKE ?
        ORDER BY pr.saveEpoch DESC;`;

        const values = [
            studentID,
            isSent,
            isApproved,
            finalCourseID,
            currentYear,
            currentSeason,
            `%${input.toUpperCase()}%`
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

//to delete deleted draft reports in local to remote deletion
exports.deleteProcedureFormWithID = (req, res, next) => {
    const studentID = req.params.ID;
    const localStorageID = req.params.localStorageID;

    // Check if both parameters are provided
    if (!studentID || !localStorageID) {
        return next(new AppError("Both studentID and localStorageID are required.", 400));
    }

    try {
        conn.query(
            "DELETE FROM procedurereports WHERE studentID = ? && localStorageID = ?",
            [studentID, localStorageID],
            function (err, result) {
                if (err) {
                    console.error("Error deleting procedure form:", err);
                    return next(new AppError("Internal server error", 500));
                }

                console.log("Delete result:", result);

                // Check if any rows were affected to determine if a record was deleted
                if (result.affectedRows === 0) {
                    return next(new AppError("Procedure form not found", 404));
                }

                res.status(200).json({
                    status: "success",
                    message: "Procedure form deleted!",
                });
            }
        );
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

//to see if there is a report in remote DB with a specified local storage ID
exports.getIDofProcedureForm = (req, res, next) => {
    if (!req.params.studentID) {
        return next(new AppError("No procedure with this student ID found", 404));
    }
    if (!req.params.localStorageID) {
        return next(new AppError("No procedure with this local storage ID found", 404));
    }

    const query = `select ID from procedurereports WHERE studentID =  ? AND localStorageID = ?  AND year = ? AND season = ? order by ID ASC LIMIT 1`;
    const values = [req.params.studentID, req.params.localStorageID, currentYear, currentSeason];

    try {

        conn.query(
            query,
            values,
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


exports.getLastLocalStorageID = (req, res, next) => { //returns specific patientreports with ID
    if (!req.params.studentID) {
        return next(new AppError("No patient with this ID found", 404));
    }
    try {
        conn.query(
            "select localStorageID from procedurereports where studentID =  ? order by localStorageID DESC  limit 1;",
            [req.params.studentID],
            function (err, data, fields) {
                if (err) return next(new AppError(err, 500));
                res.status(200).json({
                    status: "success",
                    data: data,
                });
            }
        );
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
        courseHelper.getCurrentCourse(studentID)
            .then((finalCourseID) => {
                conn.query(
                    `select isSent
                    from procedurereports
                    where studentID = ?
                      and localStorageID = ?
                      and courseID = ?;`,
                    [studentID, localStorageID, finalCourseID],
                    function (err, data, fields) {
                        if (err) return next(new AppError(err, 500));
                        res.status(200).json({
                            status: "success",
                            data: data,
                        });
                    }
                );
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
        courseHelper.getCurrentCourse(studentID)
            .then((finalCourseID) => {

                const query = `select saveEpoch
                    from procedurereports
                    where studentID = ?
                      and localStorageID = ?
                      and courseID = ?;`

                const values = [studentID, localStorageID, finalCourseID];
                conn.query(
                    query,
                    values,
                    function (err, data, fields) {
                        if (err) return next(new AppError(err, 500));
                        res.status(200).json({
                            status: "success",
                            data: data,
                        });
                    }
                );
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
        courseHelper.getCurrentCourse(studentID)
            .then((finalCourseID) => {

                const query = `select *
                    from procedurereports
                    where studentID = ?
                    and localStorageID = ?
                    and courseID = ?;`

                const values = [studentID, localStorageID, finalCourseID];

                conn.query(
                    query,
                    values,
                    function (err, data, fields) {
                        if (err) return next(new AppError(err, 500));
                        res.status(200).json({
                            status: "success",
                            data: data,
                        });
                    }
                );
            })
            .catch((error) => {
                // Handle errors from getCurrentCourse
                return next(new AppError(error, 500));
            });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

//counts student's form count for specified course && approval status
exports.getCountProcedureFormsForDashboardAccordingToApproval = (req, res, next) => {
    const studentID = req.params.studentID;
    let courseID = parseInt(req.params.courseID) || null; // Default courseID

    try {
        if (!courseID) {
            // Use getCurrentCourse to get the courseID
            courseHelper.getCurrentCourse(studentID)
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
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

    function executeMainQuery(finalCourseID) {
        const query = `
        SELECT COALESCE(COUNT(pa.ID), 0) AS count_value,
            appr.isApproved
        FROM (SELECT 0 AS isApproved
            UNION
            SELECT 1
            UNION
            SELECT 2) appr
                LEFT JOIN (select *
                            from procedurereports
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

//for physician Student Progress Page counts student's form count for specified course, rotation && approval status
exports.getDoctorCountProcedureFormsForDashboardAccordingToApproval = (req, res, next) => {
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
                        FROM procedurereports
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
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

};

//for physician Student ttoal progress counts student's form count for specified course, rotation && approval status
exports.getLinearTotalProgressBarData = (req, res, next) => {
    const physicianID = req.params.physicianID;
    const courseID = parseInt(req.params.courseID);
    const rotationID = parseInt(req.params.rotationID);

    if (!physicianID) {
        return next(new AppError("Lack of needed parameters", 404));
    }

    try {
        if (!rotationID || !courseID) {//if rotation and course is not provided return all the rotation courses sum

            //returns att. physc.'S total count of the year and the season
            const query = `
                SELECT COALESCE(COUNT(pr.ID), 0)           AS report_count,
                        COALESCE(SUM(pr.isApproved = 1), 0) AS approved_count,
                        COALESCE(SUM(pr.isApproved = 0), 0) AS waiting_count,
                        COALESCE(SUM(pr.isApproved = 2), 0) AS rejected_count
                FROM procedurereports pr
                        left join attendingphysicians att on att.ID = pr.attendingPhysicianID and pr.courseID = att.courseID
                WHERE att.ID = ? && pr.year = ? && pr.season = ? && pr.isSent;
                `;

            const values = [
                physicianID,
                currentYear,
                currentSeason,
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
                    procedurereports pr ON pr.attendingPhysicianID = att.ID AND pr.studentID = e.std_id AND pr.courseID = rc.course_id
                WHERE rc.rotation_id = ?
                AND rc.course_id = ?
                AND att.ID = ?
                and pr.year = ?
                and pr.season = ?;`;

            const values = [
                physicianID,
                currentYear,
                currentSeason,
                rotationID,
                courseID
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
    } catch (error) {
        return next(new AppError(error.message, 500));
    }

};
