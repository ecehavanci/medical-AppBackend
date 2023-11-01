const timestamp = Date.now(); // Get the current timestamp

const date = new Date(timestamp); // Convert the timestamp to a Date object

const year = date.getFullYear(); // Get the year (4 digits)
const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-11), add 1, and format as 2 digits
const day = String(date.getDate()).padStart(2, '0'); // Get the day of the month and format as 2 digits

const formattedDate = `${year}-${month}-${day}`; // Format the date as 'Y-M-D'

module.exports = {
    app: {
        year: 2023,
        season: 1,
        date: formattedDate,
    },
    db: {
        host: 'localhost',
        port: 3000,
        name: 'medTracker'
    }
};

