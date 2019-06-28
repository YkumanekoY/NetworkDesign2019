function initMap() {
    if (navigator.geolocation) {
        // 現在地を取得
        navigator.geolocation.getCurrentPosition(
            // 取得成功した場合
            function(position) {
                // 緯度・経度を変数に格納
                var mapLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var mapArea = document.getElementById('sample');
                var mapOptions = {
                    disableDefaultUI: true,
                    center: mapLatLng,
                    zoom: 15,
                    styles: [ /*マップの見た目*/ {
                        "featureType": "all",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "color": "#ffffff"
                        }]
                    }, {
                        "featureType": "all",
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "color": "#A28E8B"
                        }]
                    }, {
                        "featureType": "all",
                        "elementType": "labels.icon",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    }, {
                        "featureType": "administrative",
                        "elementType": "geometry.fill",
                        "stylers": [{
                            "color": "#F7EFED"
                        }]
                    }, {
                        "featureType": "administrative",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                            "color": "#F7EFED"
                        }, {
                            "weight": 1.2
                        }]
                    }, {
                        "featureType": "administrative.locality",
                        "elementType": "geometry.fill",
                        "stylers": [{
                            "lightness": "-1"
                        }]
                    }, {
                        "featureType": "administrative.neighborhood",
                        "elementType": "labels.text.fill",
                        "stylers": [{
                            "lightness": "0"
                        }, {
                            "saturation": "0"
                        }]
                    }, {
                        "featureType": "administrative.neighborhood",
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "weight": "0.01"
                        }]
                    }, {
                        "featureType": "administrative.land_parcel",
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "weight": "0.01"
                        }]
                    }, {
                        "featureType": "landscape",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#F7EFED"
                        }]
                    }, {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#C4B4B3"
                        }]
                    }, {
                        "featureType": "poi.park",
                        "elementType": "labels.icon",
                        "stylers": [{
                            visibility: "simplified"
                        }, ],
                    }, {
                        "featureType": "poi.park",
                        "elementType": "labels.icon",
                        "stylers": [{
                            "color": "#C4B4B3"
                        }]
                    }, {
                        "featureType": "road",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    }, {
                        "featureType": "road.highway",
                        "elementType": "geometry.fill",
                        "stylers": [{
                            "color": "#C4B4B3"
                        }]
                    }, {
                        "featureType": "road.highway.controlled_access",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                            "color": "#C4B4B3"
                        }]
                    }, {
                        "featureType": "road.arterial",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#C4B4B3"
                        }]
                    }, {
                        "featureType": "road.local",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#C4B4B3"
                        }]
                    }, {
                        "featureType": "transit",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#A28E8B"
                        }]
                    }, {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{
                            "color": "#61D4E2"
                        }]
                    }]
                };

                var map = new google.maps.Map(mapArea, mapOptions);
                var input = document.getElementById('pac-input');
                var searchBox = new google.maps.places.SearchBox(input);
                map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

                map.addListener('bounds_changed', function() {
                    searchBox.setBounds(map.getBounds());
                });

                var markerOptions = {
                    map: map,
                    position: mapLatLng,
                    icon: new google.maps.MarkerImage(
                        'assets/images/balloon.png',
                    ),
                };

                var marker = new google.maps.Marker(markerOptions);
                var baloonRoot = [
                    { lat: lat0, lng: lon0 }
                ];
                for (i = 1; i < latArray.length && i < lonArray.length; i++) {
                    baloonRoot.push({ lat: latArray[i], lng: lonArray[i] });
                }

                var flightPath = new google.maps.Polyline({
                    path: baloonRoot,
                    strokeColor: '#FF3333',
                    strokeOpacity: 0.8,
                    strokeWeight: 3
                });

                flightPath.setMap(map);
            }
        );
    } else {
        alert("この端末では位置情報が取得できません");
    }
}