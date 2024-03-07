const AppError = require('../utils/AppError');
const conn = require("../services/db");

exports.submitForm = async (req, res, next) => {
    try {
        const { name, phoneNumber, email, subject, message } = req.body;

        // Check if any field is empty
        if (!name || !phoneNumber || !email || !subject || !message) {
            throw new AppError('Please fill in all fields!', 400);
        }


        const query = "INSERT INTO contact_form (full_name, phone, email, subject, message) VALUES(?,?,?,?,?)";
        const values = [name, phoneNumber, email, subject, message];

        const connection = await conn.getConnection();
        const [results] = await connection.execute(query, values);
        connection.release();

        if (results.insertId) {
            res.status(201).json({
                status: "success",
                message: "New attending contact form added!",
            });
        } else {
            res.status(500).json({
                status: "error",
                message: "Failed to add new contact form!",
            });
        }

    } catch (error) {
        return next(new AppError(error.message, error.statusCode || 500));
    }
};
