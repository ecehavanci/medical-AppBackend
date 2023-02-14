const AppError = require("../../utils/appError");
const conn = require("../../services/db");

exports.insertPatientForm = (req, res, next) => {
    //we check if the client is sending an empty form "and return a 404 error message.
    if (!req.body)
        return next(new AppError("No form data found", 404));

    const values = [
        req.body.ID,
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
        "INSERT INTO patientreports (ID,name, surname, courses, rotationNo, previousRotationNo) VALUES(?)",
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

exports.getPatientFormWithID = (req, res, next) => {
    //check if the id is specified in the request parameter,
    if (!req.params.ID) {
        return next(new AppError("No student with this ID found", 404));
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

exports.updateSPatientFormWithID = (req, res, next) => {
    if (!req.params.ID) {
        return next(new AppError("No todo id found", 404));
    }
    conn.query(
        "UPDATE patientreports SET rotationNo=? WHERE ID=?",
        [req.params.rotationNo, req.params.ID],
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