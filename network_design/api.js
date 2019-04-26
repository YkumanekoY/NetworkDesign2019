// ---
 
$.ajax({
  url: "http://api.openweathermap.org/data/2.5/weather?q=Tokyo,jp&appid=f9afb324cd9adca6010dcb01b05fe097",
  cache: false,
  success:function (weatherdata){
// img insert
var img = document.createElement('img');
img.src = "http://openweathermap.org/img/w/"+weatherdata.weather[0].icon+".png";
img.alt = weatherdata.weather[0].main;
document.getElementById('icon').appendChild(img);
 
// ＝摂氏＋＝K
document.getElementById('temp').innerHTML = Math.floor(weatherdata.main.temp - 273.15);
 
// 位置
document.getElementById('here').innerHTML = weatherdata.name;
 
}
});
 
 
// 現在時刻
setInterval(function(){
var date = new Date();
var time ;
  time = date.getFullYear()+'.';
  time += (date.getMonth()+1)+'.';
  time += date.getHours()+'.';
  time += date.getMinutes()+'.';
  time += date.getSeconds(); 
 document.getElementById('currenttime').innerHTML = time;
},1000);
