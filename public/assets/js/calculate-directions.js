let addDestination = new Vue({
    el: '#add-destination',
    data: {
        waypoints: [],
        totalDistance: 0,
    },
    methods: {
        addDest: function (placeId) {
            // this.waypoints.push({ "location": app.currentPlace.placeId });
            // numWaypoints++;
            this.waypoints.push({
                location: app.currentPlace,
                stopover: true,
            });

            // this.waypoints.push(app.currentPlace);
        },

        getPOI() {
            let directionsService = new google.maps.DirectionsService();
            let directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(app.map);
            this.calcRoute(directionsService, directionsDisplay);
        },

        calcRoute(directionsService, directionsDisplay) {
            console.log("calcRoute being called")
            // let start = addDestination.waypoints[0].location;
            // let end = addDestination.waypoints[1]
            let start = app.pos;
            let end = app.pos;
            let request = {
                origin: start,
                destination: end,
                waypoints: this.waypoints,
                optimizeWaypoints: true,
                travelMode: 'WALKING'
            };
            directionsService.route(request, function (result, status) {
                console.log("This is the result: ", result);
                console.log("This is the status: ", status);
                if (status == 'OK') {
                    directionsDisplay.setDirections(result);
                    console.log("Directions results: ", result)
                    computeTotalDistance.computeTotalDistance(result);
                }
            });
        }
    }
});

let computeTotalDistance = new Vue({
    el: '#total-distance',
    data: {
        totalDistance: 0,
    },
    methods: {
        computeTotalDistance(result) {
            let total = 0;
            let myroute = result.routes[0];
            for (let i = 0; i < myroute.legs.length; i++) {
              total += myroute.legs[i].distance.value;
            }
            total = total / 1000;
            this.totalDistance = "Total trip distance: " + total + " km";
          }
    }
})