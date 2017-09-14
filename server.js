var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var json = JSON.parse(fs.readFileSync('properties.json', 'utf8'));

var table = 'db/db.sqlite3';

var twitter = require('twitter');
client = new twitter({
    access_token_key: json.key.access_token_key,
    access_token_secret: json.key.access_token_secret,
    consumer_key: json.key.consumer_key,
    consumer_secret: json.key.consumer_secret
})

var WebSocketServer = require('ws').Server
    , http = require('http')
    , express = require('express')
    , app = express();

app.use(express.static(__dirname + '/'));
var server = http.createServer(app);

server.listen(json.serverWebSocketPort);
var wss = new WebSocketServer({ server: server });

var connections = [];

wss.on('connection', function (ws) {

    console.log("connection!");

    var db = new sqlite3.Database(table);
    db.all("SELECt * FROM tweet ORDER BY date desc LIMIT 9", function (err, rows) {
        rows = rows.reverse();
        rows.forEach(function (row) {
            //console.log(row.timestamp);
            ///console.log(row.name);
            var hash = {};
            hash.profile = row.profile_url;
            hash.user = row.user;
            hash.text = row.text;
            hash.date = row.date;
            broadcast(hash);
        }, this);
    })
    db.close();

    connections.push(ws);

    ws.on('close', function () {
        connections = connections.filter(function (conn, i) {
            return (conn === ws) ? false : true;
        });
    });

    ws.on('message', function (message) {
        console.log('message:', message);
        broadcast(JSON.stringify(message));
    });
});

function broadcast(message) {
    connections.forEach(function (con, i) {
        con.send(JSON.stringify(message));
    });
};

client.stream('user',
    //// Stream API ////
    function (stream) {
        stream.on('data', function (tweet) {
            text = JSON.stringify(tweet);
            tweet = JSON.parse(text);
            if (tweet['user']['followers_count'] > 200000) {
                console.log(tweet['user']['screen_name']);
                var hash = {};
                var unixtime = Date.parse(tweet['created_at']);
                var date = new Date(unixtime);
                hash.date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                hash.profile = tweet['user']['profile_image_url'];
                hash.user = tweet['user']['screen_name'];
                hash.text = tweet['text'];

                var db = new sqlite3.Database(table);
                db.run("INSERT INTO tweet (date, user, text, profile_url) VALUES (?, ?, ?, ?)",
                    hash.date, hash.user, hash.text, hash.profile);
                db.close();

                if (tweet.entities.media !== undefined) {
                    hash.image = tweet.entities.media[0].media_url;
                }
                broadcast(hash);
            }
        });

        stream.on('error', function (error) {
            console.log(error);
        });
    }
);