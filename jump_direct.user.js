// ==UserScript==
// @name        jump_direct
// @namespace   https://github.com/jonetwelve/userjs
// @description	删除重定向，直接跳转到搜索结果
// @include     https://www.so.com/*
// @include     http://www.so.com/*
// @version     1
// @run-at      document-end
// @grant       none
// ==/UserScript==


function main(){
    //$('#side').html('');//右边ad删除
    if(document.getElementById('cardWrap')){
        document.getElementById('cardWrap').remove();
    }
    if(document.getElementById('side')){
        document.getElementById('side').remove();
    }
    if(document.getElementById('m-spread-left')){
        document.getElementById('m-spread-left');
    }
    if (document.getElementById('main')) {
        document.getElementById('main').style.width = '98%';
    }

    var searchResult = document.getElementsByClassName('res-list');
    if (searchResult) {
        for (var i = searchResult.length - 1; i >= 0; i--) {
            var all_a = searchResult[i].getElementsByTagName('a');
            if (all_a) {
                for (var j = all_a.length - 1; j >= 0; j--) {
                    var url = all_a[j].href.toString();
                    var link = decodeURIComponent(url).match(/url=(.+?)&q=/g)[0];
                    var href = link.substr(4, link.length - 7);
                    all_a[j].href = href;
                }
            }
        }
    }
}
window.setTimeout(main,1000);
