// ==UserScript==
// @name        Darker
// @namespace   https://github.com/jonetwelve/userjs
// @description 网页变为暗色系
// @include     http://*
// @include     https://*
// @version     1
// @grant       none
// ==/UserScript==

var targetColor = '#3f3f3f';
var txtColor = '#8dffa8';
var linkColor = '#ff8a00';

/* Wheat */
// var targetColor = '#E6D6B8'; // 90
// var targetColor = '#E3E1D1'; // 89

var Brightness_Threshold = 0.94; // a number between 0 and 1

// For websites updating their contents via ajax, NoBrighter can run in background and convert background color periodically.
var longRunSites = [
    'mail.google.com',
    'docs.google.com',
    'plus.google.com',
    'groups.google.com',

    'twitter.com',
    'github.com',

    'www.coursera.org',
    'class.coursera.org',

    'weibo.com',
    'www.weibo.com',
    'www.renren.com',

    'feedly.com',
    'reader.aol.com',
];

var $minHeight = 6;

// ========== End of config ========== //

function isTransparent(color) {
    return color === 'transparent' || color.replace(/ /g, '') === 'rgba(0,0,0,0)';
}

function changeBgcolor(elem) {
    if (elem.nodeType !== Node.ELEMENT_NODE) {
        return;
    }
    var bgcolor = window.getComputedStyle(elem, null).backgroundColor;
    if (bgcolor && !isTransparent(bgcolor) && elem.clientHeight >= $minHeight) {
        var arRGB = bgcolor.match(/\d+/g);
        var r = parseInt(arRGB[0], 10);
        var g = parseInt(arRGB[1], 10);
        var b = parseInt(arRGB[2], 10);

        // we adopt HSL's lightness definition, see http://en.wikipedia.org/wiki/HSL_and_HSV
        var brightness = (Math.max(r, g, b) + Math.min(r, g, b)) / 255 / 2;

        if (brightness > Brightness_Threshold) {
            elem.style.backgroundColor = targetColor;
            elem.style.color = txtColor;
        }
        return true;
    } else {
        return false;
    }
}

function changeTransparent(elem) {
    var bgcolor = window.getComputedStyle(elem, null).backgroundColor;
    if (!bgcolor || isTransparent(bgcolor)) {
        elem.style.backgroundColor = targetColor;
    }
}

var alltags = document.getElementsByTagName("*");

var bodyChanged = false;

function changeAll() {
    var len = alltags.length;
    for (var i = 0; i < len; i++) {
        var changed = changeBgcolor(alltags[i]);
        var tagName = alltags[i].tagName.toUpperCase();
        if (changed && (tagName === "BODY" || tagName === "HTML")) {
            bodyChanged = true;
        }
    }
}
changeAll();
function changeLink(){
  var links = document.getElementsByTagName("a");
  var linkNum = links.length;
  for(var i = 0; i < linkNum; i++){
    links[i].style.color = linkColor;
  }
}
changeLink();

if (window.top == window) {
    // change transparent only when in top frame
    if (!bodyChanged) {
        changeTransparent(document.body.parentNode);
    }
}

for (var i = 0; i < longRunSites.length; i++) {
    if (location.hostname === longRunSites[i]) {
        console.info('make NoBrighter runs forever...');
        setInterval(changeAll, 2000); // convert every 2s
        break;
    }
}