const AppError = require("../utils/appError");
const conn = require("../services/db");

exports.getAllDiagnosis = (req, res, next) => {

    conn.query(
        "SELECT * FROM diagnostics order by ID ASC",
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

exports.filterDiagnosisByID = (req, res, next) => {
    //check if the id is specified in the request parameter, 
    if (!req.params.ID) {
        return next(new AppError("No diagnosis with this ID found", 404));
    }
    conn.query(
        "SELECT * FROM diagnostics WHERE ID = ?",
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

// exports.insertPhyscian = (req, res, next) => {
//     //we check if the client is sending an empty form "and return a 404 error message.
//     if (!req.body)
//         return next(new AppError("No form data found", 404));

//     const values = [req.body.ID, req.body.name, req.body.surname,
//     req.body.instituteID, req.body.specialityID, req.body.phone];

//     console.log(req.body);

//     conn.query(
//         "INSERT INTO attendingphysicians (ID,name, surname, instituteID, specialityID, phone) VALUES(?)",
//         [values],
//         function (err, data, fields) {
//             if (err)
//                 return next(new AppError(err, 500));
//             res.status(201).json({
//                 status: "success",
//                 message: "New attending physician added!",
//             });
//         }
//     );
// };


// exports.updatePhysicianByID = (req, res, next) => {
//     if (!req.params.ID) {
//         return next(new AppError("No attending physician id found", 404));
//     }
//     if (!req.params.colName) {
//         return next(new AppError("No attending physician column with this name found", 404));
//     }
//     if (!req.params.value) {
//         return next(new AppError("No value", 404));
//     }

//     conn.query(
//         "UPDATE attendingphysicians SET" + req.params.colName + "=? WHERE ID=?",
//         [req.params.value, req.params.ID],
//         function (err, data, fields) {
//             if (err) return next(new AppError(err, 500));
//             res.status(201).json({
//                 status: "success",
//                 message: "attending physician updated!",
//             });
//         }
//     );
// };

// exports.deletePhysicianByID = (req, res, next) => {
//     if (!req.params.ID) {
//         return next(new AppError("No physician with this ID found", 404));
//     }
//     conn.query(
//         "DELETE FROM attendingphysicians WHERE ID=?",
//         [req.params.ID],
//         function (err, fields) {
//             if (err) return next(new AppError(err, 500));
//             res.status(201).json({
//                 status: "success",
//                 message: "physician deleted!",
//             });
//         }
//     );
// }