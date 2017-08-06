(function() {

  // Get elements.
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnSubmit = document.getElementById('btnSubmit');
  const btnGoogleLogin = document.getElementById('btnGoogleLogin');

  // Add login event.
  btnSubmit.addEventListener('click', e => {

    // Prevent form submission until after auth completed.
    e.preventDefault();

    // Get email and password.
    const email = txtEmail.value;
    const password = txtPassword.value;

    const promise = firebase.auth().signInWithEmailAndPassword(email, password);
    promise.catch(validateForm);
  });

  btnGoogleLogin.addEventListener('click', e => {

    // Prevent form submission until after auth completed.
    e.preventDefault();

    // Start sign in process for an unauthenticated user.
    var provider = new firebase.auth.GoogleAuthProvider();
    const promise = firebase.auth().signInWithPopup(provider);
    promise.catch(e => console.log(e.message));
  });

  // Add realtime listener.
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      console.log(firebaseUser);
      window.location = './community.html';
    }
    else {
      console.log('not logged in');
    }
  });

}());

// Validate form data and display visual queues upon error.
function validateForm(error) {

  // Hide errorMessage by default.
  const errorMessage = document.getElementById('error-message');
  errorMessage.style.visibility = 'hidden';

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
    case 'auth/wrong-password':
      txtPassword.style.border = '3px solid #FF6138';
      txtPassword.placeholder = 'Invalid Password';
      break;
    case 'auth/user-not-found':
      txtEmail.style.border = '3px solid #FF6138';
      txtPassword.style.border = '3px solid #FF6138';
      errorMessage.style.visibility = 'visible';
      break;
  }

  // console.log(error);
  // console.log(error.message);
}
