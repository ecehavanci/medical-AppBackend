const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getAllStudents = (err, req, res, next) => {
    console.log("data");
    conn.query("SELECT * FROM student", function (err, data, fields) {
        if (err)
            return next(new AppError(err));

        console.log(data);
        res.status(201).json({
            status: "success",
            length: data?.length,
            data: data,
        });
        console.log("dataaaaaaaaaaaaaaaaaaaaaaaaa");
    });

};

//not needed
exports.insertStd = (req, res, next) => {
    //we check if the client is sending an empty form "and return a 404 error message.
    if (!req.body)
        return next(new AppError("No form data found", 404));

    const values = [req.body.name, "pending"];

    conn.query(
        "INSERT INTO student (ID,name, surname, courses, rotationNo, previousRotationNo) VALUES(?)",
        [values],
        function (err, data, fields) {
            if (err)
                return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "student added!",
            });
        }
    );
};

exports.filterStdByID = (req, res, next) => {
    //check if the id is specified in the request parameter, 
    if (!req.params.id) {
        return next(new AppError("No todo id found", 404));
    }
    conn.query(
        "SELECT * FROM student WHERE ID = ?",
        [req.params.id],
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

exports.updateStdByID = (req, res, next) => {
    if (!req.params.id) {
        return next(new AppError("No todo id found", 404));
    }
    conn.query(
        "UPDATE student SET rotationNo=? WHERE ID=?",
        [req.params.rotationNo, req.params.id],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "student updated!",
            });
        }
    );
};

exports.deleteStdByID = (req, res, next) => {
    if (!req.params.id) {
        return next(new AppError("No todo id found", 404));
    }
    conn.query(
        "DELETE FROM student WHERE ID=?",
        [req.params.id],
        function (err, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "student deleted!",
            });
        }
    );
}