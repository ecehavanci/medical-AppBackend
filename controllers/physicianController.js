const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getAllPhysicians = (req, res, next) => {//SELECT * FROM attendingphysicians where is_active = 1 order by ID ASC;
    conn.query(
        "SELECT * FROM attendingphysicians order by ID ASC",
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

exports.insertPhysician = (req, res, next) => {
    if (!req.body) {
        return next(new AppError("No form data found", 400));
    }

    const values = [req.body.ID, req.body.name, req.body.surname,
    req.body.institute_ID, req.body.speciality_ID, req.body.phone, req.body.is_active];

    try {
        conn.query(
            "INSERT INTO attendingphysicians (ID, name, surname, institute_ID, speciality_ID, phone, is_active) VALUES(?)",
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
    } catch (error) {
        return next(new AppError(error, 500));
    }
};

exports.filterPhysician = (req, res, next) => {
    const id = req.params.ID;
    const name = req.params.name;
    const surname = req.params.surname;
    const phone = req.params.phone;

    if (!id && !name && !surname && !phone) {
        return next(new AppError("At least one search criterion is required.", 400));
    }

    const query = "SELECT * FROM attendingphysicians WHERE ID = ? OR phone = ? OR name = ? OR surname = ?";

    const params = [id, phone, name, surname];

    try {
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
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};


exports.updateAttendingPhysician = (req, res, next) => {
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
};



exports.deletePhysicianByID = (req, res, next) => {
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
}