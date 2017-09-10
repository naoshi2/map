var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/db.sqlite3');

db.all("SELECt * FROM tweet ORDER BY timestamp desc LIMIT 3", function (err, rows) {
    rows.forEach(function (row) {
        console.log(row.timestamp);
        console.log(row.name);
        console.log(row.content);
        console.log("-------");
    }, this);
})

db.close();