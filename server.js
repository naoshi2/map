var twitter = require('./twitter-client.js');
client = twitter.getClient();

var WebSocketServer = require('ws').Server
    , http = require('http')
    , express = require('express')
    , app = express();

app.use(express.static(__dirname + '/'));
var server = http.createServer(app);
server.listen(8081);
var wss = new WebSocketServer({ server: server });

var connections = [];

wss.on('connection', function (ws) {
    var params = { count: 100 };
    client.get('statuses/home_timeline', params, function (error, tweet, response) {
        if (!error) {
            tweet = tweet.reverse();
            tweet.forEach(function (val, index, ar) {
                if (tweet[index]['user']['followers_count'] > 100000) {
                    var hash = {};
                    hash.date = tweet[index]['created_at'];
                    hash.profile = tweet[index]['user']['profile_image_url'];
                    hash.user = tweet[index]['user']['screen_name'];
                    hash.text = tweet[index]['text'];
                    broadcast(hash);
                }
            });
        }
    });

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
    function (stream) {
        stream.on('data', function (tweet) {
            text = JSON.stringify(tweet);
            tweet = JSON.parse(text);
            if (tweet['user']['followers_count'] > 200000) {
                console.log(tweet['user']['screen_name']);

                var hash = {};
                hash.date = tweet['created_at'];
                hash.profile = tweet['user']['profile_image_url'];
                hash.user = tweet['user']['screen_name'];
                hash.text = tweet.text;
                if (tweet.entities.media !== undefined) {
                    hash.image = tweet.entities.media[0].media_url;
                }
                broadcast(hash);
            }
        });

        stream.on('error', function (error) {
            console.log(error);
        });
    });