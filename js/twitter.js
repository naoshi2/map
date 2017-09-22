const breaking = /^Breaking|#Breaking.*/i;
const justin = /^.*Just in.*/i;
const sokuho = /\u901F\u5831/i; // ‘¬•ñ

var tickerArray = [];
var WebSocketPort;
var serverIp;
var tickerIntervalId;

$.getJSON("properties.json", function (json) {
    WebSocketPort = json.serverWebSocketPort;
    serverIp = json.serverIp;
    console.log("port " + WebSocketPort + ", IP " + serverIp);
})

function updateTicker() {
    console.log('update ticker');
    if (tickerIntervalId !== undefined) {
        clearInterval(tickerIntervalId);
    }

    while (tickerArray.length > 10) {
        tickerArray.shift();
    }

    console.log(tickerArray);

    $('.ticker').empty();
    $('.ticker').append('<ul></ul>');

    tickerArray.forEach(function (val, index, ar) {
        text = decorateText(val.text);
        user = addUserLink(val.user);
        date = getLocalTime(val.date);
        var str = "<li>" + date + " " + user + " <br>" + text + " " + "</li>";
        $('.ticker ul').prepend(str);
    })

    var $setElm = $('.ticker');
    const effectSpeed = 1000;
    const switchDelay = 6000;
    const easing = 'swing';

    $setElm.each(function () {
        var effectFilter = $(this).attr('rel');

        var $targetObj = $(this);
        var $targetUl = $targetObj.children('ul');
        var $targetLi = $targetObj.find('li');
        var $setList = $targetObj.find('li:first');

        var ulWidth = $targetUl.width();
        var listHeight = $targetLi.height();
        $targetObj.css({ height: (listHeight) });
        $targetLi.css({ top: '0', left: '0', position: 'absolute' });

        $setList.css({ left: (ulWidth), display: 'block', opacity: '0', zIndex: '98' }).stop().animate({ left: '0', opacity: '1' }, effectSpeed, easing).addClass('showlist');
        if ($targetLi.length > 1) {
            tickerIntervalId = setInterval(function () {
                var $activeShow = $targetObj.find('.showlist');
                $activeShow.animate({ left: (-(ulWidth)), opacity: '0' }, effectSpeed, easing).next().css({ left: (ulWidth), display: 'block', opacity: '0', zIndex: '99' }).animate({ left: '0', opacity: '1' }, effectSpeed, easing).addClass('showlist').end().appendTo($targetUl).css({ zIndex: '98' }).removeClass('showlist');
            }, switchDelay);
        }
    });
}

window.onload = function () {
    var isFirstCall = true;
    setTimeout("updateTicker()", 3000);
    socket = new WebSocket("ws://" + serverIp + ":" + WebSocketPort);

    socket.onmessage = function (event) {
        tweet = JSON.parse(event.data);

        console.log("push");
        tickerArray.push(tweet);

        if (isFirstCall) {
            setInterval("updateTicker()", 90000);
            isFirstCall = false;
        }

        // image
        if (tweet.image !== undefined) {
            $('.twitter').prepend('<div id="attached_image"><img /></div>');

            var image_url = tweet.image;
            var imgPreloader = new Image();
            imgPreloader.onload = function () {
                $('#attached_image').children('img').attr({ 'src': image_url, 'height': 200 });
            }
            imgPreloader.src = image_url;
        }

        // Tweet
        var text = tweet.text;
        text = decorateText(text);
        if (breaking.test(text) || justin.test(text) || sokuho.test(text)) {
            console.log("Breaking!!");
            $('.twitter').prepend('<p id="breaking_text">' + text + '</p>');
        }
        else {
            $('.twitter').prepend('<p id="text">' + text + '</p>');
        }

        // Screen name
        user = addUserLink(tweet.user, tweet.id);
        date = getLocalTime(tweet.date);
        $('.twitter').prepend('<p id="user">' + date + " " + user + '</p>');

        // Profile image
        $('.twitter').prepend('<div id="profile"><img /></div>');
        var imgPreloader = new Image();
        imgPreloader.onload = function () {
            //console.log(tweet.profile);
        }
        imgPreloader.src = tweet.profile;
        $('#profile').children('img').attr({ 'src': tweet.profile, 'height': 50, 'align': 'left' });
    }
}