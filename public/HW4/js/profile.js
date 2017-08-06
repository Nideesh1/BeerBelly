// Create a new anonymous function, to use as a wrapper
(function(){

  var pullProfile = function() {

    var oldURL = document.referrer;
    var variable = document.getElementById('floating-link');

    variable.href = oldURL;

    if (oldURL.search("brewery") > 0) {
      variable.text = "Back To Beers";
    }
    else {
      variable.text = "Back To Brewery";
    }

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyAXVsafE66O74lXovexVz1B2dHVzQY3mIo",
      authDomain: "beerbelly-cbc10.firebaseapp.com",
      databaseURL: "https://beerbelly-cbc10.firebaseio.com",
      storageBucket: "beerbelly-cbc10.appspot.com",
      messagingSenderId: "111899432837"
    };

    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.

        var storage = firebase.storage();
        var database = firebase.database().ref();

        var needed = database.child('Users').child(user.uid).child('Profile');

        needed.once('value').then(function(snapshot) {
          console.log(snapshot.val().format);
          format(snapshot.val().format);
        });
      }

      function format(format) {

        var neededName = user.uid + "." +format;

        console.log(user.providerData[0].providerId);

        if(user.providerData[0].providerId === "google.com") {

          console.log("bro u used googs");
          //document.getElementById('edit-error').style.visibility = "hidden";

          $(':input').attr('readonly','readonly');
          $('form').submit(false);
        }

        var profile = storage.ref("Users/"+neededName);

        profile.getDownloadURL().then(function(url) {

          // Or inserted into an <img> element:
          var img = document.getElementById('profile-pic');
          img.src = url;
        }).catch(function(error) {
          // Handle any errors
          console.log("done goofed boii");
        });
      }
    });
  }

  var called = pullProfile();
  
  // Close off the anonymous function and execute it
})();
