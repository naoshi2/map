function initMap() {
    var originLatLng = {lat: 35.6807233, lng: 139.7676282};
    document.getElementById("lat").textContent = originLatLng.lat;
    document.getElementById("lng").textContent = originLatLng.lng;

    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: originLatLng
    });

    marker = new google.maps.Marker({
      position: originLatLng,
      map: map,
      title: 'original',
      icon: 't.png',
    });

    this.markerArray = [];
    markerArray.push(this.marker);

    map.addListener('center_changed', function() {
        latlng = map.getCenter();
        document.getElementById("lat").textContent = latlng.lat();
        document.getElementById("lng").textContent = latlng.lng();
    });

    map.addListener('bounds_changed', function() {
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

function addMarkder() {
    boouns = getBounds(this.map);
    lat = Math.random() * (bounds.North - boouns.South) + bounds.South;
    lng = Math.random() * (bounds.East - boouns.West) + bounds.West;
    
    var LatLng = {lat: lat, lng: lng};

    marker = new google.maps.Marker({
        position:LatLng,
        map: map,
        title: 'Hello world!',
        icon: 't.png'
    })
    markerArray.push(marker);
};

function toggleMarkder() {
    for(var m in markerArray) {
        if (markerArray[m].getVisible()) {
            markerArray[m].setVisible(false);
        } else {
            markerArray[m].setVisible(true);
        };
    }
};