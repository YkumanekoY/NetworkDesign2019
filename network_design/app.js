$(document).ready(function() {
    'use strict'

    const APIKEY = "f9afb324cd9adca6010dcb01b05fe097";

    //翌日9時のデータの場所を割り出す
    const date = new Date();
    const nowHour = date.getHours();
    const whichTomorrowWeatherData = Math.floor((24 - nowHour + 9) / 3);
    const whichDayAfterTomorrowWeatherData = Math.floor((24 - nowHour + 33) / 3);

    //現在位置の取得ができるかどうか
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);

        // 現在位置の取得に成功した場合
        function success(position) {
            const positionData = position.coords;

            //緯度経度の取得と表示
            const lat = positionData.latitude;
            const lon = positionData.longitude;
            $('.location').text('現在の位置（' + Math.floor(lat * 100) / 100 + ',' + Math.floor(lon * 100) / 100 + ')');


            //現在の天気データを呼び出し
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/weather",
                dataType: "jsonp",
                data: "lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY,
                //天気データ呼び出し成功時の挙動
                success: function(data) {
                    if (data.weather[0].main === "Clear") {
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
                    $('.windSpeed').text(data.wind.speed);
                    $('.windDeg').text(data.wind.deg);

                    //各データの表示
                    $('.nowTemp').text(Math.floor((data.main.temp - 273.15) * 10) / 10);
                    $('.dayWeatherIcon').attr('src', 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png ');
                }
            });

            //明日9時の天気データを呼び出し
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/forecast",
                dataType: "jsonp",
                data: "lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY,
                //天気データ呼び出し成功時の挙動
                success: function(data) {

                    //翌日9時の天気データ
                    const targetData1 = data.list[whichTomorrowWeatherData];
                    const targetData2 = data.list[whichDayAfterTomorrowWeatherData];

                    if (targetData1.weather[0].main === "Clear") {
                        $('.tomorrowWeather').text("晴れ");
                    } else if (targetData1.weather[0].main === "Rain") {
                        $('.tomorrowWeather').text("雨");
                    } else if (targetData1.weather[0].main === "Clouds") {
                        $('.tomorrowWeather').text("くもり");
                    } else if (targetData1.weather[0].main === "Snow") {
                        $('.tomorrowWeather').text("雪");
                    }

                    if (targetData2.weather[0].main === "Clear") {
                        $('.dayAfterTomorrowWeather').text("晴れ");
                    } else if (targetData2.weather[0].main === "Rain") {
                        $('.dayAfterTomorrowWeather').text("雨");
                    } else if (targetData2.weather[0].main === "Clouds") {
                        $('.dayAfterTomorrowWeather').text("くもり");
                    } else if (targetData2.weather[0].main === "Snow") {
                        $('.dayAfterTomorrowWeather').text("雪");
                    }

                    ///各データの表示
                    $('.tomorrowTemp').text(Math.floor((targetData1.main.temp - 273.15) * 10) / 10);
                    $('.tomorrowWeatherIcon').attr('src', 'https://openweathermap.org/img/w/' + targetData1.weather[0].icon + '.png ');
                    $('.dayAfterTomorrowTemp').text(Math.floor((targetData2.main.temp - 273.15) * 10) / 10);
                    $('.dayAfterTomorrowWeatherIcon').attr('src', 'https://openweathermap.org/img/w/' + targetData2.weather[0].icon + '.png ');
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

        //翌日9時の天気データを呼び出し
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast",
            dataType: "jsonp",
            data: "q=Tokyo,jp&appid=" + APIKEY,
            //天気データ呼び出し成功時の挙動
            success: function(data) {

                //翌日9時の天気データ
                const targetData1 = data.list[whichTomorrowWeatherData];
                const targetData2 = data.list[whichDayAfterTomorrowWeatherData];

                if (targetData1.weather[0].main === "Clear") {
                    $('.tomorrowWeather').text("晴れ");
                } else if (targetData1.weather[0].main === "Rain") {
                    $('.tomorrowWeather').text("雨");
                } else if (targetData1.weather[0].main === "Clouds") {
                    $('.tomorrowWeather').text("くもり");
                } else if (targetData1.weather[0].main === "Snow") {
                    $('.tomorrowWeather').text("雪");
                }

                if (targetData2.weather[0].main === "Clear") {
                    $('.dayAfterTomorrowWeather').text("晴れ");
                } else if (targetData2.weather[0].main === "Rain") {
                    $('.dayAfterTomorrowWeather').text("雨");
                } else if (targetData2.weather[0].main === "Clouds") {
                    $('.dayAfterTomorrowWeather').text("くもり");
                } else if (targetData2.weather[0].main === "Snow") {
                    $('.dayAfterTomorrowWeather').text("雪");
                }

                ///各データの表示
                $('.tomorrowTemp').text(Math.floor((targetData1.main.temp - 273.15) * 10) / 10);
                $('.tomorrowWeatherIcon').attr('src', 'https://openweathermap.org/img/w/' + targetData1.weather[0].icon + '.png ');
                $('.dayAfterTomorrowTemp').text(Math.floor((targetData2.main.temp - 273.15) * 10) / 10);
                $('.dayAfterTomorrowWeatherIcon').attr('src', 'https://openweathermap.org/img/w/' + targetData2.weather[0].icon + '.png ');
            }
        });
    }
}());