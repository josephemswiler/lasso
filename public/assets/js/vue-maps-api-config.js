let app = new Vue({
    el: '#gmaps-app',
    data: {
        apikey: "AIzaSyB2IahrwPpyvfygnrvqEa_lP61ri9w3CxY",
        map: "",
        infoWindow: "",
        service: "",
        pos: "",
        currentPlace: "",
        placeDetails: "",
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
                    this.createMarker(results[i]);
                }
            }
        },

        createMarker(place) {
            let placeLoc = place.geometry.location;
            let marker = new google.maps.Marker({
                map: this.map,
                position: place.geometry.location,
            });
            google.maps.event.addListener(marker, 'click', function() {
                let request = {
                    placeId: place.place_id
                };
                app._data.service.getDetails(request, function (place, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        console.log(place);
                        console.log(place.formatted_address);
                        app._data.infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                        'Place ID: ' + place.place_id + '<br>' +
                        place.formatted_address + '</div>');
                        app._data.infoWindow.open(app._data.map, marker);
                        placeDetailsApp.showPlaceDetails(place);
                    }
                });
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
console.log("Address: ", app._data.placeDetails)

Vue.component('todo-item', {
    props: ['detail'],
    template: '<li>{{ detail.text }}</li>'
  })
  
  var placeDetailsApp = new Vue({
    el: '#place-details',
    data: {
      placeDetails: [
        { id: 0, text: "" }, // name
        { id: 1, text: "" }, // address
        { id: 2, text: "" }, // phone number
        // { id: 3, text: "" }, // photo
        // { id: 4, text: "" }, // hours
        // { id: 5, text: "" }, // rating
        // { id: 6, text: "" }, // website
      ]
    },
    methods: {
        showPlaceDetails(place) {
            this.placeDetails[0].text = place.name;
            this.placeDetails[1].text = place.formatted_address;
            this.placeDetails[2].text = place.formatted_phone_number;
            // this.placeDetails[3].text = place.photos[0].getUrl({'maxWidth' : 35, 'maxHeight' : 35}),
            // this.placeDetails[4].text = place.opening_hours;
            // this.placeDetails[5].text = place.rating;
            // this.placeDetails[6].text = place.website;
        }
    }
})