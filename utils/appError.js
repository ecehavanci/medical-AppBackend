const fs = require('fs').promises;
const path = require('path');

class AppError extends Error {
  constructor(msg, statusCode) {
    super(msg);

    this.statusCode = statusCode;
    this.error = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture stack trace excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);

    this.logError();
  }

  async logError() {
    const logFileName = 'errors.json';
    const logFilePath = path.join(__dirname, logFileName);

    const logObject = { error: this.error, message: this.message, stack: this.stack };

    try {
      // Ensure the directory exists
      await fs.mkdir(path.dirname(logFilePath), { recursive: true });

      // Read the existing content of the file
      let existingContent = '[]';
      try {
        existingContent = await fs.readFile(logFilePath, 'utf8');
      } catch (readError) {
        // If the file doesn't exist, the content is set to an empty array
      }

      // Parse the existing content as JSON
      const existingArray = JSON.parse(existingContent);

      // Append the new log object to the array
      existingArray.push(logObject);

      // Write the updated array back to the file with a comma at the end
      await fs.writeFile(logFilePath, JSON.stringify(existingArray, null, 2));

    } catch (error) {
      console.error('Error updating errors.json:', error);
    }
  }
}

module.exports = AppError;
