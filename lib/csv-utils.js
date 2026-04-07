const fs = require("fs");
const csv = require("csv-parser");

// ============================================
// HELPER FUNCTION: Read CSV with row limit
// ============================================
function readCSVWithLimit(csvFilePath, limitRows = 1000) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let rowCount = 0;

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        if (rowCount < limitRows) {
          rows.push(row);
          rowCount++;
        }
      })
      .on("end", () => {
        resolve(rows);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

module.exports = { readCSVWithLimit };
