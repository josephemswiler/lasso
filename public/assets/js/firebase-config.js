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
    let localUser = new Object();

    //combine profile page and sign out page, add places from google api to firebase, add lazy load of places on profile page

    //   let placeList = addDestination.waypoints;

    //Google login
    $('.google-login').click(function () {

        var provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            userSetup(user)

        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
        });
    }) //Google login

    function userSetup(currentUser) {

        $('.profile-img').attr('src', currentUser.photoURL);

        $('.profile-name').text(currentUser.displayName);

        database.ref('users/' + currentUser.G).set({
            name: currentUser.displayName,
            isActive: true,
            authenticated: true,
            // places: placeList,
        });

        localUser = JSON.parse(localStorage.getItem('firebase:authUser:' + currentUser.G + ':[DEFAULT]'));

        if (currentUser.G) {
            database.ref('users/' + currentUser.G).onDisconnect().update({
                isActive: false
            })
        }
    }

    //Sign out of current login
    $('.signout').click(function () {

        firebase.auth().signOut().then(function () {

            database.ref('users/' + localUser.apiKey).update({
                isActive: false,
                authenticated: false
            })

        }).catch(function (error) {
            // An error happened.
        });
    }) //Sign out of current login

    //listen for state change
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $('.signout')
                .css('display', 'inline-block')
                
            $('.google-login').css('display', 'none');

            $('.auth-message').text("You are signed in with Google as " + user.displayName + ".")

            $('.trip-tab').removeClass('disabled')
            $('.trip-tab a').addClass('active')
            $('.profile-tab').removeClass('disabled')
            $('.auth-tab a').removeClass('active')

            userSetup(user)

        } else {
            $('.google-login')
                .css('display', 'inline-block')
               
            $('.signout').css('display', 'none');
            
            $('.auth-message').text("Sign in with your Google Account.")

            $('.trip-tab').addClass('disabled')
            $('.trip-tab a').removeClass('active')
            $('.profile-tab').addClass('disabled')
            $('.auth-tab a').addClass('active')

        }
    }); //listen for state change

})()

