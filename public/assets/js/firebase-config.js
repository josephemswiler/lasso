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
    let currentFavorites = [];
    let emailKey = "";


    //combine profile page and sign out page, add places from google api to firebase, add lazy load of places on profile page

    //   let placeList = addDestination.waypoints;

    // database.ref().child('users').orderByChild('name').on("value", function(snapshot) {
    //     console.log(snapshot.val());
    //     snapshot.forEach(function(data) {
    //         savedProfile.name = data.name;
    //         savedProfile.key = data.key;
    //         console.log(data.name);
    //     });
    // });

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

        emailKey = currentUser.email.substr(0, currentUser.email.indexOf('@'));

        database.ref('users/' + emailKey).on('value', function (snap) {
            let data = snap.val()
            if (!data) {
                database.ref('users/' + emailKey).set({
                    name: currentUser.displayName,
                    isActive: false,
                    authenticated: false
                });
            }
        })

        localUser = JSON.parse(localStorage.getItem('firebase:authUser:' + currentUser.G + ':[DEFAULT]'));

        if (currentUser.G) {
            database.ref('users/' + emailKey).onDisconnect().update({
                isActive: false
            })
        }
    }

    //Sign out of current login
    $('.signout').click(function () {

        emailKey = localUser.email.substr(0, localUser.email.indexOf('@'));

        firebase.auth().signOut().then(function () {

            database.ref('users/' + emailKey).update({
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
            $('.auth-tab a').removeClass('active').text('Sign Out')

            userSetup(user)

            // console.log(currentFavorites)

            emailKey = user.email.substr(0, user.email.indexOf('@'));

            database.ref('users/' + emailKey).update({
                isActive: true,
                authenticated: true
            })

        } else {
            $('.google-login')
                .css('display', 'inline-block')

            $('.signout').css('display', 'none');

            $('.auth-message').text("Sign in with your Google Account.")

            $('.trip-tab').addClass('disabled')
            $('.trip-tab a').removeClass('active')
            $('.profile-tab').addClass('disabled')
            $('.auth-tab a').addClass('active').text('Sign In')

        }
    }); //listen for state change

    $('.fav-star').click(function () { //in click handler .off() bound

        let text = ($(this).parent().find('p').text());

        if ($(this).hasClass('grey-text')) {

            $(this)
                .removeClass('grey-text text-darken-1')
                .addClass('deep-orange-text text-lighten-1')
                .text('star')

            emailKey = localUser.email.substr(0, localUser.email.indexOf('@'));

            database.ref('users/' + emailKey + '/favoritePlaces/').off("value")
            database.ref('users/' + emailKey + '/favoritePlaces/').on("value", function (snap) {

                snap.forEach(function (data) {

                    database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).off("value")
                    database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).on("value", function (snap) {
                        if (currentFavorites.includes(snap.val())) {} else {
                            currentFavorites.push(snap.val())
                        }
                    });
                });
            });

            if (currentFavorites.includes(text)) {

            } else {

                database.ref('users/' + emailKey + '/favoritePlaces/').push(text)
            }
        } else {

            $(this)
                .removeClass('deep-orange-text text-lighten-1')
                .addClass('grey-text text-darken-1')
                .text('star_border')

            currentFavorites.splice(currentFavorites.indexOf(text), 1);

                database.ref('users/' + emailKey + '/favoritePlaces/').off("value")
                database.ref('users/' + emailKey + '/favoritePlaces/').on("value", function (snap) { //here
                    // console.log(snap.val());
                    snap.forEach(function (data) {
                        // console.log(data.key);
    
                        database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).off("value")
                        database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).on("value", function (snap) {
    
                            if (text === (snap.val())) {
    
                                database.ref('users/' + emailKey + '/favoritePlaces/' + data.key).remove();

                            } else {
                            }
                        });
                    });
                });
        } 
    })

    // $(document).on('click', '.fav-star', function () {

    //     //firebase delete
    //     database.ref("users/" + tupleList[currentIndex].userKey).remove(); 

    //     //local delete

    //     tupleList.splice(currentIndex, 1);

    //     savedNames.splice(currentIndex, 1); 

    //     savedUsers = tupleList;

    //     localStorage.setItem('localUsers', JSON.stringify(savedUsers));

    //     $(this).parent().remove();

    //     location.reload();
    // });
})()