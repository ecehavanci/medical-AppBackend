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
        async function (err, data, fields) {
            if (err) {
                return next(new AppError(err, 500));
            }

            if (data.affectedRows > 0) {
                if (req.body.isSent === 1) {
                    const insertedTier1 = await checkAndInsertTierData(req.body.tier1ID, req.body.tier1, data.insertId, res, next);
                    const insertedTier2 = await checkAndInsertTierData(req.body.tier2ID, req.body.tier2, data.insertId, res, next);
                    const insertedTier3 = await checkAndInsertTierData(req.body.tier3ID, req.body.tier3, data.insertId, res, next);
                    const insertedTier4 = await checkAndInsertTierData(req.body.tier4ID, req.body.tier4, data.insertId, res, next);
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
    if (req.body.studentName !== undefined) values.unshift(req.body.studentName);
    if (req.body.rotationID !== undefined) values.unshift(req.body.rotationID);
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
    if (req.body.illnessScript !== undefined) values.unshift(req.body.illnessScript);
    if (req.body.tier1ID !== undefined) values.unshift(req.body.tier1ID);
    if (req.body.tier1 !== undefined) values.unshift(req.body.tier1);
    if (req.body.tier2ID !== undefined) values.unshift(req.body.tier2ID);
    if (req.body.tier2 !== undefined) values.unshift(req.body.tier2);
    if (req.body.tier3ID !== undefined) values.unshift(req.body.tier3ID);
    if (req.body.tier3 !== undefined) values.unshift(req.body.tier3);
    if (req.body.tier4ID !== undefined) values.unshift(req.body.tier4ID);
    if (req.body.tier4 !== undefined) values.unshift(req.body.tier4);
    if (req.body.saveEpoch !== undefined) values.unshift(req.body.saveEpoch);
    if (req.body.sentEpoch !== undefined) values.unshift(req.body.sentEpoch);
    if (req.body.isSent !== undefined) values.unshift(req.body.isSent);
    if (req.body.isApproved !== undefined) values.unshift(req.body.isApproved);
    if (req.body.comment !== undefined) values.unshift(req.body.comment);
    console.log("values: " + values.reverse().toString());


    console.log(req.body);

    var str = "UPDATE patientreports SET " +
        (req.body.studentID !== undefined ? "studentID = ?, " : "") +
        (req.body.studentName !== undefined ? "studentName = ?, " : "") +
        (req.body.rotationID !== undefined ? "rotationID = ?, " : "") +
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

                if (req.body.isSent === 1) {
                    const insertedTier1 = await checkAndInsertTierData(req.body.tier1ID, req.body.tier1, req.params.ID, res, next);
                    const insertedTier2 = await checkAndInsertTierData(req.body.tier2ID, req.body.tier2, req.params.ID, res, next);
                    const insertedTier3 = await checkAndInsertTierData(req.body.tier3ID, req.body.tier3, req.params.ID, res, next);
                    const insertedTier4 = await checkAndInsertTierData(req.body.tier4ID, req.body.tier4, req.params.ID, res, next);
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
            SELECT description,tier,
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