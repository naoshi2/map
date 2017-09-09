var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/db.sqlite3');

db.run("INSERT INTO messages (content) VALUES (?)", "aaa");
db.close();