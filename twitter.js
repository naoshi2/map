var breaking = /^.Breaking.*/i;
var justin = /^Just in.*/i;
var sokuho = /^����.*/i;

function refreshTicker() {
    console.log('aaa');
    var d = new Date();
    var minsec = d.getMinutes() + " " + d.getSeconds();

    $('.ticker').empty();
    $('.ticker').append('<ul>');

    for (var i = 0; i < 5; i++) {
        var str = "<li>" + i + " " + minsec + "</li>";
        $('.ticker ul').prepend(str);
        //console.log('<li> ' + i + ' ' + minsec + '</li> ');
    }
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
    setInterval("refreshTicker()", 30000);

    socket = new WebSocket("ws://127.0.0.1:8081");
    socket.onmessage = function (event) {
        tweet = JSON.parse(event.data);

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
            console.log(tweet.text);
            $('.twitter').prepend('<p id="breaking_text">' + tweet.text + '</p>');
        }
        else {
            $('.twitter').prepend('<p id="text">' + tweet.text + '</p>');
        }

        // Screen name
        unixtime = Date.parse(tweet.date);
        var date = new Date(unixtime);
        localDate = date.toLocaleDateString();
        localtime = date.toLocaleTimeString();
        $('.twitter').prepend('<p id="user">' + localDate + " " + localtime + " @" + tweet.user + '</p>');

        // Profile image
        $('.twitter').prepend('<div id="profile"><img /></div>');
        var imgPreloader = new Image();
        imgPreloader.onload = function () {
            console.log(tweet.profile);
        }
        imgPreloader.src = tweet.profile;
        $('#profile').children('img').attr({ 'src': tweet.profile, 'height': 50, 'align': 'left' });
    }
}