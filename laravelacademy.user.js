// ==UserScript==
// @name           laravelacademy
// @namespace      tps://github.com/jonetwelve/userjs
// @description    laravelacademy文档美化
// @include        https://laravelacademy.org/*
// @include        http://laravelacademy.org/*
// @run-at         document-end
// ==/UserScript==

// Add jQuery
var GM_JQ = document.createElement('script');
GM_JQ.src = 'http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js';
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
    $('#main > article > .entry-content > ul').last().hide();
    $('#quickstart-tutorial').hide();

    $('#main > article > .entry-content > h3').each(function(){
        $(this).next('ul').prepend(this);
    });
    var ul = $('#main > article > .entry-content > ul').eq(6);

    $('#main > article > .entry-content').prepend(ul);

}
