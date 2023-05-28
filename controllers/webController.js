const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getAllCourses = (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/json' });
    conn.query('Select * from courses', (err, result) => {
        if (err) throw err;

        res.write(JSON.stringify(result));
        res.end();
    });
}

exports.insertCourse = (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    let ID = req.body.ID;
    let description = req.body.description;
    let code = req.body.code;
    let sql = 'INSERT INTO courses(ID, description, code) VALUES(?, ?, ?)';
    conn.query(sql, [ID, description, code], (err, result) => {
        if (err) throw err;

        res.write('Inserted');
        res.end();
    });
}

exports.getCoordinators = (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/json' });
    conn.query('Select * from coordinators', (err, result) => {
        if (err) throw err;

        res.write(JSON.stringify(result));
        res.end();
    });
}

exports.insertCoordinators = (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    let id = req.body.id;
    let user_name = req.body.user_name;
    let password = req.body.password;
    let name = req.body.name;
    let sql = 'INSERT INTO coordinators(id, user_name, password, name) VALUES(?, ?, ?, ?)';
    conn.query(sql, [id, user_name, password, name], (err, result) => {
        if (err) throw err;

        res.write('Inserted');
        res.end();
    });
}

exports.getDiagnostics = (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/json' });
    conn.query('Select * from diagnostics', (err, result) => {
        if (err) throw err;

        res.write(JSON.stringify(result));
        res.end();
    });
}

exports.insertDiagnostics = (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    let ID = req.body.ID;
    let specialityID = req.body.specialityID;
    let name = req.body.name;
    let sql = 'INSERT INTO diagnostics(ID, specialityID, name) VALUES(?, ?, ?)';
    conn.query(sql, [ID, specialityID, name], (err, result) => {
        if (err) throw err;

        res.write('Inserted');
        res.end();
    });
}

exports.getAttPhysc = (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/json' });
    conn.query('Select * from attendingphysicians', (err, result) => {
        if (err) throw err;

        res.write(JSON.stringify(result));
        res.end();
    });
}

exports.insertAttPhysc = (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    let ID = req.body.ID;
    let name = req.body.name;
    let surname = req.body.surname;
    let instituteID = req.body.instituteID;
    let specialityID = req.body.specialityID;
    let phone = req.body.phone;
    let sql = 'INSERT INTO attendingphysicians(ID, name, surname, instituteID, specialityID, phone) VALUES(?, ?, ?, ?, ?, ?)';
    conn.query(sql, [ID, name, surname, instituteID, specialityID, phone], (err, result) => {
        if (err) throw err;

        res.write('Inserted');
        res.end();
    });
}

exports.updateAttPhysc = (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    let isDeleted = req.body.isdelete;
    let ID = req.body.ID;
    let sql = 'UPDATE attendingphysicians set isDeleted = ? where ID = ?';
    conn.query(sql, [isDeleted], (err, result) => {
        if (err) throw err;
        res.write('Updated..')
        res.end();
    });
}