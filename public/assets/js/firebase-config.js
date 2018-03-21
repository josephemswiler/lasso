(function () {

    var config = {
        apiKey: "AIzaSyD-C8fCk0JV3EVUlXQHGLLpLlg8HJI_Tbw",
        authDomain: "project-1-jfe.firebaseapp.com",
        databaseURL: "https://project-1-jfe.firebaseio.com",
        projectId: "project-1-jfe",
        storageBucket: "project-1-jfe.appspot.com",
        messagingSenderId: "38105637620"
    };
    firebase.initializeApp(config);

    let database = firebase.database();
    let currentUserName = "";
    let currentUserTuple = new Object();
    let savedUserNames = ""
    let savedLocalUsers = JSON.parse(localStorage.getItem('localSavedUsers'));
    if (!Array.isArray(savedLocalUsers)) {
        savedLocalUsers = [];
    }

    $('.google-login').click(function () {

        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            let name = user.email.substr(0, user.email.indexOf('@'));

            currentUserName = name;

            console.log(name)

            addUser(name);
            // ...
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    })

    //   let visitedPlaces = addDestination.waypoints;

    //users
    //id
    //name
    //places
    //google place id
    //locateOn: false
    //isActive: false
    //search
    //cost
    //time
    //stops add button, close button

    function addUser(user) {
        event.preventDefault();
        console.log(user, savedLocalUsers)
        // if (user === "") {
        //     return;
        // }
        //checks if user exists, adds username to currentUserTuple.userName and key to currentUserTuple.userKey
        if (savedLocalUsers.includes(user)) {
            currentUserTuple.userName = currentUserName;
            let key = "";
            let tupleList = JSON.parse(localStorage.getItem('localSavedUsers'));
            for (var i = 0; i < tupleList.length; i++) {
                if ((tupleList[i].userName === currentUserName)) {
                    key = tupleList[i].userKey;
                }
            }
            currentUserTuple.userKey = key;
            console.log("new " + currentUserTuple)
        } else {
            let key = firebase.database().ref('users').push().key;
            currentUserTuple.userName = currentUserName;
            currentUserTuple.userKey = key;
            savedLocalUsers.push(currentUserTuple);
            // savedNames.push(currentName);
            localStorage.setItem('localUsers', JSON.stringify(savedLocalUsers));
            database.ref('users/' + key).set({
                name: currentUserName,
                isActive: false
                // places: currentPlaces,
            });
            console.log("existing " + currentUserTuple)
        }
        database.ref('users/' + currentUserTuple.userKey).update({
            isActive: true
        });

        $('.auth-container').fadeOut("slow", function () {

            $('.trip-container').fadeIn("slow", function () {});
        });

        if (currentUserTuple.userKey) {
            database.ref('users/' + userTuple.userKey).onDisconnect().update({
                isActive: false
            })
        }
    } //addUser

    $('.signout').click(function () {

        firebase.auth().signOut().then(function () {
          // Sign-out successful.
        }).catch(function (error) {
          // An error happened.
        });
      })

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          console.log('User is signed in.')
          $('.signout').css('display', 'inline-block');
        //   $('.auth-container').hide();
        //   $('.trip-container').show();
    
        } else {
          $('.signout').css('display', 'none');
          console.log('No user is signed in.')
        //   $('.auth-container').show();
        //   $('.trip-container').hide();
        }
      });

})()