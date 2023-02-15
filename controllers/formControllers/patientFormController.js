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
        req.body.diagnosisIDi,
        req.body.diagnosis,
        req.body.patientHospitalID,
        req.body.patientName,
        req.body.patientGender,
        req.body.patientAge,
        req.body.relevants,
        req.body.keySymptoms,
        req.body.signs,
        req.body.data,
        req.body.traineesRole,
        req.body.levelOfCare,
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
        "traineesRole," +
        "levelOfCare," +
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

exports.getAllPatientForms = (req, res, next) => {
    conn.query(
        "SELECT * FROM patientreports",
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