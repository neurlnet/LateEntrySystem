const db = require("./db");

function selectRows() {
  db.all(`SELECT * FROM late_entry`, (error, row) => {
    if (error) {
      throw new Error(error.message);
    }
    console.log(row)
  });
}

selectRows();