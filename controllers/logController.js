const AppError = require("../utils/appError");
const conn = require("../services/db");
const config = require("../config.js");
const currentYear = config.app.year;
const currentSeason = config.app.season;
const currentDate = config.app.date;

exports.updatePatientFormLog = (updateFields, values) => { //todo fix the query and handle the case when patient_logger increments the change_no
    return new Promise((resolve, reject) => {
        const valuesCopy = values.slice(); // Create a copy of the values array
        const columnNamesCopy = updateFields.slice(); // Create a copy of the column names array

        // Get the ID from the last index of the values array
        const ID = valuesCopy.pop(); // Remove and store the last value (ID)

        if (columnNamesCopy.length !== valuesCopy.length) {
            // Check that both arrays have the same length
            console.error("Arrays must have the same length");
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
                        const insertLogDataQuery = "INSERT INTO patient_logger (old_data, new_data) VALUES (?, ?)";

                        conn.query(insertLogDataQuery, [JSON.stringify(logData.old_data), JSON.stringify(logData.new_data)], (err) => {
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


exports.updateProcedureFormLog = (updateFields, values, req, res, next) => {

}