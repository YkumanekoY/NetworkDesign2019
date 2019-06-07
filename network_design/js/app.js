$(document).ready(function() {
    'use strict'

    const APIKEY = "f9afb324cd9adca6010dcb01b05fe097";

    //翌日9時のデータの場所を割り出す
    const date = new Date();
    const nowHour = date.getHours();
    // const whichTomorrowWeatherData = Math.floor((24 - nowHour + 9) / 3);
    // const whichDayAfterTomorrowWeatherData = Math.floor((24 - nowHour + 33) / 3);

    //現在位置の取得ができるかどうか
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);

        // 現在位置の取得に成功した場合
        function success(position) {
            const positionData = position.coords;

            //緯度経度の取得と表示
            let lat = positionData.latitude;
            let lon = positionData.longitude;


            $('.location').text('現在の位置（' + Math.floor(lat * 100) / 100 + ',' + Math.floor(lon * 100) / 100 + ')');
            //現在の天気データを呼び出し
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/weather",
                dataType: "jsonp",
                data: "lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY,
                //天気データ呼び出し成功時の挙動
                success: function(data) {
                    //風速
                    $('.windSpeed').text(data.wind.speed);
                    //風向きについての処理
                    $('.windDeg').text(data.wind.deg + "°(" + getAzimuth(data.wind.deg) + ")");
                }
            });


            //高度限界まで風船を飛ばすぜ
            var speed = 4.0;
            for (let alt = 2.0; alt < 11000; alt += speed * 10) {
                $.ajax({
                    type: 'GET',
                    url: "https://api.openweathermap.org/data/2.5/weather",
                    dataType: "jsonp",
                    data: "lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY,
                    //天気データ呼び出し成功時の挙動
                    success: function(data) {
                        console.log("緯度: " + lat + " ,緯度: " + lon + " ,高度: " + alt);
                        lat = vincenty(lat, lon, data.wind.deg, data.wind.speed)[0];
                        lon = vincenty(lat, lon, data.wind.deg, data.wind.speed)[1];
                    },
                    error: function() {
                        alert("ファイルを読み込めませんでした。");
                    },
                    complete: function() {}
                });
            }
        }

        //現在位置の取得に失敗した場合
        function error(error) {
            alert("位置情報が取得できなかったため、東京からの風向きでシミュレーションします");
            $('.location').text('東京');

            TokyoWeather();

        }
        //現在位置がそもそも取得できない場合
    } else {
        alert("位置情報が取得できなかったため、東京からの風向きでシミュレーションします");
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
                //風速
                $('.windSpeed').text(data.wind.speed);
                //風向きについての処理
                $('.windDeg').text(data.wind.deg + "°(" + getAzimuth(data.wind.deg) + ")");
            }
        });
    }
}());

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
        count++;
    }
    return dname[count];
}

function openYahoo() {
    window.open("http://www.yahoo.co.jp/", "yahoo");
}

setTimeout("openYahoo()", 3000);


//風船の目的地


//球面で出そうとした跡
/*
var check;
var Radius_long = 6378137.0;
var Henpei = 1 / 298.257222101;
var Radius_short = Radius_long * (1 - Henpei); // 6356752.314 

function radDo(a) {
    return a * 180 / Math.PI;
}

function xy(x, y) {
    return Math.pow(x, y);
}

function vincenty(lat1, lng1, alpha12, length) {
    var U1 = Math.atan((1 - Henpei) * Math.tan(lat1));
    var sigma1 = Math.atan(Math.tan(U1) / Math.cos(alpha12));
    var alpha = Math.asin(Math.cos(U1) * Math.sin(alpha12));
    var u2 = xy(Math.cos(alpha), 2) * (xy(Radius_long, 2) - xy(Radius_short, 2)) / xy(Radius_short, 2);
    var A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
    var B = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
    var sigma = length / Radius_short / A;
    do {
        var sigma0 = sigma;
        var dm2 = 2 * sigma1 + sigma;
        var x = Math.cos(sigma) * (-1 + 2 * xy(Math.cos(dm2), 2)) - B / 6 * Math.cos(dm2) * (-3 + 4 * xy(Math.sin(dm2), 2)) * (-3 + 4 * xy(Math.cos(dm2), 2));
        var dSigma = B * Math.sin(sigma) * (Math.cos(dm2) + B / 4 * x);
        sigma = length / Radius_short / A + dSigma;
    } while (Math.abs(sigma0 - sigma) > 1e-9);

    var x = Math.sin(U1) * Math.cos(sigma) + Math.cos(U1) * Math.sin(sigma) * Math.cos(alpha12)
    var y = (1 - Henpei) * xy(xy(Math.sin(alpha), 2) + xy(Math.sin(U1) * Math.sin(sigma) - Math.cos(U1) * Math.cos(sigma) * Math.cos(alpha12), 2), 1 / 2);
    var lamda = Math.sin(sigma) * Math.sin(alpha12) / (Math.cos(U1) * Math.cos(sigma) - Math.sin(U1) * Math.sin(sigma) * Math.cos(alpha12));
    lamda = Math.atan(lamda);
    var C = (Henpei / 16) * xy(Math.cos(alpha), 2) * (4 + Henpei * (4 - 3 * xy(Math.cos(alpha), 2)));
    var z = Math.cos(dm2) + C * Math.cos(sigma) * (-1 + 2 * xy(Math.cos(dm2), 2));
    var omega = lamda - (1 - C) * Henpei * Math.sin(alpha) * (sigma + C * Math.sin(sigma) * z);
    return [radDo(Math.atan(x / y)), radDo(lng1 + omega)];
}*/