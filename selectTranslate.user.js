// ==UserScript==
// @name        select translate
// @namespace   https://github.com/jonetwelve/userjs
// @description 划词翻译
// @include     *
// @version     1
// @grant       GM_xmlhttpRequest
// ==/UserScript==

function getSelect() {
  if (window.getSelection) {
    return window.getSelection();
  } else {
    return document.selection.createRange().text;
  }
}
function BSkeyDown(e) {
  if (84 == e.keyCode) {
    var word = getSelect();
    var yurl = 'http://fanyi.youdao.com/openapi.do?keyfrom=selectTranslate&key=509196210&type=data&doctype=json&version=1.1&q=' + word;
    GM_xmlhttpRequest({
      method: 'GET',
      url: yurl,
      onload: function(response){
        obj = JSON.parse(response.response);
        content = obj.basic.explains;
        showTranslate(content, word);
      }
    });
  }
}

function showTranslate(content, title){
  var div = document.createElement('div');
  div.id = '_translate';
  div.setAttribute('style','position:fixed;top:5px;right:5px;border:2px solid blue;padding:0 10px 10px;background:grey;color:white;z-index:9999;');
  
  var inner = '<div style="background:blue;color:black;padding:6px 10px;margin:0 -10px;border-bottom:1px solid white;">'+title+'</div>\
  <ol style="padding-left:15px;margin:10px 2px;font-size:15px;">';
  for (var i = content.length - 1; i >= 0; i--) {
    inner += '<li>'+content[i]+'</li>';
  }
  inner += '</ol></div>';

  div.innerHTML = inner;
  document.body.appendChild(div);
  
  setTimeout(function(){
    document.getElementById('_translate').remove();
  },10000);
}
document.onkeydown = BSkeyDown;