let app = new Vue({
    el: '#gmaps-app',
    data: {
        map: "",
        infoWindow: "",
    },
    methods: {
        initMap() {
            this.map = new google.maps.Map(document.getElementById('gmaps-app'), {
                center: {
                    lat: -34.397,
                    lng: 150.644
                },
                zoom: 6
            });
            this.infoWindow = new google.maps.InfoWindow;

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    let pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
        
                    this.infoWindow.setPosition(pos);
                    this.infoWindow.setContent('Location found.');
                    this.infoWindow.open(this.map);
                    this.map.setCenter(pos);
                }, function () {
                    handleLocationError(true, this.infoWindow, this.map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, this.infoWindow, this.map.getCenter());
            }
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






// function initMap() {
//     map = new google.maps.Map(document.getElementById('gmap'), {
//         center: {
//             lat: -34.397,
//             lng: 150.644
//         },
//         zoom: 6
//     });
//     infoWindow = new google.maps.InfoWindow;

//     // Try HTML5 geolocation.
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function (position) {
//             let pos = {
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude
//             };

//             infoWindow.setPosition(pos);
//             infoWindow.setContent('Location found.');
//             infoWindow.open(map);
//             map.setCenter(pos);
//         }, function () {
//             handleLocationError(true, infoWindow, map.getCenter());
//         });
//     } else {
//         // Browser doesn't support Geolocation
//         handleLocationError(false, infoWindow, map.getCenter());
//     }
// }

// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//     infoWindow.setPosition(pos);
//     infoWindow.setContent(browserHasGeolocation ?
//         'Error: The Geolocation service failed.' :
//         'Error: Your browser doesn\'t support geolocation.');
//     infoWindow.open(map);
// }