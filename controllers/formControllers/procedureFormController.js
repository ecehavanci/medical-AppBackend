const AppError = require("../../utils/appError");
const conn = require("../../services/db");
const procedureController = require("../procedureController");

exports.insertProcedureForm = (req, res, next) => {
    //we check if the client is sending an empty form "and return a 404 error message.
    if (!req.body)
        return next(new AppError("No form data found", 404));

    const values = [
        req.body.studentID,
        req.body.studentName,
        req.body.rotationID,
        req.body.courseID,
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
        req.body.localStorageID
    ];

    console.log(req.body);

    conn.query(
        "INSERT INTO procedurereports (studentID," +
        "studentName," +
        "rotationID," +
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
        "localStorageID) " +
        "VALUES(?)",
        [values],
        async function (err, data, fields) {
            if (err) {
                return next(new AppError(err, 500));
            }

            if (data.affectedRows > 0) {
                if (req.body.isSent === 1) {
                const inserted = await checkAndUpdateProcedure(req.body.procedureID, req.body.procedureText.toLowerCase().trim(), data.insertId, res, next);
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
    //we check if the client is sending an empty form "and return a 404 error message.
    if (!req.body)
        return next(new AppError("No form data found", 404));

    let values = [];
    if (req.body.studentID !== undefined) values.push(req.body.studentID);
    if (req.body.studentName !== undefined) values.push(req.body.studentName);
    if (req.body.rotationID !== undefined) values.push(req.body.rotationID);
    if (req.body.courseID !== undefined) values.push(req.body.courseID);
    if (req.body.specialtyID !== undefined) values.push(req.body.specialtyID);
    if (req.body.attendingPhysicianID !== undefined) values.push(req.body.attendingPhysicianID);
    if (req.body.procedureID !== undefined) values.push(req.body.procedureID);
    if (req.body.procedureText !== undefined) values.push(req.body.procedureText.toLowerCase().trim());
    if (req.body.isObserved !== undefined) values.push(req.body.isObserved);
    if (req.body.isAssisted !== undefined) values.push(req.body.isAssisted);
    if (req.body.isPerformed !== undefined) values.push(req.body.isPerformed);
    if (req.body.isSimulated !== undefined) values.push(req.body.isSimulated);
    if (req.body.setting !== undefined) values.push(req.body.setting);
    if (req.body.saveEpoch !== undefined) values.push(req.body.saveEpoch);
    if (req.body.sentEpoch !== undefined) values.push(req.body.sentEpoch);
    if (req.body.isSent !== undefined) values.push(req.body.isSent);
    if (req.body.isApproved !== undefined) values.push(req.body.isApproved);
    if (req.body.comment !== undefined) values.push(req.body.comment);

    console.log("values: " + values.toString());


    console.log(req.body);

    var str = "UPDATE procedurereports SET " +
        (req.body.studentID !== undefined ? "studentID = ?, " : "") +
        (req.body.studentName !== undefined ? "studentName = ?, " : "") +
        (req.body.rotationID !== undefined ? "rotationID = ?, " : "") +
        (req.body.courseID !== undefined ? "courseID = ?, " : "") +
        (req.body.specialtyID !== undefined ? "specialtyID = ?, " : "") +
        (req.body.attendingPhysicianID !== undefined ? "attendingPhysicianID = ?, " : "") +
        (req.body.procedureID !== undefined ? "procedureID = ?, " : "") +
        (req.body.procedureText !== undefined ? "procedureText = ?, " : "") +
        (req.body.isObserved !== undefined ? "isObserved = ?, " : "") +
        (req.body.isAssisted !== undefined ? "isAssisted = ?, " : "") +
        (req.body.isPerformed !== undefined ? "isPerformed = ?, " : "") +
        (req.body.isSimulated !== undefined ? "isSimulated = ?, " : "") +
        (req.body.setting !== undefined ? "setting = ?, " : "") +
        (req.body.saveEpoch !== undefined ? "saveEpoch = ?, " : "") +
        (req.body.sentEpoch !== undefined ? "sentEpoch = ?, " : "") +
        (req.body.isSent !== undefined ? "isSent = ?, " : "") +
        (req.body.isApproved !== undefined ? "isApproved = ?, " : "") +
        (req.body.comment !== undefined ? "comment = ?, " : "");

    var pos = str.lastIndexOf(",");
    str = str.substring(0, pos) + str.substring(pos + 1);

    str = str + " WHERE ID = " + req.params.ID + ";";

    console.log("STR: " + str);

    try {
        conn.query(
            str,
            values,
            async function (err, data, fields) {
                if (err) {
                    return next(new AppError(err, 500));
                }

                // Check if any rows were actually updated
                if (data.affectedRows > 0) {
                    if (req.body.isSent === 1) {
                        const inserted = await checkAndUpdateProcedure(req.body.procedureID, req.body.procedureText.toLowerCase().trim(), req.params.ID, res, next);
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
    } catch (error) {
        console.error("Error:", error);
        res.status(error.status || 500).json({
            status: "error",
            message: error.message || "Internal Server Error",
        });
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


exports.getAllProcedureFormsWithStudentID = (req, res, next) => {
    conn.query(
        "SELECT * FROM procedurereports WHERE studentID = ?", [req.params.studentID],
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

exports.getAllProcedureFormsForLocalStorage = (req, res, next) => {
    conn.query(
        "select * from procedurereports WHERE studentID = $ID AND isSent = 0 ORDER BY " +
        "saveEpoch DESC, sentEpoch DESC",
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

exports.getAllSentProcedureForms = (req, res, next) => {
    conn.query(
        "SELECT * FROM procedurereports where isSent = 1",
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

exports.searchProcedureReportsByAcceptance = (req, res, next) => {
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    conn.query(
        "SELECT pr.*" +
        "FROM procedurereports pr " +
        "INNER JOIN procedures p ON pr.procedureID = p.ID " +
        "WHERE pr.studentID = ? AND pr.isSent = ? AND pr.isApproved = ? " +
        "AND UPPER(p.description) LIKE '%" + input + "%' " +
        "ORDER BY pr.saveEpoch DESC",
        [req.params.studentID, req.params.isSent, req.params.isApproved],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
            });
        }
    )
};

exports.searchProcedureReportsByMultipleAcceptance = (req, res, next) => {
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    conn.query(
        "SELECT pr.*" +
        "FROM procedurereports pr " +
        "INNER JOIN procedures p ON pr.procedureID = p.ID " +
        "WHERE pr.studentID = ? AND pr.isSent = ? " +
        "AND (pr.isApproved = ? OR pr.isApproved = ?) " +
        "AND UPPER(p.description) LIKE '%" + input + "%' " +
        "ORDER BY pr.saveEpoch DESC;",
        [req.params.studentID, req.params.isSent, req.params.isApproved1, req.params.isApproved2],
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


exports.listProcedureFormsWithStudentID = (req, res, next) => {
    var str = "SELECT * FROM procedurereports WHERE studentID = ? AND isSent = ?";
    conn.query(
        str, [req.params.studentID, req.params.isSent],
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

exports.getSentProcedureFormsWithStudentID = (req, res, next) => {
    conn.query(
        "SELECT * FROM procedurereports WHERE studentID = ? AND isSent = 1", [req.params.studentID],
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

exports.searchSentProcedureFormsWithDocIDAccordingToSendDate = (req, res, next) => {
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    conn.query(
        "SELECT pr.*" +
        "FROM procedurereports pr " +
        "INNER JOIN procedures p ON pr.procedureID = p.ID " +
        "WHERE pr.attendingPhysicianID = ? AND " +
        "pr.isSent = 1 AND pr.isApproved = ? " +
        "AND UPPER(p.description) LIKE '%" + input + "%' " +
        "ORDER BY pr.saveEpoch DESC;",
        [req.params.attendingPhysicianID, req.params.isApproved],
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


exports.searchSentProcedureFormsWithDocIDAccordingToApproveDate = (req, res, next) => {
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    conn.query(
        "SELECT pr.*" +
        "FROM procedurereports pr " +
        "INNER JOIN procedures p ON pr.procedureID = p.ID " +
        "WHERE pr.attendingPhysicianID = ? AND " +
        "pr.isSent = 1 AND pr.isApproved = ? " +
        "AND UPPER(p.description) LIKE '%" + input + "%' " +
        "ORDER BY pr.sentEpoch DESC;",
        [req.params.attendingPhysicianID, req.params.isApproved],
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


exports.searchProcedureFormsForStudent = (req, res, next) => {
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    conn.query(
        "SELECT pr.*" +
        "FROM procedurereports pr " +
        "INNER JOIN procedures p ON pr.procedureID = p.ID " +
        "WHERE pr.studentID = ? AND " +
        "pr.isSent = ? " +
        "AND UPPER(p.description) LIKE '%" + input + "%' " +
        "ORDER BY pr.saveEpoch DESC;",
        [req.params.studentID, req.params.isSent],
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

exports.searchProcedureFormsForStudentByAcceptance = (req, res, next) => {
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    console.log("PARAMS: " + req.params.searchInput + " " + req.params.studentID + " " + req.params.isSent + " " + req.params.isApproved);

    conn.query(
        "SELECT pr.*" +
        "FROM procedurereports pr " +
        "INNER JOIN procedures p ON pr.procedureID = p.ID " +
        "WHERE pr.studentID = ? AND " +
        "pr.isSent = ? AND pr.isApproved = ? " +
        "AND UPPER(p.description) LIKE '%" + input + "%' " +
        "ORDER BY pr.saveEpoch DESC;",
        [req.params.studentID, req.params.isSent, req.params.isApproved],
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


exports.getProcedureFormWithID = (req, res, next) => {
    if (!req.params.ID) {
        return next(new AppError("No procedure with this ID found", 404));
    }
    conn.query(
        "SELECT * FROM procedurereports WHERE ID = ?",
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

exports.deleteProcedureFormWithID = (req, res, next) => {
    if (!req.params.ID) {
        return next(new AppError("No todo id found", 404));
    }
    conn.query(
        "DELETE FROM student WHERE ID=?",
        [req.params.ID],
        function (err, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "Procedure form deleted!",
            });
        }
    );
}

exports.getCount = (req, res, next) => {
    conn.query(
        "select count(ID) from procedurereports where studentID  = ?",
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


exports.getLocalStorageIDofProcedureFormWithID = (req, res, next) => {
    if (!req.params.ID) {
        return next(new AppError("No procedure with this ID found", 404));
    }
    conn.query(
        "SELECT localStorageID FROM procedurereports WHERE ID = ?  order by ID ASC LIMIT 1",
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

exports.getIDofProcedureForm = (req, res, next) => {
    if (!req.params.studentID) {
        return next(new AppError("No procedure with this student ID found", 404));
    }
    if (!req.params.localStorageID) {
        return next(new AppError("No procedure with this local storage ID found", 404));
    }
    conn.query(
        "select ID from procedurereports WHERE studentID =  ? AND localStorageID = ? order by ID ASC LIMIT 1",
        [req.params.studentID, req.params.localStorageID],
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

exports.updateProcedureFormApproveInfo = (req, res, next) => {
    if (!req.params.reportID) {
        return next(new AppError("No report with this ID found", 404));
    }
    if (!req.params.updateChoice) {
        return next(new AppError("Wrong update choice index", 404));
    }
    if (!req.params.sentEpoch) {
        return next(new AppError("Wrong sentEpoch", 404));
    }
    conn.query(
        "UPDATE procedurereports SET isApproved = ? ,sentEpoch = ?  WHERE ID = ?",
        [req.params.updateChoice, req.params.sentEpoch, req.params.reportID],
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

exports.getCountProcedureFormsForDashboardAccordingToApproval = (req, res, next) => {
    conn.query(
        "select count(ID) from procedurereports where studentID =? && rotationID = ? && isApproved = ?;",
        [req.params.studentID, req.params.rotationID, req.params.approvalCode],
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

exports.getRequiredCountProcedureFormsForDashboard = (req, res, next) => {
    conn.query(
        "select procedureReportCount from rotations where ID = ?;",
        [req.params.rotationID],
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

exports.getAllCountProcedureFormsForDashboard = (req, res, next) => {
    conn.query(
        "select count(ID) from procedurereports where studentID = ? && rotationID = ? && isSent = 1;",
        [req.params.studentID, req.params.rotationID],
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
