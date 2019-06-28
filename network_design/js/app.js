//緯度 経度 配列
var latArray = new Array();
var lonArray = new Array();
var lat = 0;
var lon = 0;

//天気情報---------------------------------------------------------------------------

$(document).ready(function() {
    'use strict'

    const APIKEY = "f9afb324cd9adca6010dcb01b05fe097";

    //今日のデータを取り出す
    const date = new Date();
    const nowHour = date.getHours();

    //現在位置の取得ができるかどうか
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);

        // 現在位置の取得に成功した場合
        function success(position) {
            const positionData = position.coords;

            //最初の位置の緯度経度取得
            const lat0 = positionData.latitude;
            const lon0 = positionData.longitude;

            //緯度経度の表示
            $('.location').text('現在の位置（' + Math.floor(lat0 * 100) / 100 + ',' + Math.floor(lon0 * 100) / 100 + ')');
            //現在の天気データ呼び出し
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/weather",
                dataType: "jsonp",
                data: "q=Tokyo,jp&appid=" + APIKEY,
                //天気データ呼び出し成功時の挙動
                success: function(data) {
                    if (data.weather[0].main === "Sunny" || data.weather[0].main === "Clear") {
                        $('body').css('background-image', 'url(Sunny.jpg)');
                        $('.dayWeather').text("晴れ");
                    } else if (data.weather[0].main === "Rain") {
                        $('body').css('background-image', 'url(Rain.jpg)');
                        $('.dayWeather').text("雨");
                    } else if (data.weather[0].main === "Clouds") {
                        $('body').css('background-image', 'url(Cloudy.jpg)');
                        $('.dayWeather').text("くもり");
                    } else if (data.weather[0].main === "Snow") {
                        $('body').css('background-image', 'url(Snowy.jpg)');
                        $('.dayWeather').text("雪");
                    }

                    //各データの表示
                    $('.nowTemp').text(Math.floor((data.main.temp - 273.15) * 10) / 10);
                    $('.dayWeatherIcon').attr('src', 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png ');
                }
            });
        }

        //現在位置の取得に失敗した場合
        function error(error) {
            alert("位置情報が取得できなかったため、東京の天気を表示します");
            $('.location').text('東京');

            TokyoWeather();

        }
        //現在位置がそもそも取得できない場合
    } else {
        alert("位置情報が取得できなかったため、東京の天気を表示します");
        $('.location').text('東京');

        TokyoWeather();
    }

    //東京の天気
    function TokyoWeather() {

        //現在の天気データ呼び出し
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather",
            dataType: "jsonp",
            data: "q=Tokyo,jp&appid=" + APIKEY,
            //天気データ呼び出し成功時の挙動
            success: function(data) {
                if (data.weather[0].main === "Sunny" || data.weather[0].main === "Clear") {
                    $('body').css('background-image', 'url(Sunny.jpg)');
                    $('.dayWeather').text("晴れ");
                } else if (data.weather[0].main === "Rain") {
                    $('body').css('background-image', 'url(Rain.jpg)');
                    $('.dayWeather').text("雨");
                } else if (data.weather[0].main === "Clouds") {
                    $('body').css('background-image', 'url(Cloudy.jpg)');
                    $('.dayWeather').text("くもり");
                } else if (data.weather[0].main === "Snow") {
                    $('body').css('background-image', 'url(Snowy.jpg)');
                    $('.dayWeather').text("雪");
                }

                //各データの表示
                $('.nowTemp').text(Math.floor((data.main.temp - 273.15) * 10) / 10);
                $('.dayWeatherIcon').attr('src', 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png ');
            }
        });
    }
});

//---------------------------------------------------------------------------

//角度を方角に変換
//今は使ってない？
function getAzimuth(degree) {
    var dname = [
        "北", "北北東", "北東", "東北東",
        "東", "東南東", "南東", "南南東",
        "南", "南南西", "南西", "西南西",
        "西", "西北西", "北西", "北北西", "北"
    ];
    var count = 0;
    for (var i = 11.25; i < (360 + 11.25); i += 22.5) {
        if (degree < i) {
            break
        }
        return dname[count];
    }
    return dname[count];
}
