// ==UserScript==
// @name        Darker
// @namespace   https://github.com/jonetwelve/userjs
// @description 网页变为暗色系
// @include     http://*
// @include     https://*
// @version     1
// @grant       none
// ==/UserScript==

// ============= Config ==================//

var bgColor = '#3f3f3f';
var txtColor = '#8dffa8';
var linkColor = '#ff8a00';

var intevelSites = ['phpmyadmin'];

// ============ End of config ===========//


function changeBg(){
  var main = document.getElementsByTagName("body");
  main[0].style.background = bgColor;
  main[0].style.color = txtColor;
  
  var allTags = document.getElementsByTagName("*");
  var allTagsNum = allTags.length;
  for(var i= 0;i<allTagsNum;i++){
    allTags[i].style.background = bgColor;
    allTags[i].style.textShadow = 'none';
    allTags[i].style.color = txtColor;
  }
}

function changeLink(){
  var links = document.getElementsByTagName("a");
  var linkNum = links.length;
  for(var i = 0; i < linkNum; i++){
    links[i].style.color = linkColor;
  }
}

function main(){
  changeBg();
  changeLink();
}
main();

var leng = intevelSites.length;
for(var i = 0; i < leng; i++){
  if(location.href.indexOf(intevelSites[i]) != -1){
    setInterval(main, 1000);
  }
}
