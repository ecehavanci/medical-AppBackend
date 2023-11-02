const AppError = require("../../utils/appError");
const conn = require("../../services/db");
const procedureController = require("../procedureController");
const config = require("../../config");
const currentYear = config.app.year;
const currentSeason = config.app.season;
const currentDate = config.app.date;


exports.insertProcedureForm = (req, res, next) => {
    //we check if the client is sending an empty form "and return a 404 error message.
    if (!req.body)
        return next(new AppError("No form data found", 404));

    const values = [
        req.body.studentID,
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
        req.body.comment,
        req.body.localStorageID,
        currentYear,
        currentSeason
    ];

    console.log(req.body);

    conn.query(
        "INSERT INTO procedurereports (studentID," +
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

                res.status(201).json({
                    status: "success",
                    message: "Student data successfully altered",
                    insertedId: inserted, // This should now have the correct value
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
};

exports.updateProcedureForm = (req, res, next) => {
    if (!req.body) {
        return next(new AppError("No form data found", 400));
    }

    let query = "UPDATE procedurereports SET ";

    const setClauses = [];

    const values = [];

    const updateFields = [
        "studentID", "specialtyID", "courseID", "attendingPhysicianID", "procedureID",
        "procedureText", "isObserved", "isAssisted", "isPerformed", "isSimulated",
        "setting", "saveEpoch", "sentEpoch", "isSent", "isApproved", "comment"
    ];

    for (const field of updateFields) {
        if (req.body[field] !== undefined) {
            setClauses.push(`${field} = ?`);
            values.push(req.body[field]);
        }
    }

    if (setClauses.length === 0) {
        return res.status(200).json({
            status: "success",
            message: "No student data updated",
        });
    }

    query += setClauses.join(", ");
    query += " WHERE ID = ?;";
    values.push(req.params.ID);

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

        // Check and update the procedure (if needed)
        let inserted = null;
        if (req.body.isSent === 1) {
            inserted = await checkAndUpdateProcedure(req.body.procedureID, req.body.procedureText.toLowerCase().trim(), req.params.ID, res, next);
        }

        res.status(201).json({
            status: "success",
            message: "Student data successfully altered",
            insertedId: inserted || "No new procedure data inserted",
        });
    });
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
        if (procedureID === -1) {
            // find the most similar procedure description to a given input string by calculating the Levenshtein 
            //distance-based similarity percentage and filtering for procedures. The closest match is returned as a result.
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

    let courseID = parseInt(req.query.courseID) || null; // Default courseID

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
        SELECT pr.*, p.description as gettedProcedure
        FROM procedurereports pr
                 INNER JOIN procedures p ON pr.procedureID = p.ID
        WHERE pr.studentID = ?
          AND pr.isSent = ?
          AND courseID = ?
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

// Create a function to get the current course of the student
const getCurrentCourse = (studentID) => {
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
const getCurrentCourseDoctor = (physicianID) => {
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
                    resolve(data[0].ID);
                } else {
                    // Handle the case where the student is not enrolled in any course
                    reject(new Error("Student is not currently enrolled in any course."));
                }
            }
        );
    });
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
        SELECT pr.*, p.description as gettedProcedure
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

    getCurrentCourse(stdID).then((courseID) => {
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
};

//no need for filtering by course ID because it only gets *waiting reports*, lists att. physc. waiting reports
exports.listWaitingReports = (req, res, next) => {
    const physicianID = req.params.attendingPhysicianID;
    const isApproved = 0;

    const query = `
        SELECT pr.*
        FROM procedurereports pr, p.description as getteredDesc
        INNER JOIN procedures p ON pr.procedureID = p.ID
        WHERE pr.attendingPhysicianID = ? 
            AND pr.isSent = 1 
            AND pr.isApproved = ? 
            AND pr.year = ?
            AND pr.season = ?
        ORDER BY pr.saveEpoch DESC;
    `;

    const values = [physicianID, isApproved, currentYear, currentSeason];

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
};


//list sent forms for doctor accepted & rejected page with filtering fuctionality with student name
exports.searchSentProcedureFormsWithDocIDAccordingToApproveDate = (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const physicianID = req.params.attendingPhysicianID;
    const approvement = req.params.isApproved;
    let courseID = parseInt(req.query.courseID) || null; // Default courseID

    if (!req.query.courseID) {
        // Use getCurrentCourse to get the courseID
        getCurrentCourseDoctor(physicianID)
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
        SELECT pr.*
        FROM procedurereports pr
                INNER JOIN procedures p ON pr.procedureID = p.ID
                LEFT JOIN student std ON pr.studentID = std.ID
        WHERE pr.attendingPhysicianID = ?
        AND pr.isSent = 1
        AND pr.isApproved = ?
        AND UPPER(std.name) LIKE ?
        AND pr.courseID = ?
        AND pr.year = ?
        AND pr.season = ?
        ORDER BY pr.sentEpoch DESC
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

//list sent forms for student to show on student sent page with ability to filter by procedure name & an input
exports.searchProcedureFormsForStudent = (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of items per page
    const offset = (page - 1) * pageSize;
    const input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    const studentID = req.params.studentID;
    const isSent = req.params.isSent;
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
        SELECT pr.*, p.description as gettedProcedure
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
};

//to see if there is a report in remote DB with a specified local storage ID
exports.getIDofProcedureForm = (req, res, next) => {
    if (!req.params.studentID) {
        return next(new AppError("No procedure with this student ID found", 404));
    }
    if (!req.params.localStorageID) {
        return next(new AppError("No procedure with this local storage ID found", 404));
    }
    conn.query(
        "select ID from procedurereports WHERE studentID =  ? AND localStorageID = ?  AND year = ? AND season = ? order by ID ASC LIMIT 1",
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

//counts student's form count for specified course && approval status
exports.getCountProcedureFormsForDashboardAccordingToApproval = (req, res, next) => {
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
        select count(ID) from procedurereports 
        where studentID = ? && courseID = ? && isApproved = ? && year = ? && season = ?;`;

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
