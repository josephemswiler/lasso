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

        database.ref('users/' + currentUser.G).on('value', function (snap) {
            let data = snap.val()
            if (!data) {
                database.ref('users/' + currentUser.G).set({
                    name: currentUser.displayName,
                    isActive: false,
                    authenticated: false
                });
            }
        })

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
            $('.auth-tab a').removeClass('active').text('Sign Out')

            userSetup(user)

            database.ref('users/' + user.G).update({
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

    $('.fav-star').click(function () {
        if ($(this).hasClass('grey-text')) {
            $(this)
                .removeClass('grey-text text-darken-1')
                .addClass('deep-orange-text text-lighten-1')
                .text('star')


            database.ref('users/' + localUser.apiKey + '/favoritePlaces/').on("value", function (snap) {

                snap.forEach(function (data) {

                    database.ref('users/' + localUser.apiKey + '/favoritePlaces/' + data.key).on("value", function (snap) {
                        if (currentFavorites.includes(snap.val())) {} else {
                            currentFavorites.push(snap.val())
                        }
                    });
                });
            });

            console.log(currentFavorites)

            if (currentFavorites.includes($(this).parent().find('p').text())) {

            } else {

                database.ref('users/' + localUser.apiKey + '/favoritePlaces/').push($(this).parent().find('p').text())

            }

        } else {
            $(this)
                .removeClass('deep-orange-text text-lighten-1')
                .addClass('grey-text text-darken-1')
                .text('star_border')

                database.ref('users/' + localUser.apiKey + '/favoritePlaces/').on("value", function (snap) {
                    // console.log(snap.val());
                    snap.forEach(function (data) {
                        // console.log(data.key);
    
                        database.ref('users/' + localUser.apiKey + '/favoritePlaces/' + data.key).on("value", function (snap) {

                            console.log(($(this).parent().find('p').text())) //here

                            if (($(this).parent().find('p').text()) === (snap.val())) {
                                
                                database.ref('users/' + localUser.apiKey + '/favoritePlaces/' + data.key).remove();

                                currentFavorites.splice(currentFavorites.indexOf($(this).parent().find('p').text()),1)

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