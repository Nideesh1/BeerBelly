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
    promise.catch(e => console.log(e.message));
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
      window.location = "./community.html";
    }
    else {
      console.log('not logged in');
    }
  });

}());
