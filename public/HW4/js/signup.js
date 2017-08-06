(function () {

  // Get elements.
  const txtEmail = document.getElementById('email');
  const txtPassword = document.getElementById('password');
  const btnSubmit = document.getElementById('submit');
  const btnGoogle = document.getElementById('google');

  // Sign in with email and password.
  btnSubmit.addEventListener('click', e => {

    // Prevent form submission until after auth completed.
    e.preventDefault();

    // Get email, password and profile pic.
    const email = txtEmail.value;
    const password = txtPassword.value;
    const profilePic = document.getElementById('image-file').files[0];
    const auth = firebase.auth();

    // Create user.
    var promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));

    // Run after account created.
    promise.then(function() {

      // Create file name to store.
      var filename = auth.currentUser.uid + '.' + profilePic.name.split('.').pop();

      // Write account info to database.
      firebase.database().ref('Users/' + auth.currentUser.uid).set({
        Profile : {
          format : profilePic.name.split('.').pop()
        }
      });

      // Upload profile pic.
      var storageRef = firebase.storage().ref().child('Users/' + filename);
      storageRef.put(profilePic).then(function() {

        // Redirect to community.html.
        window.location = "./community.html";
      });
    });

  });

  // Sign in with Google.
  btnGoogle.addEventListener('click', e => {

    // Prevent form submission until after auth completed.
    e.preventDefault();

    // Start sign in process for an unauthenticated user.
    var provider = new firebase.auth.GoogleAuthProvider();
    const promise = firebase.auth().signInWithPopup(provider);
    promise.catch(e => console.log(e.message));

    // Run after account created.
    promise.then(function() {

      // TODO: Get and store Google account profile pic.
      // var token = result.credential.accessToken;

      // Redirect to community.html.
      window.location = "./community.html";
    });

  });

  // Add realtime listener.
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      console.log(firebaseUser);
    }
    else {
      console.log("not logged in");
    }
  });

}());

/* Displays selected image before submission. */
function previewFile() {
  var preview = document.querySelector('#profile-pic');
  var file = document.querySelector('#image-file').files[0];
  var reader = new FileReader();

  reader.onloadend = function() {
    preview.src = reader.result;
  }

  if (file) {
    reader.readAsDataURL(file);
  }
  else {
    preview.src = "";
  }
}
