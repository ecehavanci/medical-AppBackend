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
        req.body.illnessScript,
        req.body.tier1ID,
        req.body.tier1,
        req.body.tier2ID,
        req.body.tier2,
        req.body.tier3ID,
        req.body.tier3,
        req.body.tier4ID,
        req.body.tier4,
        req.body.saveEpoch,
        req.body.sentEpoch,
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
    console.log("Updating started");
  
    // Check if the client is sending an empty form and return a 400 Bad Request response.
    if (!req.body) {
      return res.status(400).json({ error: "No form data found" });
    }
  
    const updateFields = [
      "studentID",
      "studentName",
      "rotationID",
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
  
    // Filter and map request body values for update
    const values = updateFields.map((field) => req.body[field]);
  
    // Create the SET part of the SQL query
    const setClause = updateFields
      .map((field) => (req.body[field] !== undefined ? `${field} = ?` : null))
      .filter((clause) => clause !== null)
      .join(", ");
  
    if (!setClause) {
      return res.status(400).json({ error: "No valid fields to update" });
    }
  
    // Construct the SQL query
    const sql = `UPDATE patientreports SET ${setClause} WHERE ID = ?`;
  
    // Add the record ID to the values array
    values.push(req.params.ID);
  
    console.log("SQL Query: " + sql);
    console.log("Values: " + values);
  
    conn.query(sql, values, (err, data, fields) => {
      if (err) {
        console.error("Error updating record: " + err);
        return res.status(500).json({ error: "Internal server error" });
      }
  
      console.log("Record updated successfully");
      res.status(200).json({ message: "Student data successfully altered" });
    });
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

exports.getRequiredCountPatientFormsForDashboard = (req, res, next) => {
    conn.query(
        "select patientReportCount from rotations where ID = ?;",
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

exports.getAllCountPatientFormsForDashboard = (req, res, next) => {
    conn.query(
        "select count(ID) from patientreports where studentID = ? && rotationID = ? && isSent = 1;",
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

exports.getCountPatientFormsForDashboardAccordingToApproval = (req, res, next) => {
    conn.query(
        "select count(ID) from patientreports where studentID =? && rotationID = ? && isApproved = ?;",
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

exports.getRotationCountPatientFormsForDashboard = (req, res, next) => {
    conn.query(
        "select distinct rotationID from patientreports where studentID = ?;",
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

exports.searchPatientForms = (req, res, next) => {
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    conn.query(
        "select * from patientreports WHERE studentID = ? and isSent = ? " +
        "AND UPPER(illnessScript) LIKE '%" + input + "%' order by saveEpoch DESC",
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
        "select * from patientreports WHERE studentID = ? and isSent = ? AND isApproved = ? " +
        "AND UPPER(illnessScript) LIKE '%" + input + "%' order by saveEpoch DESC",
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
        "select * from patientreports WHERE studentID = ? and isSent = ? " +
        "AND (isApproved = ? OR isApproved = ?) " +
        "AND UPPER(illnessScript) LIKE '%" + input + "%' order by saveEpoch DESC",
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

    if (req.params.patientHospitalID !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "patientHospitalID= '" + req.params.patientHospitalID + "'";
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

    if (req.params.illnessScript !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "illnessScript= '" + req.params.illnessScript + "'";
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

    if (req.params.saveEpoch !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "saveEpoch= '" + req.params.saveEpoch + "'";
        firstArgumentEntered = true;
    }

    if (req.params.sentEpoch !== undefined) {
        if (firstArgumentEntered) {
            queryString += ", ";
        }
        queryString += "sentEpoch= '" + req.params.sentEpoch + "'";
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
    var input = req.params.searchInput === "|" ? "" : req.params.searchInput;
    conn.query("select * from patientreports WHERE attendingPhysicianID= ? AND isSent = 1 AND isApproved = ? AND " +
        "UPPER(studentName) LIKE '%" + input + "%' order by saveEpoch DESC",
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

//TODO 
exports.listAllPatientReportsAccApproveDateForDoc = (req, res, next) => {
    const input = req.params.searchInput === "|" ? "" : req.params.searchInput;

    conn.query("select * from patientreports WHERE attendingPhysicianID= ? AND isSent = 1 AND isApproved = ? AND " +
        "UPPER(studentName) LIKE '%" + input + "%' order by sentEpoch DESC",
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
        "select count(ID) from patientreports Where studentID = ?;",
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

exports.getCountForRotation = (req, res, next) => {
    conn.query(
        "select count(ID) from patientreports Where studentID = ? rotationID = ?;",
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
        "select ID from patientreports WHERE studentID =  ? AND localStorageID = ? order by ID ASC LIMIT 1",
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

exports.updatePatientFormApproveInfo = (req, res, next) => { //todoooooooooooo change it for also in app endpoint
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
        "UPDATE patientreports SET isApproved = ? ,sentEpoch = '?'  WHERE ID = ?",
        [req.params.updateChoice, sentEpoch, req.params.reportID],
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