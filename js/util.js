function decorateText(str) {
    str = addLink(str);
    return addHashTag(str);
}

function addLink(str) {
    var regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g;
    var regexp_makeLink = function (all, url, h, href) {
        return '<a href="h' + href + '" target="_blank">' + url + '</a>';
    }
    return str.replace(regexp_url, regexp_makeLink);
}

function addHashTag(str) {
    var pattern = /(#[a-zA-Z0-9‚Ÿ-‚ñƒ@-ƒ–ˆŸ-ê¤+.\-_@:/~?%&;=+#',()*!]+)/g;
    var base = "https://twitter.com/hashtag/";
    var bottom = "?f=tweets&vertical=default&src=hash";

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