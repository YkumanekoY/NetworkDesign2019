//var body = document.getElementsByTagName('body')[100];

/*function fadeOut() {
    body.classList.add('.bodyfadeout');
}

function linkUrl() {
    location.href = './html/map.html/'
}
var bt1 = document.getElementById('btn1');
bt1.addEventListener('click', function() {
    fadeOut();
    setTimeout(linkUrl, 1500);
});*/

/* $('button').click(function() {
     console.log('クリックされました！');
 });*/

/*$(window).on('load', function(){
  $('body').removeClass('fadeout');
});

$(function() {
  // ハッシュリンク(#)と別ウィンドウでページを開く場合はスルー
  $('a:not([href^="../index.html"]):not([_blank])').on('click', function(e){
    e.preventDefault(); // ナビゲートをキャンセル
    url = $(this).attr('href'); // 遷移先のURLを取得
    if (url !== './html/map.html') {
      $('body').addClass('fadeout');  // bodyに class="fadeout"を挿入
      setTimeout(function(){
        window.location = url;  // 0.8秒後に取得したURLに遷移
      }, 800);
    }
    return false;
  });
});*/

$('#btn1').click(function(){
  console.log("fo");
  $('#bodyfadeout').fadeOut("slow");
});

/*$('#btn1').click(function(){
$('#bodyfadein').hide().fadeIn("slow");
console.log("fi");
});*/


/*$('h1').fadeIn(3000, function() {

  console.log('フェードインされました！');

});*/