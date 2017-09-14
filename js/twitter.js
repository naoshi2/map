var breaking = /^Breaking|#Breaking.*/i;
var justin = /^.*Just in.*/i;
var sokuho = /\u901F\u5831/i; // ‘¬•ñ

var tickerArray = [];
var WebSocketPort;
var serverIp;

$.getJSON("properties.json", function (json) {
    WebSocketPort = json.serverWebSocketPort;
    console.log(WebSocketPort);
    serverIp = json.serverIp;
    console.log(serverIp);
})

function updateTicker() {
    console.log('update ticker');

    while (tickerArray.length > 10) {
        tickerArray.shift();
    }

    console.log(tickerArray);

    $('.ticker').empty();
    $('.ticker').append('<ul>');

    tickerArray.forEach(function (val, index, ar) {
        //console.log(val.text);
        var str = "<li>" + val.date + "<br> @" + val.user + " " + val.text + " " + "</li>";
        $('.ticker ul').prepend(str);
    })

    $('ul').append('</ul>');

    var $setElm = $('.ticker');
    var effectSpeed = 1000;
    var switchDelay = 6000;
    var easing = 'swing';

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

        var liCont = $targetLi.length;
        $setList.css({ left: (ulWidth), display: 'block', opacity: '0', zIndex: '98' }).stop().animate({ left: '0', opacity: '1' }, effectSpeed, easing).addClass('showlist');
        if (liCont > 1) {
            setInterval(function () {
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

        /*
        if (tickerArray.length > 10) {
            console.log("shift");
            tickerArray.shift();
        }
        */

        // image
        if (tweet.image !== undefined) {
            $('.twitter').prepend('<div id="attached_image"><img /></div>');

            var image_url = tweet.image;
            var imgPreloader = new Image();
            imgPreloader.onload = function () {
                $('#attached_image').children('img').attr({ 'src': image_url, 'height': 256 });
            }
            imgPreloader.src = image_url;
        }

        // Tweet
        if (breaking.test(tweet.text) || justin.test(tweet.text) || sokuho.test(tweet.text)) {
            console.log("Breaking!!");
            $('.twitter').prepend('<p id="breaking_text">' + tweet.text + '</p>');
        }
        else {
            $('.twitter').prepend('<p id="text">' + tweet.text + '</p>');
        }

        // Screen name
        $('.twitter').prepend('<p id="user">' + tweet.date + " @" + tweet.user + '</p>');

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