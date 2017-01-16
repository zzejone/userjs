// ==UserScript==
// @name        pocket_jump_direct
// @namespace   https://github.com/jonetwelve/userjs
// @description	删除重定向，直接跳转到搜索结果
// @include     https://getpocket.com/*
// @version     1
// @run-at      document-end
// @grant       none
// ==/UserScript==


function main(){
    var all_a = document.getElementsByClassName('original_url');
    if (all_a) {
        for (var i = all_a.length - 1; i >= 0; i--) {
          var url = all_a[i].href.toString();
          var link = decodeURIComponent(url).match(/url=(.+?)&formCheck=/g)[0];
          var href = link.substr(4, link.length - 15);
          all_a[i].href = href;
        }
    }
}
window.setTimeout(main,1000);
