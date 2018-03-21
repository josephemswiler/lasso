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
    let savedUserNames
    let savedLocalUsers = JSON.parse(localStorage.getItem('localSavedUsers'));
    if (!Array.isArray(savedUserNames)) {
      savedUserNames = [];
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
          
          addUser(currentUserName);
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

})()