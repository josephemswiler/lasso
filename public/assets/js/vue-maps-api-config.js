let app = new Vue({
    el: '#gmaps-app',
    data: {
        map: "",
        infoWindow: "",
        service: "",
    },
    methods: {
        initialize() {
            let austin = new google.maps.LatLng(30.307182,-97.755996);
            this.map = new google.maps.Map(document.getElementById('gmaps-app'), {
                center: austin,
                zoom: 15
            });
            let request = {
                location: austin,
                radius: '500',
                query: 'restaurant'
            };
            this.service = new google.maps.places.PlacesService(this.map);
            this.service.nearbySearch(request, this.callback);
        },

        callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    let place = results[i];
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
        },
        
        // initMap() {
        //     this.map = new google.maps.Map(document.getElementById('gmaps-app'), {
        //         center: {
        //             lat: -34.397,
        //             lng: 150.644
        //         },
        //         zoom: 6
        //     });
        //     this.infoWindow = new google.maps.InfoWindow;

        //     // Try HTML5 geolocation.
        //     if (navigator.geolocation) {
        //         navigator.geolocation.getCurrentPosition(function (position) {
        //             let pos = {
        //                 lat: position.coords.latitude,
        //                 lng: position.coords.longitude
        //             };
        //             app._data.infoWindow.setPosition(pos);
        //             app._data.infoWindow.setContent('Location found.');
        //             app._data.infoWindow.open(app._data.map);
        //             app._data.map.setCenter(pos);
        //         }, function () {
        //             handleLocationError(true, this.infoWindow, this.map.getCenter());
        //         });
        //     } else {
        //         // Browser doesn't support Geolocation
        //         handleLocationError(false, this.infoWindow, this.map.getCenter());
        //     }
        // },
        // handleLocationError(browserHasGeolocation, infoWindow, pos) {
        //     this.infoWindow.setPosition(pos);
        //     this.infoWindow.setContent(browserHasGeolocation ?
        //         'Error: The Geolocation service failed.' :
        //         'Error: Your browser doesn\'t support geolocation.');
        //     this.infoWindow.open(this.map);
        // }
    }
})

function gmapsCallback(){
    // app.initMap()
    app.initialize();
}
console.log(app)