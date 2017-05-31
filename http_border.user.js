// ==UserScript==
// @name        http border
// @namespace   https://github.com/jonetwelve/userjs
// @description 非安全链接显示边框
// @include     *
// @version     1
// ==/UserScript==

if (document.URL.substr(0,5) != 'https') {
    console.log(document.URL);
    document.getElementByTagName('body').style.borderStyle='dotted';
}
