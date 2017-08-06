// Get elements.
const txtEmail = document.getElementById('email');
const txtPassword = document.getElementById('password');
const profilePic = document.getElementById('image-file').files[0];
const btnUploadImage = document.getElementById('upload-image-btn');
const btnSubmit = document.getElementById('submit');
const btnGoogle = document.getElementById('google');

(function () {

  // Upload image button clicks image file button.
  btnUploadImage.addEventListener('click', e => {

    document.getElementById('image-file').click();
  });

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
    promise.catch(validateForm);

    // Run after account created.
    promise.then(function() {

      // User uploaded profile pic.
      if (profilePic) {

        // Create filename to store.
        var filename = auth.currentUser.uid + '.' +
        profilePic.name.split('.').pop();

        // Upload profile pic.
        var storageRef = firebase.storage().ref().child('Users/' + filename);
        var uploadTask = storageRef.put(profilePic);

        // Stages of upload.
        uploadTask.on('state_changed', function(snapshot) {
        }, function(error) {
          console.log("Error during profile pic upload.");
          console.log(error);
        }, function() {

          // Get profile pic URL.
          var photoURL = uploadTask.snapshot.downloadURL;

          // Write account info to database.
          var promise = firebase.database().ref('Users/' +
          auth.currentUser.uid).set({
            Profile : {
              picture : photoURL
            }
          });

          // Run after database write complete.
          promise.then(function() {

            // Redirect to community.html.
            window.location = "./community.html";
          });
        });
      }

      // User didn't upload profile pic.
      else {

        // Create filename to store.
        var filename = 'Users/profile.png';

        firebase.storage().ref().child(filename).
            getDownloadURL().then(function(url) {

          // Write account info to database.
          var promise = firebase.database().ref(
              'Users/' + auth.currentUser.uid).set({
            Profile : {
              picture : url
            }
          });

          // Run after database write complete.
          promise.then(function() {

            // Redirect to community.html.
            window.location = "./community.html";
          });
        });
      }
    });
  });

  // Sign in with Google.
  btnGoogle.addEventListener('click', e => {

    // Prevent form submission until after auth completed.
    e.preventDefault();

    // Start sign in process for an unauthenticated user.
    var provider = new firebase.auth.GoogleAuthProvider();
    const auth = firebase.auth();
    const promise = auth.signInWithPopup(provider);
    promise.catch(e => console.log(e.message));

    // Run after account created.
    promise.then(function() {

      var photoURL;

      // Google profile pic already exists.
      if (auth.currentUser.photoURL) {
        photoURL = auth.currentUser.photoURL;
      }

      // Use default profile.png.
      else {
        photoURL = firebase.storage().ref().
                   child('Users/profile.png').getDownloadURL();
      }

      // Write account info to database.
      var promise = firebase.database().ref('Users/' +
        auth.currentUser.uid).set({
          Profile : {
            picture : photoURL
          }
        });

      // Run after database write complete.
      promise.then(function() {

        // Redirect to community.html.
        window.location = "./community.html";
      });
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

// Displays selected image before submission.
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

// Validate form data and display visual queues upon error.
function validateForm(error) {

  // Reset error borders.
  txtEmail.style.border = '';
  txtPassword.style.border = '';

  // Reset field values.
  txtEmail.value = '';
  txtPassword.value = '';

  // Reset placeholders.
  txtEmail.placeholder = '';
  txtPassword.placeholder = '';

  // Visual queue depends on error code.
  switch(error.code) {
    case 'auth/invalid-email':
      txtEmail.style.border = '3px solid #FF6138';
      txtEmail.placeholder = 'Invalid Email';
      break;
    case 'auth/weak-password':
      txtPassword.style.border = '3px solid #FF6138';
      txtPassword.placeholder = 'Weak Password';
      break;
    case 'auth/email-already-in-use':
      txtEmail.style.border = '3px solid #FF6138';
      txtEmail.placeholder = 'Email Already Exists';
      break;
  }

  // console.log(error);
  // console.log(error.message);
}
