//天気情報---------------------------------------------------------------------------
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
            console.log("koko!");

            const lat0 = positionData.latitude;
            const lon0 = positionData.longitude;

            console.log(lat0 + ", " + lon0);

            $('.location').text('現在の位置（' + Math.floor(lat0 * 100) / 100 + ',' + Math.floor(lon0 * 100) / 100 + ')');

            //現在の天気データを呼び出し
            // $.ajax({
            //     url: "https://api.openweathermap.org/data/2.5/weather",
            //     dataType: "jsonp",
            //     data: "lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY,
            //     //天気データ呼び出し成功時の挙動
            //     success: function(data) {
            //         //風速
            //         $('.windSpeed').text(data.wind.speed);
            //         //風向きについての処理
            //         $('.windDeg').text(data.wind.deg + "°(" + getAzimuth(data.wind.deg) + ")");
            //     }
            // });


            //高度限界まで風船を飛ばすぜ
            var speed = 4.0;
            let lat;
            let lon;
            for (let alt = 2.0; alt < 11000; alt += speed * 10) {
                if (alt = 2.0) {
                    lat = lat0;
                    lon = lon0;
                } else {
                    $.ajax({
                        type: 'GET',
                        url: "https://api.openweathermap.org/data/2.5/weather",
                        dataType: "jsonp",
                        data: "lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY,
                        //天気データ呼び出し成功時の挙動
                        success: function(data) {
                            //console.log("緯度: " + lat + " ,緯度: " + lon + " ,高度: " + alt);
                            targetPos(lat, lon, data.wind.deg, data.wind.speed);
                        },
                        error: function() {
                            alert("ファイルを読み込めませんでした。");
                        },
                        complete: function() {}
                    });
                }
            }
        }

        //現在位置の取得に失敗した場合
        function error(error) {
            alert("位置情報が取得できなかったため、東京から風船を飛ばします");
            $('.location').text('東京');

            TokyoWeather();
        }
        //現在位置がそもそも取得できない場合
    } else {
        alert("位置情報が取得できなかったため、東京から風船を飛ばします");
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

//---------------------------------------------------------------------------

//角度を方角に変換
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

//5秒ごとに位置情報を更新
//setTimeout("targetPos(lat, lon, distance, degree)", 3000);

//風船の目的地
function targetPos(lat1, lon1, rotation, distance) {
    console.log("緯度：" + lat1 + "経度：" + lon1);
    // 緯度経度をラジアンに変換
    let radLat1 = lat1 * Math.PI / 180; // 緯度１
    let radLon1 = lon1 * Math.PI / 180; // 経度１
    //$r = 6378137.0; // 赤道半径
    console.log("緯度ラジアン：" + radLat1 + "経度ラジアン：" + radLon1);

    r = distance;
    radLat2 = radLat1 + r * Math.cos(rotation);
    radLon2 = radLon1 + r * Math.sin(rotation);
    console.log("緯度ラジアン2：" + radLat2 + "経度ラジアン2：" + radLon2);

    lat = radLat2 * 180 / Math.PI;
    lon = radLon2 * 180 / Math.PI;

    if (lat > 90) 180 - lat;
    else if (lat < -90) - (180 + lat);

    if (lon > 180) 360 - lon;
    else if (lon < 180) - (lat - 360);

    console.log("緯度２：" + lat + "経度２：" + lon);

}