const express = require('express');
const path = require("path")
const app = express();
app.use(express.static(__dirname + '/public'));
const db = require("./db");
app.use(express.urlencoded({ extended: true }))
const PORT = 3000;
app.get('/', async (req, res) => {
  let path_to_file = path.resolve(__dirname, "index.html")
  res.sendFile(path_to_file)
})


app.post('/submit', async (req, res) => {
  let date = new Date();
  let joe = req.body;
  joe.date = joe.date.split("-")
  joe.time = joe.time.split(":")
  let date_today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  let timestamp = `${date.getHours()}:${date.getMinutes()}`
  if (joe.date[0] != '') {
    date_today = `${Number(joe.date[0])}-${Number(joe.date[1])}-${Number(joe.date[2])}`
  }
  if (joe.time[0] != '') {
    timestamp = `${Number(joe.time[0])}:${Number(joe.time[1])}`
  }
  //console.log(joe)
  let today = date_today.split("-")
  function insertRow() {
    db.run(
      `INSERT INTO late_entry (name, section, grade, year,month,date ,timestamp) VALUES (?, ?, ?, ?, ?,?,?)`,
      [`${joe.name.toUpperCase()}`, joe.section.toUpperCase(), joe.class, Number(today[0]), Number(today[1]), Number(today[2]), timestamp],
      function (error) {
        if (error) {
          console.error(error.message);
        }
        console.log(`Inserted a row with the ID: ${this.lastID}`);
      }
    );
  }
  db.all(`SELECT * FROM late_entry WHERE name='${joe.name.toUpperCase()}' AND section='${joe.section.toUpperCase()}' AND grade='${joe.class}' AND year='${Number(today[0])}' AND month='${Number(today[1])}' AND date = '${Number(today[2])}'`, async function (err, rows) {
    if (rows.length < 1) {
      insertRow();
      res.redirect('/')
    }
    else {
      res.send('You cannot enter 2 records for same day and person!');

    }
  })



})
app.get("/details", async (req, res) => {
  let body = JSON.parse(req.query.data)
  let file = `
    <style>
    @import url(https://fonts.googleapis.com/css?family=Roboto:400,500,700,300,100);

    body {
      background-color: #3e94ec;
      font-family: "Roboto", helvetica, arial, sans-serif;
      font-size: 16px;
      font-weight: 400;
      text-rendering: optimizeLegibility;
    }
    
    div.table-title {
      display: block;
      margin: auto;
      text-align:center;
      max-width: 600px;
      padding:5px;
      width: 200%;
    }
    
    .table-title h3 {
       color: #fafafa;
       font-size: 30px;
       font-weight: 400;
       font-style:normal;
       font-family: "Roboto", helvetica, arial, sans-serif;
       text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
       text-transform:uppercase;
    }
    
    
    /*** Table Styles **/
    
    .table-fill {
      background: white;
      border-radius:3px;
      border-collapse: collapse;
      height: 320px;
      margin: auto;
      max-width: 85%;
      padding:5px;
      width: 200%;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
      animation: float 5s infinite;
    }
     
    th {
      color:#D5DDE5;;
      background:#1b1e24;
      border-bottom:4px solid #9ea7af;
      border-right: 1px solid #343a45;
      font-size:23px;
      font-weight: 100;
      padding:24px;
      text-align:left;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      vertical-align:middle;
    }
    
    th:first-child {
      border-top-left-radius:3px;
    }
     
    th:last-child {
      border-top-right-radius:3px;
      border-right:none;
    }
      
    tr {
      border-top: 1px solid #C1C3D1;
      border-bottom: 1px solid #C1C3D1;
      color:#666B85;
      font-size:16px;
      font-weight:normal;
      text-shadow: 0 1px 1px rgba(256, 256, 256, 0.1);
    }
     
    tr:hover td {
      background:#4E5066;
      color:#FFFFFF;
      border-top: 1px solid #22262e;
    }
     
    tr:first-child {
      border-top:none;
    }
    
    tr:last-child {
      border-bottom:none;
    }
     
    tr:nth-child(odd) td {
      background:#EBEBEB;
    }
     
    tr:nth-child(odd):hover td {
      background:#4E5066;
    }
    
    tr:last-child td:first-child {
      border-bottom-left-radius:3px;
    }
     
    tr:last-child td:last-child {
      border-bottom-right-radius:3px;
    }
     
    td {
      background:#FFFFFF;
      padding:20px;
      text-align:left;
      vertical-align:middle;
      font-weight:300;
      font-size:18px;
      text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
      border-right: 1px solid #C1C3D1;
    }
    
    td:last-child {
      border-right: 0px;
    }
    
    th.text-left {
      text-align: left;
    }
    
    th.text-center {
      text-align: center;
    }
    
    th.text-right {
      text-align: right;
    }
    
    td.text-left {
      text-align: left;
    }
    
    td.text-center {
      text-align: center;
    }
    
    td.text-right {
      text-align: right;
    }
    </style>
    <div class="table-title">
    <h3>Late Entries</h3>
    </div>
    <table class="table-fill">
    <thead>
    <tr>
    <th class="text-left">Name</th>
    <th class="text-left">Section</th>
    <th class="text-left">Grade</th>
    <th class="text-left">Late Arrivals</th>
    <th class="text-left">No. Of Late Arrivals</th>
    </tr>
    </thead>
    <tbody class="table-hover">
    `
  body.year = parseInt(body.year, 10) ? parseInt(body.year, 10) : ""
  body.month = parseInt(body.month, 10) ? parseInt(body.month, 10) : ""
  body.date = parseInt(body.date, 10) ? parseInt(body.date, 10) : ""
  body.timestamp = body.timestamp.split(":")
  if (body.timestamp[0] != "") {
    body.timestamp = [Number(body.timestamp[0]), Number(body.timestamp[1])].join(":")
  }
  function gen_query(name, section, grade, year, month, date, timestamp) {
    let query = "SELECT * FROM late_entry "
    let params = { "name": name, "section": section, "grade": grade, "year": year, "month": month, "date": date, "timestamp": timestamp }
    let query_string = []
    for (let i = 0; i < Object.keys(params).length; i++) {
      if (params[Object.keys(params)[i]] != "") {
        if (Object.keys(params)[i] == "name") {
          query_string.push(`${Object.keys(params)[i]} LIKE '%${params[Object.keys(params)[i]]}%'`)
        }
        else {
          query_string.push(`${Object.keys(params)[i]} = '${params[Object.keys(params)[i]]}'`)
        }
      }
    }
    if(query_string[0] == undefined){
      return query
    }
    else{
      return query + " WHERE "+query_string.join(" AND ")
    }
    
  }

  if (body.class != "") {
    let obj = {}
    let query = gen_query(body.name.toUpperCase(), body.section.toUpperCase(), body.class, body.year, body.month, body.date, body.timestamp)
    db.all(query, (error, row) => {
      let data = row
      for (let i = 0; i < data.length; i++) {
        if (obj[data[i].name + "," + data[i].section + "," + data[i].grade] == undefined) {
          obj[data[i].name + "," + data[i].section + "," + data[i].grade] = []
          obj[data[i].name + "," + data[i].section + "," + data[i].grade].push([[data[i].date, data[i].month, data[i].year].join("-"), data[i].timestamp].join("::"))
        }
        else {
          obj[data[i].name + "," + data[i].section + "," + data[i].grade].push([[data[i].date, data[i].month, data[i].year].join("-"), data[i].timestamp].join("::"))
        }
      }
      for (let j = 0; j < Object.keys(obj).length; j++) {
        let key = Object.keys(obj)[j].split(",")
        file += `<tr>
            <td class="text-left">${key[0]}</td>
            <td class="text-left">${key[1]}</td>
            <td class="text-left">${key[2]}</td>
            <td class="text-left">${obj[Object.keys(obj)[j]].join(" || ")}</td>
            <td class="text-left">${obj[Object.keys(obj)[j]].length}</td>
            </tr>`
      }
      file += '</tbody></table>'
      res.send(
        file
      )
    });
  }
  else if (body.range != "") {
    let range = body.range
    let classes = range.split("-")
    classes[0] = Number(classes[0])
    classes[1] = Number(classes[1])
    let obj = {}
    let table_to_add = ""
    let i = classes[0];
    while (i <= classes[1]) {
      async function query() {
        return new Promise(function (resolve, reject) {
          let query = gen_query(body.name.toUpperCase(), body.section.toUpperCase(), i, body.year, body.month, body.date, body.timestamp)
          db.all(query, (error, row) => {
            let data = row
            for (let k = 0; k < data.length; k++) {
              if (obj[data[k].name + "," + data[k].section + "," + data[k].grade] == undefined) {
                obj[data[k].name + "," + data[k].section + "," + data[k].grade] = []
                obj[data[k].name + "," + data[k].section + "," + data[k].grade].push([[data[k].date, data[k].month, data[k].year].join("-"), data[k].timestamp].join("::"))
              }
              else {
                obj[data[k].name + "," + data[k].section + "," + data[k].grade].push([[data[k].date, data[k].month, data[k].year].join("-"), data[k].timestamp].join("::"))
              }
            }
            if ((i - 1 == classes[1])) {

              if (Object.keys(obj)[0] == undefined) {
                res.send(file);
                return
              }
              for (let j = 0; j < Object.keys(obj).length; j++) {
                let key = Object.keys(obj)[j].split(",")
                table_to_add = table_to_add + `<tr>
            <td class="text-left">${key[0]}</td>
            <td class="text-left">${key[1]}</td>
            <td class="text-left">${key[2]}</td>
            <td class="text-left">${obj[Object.keys(obj)[j]].join(" || ")}</td>
            <td class="text-left">${obj[Object.keys(obj)[j]].length}</td>
            </tr>`
                if ((Object.keys(obj)[j] == Object.keys(obj).slice(-1)[0])) {
                  res.send(
                    file + table_to_add
                  )
                }
              }
            }
            resolve();
          });
        })
      }
      await query().then(i++)
    }
  }
  else {
    let obj = {}
    let query = gen_query(body.name.toUpperCase(), body.section.toUpperCase(), body.class, body.year, body.month, body.date, body.timestamp)
    db.all(query, (error, row) => {
      let data = row
      for (let i = 0; i < data.length; i++) {
        if (obj[data[i].name + "," + data[i].section + "," + data[i].grade] == undefined) {
          obj[data[i].name + "," + data[i].section + "," + data[i].grade] = []
          obj[data[i].name + "," + data[i].section + "," + data[i].grade].push([[data[i].date, data[i].month, data[i].year].join("-"), data[i].timestamp].join("::"))
        }
        else {
          obj[data[i].name + "," + data[i].section + "," + data[i].grade].push([[data[i].date, data[i].month, data[i].year].join("-"), data[i].timestamp].join("::"))
        }
      }
      for (let j = 0; j < Object.keys(obj).length; j++) {
        let key = Object.keys(obj)[j].split(",")
        file += `<tr>
            <td class="text-left">${key[0]}</td>
            <td class="text-left">${key[1]}</td>
            <td class="text-left">${key[2]}</td>
            <td class="text-left">${obj[Object.keys(obj)[j]].join(" || ")}</td>
            <td class="text-left">${obj[Object.keys(obj)[j]].length}</td>
            </tr>`
      }
      file += '</tbody></table>'
      res.send(
        file
      )
    });
  }
})
app.get('/filter_details', async (req, res) => {
  let path_to_file = path.resolve(__dirname, "filter_detail.html")
  res.sendFile(path_to_file)
})
app.post('/filter', async (req, res) => {
  //console.log(req.body)
  if (req.body.password == "Deens@123") {
    res.redirect(`/details?data=${JSON.stringify(req.body)}`)
  } else {
    res.send("Wrong Password")
  }
})

app.listen(PORT, (error) => {
  if (!error)
    console.log("Server is Successfully Running, and App is listening on port " + PORT)
  else
    console.log("Error occurred, server can't start", error);
}
)