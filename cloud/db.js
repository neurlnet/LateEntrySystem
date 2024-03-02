const sqlite3 = require("sqlite3").verbose();
const filepath = "./entry.db";
const fs = require("fs");
function createDbConnection() {
  if (fs.existsSync(filepath)) {
    return new sqlite3.Database(filepath);
  } else {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
      createTable(db);
    });
    console.log("Connection with SQLite has been established");
    return db;
  }
}

function createTable(db) {
  db.exec(`
  CREATE TABLE late_entry
  (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    name   VARCHAR(50) NOT NULL,
    section   VARCHAR(50) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    year VARCHAR(50) NOT NULL,
    month VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    timestamp VARCHAR(50) NOT NULL
  );
`);
}

module.exports = createDbConnection();