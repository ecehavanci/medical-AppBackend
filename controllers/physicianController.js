const AppError = require("../utils/appError");
const conn = require("../services/db");
const courseHelper = require("../controllers/currentCourse");
const generateAccessToken = require('../utils/generateToken');

exports.getAllPhysicians = async (req, res, next) => {//SELECT * FROM attendingphysicians where is_active = 1 order by ID ASC;
    try {

        const query = "SELECT ID, name, surname,speciality_ID FROM attendingphysicians order by ID ASC";

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query);
        connection.release();

        res.status(200).json({
            status: "success",
            length: results?.length,
            data: results,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.insertPhysician = async (req, res, next) => {
    try {
        if (!req.body) {
            return next(new AppError("No form data found", 400));
        }

        const token = generateAccessToken({
            username: req.body.name + " " + req.body.surname
        }); //temp data

        const query = "INSERT INTO attendingphysicians (ID, name, surname, institute_ID, courseID, speciality_ID, phone, is_active,token) VALUES(?)";
        const values = [req.body.ID, req.body.name, req.body.surname,
        req.body.institute_ID, req.body.courseID, req.body.speciality_ID, req.body.phone, req.body.is_active, token];


        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        if (results.insertId) {
            res.status(201).json({
                status: "success",
                message: "New attending physician added!",
            });
        } else {
            res.status(500).json({
                status: "error",
                message: "Failed to add new physician",
            });
        }

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

exports.filterPhysician = async (req, res, next) => {

    try {
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
        const values = [id, phone, name, surname];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        res.status(200).json({
            status: "success",
            length: results.length,
            data: results,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

exports.getFullPhysicianInfoByID = async (req, res, next) => {
    try {
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
        const values = [id];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        if (data.length === 0) {
            return next(new AppError("Physician not found.", 404));
        }

        const physicianProfile = {
            fullName: results[0].name + " " + results[0].surname,
            phoneNumber: results[0].phoneNumber,
            courses: results[0].courses.split(','), // Convert courses string to array
            courseSpecialties: JSON.parse(results[0].courseSpecialties),
        };

        res.status(200).json({
            status: "success",
            data: physicianProfile,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


exports.updateAttendingPhysician = async (req, res, next) => {
    try {
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
        const values = [updateFields, id];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        if (results.affectedRows > 0) {
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

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};



exports.deletePhysicianByID = async (req, res, next) => {
    try {
        if (!req.params.ID) {
            return next(new AppError("No physician with this ID found", 404));
        }

        const query = "DELETE FROM attendingphysicians WHERE ID=?";
        const values = [req.params.ID];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        // Check if any rows were affected
        if (results.affectedRows > 0) {
            res.status(201).json({
                status: "success",
                message: "Physician deleted!",
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Physician not found or no changes made",
            });
        }

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}


exports.listCoursePhysicians = (req, res, next) => {
    try {
        if (!req.params.stdID) {
            return next(new AppError("No physician with this ID found", 404));
        }

        courseHelper.getCurrentCourse(req.params.stdID).then(async (finalCourseID) => {
            const query = "select ID,name,surname,speciality_ID from attendingphysicians where courseID = ? and is_active = 1;";
            const values = [finalCourseID];


            const connection = await conn.getConnection();
            const [results] = await connection.execute(query, values);
            connection.release();

            res.status(200).json({
                status: "success",
                length: results?.length,
                data: results,
            });

        }).catch((error) => {
            return next(new AppError(error, 500));
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.listCountsReportsPhysicians = (req, res, next) => { ////???????????????
    try {
        if (!req.params.ID) {
            return next(new AppError("No physician with this ID found", 404));
        }

        // const queryAccepted = `
        //     select count(pr.ID) AS counted from patientreports pr
        //     where pr.attendingPhysicianID = ?
        //     && isSent = 1
        //     && pr.isApproved = ?
        //     `;
        // const valueAccepted = [ID, 1];

        // const queryRejected = `
        //     select count(pr.ID) AS counted from patientreports pr
        //     where pr.attendingPhysicianID = ?
        //     && isSent = 1
        //     && pr.isApproved = ?
        //     `;
        // const valueRejected = [ID, 2];

        courseHelper.getCurrentCourse(req.params.stdID).then(async (finalCourseID) => {
            const query = "select ID,name,surname,speciality_ID as specialtyID from attendingphysicians where courseID = ? and is_active = 1;";
            const values = [finalCourseID];

            const connection = await conn.getConnection();
            const [results] = await connection.execute(query, values);
            connection.release();

            res.status(200).json({
                status: "success",
                length: results?.length,
                data: results,
            });

        }).catch((error) => {
            return next(new AppError(error, 500));
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

exports.matchPhysiciandStdWithRotation = async (req, res, next) => {
    try {
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

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        res.status(200).json({
            status: "success",
            length: results?.length,
            data: results,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}