const AppError = require('../utils/AppError');
const conn = require("../services/db");
const nodemailer = require('nodemailer');
require('dotenv').config();

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

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            // secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const formattedMessage = formatMessage(name, phoneNumber, email, subject, message);

        // Define email options
        const mailOptions = {
            from: 'ybs-no-reply@izmirekonomi.edu.tr',
            // to: 'ybs@ieu.edu.tr',
            to: 'ece.havanci@ieu.edu.tr',
            subject: subject,
            text: formattedMessage
        };

        // Send email
        let sent = false;
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred:', error.message);
            } else {
                console.log('Email sent:', info.response);
                sent = true;
            }
        });

        if (results.insertId && sent) {
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

function formatMessage(name, phoneNumber, email, subject, message) {
    const maxLength = 50; // Maximum characters per line
    let formattedMessage = `╔══════════════════════════════════════════════════════\n`;
    formattedMessage += `║                     İletişim Formu                     \n`;
    formattedMessage += `╠══════════════════════════════════════════════════════\n`;
    formattedMessage += `║ Adı: ${name.padEnd(maxLength, ' ')}\n`;
    formattedMessage += `║ Telefon Numarası: ${phoneNumber.padEnd(maxLength, ' ')}\n`;
    formattedMessage += `║ E-posta: ${email.padEnd(maxLength, ' ')}\n`;
    formattedMessage += `║ Konu: ${subject.padEnd(maxLength, ' ')}\n`;
    formattedMessage += `║ Mesaj: \n`;

    // Split message into lines with maximum length
    const messageLines = message.match(new RegExp(`.{1,${maxLength}}`, 'g'));
    if (messageLines) {
        for (const line of messageLines) {
            formattedMessage += `║ ${line.padEnd(maxLength, ' ')}\n`;
        }
    }

    formattedMessage += `╚══════════════════════════════════════════════════════`;

    return formattedMessage;
}