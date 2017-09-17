function getLocalTime(str) {
    var date = new Date(str);
    var month = date.getMonth() + 1;

    if (month < 10) {
        month = "0" + month;
    }

    return date.getFullYear() + '-' +
        month + "-" +
        date.getDate() + " " +
        date.toLocaleTimeString("ja-JP", { hour12: false });
}

function decorateText(str) {
    str = addLink(str);
    return addHashTag(str);
}

function addUserLink(screen_name) {
    const twitter_base = "https://twitter.com/";
    return '<a href="' + twitter_base + screen_name +
        '" target="_blank"> @' + screen_name + '</a>'
}

function addLink(str) {
    const regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g;
    var regexp_makeLink = function (all, url, h, href) {
        return '<a href="h' + href + '" target="_blank">' + url + '</a>';
    }
    return str.replace(regexp_url, regexp_makeLink);
}

function addHashTag(str) {
    const pattern = /(#[a-zA-Z0-9‚Ÿ-‚ñƒ@-ƒ–ˆŸ-ê¤+.\-_@:/~?%&;=+#',()*!]+)/g;
    const base = "https://twitter.com/hashtag/";
    const bottom = "?f=tweets&vertical=default&src=hash";

    var list = str.match(pattern);

    // No hash tag
    if (!list) return str;

    for (var index in list) {
        var tag = list[index];              // #hoge
        var word = tag.replace('#', '');    // hoge

        var link = base + word + bottom;
        str = str.replace(tag, '<a href="' + link + '" target="_blank">' + tag + '</a>');
    }
    return str;
}