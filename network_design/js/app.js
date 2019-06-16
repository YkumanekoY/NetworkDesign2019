
//緯度 経度 配列
var latArray = new Array();
var lonArray = new Array();

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

            //高度限界まで風船を飛ばすぜ　altは高度
            var speed = 4.0;
            latArray.push(lat0);
            lonArray.push(lon0);
            var count = 0;
            for (let alt = 2.0; alt < 11000; alt += speed * 10) {
                $.ajax({
                    type: 'GET',
                    url: "https://api.openweathermap.org/data/2.5/weather",
                    dataType: "jsonp",
                    data: "lat=" + latArray[count] + "&lon=" + lonArray[count] + "&appid=" + APIKEY,
                    //天気データ呼び出し成功時の挙動
                    success: function(data) {
                        latArray.push(
                            vincenty(latArray[count], lonArray[count], data.wind.deg, data.wind.speed)[0]
                        );
                        lonArray.push(
                            vincenty(latArray[count], lonArray[count], data.wind.deg, data.wind.speed)[1]
                        );
                    },
                    error: function() {
                        alert("ファイルを読み込めませんでした。");
                        break;
                    },
                    complete: function() {}
                });
                console.log("緯度: " + latlonArray[count][0] + ", 経度:" + latlonArray[count][1]);
                count++;
            }
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
}());

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

//5秒ごとに位置情報を更新
//setTimeout("targetPos(lat, lon, distance, degree)", 3000);


//---ここから風船の目的地計算用--------------------------
var check;
var Radius_long = 6378137.0;
var Henpei = 1 / 298.257222101;
var Radius_short = Radius_long * (1 - Henpei); // 6356752.314 

function doRad(a) {
    return a / 180 * Math.PI;
}

function radDo(a) {
    return a * 180 / Math.PI;
}

function xy(x, y) {
    return Math.pow(x, y);
}

function vincenty(lat1, lng1, alpha12, length) {
    lat1 = doRad(lat1);
    lng1 = doRad(lng1);
    alpha12 = doRad(alpha12);

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
}
