const AppError = require("../../utils/appError");
const conn = require("../../services/db");

exports.insertPatientForm = (req, res, next) => {
    //we check if the client is sending an empty form "and return a 404 error message.
    if (!req.body)
        return next(new AppError("No form data found", 404));

    const values = [
        req.body.studentID,
        req.body.studentName,
        req.body.rotationID,
        req.body.specialtyID,
        req.body.attendingPhysicianID,
        req.body.diagnosisID,
        req.body.diagnosis,
        req.body.patientHospitalID,
        req.body.patientName,
        req.body.patientGender,
        req.body.patientAge,
        req.body.relevants,
        req.body.keySymptoms,
        req.body.signs,
        req.body.data,
        req.body.isObserved,
        req.body.isAssisted,
        req.body.isPerformed,
        req.body.isSimulated,
        req.body.isHistory,
        req.body.isTreatment,
        req.body.isPhysicalExamination,
        req.body.isDifferentialDiagnosis,
        req.body.setting,
        req.body.tier1ID,
        req.body.tier1,
        req.body.tier2ID,
        req.body.tier2,
        req.body.tier3ID,
        req.body.tier3,
        req.body.tier4ID,
        req.body.tier4,
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
        "INSERT INTO patientreports (studentID," +
        "studentName," +
        "rotationID," +
        "specialtyID," +
        "attendingPhysicianID," +
        "diagnosisID," +
        "diagnosis," +
        "patientHospitalID," +
        "patientName," +
        "patientGender," +
        "patientAge," +
        "relevants," +
        "keySymptoms," +
        "signs," +
        "data," +
        "isObserved," +
        "isAssisted," +
        "isPerformed," +
        "isSimulated," +
        "isHistory," +
        "isTreatment," +
        "isPhysicalExamination," +
        "isDifferentialDiagnosis," +
        "setting," +
        "tier1ID," +
        "tier1," +
        "tier2ID," +
        "tier2," +
        "tier3ID," +
        "tier3," +
        "tier4ID," +
        "tier4," +
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

exports.updatePatientForm = (req, res, next) => {
    console.log("updating started");
    //we check if the client is sending an empty form "and return a 404 error message.
    if (!req.body)
        return next(new AppError("No form data found", 404));

    console.log("req body found: student ID: " + req.body.studentID);

    let values = [];
    if (req.body.studentID !== undefined) values.unshift(req.body.studentID);
    if (req.body.studentName !== undefined) values.unshift(req.body.studentName);
    if (req.body.rotationID !== undefined) values.unshift(req.body.rotationID);
    if (req.body.specialtyID !== undefined) values.unshift(req.body.specialtyID);
    if (req.body.attendingPhysicianID !== undefined) values.unshift(req.body.attendingPhysicianID);
    if (req.body.diagnosisID !== undefined) values.unshift(req.body.diagnosisID);
    if (req.body.diagnosis !== undefined) values.unshift(req.body.diagnosis);
    if (req.body.patientHospitalID !== undefined) values.unshift(req.body.patientHospitalID);
    if (req.body.patientName !== undefined) values.unshift(req.body.patientName);
    if (req.body.patientGender !== undefined) values.unshift(req.body.patientGender);
    if (req.body.patientAge !== undefined) values.unshift(req.body.patientAge);
    if (req.body.relevants !== undefined) values.unshift(req.body.relevants);
    if (req.body.keySymptoms !== undefined) values.unshift(req.body.keySymptoms);
    if (req.body.signs !== undefined) values.unshift(req.body.signs);
    if (req.body.data !== undefined) values.unshift(req.body.data);
    if (req.body.isObserved !== undefined) values.unshift(req.body.isObserved);
    if (req.body.isAssisted !== undefined) values.unshift(req.body.isAssisted);
    if (req.body.isPerformed !== undefined) values.unshift(req.body.isPerformed);
    if (req.body.isSimulated !== undefined) values.unshift(req.body.isSimulated);
    if (req.body.isHistory !== undefined) values.unshift(req.body.isHistory);
    if (req.body.isTreatment !== undefined) values.unshift(req.body.isTreatment);
    if (req.body.isPhysicalExamination !== undefined) values.unshift(req.body.isPhysicalExamination);
    if (req.body.isDifferentialDiagnosis !== undefined) values.unshift(req.body.isDifferentialDiagnosis);
    if (req.body.setting !== undefined) values.unshift(req.body.setting);
    if (req.body.tier1ID !== undefined) values.unshift(req.body.tier1ID);
    if (req.body.tier1 !== undefined) values.unshift(req.body.tier1);
    if (req.body.tier2ID !== undefined) values.unshift(req.body.tier2ID);
    if (req.body.tier2 !== undefined) values.unshift(req.body.tier2);
    if (req.body.tier3ID !== undefined) values.unshift(req.body.tier3ID);
    if (req.body.tier3 !== undefined) values.unshift(req.body.tier3);
    if (req.body.tier4ID !== undefined) values.unshift(req.body.tier4ID);
    if (req.body.tier4 !== undefined) values.unshift(req.body.tier4);
    if (req.body.lastSaveDate !== undefined) values.unshift(req.body.lastSaveDate);
    if (req.body.lastSaveTime !== undefined) values.unshift(req.body.lastSaveTime);
    if (req.body.approveDate !== undefined) values.unshift(req.body.approveDate);
    if (req.body.approveTime !== undefined) values.unshift(req.body.approveTime);
    if (req.body.isSent !== undefined) values.unshift(req.body.isSent);
    if (req.body.isApproved !== undefined) values.unshift(req.body.isApproved);
    if (req.body.comment !== undefined) values.unshift(req.body.comment);
    console.log("values: " + values.reverse().toString());


    console.log(req.body);

    var str = "UPDATE patientreports SET " +
        (req.body.studentID !== undefined ? "studentID = ?, " : "") +
        (req.body.studentName !== undefined ? "studentName = ?, " : "") +
        (req.body.rotationID !== undefined ? "rotationID = ?, " : "") +
        (req.body.specialtyID !== undefined ? "specialtyID = ?, " : "") +
        (req.body.attendingPhysicianID !== undefined ? "attendingPhysicianID = ?, " : "") +
        (req.body.diagnosisID !== undefined ? "diagnosisID = ?, " : "") +
        (req.body.diagnosis !== undefined ? "diagnosis = ?, " : "") +
        (req.body.patientHospitalID !== undefined ? "patientHospitalID = ?, " : "") +
        (req.body.patientName !== undefined ? "patientName = ?, " : "") +
        (req.body.patientGender !== undefined ? "patientGender = ?, " : "") +
        (req.body.patientAge !== undefined ? "patientAge = ?, " : "") +
        (req.body.relevants !== undefined ? "relevants = ?, " : "") +
        (req.body.keySymptoms !== undefined ? "keySymptoms = ?, " : "") +
        (req.body.signs !== undefined ? "signs = ?, " : "") +
        (req.body.data !== undefined ? "data = ?, " : "") +
        (req.body.isObserved !== undefined ? "isObserved = ?, " : "") +
        (req.body.isAssisted !== undefined ? "isAssisted = ?, " : "") +
        (req.body.isPerformed !== undefined ? "isPerformed = ?, " : "") +
        (req.body.isSimulated !== undefined ? "isSimulated = ?, " : "") +
        (req.body.isHistory !== undefined ? "isHistory = ?, " : "") +
        (req.body.isTreatment !== undefined ? "isTreatment = ?, " : "") +
        (req.body.isPhysicalExamination !== undefined ? "isPhysicalExamination = ?, " : "") +
        (req.body.isDifferentialDiagnosis !== undefined ? "isDifferentialDiagnosis = ?, " : "") +
        (req.body.setting !== undefined ? "setting = ?, " : "") +
        (req.body.tier1ID !== undefined ? "tier1ID = ?, " : "") +
        (req.body.tier1 !== undefined ? "tier1 = ?, " : "") +
        (req.body.tier2ID !== undefined ? "tier2ID = ?, " : "") +
        (req.body.tier2 !== undefined ? "tier2 = ?, " : "") +
        (req.body.tier3ID !== undefined ? "tier3ID = ?, " : "") +
        (req.body.tier3 !== undefined ? "tier3 = ?, " : "") +
        (req.body.tier4ID !== undefined ? "tier4ID = ?, " : "") +
        (req.body.tier4 !== undefined ? "tier4 = ?, " : "") +
        (req.body.lastSaveDate !== undefined ? "lastSaveDate = ?, " : "") +
        (req.body.lastSaveTime !== undefined ? "lastSaveTime = ?, " : "") +
        (req.body.approveDate !== undefined ? "approveDate = ?, " : "") +
        (req.body.approveTime !== undefined ? "approveTime = ?, " : "") +
        (req.body.isSent !== undefined ? "isSent = ?, " : "") +
        (req.body.isApproved !== undefined ? "isApproved = ?, " : "") +
        (req.body.comment !== undefined ? "comment = ?, " : "");

    var pos = str.lastIndexOf(",");
    str = str.substring(0, pos) + str.substring(pos + 1);

    str = str + " WHERE localStorageID = " + req.params.localStorageID + ";";

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

exports.getAllPatientFormsForStudent = (req, res, next) => {
    conn.query(
        "SELECT * FROM patientreports WHERE studentID = ?", [req.params.studentID],
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

exports.getAllPatientForms = (req, res, next) => {
    conn.query(
        "SELECT * FROM patientreports where isSent = 1",
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

exports.searchPatientForms = (req, res, next) => {
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    conn.query(
        "select * from patientReports WHERE studentID = ? and isSent = ? " +
        "AND UPPER(patientName) LIKE '%" + input + "%' order by lastSaveDate DESC, lastSaveTime DESC",
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

exports.searchPatientFormsByAcceptance = (req, res, next) => {
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    conn.query(
        "select * from patientReports WHERE studentID = ? and isSent = ? AND isApproved = ? " +
        "AND UPPER(patientName) LIKE '%" + input + "%' order by lastSaveDate DESC, lastSaveTime DESC",
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

exports.searchPatientFormsByMultipleAcceptance = (req, res, next) => {
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    conn.query(
        "select * from patientReports WHERE studentID = ? and isSent = ? " +
        "AND (isApproved = ? OR isApproved = ?) " +
        "AND UPPER(patientName) LIKE '%" + input + "%' order by lastSaveDate DESC, lastSaveTime DESC",
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

exports.getPatientFormsWithStudentID = (req, res, next) => {
    conn.query(
        "SELECT * FROM patientreports WHERE studentID = ? AND isSent = ?", [req.params.studentID, req.params.isSent],
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

exports.getPatientFormWithID = (req, res, next) => {
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

exports.updatePatientFormWithID = (req, res, next) => {
    if (!req.params.ID) {
        return next(new AppError("No todo id found", 404));
    }

    console.log("ID: " + req.params.ID);
    console.log("Student ID: " + req.params.studentID);
    console.log("Student Name: " + req.params.studentName);
    console.log("Rotation ID: " + req.params.rotationID);
    console.log("Specialty ID: " + req.params.specialtyID);

    var firstArgumentEntered = false;
    var queryString = "UPDATE patientreports SET ";

    if (req.params.studentID !== undefined) {
        queryString += "studentID=" + req.params.studentID;
        firstArgumentEntered = true;
    }

    if (req.params.studentName !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "studentName= '" + req.params.studentName + "'";
        firstArgumentEntered = true;
    }

    if (req.params.rotationID !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "rotationID= '" + req.params.rotationID + "'";
        firstArgumentEntered = true;
    }

    if (req.params.specialtyID !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "specialtyID= '" + req.params.specialtyID + "'";
        firstArgumentEntered = true;
    }

    if (req.params.attendingPhysicianID !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "attendingPhysicianID= '" + req.params.attendingPhysicianID + "'";
        firstArgumentEntered = true;
    }

    if (req.params.diagnosisID !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "diagnosisID= '" + req.params.diagnosisID + "'";
        firstArgumentEntered = true;
    }

    if (req.params.diagnosis !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "diagnosis= '" + req.params.diagnosis + "'";
        firstArgumentEntered = true;
    }

    if (req.params.patientHospitalID !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "patientHospitalID= '" + req.params.patientHospitalID + "'";
        firstArgumentEntered = true;
    }

    if (req.params.patientName !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "patientName= '" + req.params.patientName + "'";
        firstArgumentEntered = true;
    }

    if (req.params.patientGender !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "patientGender= '" + req.params.patientGender + "'";
        firstArgumentEntered = true;
    }

    if (req.params.patientAge !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "patientAge= '" + req.params.patientAge + "'";
        firstArgumentEntered = true;
    }

    if (req.params.relevants !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "relevants= '" + req.params.relevants + "'";
        firstArgumentEntered = true;
    }

    if (req.params.keySymptoms !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "keySymptoms= '" + req.params.keySymptoms + "'";
        firstArgumentEntered = true;
    }

    if (req.params.signs !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "signs= '" + req.params.signs + "'";
        firstArgumentEntered = true;
    }

    if (req.params.data !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "data= '" + req.params.data + "'";
        firstArgumentEntered = true;
    }

    if (req.params.traineesRole !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "traineesRole= '" + req.params.traineesRole + "'";
        firstArgumentEntered = true;
    }

    if (req.params.levelOfCare !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "levelOfCare= '" + req.params.levelOfCare + "'";
        firstArgumentEntered = true;
    }

    if (req.params.setting !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "setting= '" + req.params.setting + "'";
        firstArgumentEntered = true;
    }

    if (req.params.tier1ID !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "tier1ID= '" + req.params.tier1ID + "'";
        firstArgumentEntered = true;
    }

    if (req.params.tier1 !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "tier1= '" + req.params.tier1 + "'";
        firstArgumentEntered = true;
    }

    if (req.params.tier2 !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "tier2= '" + req.params.tier2 + "'";
        firstArgumentEntered = true;
    }

    if (req.params.tier2 !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "tier3ID= '" + req.params.tier3ID + "'";
        firstArgumentEntered = true;
    }

    if (req.params.tier3ID !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "tier3ID= '" + req.params.tier3ID + "'";
        firstArgumentEntered = true;
    }

    if (req.params.tier3 !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "tier3= '" + req.params.tier3 + "'";
        firstArgumentEntered = true;
    }

    if (req.params.tier4ID !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "tier4ID= '" + req.params.tier4ID + "'";
        firstArgumentEntered = true;
    }

    if (req.params.tier4 !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "tier4= '" + req.params.tier4 + "'";
        firstArgumentEntered = true;
    }

    if (req.params.lastSaveDate !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "lastSaveDate= '" + req.params.lastSaveDate + "'";
        firstArgumentEntered = true;
    }

    if (req.params.lastSaveTime !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "lastSaveTime= '" + req.params.lastSaveTime + "'";
        firstArgumentEntered = true;
    }

    if (req.params.approveDate !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "approveDate= '" + req.params.approveDate + "'";
        firstArgumentEntered = true;
    }

    if (req.params.approveTime !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "approveTime= '" + req.params.approveTime + "'";
        firstArgumentEntered = true;
    }

    if (req.params.isSent !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "isSent= '" + req.params.isSent + "'";
        firstArgumentEntered = true;
    }

    if (req.params.isApproved !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "isApproved= '" + req.params.isApproved + "'";
        firstArgumentEntered = true;
    }

    if (req.params.comment !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "comment= '" + req.params.comment + "'";
        firstArgumentEntered = true;
    }

    if (req.params.localStorageID !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "localStorageID= '" + req.params.localStorageID + "'";
        firstArgumentEntered = true;
    }

    queryString += " WHERE ID=" + req.params.ID;
    console.log("THIS IS THE QUERY: " + queryString);

    conn.query(
        queryString,
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "student updated!",
            });
        }
    );


};

exports.listAllPatientReportsAccSentDateForDoc = (req, res, next) => {

    conn.query("select * from patientReports WHERE attendingPhysicianID= ? AND isSent = 1 AND isApproved = ? AND " +
        "UPPER(studentName) LIKE '%?%' order by lastSaveDate DESC, lastSaveTime DESC",
        [req.params.attphyscID, req.params.isApproved, req.params.searchInput],
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

exports.listAllPatientReportsAccApproveDateForDoc = (req, res, next) => {

    conn.query("select * from patientReports WHERE attendingPhysicianID= ? AND isSent = 1 AND isApproved = ? AND " +
        "UPPER(studentName) LIKE '%?%' order by approveDate DESC, approveTime DESC",
        [req.params.attphyscID, req.params.isApproved, req.params.searchInput],
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

exports.listAllPatientReportsAccApproveDateForDoc = (req, res, next) => {

    conn.query("select * from patientReports WHERE studentID = ? AND isSent = ? AND " +
        "UPPER(patientName) LIKE '%?%' order by lastSaveDate DESC, lastSaveTime DESC",
        [req.params.studentID, req.params.isSent, req.params.searchInput],
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

exports.deletePatientFormWithID = (req, res, next) => {
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
        "select count(ID) from patientreports",
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


exports.getLocalStorageIDofPatientFormWithID = (req, res, next) => {
    if (!req.params.ID) {
        return next(new AppError("No patient with this ID found", 404));
    }
    conn.query(
        "SELECT localStorageID FROM patientreports WHERE ID = ?  order by ID ASC LIMIT 1",
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

exports.getIDofPatientForm = (req, res, next) => {
    if (!req.params.studentID) {
        return next(new AppError("No patient with this student ID found", 404));
    }
    if (!req.params.localStorageID) {
        return next(new AppError("No patient with this local storage ID found", 404));
    }
    conn.query(
        "select * from patientreports WHERE studentID =  ? AND localStorageID = ? order by ID ASC LIMIT 1",
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