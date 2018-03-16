let app = new Vue({
    el: '#gmaps-app',
    data: {
        map: "",
        infoWindow: "",
        service: "",
        pos: "",
    },
    methods: {
        initMap() {
            this.map = new google.maps.Map(document.getElementById('gmaps-app'), {
                center: {
                    lat: 30.307182,
                    lng: -97.755996
                },
                zoom: 15
            });
            this.infoWindow = new google.maps.InfoWindow;

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    let pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    app._data.infoWindow.setPosition(pos);
                    app._data.map.setCenter(pos);
                    let request = {
                        location: pos,
                        radius: '500',
                        query: 'restaurant'
                    };
                    app._data.service = new google.maps.places.PlacesService(app._data.map);
                    app._data.service.nearbySearch(request, app.callback);
                },
                function () {
                    handleLocationError(true, this.infoWindow, this.map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, this.infoWindow, this.map.getCenter());
            }
        },
        
        callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    let place = results[i];
                    // console.log("This is the place: ", place)
                    this.createMarker(results[i]);
                }
            }
        },

        createMarker(place) {
            let placeLoc = place.geometry.location;
            let marker = new google.maps.Marker({
                map: this.map,
                position: place.geometry.location
            });
            google.maps.event.addListener(marker, 'click', function() {
                app._data.infoWindow.setContent(place.name);
                app._data.infoWindow.open(this.map, this);
            });
        },

        handleLocationError(browserHasGeolocation, infoWindow, pos) {
            this.infoWindow.setPosition(pos);
            this.infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            this.infoWindow.open(this.map);
        }

    }
})

function gmapsCallback(){
    app.initMap()
}
console.log(app)