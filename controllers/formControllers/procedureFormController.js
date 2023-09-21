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
        req.body.specialtyID,
        req.body.attendingPhysicianID,
        req.body.procedureID,
        req.body.procedureText,
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
        function (err, data, fields) {

            if (err)
                return next(new AppError(err, 500));


            if (res.status && res.status() === 201) {
                const insertedID = data.insertId;
                checkAndUpdateDiagnosis(req.body.procedureID, req.body.procedureText, insertedID);
            }

            res.status(201).json({
                status: "success",
                message: "New form added!",
            });
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
    if (req.body.specialtyID !== undefined) values.push(req.body.specialtyID);
    if (req.body.attendingPhysicianID !== undefined) values.push(req.body.attendingPhysicianID);
    if (req.body.procedureID !== undefined) values.push(req.body.procedureID);
    if (req.body.procedureText !== undefined) values.push(req.body.procedureText);
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

    conn.query(
        str, values,
        function (err, data, fields) {
            if (err)
                return next(new AppError(err, 500));

            if (res.status && res.status() === 201) {
                const insertedID = data.insertId;
                checkAndUpdateDiagnosis(req.body.procedureID, req.body.procedureText, insertedID);
            }

            res.status(201).json({
                status: "success",
                message: "Student data successfully altered",
            });
        }
    );
};

const checkAndUpdateDiagnosis = (procedureID, procedureText, relatedReport) => {
    // Check if isSent is 1 and procedureID is -1
    if (isSent === 1 && procedureID === -1) {
        // Search for a similar string in the procedures table
        const similarProcedureQuery = `SELECT * FROM procedures WHERE MATCH(procedureText) AGAINST (? IN NATURAL LANGUAGE MODE)`;

        conn.query(similarProcedureQuery, [procedureText], (err, results) => {
            if (err) {
                console.error('Error searching for similar procedure:', err);
                return;
            }

            // If no similar procedure is found, insert a new row in the diagnosis table
            if (results.length === 0) {
                const req = {
                    body: {
                        description: procedureText,
                        relatedReport: relatedReport,
                    },
                };

                procedureController.insertProcedure(req);
            }
        });
    }
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

exports.searchProcedureReportsByAcceptance = (req, res, next) => {           //look
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    conn.query(
        "select * from procedurereports WHERE studentID = ? and isSent = ? AND isApproved = ? " +
        "AND UPPER(procedureText) LIKE '%" + input + "%' order by lastSaveDate DESC, lastSaveTime DESC",
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
        ;
};

exports.searchProcedureReportsByMultipleAcceptance = (req, res, next) => { //look
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    conn.query(
        "select * from procedurereports WHERE studentID = ? and isSent = ? " +
        "AND (isApproved = ? OR isApproved = ?) " +
        "AND UPPER(procedureText) LIKE '%" + input + "%' order by lastSaveDate DESC, lastSaveTime DESC",
        [req.params.studentID, req.params.isSent, req.params.isApproved1, req.params.isApproved2],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
            });
        }
    )
        ;
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

exports.searchSentProcedureFormsWithDocIDAccordingToSendDate = (req, res, next) => { ///look
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    conn.query(
        "select * from procedurereports WHERE attendingPhysicianID= ? AND " +
        "isSent = 1 AND isApproved = ? AND UPPER(procedureText) " +
        "LIKE '%" + input + "%' order by lastSaveDate DESC, " +
        "lastSaveTime DESC", [req.params.attendingPhysicianID, req.params.isApproved],
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

//The query here works, however the api does not return the right result
exports.searchSentProcedureFormsWithDocIDAccordingToApproveDate = (req, res, next) => {   ///look
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    conn.query(
        "select * from procedurereports WHERE attendingPhysicianID= ? AND isSent = 1 AND isApproved = ? AND " +
        "UPPER(procedureText) LIKE '%" + input + "%' order by lastSaveDate DESC;"
        , [req.params.attendingPhysicianID, req.params.isApproved],
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

exports.searchProcedureFormsForStudent = (req, res, next) => {   ///look
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    conn.query(
        "select * from procedurereports WHERE studentID= ? AND " +
        " isSent = ? AND UPPER(procedureText) " +
        "LIKE '%" + input + "%' order by lastSaveDate DESC, " +
        "lastSaveTime DESC", [req.params.studentID, req.params.isSent],
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

exports.searchProcedureFormsForStudentByAcceptance = (req, res, next) => {   ///look
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    console.log("PARAMS: " + req.params.searchInput + " " + req.params.studentID + " " + req.params.isSent + " " + req.params.isApproved);
    conn.query(
        "select * from procedurereports WHERE studentID= ? AND " +
        "isSent = ? AND isApproved = ? AND UPPER(procedureText) " +
        "LIKE '%" + input + "%' order by lastSaveDate DESC, " +
        "lastSaveTime DESC", [req.params.studentID, req.params.isSent, req.params.isApproved],
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
                message: "student deleted!",
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
    if (!req.params.approveDate || !req.params.approveTime) {
        return next(new AppError("Wrong approve Date & Time", 404));
    }
    conn.query(
        "UPDATE procedurereports SET isApproved = ? ,approveDate = ? ,approveTime = ?  WHERE ID = ?",
        [req.params.updateChoice, req.params.approveDate, req.params.approveTime, req.params.reportID],
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

/*exports.getCountProcedureFormsForDashboardAccordingToApproval = (req, res, next) => {
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
};*/