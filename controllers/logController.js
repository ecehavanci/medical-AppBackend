const AppError = require("../utils/appError");
const conn = require("../services/db");
const config = require("../config.js");
const currentYear = config.app.year;
const currentSeason = config.app.season;
const currentDate = config.app.date;
const deepDiff = require('deep-diff');

exports.updatePatientFormLog = (selectClauses, values) => { //todo fix the query and handle the case when patient_logger increments the change_no

    console.log("updatePatientFormLog");
    return new Promise((resolve, reject) => {
        const valuesCopy = values.slice(); // Create a copy of the values array
        const columnNamesCopy = selectClauses.slice(); // Create a copy of the column names array

        // Get the ID from the last index of the values array
        const ID = valuesCopy.pop(); // Remove and store the last value (ID)

        if (columnNamesCopy.length !== valuesCopy.length) {
            // Check that both arrays have the same length
            reject("Arrays must have the same length");
        } else {
            const newJSON = {};

            for (let i = 0; i < columnNamesCopy.length; i++) {
                const field = columnNamesCopy[i];
                const value = valuesCopy[i];
                newJSON[field] = value;
            }

            // Create a query to select the old data for the given ID
            const placeholders = columnNamesCopy.join(', ');

            const selectOldDataQuery = `SELECT ${placeholders} FROM patientreports WHERE ID = ? AND isApproved = 2`;

            const params = [ID];

            conn.query(selectOldDataQuery,
                params,
                (err, oldDataRows) => {
                    if (err) {
                        console.error("Error reading old data:", err);
                        reject(err);
                    }
                    else if (oldDataRows.length === 0) {
                        // Handle the case where no data is found for the given ID
                        const errorMessage = "No data found for the provided ID";
                        console.error(errorMessage);
                        resolve();
                    }
                    else {
                        // Assuming oldDataRows is an array of rows with the old data
                        // Create a JSON object to represent the old and new data
                        const logData = {
                            old_data: oldDataRows[0], // Assuming you're interested in the first row
                            new_data: newJSON, // Remove the last ID value
                        };

                        // Now, you can insert the logData into your logger table
                        const insertLogDataQuery = "INSERT INTO patient_logger (report_id, old_data, new_data) VALUES (?, ?, ?)";

                        conn.query(insertLogDataQuery,
                            [ID, JSON.stringify(logData.old_data), JSON.stringify(logData.new_data)], (err) => {
                                if (err) {
                                    console.error("Error inserting log data:", err);
                                    reject(err);
                                }

                                console.log("Log data inserted:", logData);
                                resolve();
                            });
                    }
                });
        }
    });
}


exports.updateProcedureFormLog = (selectClauses, values) => {
    console.log(selectClauses);

    return new Promise((resolve, reject) => {
        const valuesCopy = values.slice(); // Create a copy of the values array
        const columnNamesCopy = selectClauses.slice(); // Create a copy of the column names array

        // Get the ID from the last index of the values array
        const ID = valuesCopy.pop(); // Remove and store the last value (ID)

        if (columnNamesCopy.length !== valuesCopy.length) {
            // Check that both arrays have the same length
            reject("Arrays must have the same length");
        } else {
            const newJSON = {};

            for (let i = 0; i < columnNamesCopy.length; i++) {
                const field = columnNamesCopy[i];
                const value = valuesCopy[i];
                newJSON[field] = value;
            }

            // Create a query to select the old data for the given ID
            const placeholders = columnNamesCopy.join(', ');
            console.log(placeholders);

            const selectOldDataQuery = `SELECT ${placeholders} FROM procedurereports WHERE ID = ? AND isApproved = 2`;
            console.log(selectOldDataQuery);
            const params = [ID];

            conn.query(selectOldDataQuery,
                params,
                (err, oldDataRows) => {
                    if (err) {
                        console.error("Error reading old data:", err);
                        reject(err);
                    }
                    else if (oldDataRows.length === 0) {
                        // Handle the case where no data is found for the given ID
                        const errorMessage = "No data found for the provided ID";
                        console.error(errorMessage);
                        resolve();
                    }
                    else {
                        // Assuming oldDataRows is an array of rows with the old data
                        // Create a JSON object to represent the old and new data
                        const logData = {
                            old_data: oldDataRows[0], // Assuming you're interested in the first row
                            new_data: newJSON, // Remove the last ID value
                        };

                        // Now, you can insert the logData into your logger table
                        const insertLogDataQuery = "INSERT INTO procedure_logger (report_id, old_data, new_data) VALUES (?, ?, ?)";
                        console.log(insertLogDataQuery);

                        conn.query(insertLogDataQuery,
                            [ID, JSON.stringify(logData.old_data), JSON.stringify(logData.new_data)], (err) => {
                                if (err) {
                                    console.error("Error inserting log data:", err);
                                    reject(err);
                                }

                                console.log("Log data inserted:", logData);
                                resolve();
                            });
                    }
                });
        }
    });
}

exports.countPatientLogs = (req, res, next) => {
    if (!req.params.formID) {
        return next(new AppError("No form ID specified", 404));
    }
    else {
        const formID = req.params.formID;
        const query = `select change_no
        from patient_logger
        where report_id = ?
        order by change_no desc limit 1;`;

        conn.query(
            query,
            [formID],
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
}

exports.countProcedureLogs = (req, res, next) => {
    if (!req.params.formID) {
        return next(new AppError("No form ID specified", 404));
    }
    else {
        const formID = req.params.formID;
        const query = `select change_no
        from procedure_logger
        where report_id = ?
        order by change_no desc limit 1;`;

        conn.query(
            query,
            [formID],
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
}

//the latest difference of the report
exports.readPatientDifferences = (req, res, next) => {
    if (!req.params.formID) {
        return next(new AppError("No form ID specified", 404));
    } else {

        const formID = req.params.formID;
        const query = `
        SELECT old_data, new_data, change_no
        FROM patient_logger
        WHERE report_id = ?
        ORDER BY change_no ASC;`;

        try {
            conn.query(
                query,
                [formID],
                function (err, data, fields) {
                    if (err) return next(new AppError(err, 500));

                    // Create an array to store all differences
                    const allDifferences = {};

                    data.forEach(row => {
                        const oldData = JSON.parse(row.old_data);
                        const newData = JSON.parse(row.new_data);

                        // Compute the differences between oldData and newData
                        const differences = deepDiff(oldData, newData);

                        let diffText = '';

                        if (differences) {
                            differences.forEach(diff => {
                                // Initialize an object for each diff.path if it doesn't exist
                                if (!allDifferences[diff.path]) {
                                    allDifferences[diff.path] = {
                                        data: [], // An array to store the descriptions
                                        totalChange: 0,
                                    };
                                }

                                // You can customize the text generation based on the type of difference (added, deleted, or updated)
                                let diffText = '';
                                switch (diff.kind) {
                                    case 'E':
                                        diffText = `changed from '${diff.lhs}' to '${diff.rhs}'.`;
                                        break;
                                    case 'N':
                                        diffText = `was added with value '${diff.rhs}'.`;
                                        break;
                                    case 'D':
                                        diffText = `was removed with value '${diff.lhs}'.`;
                                        break;
                                    // You can handle other cases as needed
                                }

                                allDifferences[diff.path].data.push(diffText);
                                allDifferences[diff.path].totalChange = row.change_no;
                            });
                        }
                    });

                    res.status(200).json({
                        status: "success",
                        length: data.length,
                        data: {
                            differences: allDifferences,
                        },
                    });
                }
            );
        } catch (err) {
            return next(new AppError(err, 500));
        }

    }
}

//the latest difference of the report
exports.readProcedureDifferences = (req, res, next) => {
    if (!req.params.formID) {
        return next(new AppError("No form ID specified", 404));
    } else {

        const formID = req.params.formID;
        const query = `
        SELECT old_data, new_data, change_no
        FROM procedure_logger
        WHERE report_id = ?
        ORDER BY change_no ASC;`;

        try {
            conn.query(
                query,
                [formID],
                function (err, data, fields) {
                    if (err) return next(new AppError(err, 500));

                    // Create an array to store all differences
                    const allDifferences = {};

                    data.forEach(row => {
                        const oldData = JSON.parse(row.old_data);
                        const newData = JSON.parse(row.new_data);

                        // Compute the differences between oldData and newData
                        const differences = deepDiff(oldData, newData);

                        let diffText = '';

                        if (differences) {
                            differences.forEach(diff => {
                                // Initialize an object for each diff.path if it doesn't exist
                                if (!allDifferences[diff.path]) {
                                    allDifferences[diff.path] = {
                                        data: [], // An array to store the descriptions
                                        totalChange: 0,
                                    };
                                }

                                // You can customize the text generation based on the type of difference (added, deleted, or updated)
                                let diffText = '';
                                switch (diff.kind) {
                                    case 'E':
                                        diffText = `changed from '${diff.lhs}' to '${diff.rhs}'.`;
                                        break;
                                    case 'N':
                                        diffText = `was added with value '${diff.rhs}'.`;
                                        break;
                                    case 'D':
                                        diffText = `was removed with value '${diff.lhs}'.`;
                                        break;
                                    // You can handle other cases as needed
                                }

                                allDifferences[diff.path].data.push(diffText);
                                allDifferences[diff.path].totalChange = row.change_no;
                            });
                        }
                    });

                    res.status(200).json({
                        status: "success",
                        length: data.length,
                        data: {
                            differences: allDifferences,
                        },
                    });
                }
            );
        } catch (err) {
            return next(new AppError(err, 500));
        }

    }
};


