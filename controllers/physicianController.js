const AppError = require("../utils/appError");
const conn = require("../services/db");
const courseHelper = require("../controllers/currentCourse");
const verifyToken = require('../utils/verifyToken');
const generateAccessToken = require('../utils/generateToken');

exports.getAllPhysicians = (req, res, next) => {//SELECT * FROM attendingphysicians where is_active = 1 order by ID ASC;
    try {
        verifyToken(req, res, () => {
            conn.query(
                "SELECT ID, name, surname FROM attendingphysicians order by ID ASC",
                function (err, data, fields) {
                    if (err) return next(new AppError(err, 500));
                    res.status(200).json({
                        status: "success",
                        length: data?.length,
                        data: data,
                    });
                }
            );
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.insertPhysician = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            if (!req.body) {
                return next(new AppError("No form data found", 400));
            }

            const token = generateAccessToken({
                username: req.body.name + " " + req.body.surname
            }); //temp data

            const values = [req.body.ID, req.body.name, req.body.surname,
            req.body.institute_ID, req.body.courseID, req.body.speciality_ID, req.body.phone, req.body.is_active, token];

            conn.query(
                "INSERT INTO attendingphysicians (ID, name, surname, institute_ID, courseID, speciality_ID, phone, is_active,token) VALUES(?)",
                [values],
                function (err, data, fields) {
                    if (err) {
                        return next(new AppError(err, 500));
                    }
                    res.status(201).json({
                        status: "success",
                        message: "New attending physician added!",
                    });
                }
            );
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

exports.filterPhysician = (req, res, next) => {

    try {
        verifyToken(req, res, () => {
            if (!req.body) {
                return next(new AppError("No form data found", 400));
            }

            const id = req.params.ID;
            const name = req.params.name;
            const surname = req.params.surname;
            const phone = req.params.phone;

            if (!id && !name && !surname && !phone) {
                return next(new AppError("At least one search criterion is required.", 400));
            }

            const query = "SELECT * FROM attendingphysicians WHERE ID = ? OR phone = ? OR name = ? OR surname = ?";

            const params = [id, phone, name, surname];

            conn.query(query, params, (err, data, fields) => {
                if (err) {
                    return next(new AppError(err.message, 500));
                }

                res.status(200).json({
                    status: "success",
                    length: data.length,
                    data: data,
                });
            });
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

exports.getFullPhysicianInfoByID = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            if (!req.body) {
                return next(new AppError("No form data found", 400));
            }

            const id = req.params.ID;

            if (!id) {
                return next(new AppError("ID is required.", 400));
            }

            const query = `
            SELECT
                s.name AS name,
                s.surname AS surname,
                s.phone AS phoneNumber,
                GROUP_CONCAT(DISTINCT c.code) AS courses,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'course', c.code,
                        'specialty', c.description,
                        'rotationNos', rotationNos
                    )
                ) AS courseSpecialties
            FROM
                attendingphysicians s
                LEFT JOIN courses c ON c.ID = s.courseID
                LEFT JOIN specialties spec ON spec.ID = s.speciality_ID
                LEFT JOIN (
                    SELECT
                        physicianID,
                        JSON_ARRAY(GROUP_CONCAT(DISTINCT rotationNo)) AS rotationNos
                    FROM enrollment_physician
                    GROUP BY physicianID
                ) en ON en.physicianID = s.ID
            WHERE
                s.ID = ?
            GROUP BY
                s.ID, c.code, c.description;    
                `;
            const params = [id];

            conn.query(query, params, (err, data, fields) => {
                if (err) {
                    return next(new AppError(err.message, 500));
                }

                // If the result is empty, return an error or handle it appropriately
                if (data.length === 0) {
                    return next(new AppError("Physician not found.", 404));
                }

                const physicianProfile = {
                    fullName: data[0].name + " " + data[0].surname,
                    phoneNumber: data[0].phoneNumber,
                    courses: data[0].courses.split(','), // Convert courses string to array
                    courseSpecialties: JSON.parse(data[0].courseSpecialties),
                };

                console.log();
                res.status(200).json({
                    status: "success",
                    data: physicianProfile,
                });
            });
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


exports.updateAttendingPhysician = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            const { id } = req.params; // Get the ID of the attending physician to update

            // Check if the request body contains the fields you want to update
            if (!req.body) {
                return next(new AppError("No update data found", 400));
            }

            const updateFields = {};
            if (req.body.name) {
                updateFields.name = req.body.name;
            }
            if (req.body.surname) {
                updateFields.surname = req.body.surname;
            }
            if (req.body.institute_ID) {
                updateFields.institute_ID = req.body.institute_ID;
            }
            if (req.body.speciality_ID) {
                updateFields.speciality_ID = req.body.speciality_ID;
            }
            if (req.body.phone) {
                updateFields.phone = req.body.phone;
            }
            if (req.body.is_active !== undefined) {
                updateFields.is_active = req.body.is_active;
            }

            // Construct the SQL query to update the attending physician
            const query = "UPDATE attendingphysicians SET ? WHERE ID = ?";

            // Execute the query with the update fields and ID
            conn.query(query, [updateFields, id], (err, data, fields) => {
                if (err) {
                    return next(new AppError(err, 500));
                }

                // Check if any rows were actually updated
                if (data.affectedRows > 0) {
                    res.status(200).json({
                        status: "success",
                        message: "Attending physician updated successfully",
                    });
                } else {
                    // Handle the case where no rows were updated (e.g., the ID doesn't exist)
                    res.status(404).json({
                        status: "error",
                        message: "Attending physician not found or no changes made",
                    });
                }
            });
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};



exports.deletePhysicianByID = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            if (!req.params.ID) {
                return next(new AppError("No physician with this ID found", 404));
            }
            conn.query(
                "DELETE FROM attendingphysicians WHERE ID=?",
                [req.params.ID],
                function (err, fields) {
                    if (err) return next(new AppError(err, 500));
                    res.status(201).json({
                        status: "success",
                        message: "physician deleted!",
                    });
                }
            );
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.listCoursePhysicians = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            if (!req.params.stdID) {
                return next(new AppError("No physician with this ID found", 404));
            }

            courseHelper.getCurrentCourse(req.params.stdID).then((finalCourseID) => {
                conn.query(
                    "select ID,name,surname,speciality_ID from attendingphysicians where courseID = ? and is_active = 1;",
                    [finalCourseID],
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
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.listCountsReportsPhysicians = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            if (!req.params.ID) {
                return next(new AppError("No physician with this ID found", 404));
            }

            const queryAccepted = `
            select count(pr.ID) AS counted from patientreports pr
            where pr.attendingPhysicianID = ?
            && isSent = 1
            && pr.isApproved = ?
            `;
            const valueAccepted = [ID, 1];

            const queryRejected = `
            select count(pr.ID) AS counted from patientreports pr
            where pr.attendingPhysicianID = ?
            && isSent = 1
            && pr.isApproved = ?
            `;
            const valueRejected = [ID, 2];

            courseHelper.getCurrentCourse(req.params.stdID).then((finalCourseID) => {
                conn.query(
                    "select ID,name,surname,speciality_ID as specialtyID from attendingphysicians where courseID = ? and is_active = 1;",
                    [finalCourseID],
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
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.matchPhysiciandStdWithRotation = (req, res, next) => {
    try {
        verifyToken(req, res, () => {
            if (!req.params.physicianId) {
                return next(new AppError("No physician with this ID found", 404));
            }

            const physicianId = req.params.physicianId;
            const rotationNumber = req.params.rotationNumber;
            const courseId = req.params.courseId;

            const query = `
            SELECT s.ID, s.name, s.surname, ep.rotationNo, rc.course_id
            FROM student s
                     JOIN enrollment_physician ep ON ep.physicianID = ?
                     JOIN enrollment e ON e.rotation_id = ep.rotationNo && e.std_id = s.ID
                     JOIN rotation_courses rc ON rc.rotation_id = e.rotation_id and ep.courseID = rc.course_id
            WHERE ep.physicianID = ?
              AND ep.rotationNo = ?
              AND rc.course_id = ?
              AND s.is_active = 1;
          `;

            const values = [physicianId, physicianId, rotationNumber, courseId];

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
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}