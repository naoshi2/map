
function initMap() {
    var originLatLng = { lat: 35.3971, lng: 139.541 };
    document.getElementById("lat").textContent = originLatLng.lat;
    document.getElementById("lng").textContent = originLatLng.lng;

    this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: originLatLng
    });

    marker = new google.maps.Marker({
        position: originLatLng,
        map: map,
        title: 'original',
        icon: '../img/t.png',
    });

    this.markerArray = [];
    markerArray.push(this.marker);

    map.addListener('center_changed', function () {
        latlng = map.getCenter();
        document.getElementById("lat").textContent = latlng.lat();
        document.getElementById("lng").textContent = latlng.lng();
    });

    map.addListener('bounds_changed', function () {
        bounds = getBounds(map);
        document.getElementById("North").textContent = bounds.North;
        document.getElementById("East").textContent = bounds.East;
        document.getElementById("South").textContent = bounds.South;
        document.getElementById("West").textContent = bounds.West;
    });
}

function getBounds(map) {
    var bounds = {};

    var latlng = map.getBounds().getNorthEast();
    bounds.North = latlng.lat();
    bounds.East = latlng.lng();

    var latlng = map.getBounds().getSouthWest();
    bounds.South = latlng.lat();
    bounds.West = latlng.lng();

    return bounds;
}

function addMarker(json) {
    console.log(json);
    json = JSON.parse(json);

    lat = (json['north'] + json['south']) / 2;
    lng = (json['west'] + json['east']) / 2;

    var LatLng = { lat: lat, lng: lng };

    var infowindow = new google.maps.InfoWindow({
        content: "@" + json['user'] + "<br>" + json['text']
    });

    var marker = new google.maps.Marker({
        position: LatLng,
        map: map,
        title: json['user'],
        icon: '../img/t.png'
    })
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    markerArray.push(marker);
}

function toggleMarkder() {
    for (var m in markerArray) {
        if (markerArray[m].getVisible()) {
            markerArray[m].setVisible(false);
        } else {
            markerArray[m].setVisible(true);
        };
    }
};