const AppError = require("../../utils/appError");
const conn = require("../../services/db");

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
        req.body.procedureText,
        req.body.isObserved,
        req.body.isAssisted,
        req.body.isPerformed,
        req.body.isSimulated,
        req.body.setting,
        req.body.lastSaveDate,
        req.body.lastSaveTime,
        req.body.approveDate,
        req.body.approveTime,
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
        "procedureText," +
        "isObserved," +
        "isAssisted," +
        "isPerformed," +
        "isSimulated," +
        "setting," +
        "lastSaveDate," +
        "lastSaveTime," +
        "approveDate," +
        "approveTime," +
        "isSent," +
        "isApproved," +
        "comment," +
        "localStorageID) " +
        "VALUES(?)",
        [values],
        function (err, data, fields) {
            if (err)
                return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "New student added!",
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
    if (req.body.procedureText !== undefined) values.push(req.body.procedureText);
    if (req.body.isObserved !== undefined) values.push(req.body.isObserved);
    if (req.body.isAssisted !== undefined) values.push(req.body.isAssisted);
    if (req.body.isPerformed !== undefined) values.push(req.body.isPerformed);
    if (req.body.isSimulated !== undefined) values.push(req.body.isSimulated);
    if (req.body.setting !== undefined) values.push(req.body.setting);
    if (req.body.lastSaveDate !== undefined) values.push(req.body.lastSaveDate);
    if (req.body.lastSaveTime !== undefined) values.push(req.body.lastSaveTime);
    if (req.body.approveDate !== undefined) values.push(req.body.approveDate);
    if (req.body.approveTime !== undefined) values.push(req.body.approveTime);
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
        (req.body.procedureText !== undefined ? "procedureText = ?, " : "") +
        (req.body.isObserved !== undefined ? "isObserved = ?, " : "") +
        (req.body.isAssisted !== undefined ? "isAssisted = ?, " : "") +
        (req.body.isPerformed !== undefined ? "isPerformed = ?, " : "") +
        (req.body.isSimulated !== undefined ? "isSimulated = ?, " : "") +
        (req.body.setting !== undefined ? "setting = ?, " : "") +
        (req.body.lastSaveDate !== undefined ? "lastSaveDate = ?, " : "") +
        (req.body.lastSaveTime !== undefined ? "lastSaveTime = ?, " : "") +
        (req.body.approveDate !== undefined ? "approveDate = ?, " : "") +
        (req.body.approveTime !== undefined ? "approveTime = ?, " : "") +
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
            res.status(201).json({
                status: "success",
                message: "Student data successfully altered",
            });
        }
    );
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
        "lastSaveDate DESC, lastSaveTime DESC",
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

exports.searchProcedureReportsByMultipleAcceptance = (req, res, next) => {
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

exports.searchSentProcedureFormsWithDocIDAccordingToSendDate = (req, res, next) => {
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
exports.searchSentProcedureFormsWithDocIDAccordingToApproveDate = (req, res, next) => {
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

exports.searchProcedureFormsForStudent = (req, res, next) => {
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

exports.searchProcedureFormsForStudentByAcceptance = (req, res, next) => {
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
        "select * from procedurereports WHERE studentID =  ? AND localStorageID = ? order by ID ASC LIMIT 1",
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