// ==UserScript==
// @name        so_beautify
// @namespace   https://github.com/jonetwelve/userjs
// @description so.com搜索结果美化显示
// @include     https://www.so.com/*
// @include     http://www.so.com/*
// @version     1
// @run-at      document-end
// @grant       none
// ==/UserScript==


// Add jQuery
var GM_JQ = document.createElement('script');
GM_JQ.src = 'http://jquery.com/src/jquery-latest.js';
GM_JQ.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(GM_JQ);

// Check if jQuery's loaded
function GM_wait()
{
    if(typeof unsafeWindow.jQuery == 'undefined') { window.setTimeout(GM_wait,100); }
    else { $ = unsafeWindow.jQuery; letsJQuery(); }
}
GM_wait();


// *** put your code inside letsJQuery: 
function letsJQuery()
{
$(document).ready(function(){
    $('#side').html('');//右边ad删除
    window.setTimeout($('#cardWrap').remove(), 3000);//下面广告删除
    $('#m-spread-left').remove();
    $('#main').css({'width':'98%'});
    //open url directly
    $('#m-result .res-list').each(function(){
        $(this).find('.res-linkinfo').remove();
        $(this).find('img').remove();
        $(this).find('div').removeClass('res-rich');
        $(this).find('.cont').remove();
        var url = decodeURIComponent($(this).find('h3 a').eq(0).attr('href')).match(/url=(.+?)&q=/g)[0];
        var urlLeng = url.length;
        var href = url.substr(4, urlLeng - 7);
        $(this).find('h3 a').removeAttr('href');
        $(this).click(function(){
            window.open(href);
        });
    });
});
}
