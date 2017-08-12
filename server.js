var twitter = require('./twitter.js');
client = twitter.getClient();

var WebSocketServer = require('ws').Server
    , http = require('http')
    , express = require('express')
    , app = express();

app.use(express.static(__dirname + '/'));
var server = http.createServer(app);
server.listen(8081);
var wss = new WebSocketServer({server:server});
     
var connections = [];

wss.on('connection', function (ws) {
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
        con.send(message);
    });
};
 
client.stream('user',   
    function(stream){
    stream.on('data', function(tweet) {
      json = JSON.stringify(tweet);
      tweet = JSON.parse(json);
      if (tweet['user']['followers_count'] > 200000) {
          text = tweet.text + ' - @' +  tweet['user']['screen_name'];
          broadcast(text);
          console.log(text);
      }
    });

    stream.on('error', function(error) {
      console.log(error);
    });
});
