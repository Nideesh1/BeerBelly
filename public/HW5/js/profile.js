(function(){

  var btnUploadImage = document.getElementById('upload-image-btn');
  var submitButton = document.getElementById('submitButton');
  var txtEmail = document.getElementById('email');
  var txtPassword = document.getElementById('password');
  var emailLabel = document.getElementById('emailLabel');
  var newPasswordLabel = document.getElementById('newPasswordLabel');
  var newPassword =  document.getElementById('newPassword');

  //Pulling the profile from Database
  var pullProfile = function() {

    var oldURL = document.referrer;
    var variable = document.getElementById('floating-link');
    variable.href = oldURL;
    if(!oldURL){
      
      //Back button to brewery/neers
      if(variable.text === "Back to Breweries"){
        variable.href = "./community.html";
      }
      else if(variable.text === "Back to Beers"){
        variable.href = "./brewery.html";
      }
    }
    if (oldURL.search("brewery") > 0){
      variable.text = "Back To Beers";
      variable.href = "./brewery.html";
    }
    else{
      variable.text = "Back To Breweries";
      variable.href = "./community.html";
    }
    //Begin checking for user, and databse
    var profileDatabase = firebase.database().ref();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var profilePicture = document.getElementById("profile-pic");
        var hiddenGoogleId = document.getElementById('edit-error');
        if(user.providerData[0].providerId === "google.com"){
          //Begin hiding unwanted tags for Google Account
          $(':input').attr('readonly','readonly');
          $('form').submit(false);
          hiddenGoogleId.style.display='block';
          btnUploadImage.parentNode.removeChild(btnUploadImage);
          passwordLabel.parentNode.removeChild(passwordLabel);
          txtPassword.parentNode.removeChild(txtPassword);
          submitButton.parentNode.removeChild(submitButton);
          newPasswordLabel.parentNode.removeChild(newPasswordLabel);
          newPassword.parentNode.removeChild(newPassword);
          txtEmail.value = user.email;
        }
        else{ //Setting default value of email field from databse
          hiddenGoogleId.style.display='block';
          $('p').text('Please submit current password to update new password.');
          txtEmail.value = user.email;
          $("#txtEmail").prop("disabled", true);
          txtEmail.readonly = true;
        }
        var profileNeeded = profileDatabase.child('Users').child(user.uid).child('Profile');
        profileNeeded.once('value').then(function(snapshot)
        {
          profilePicture.src = snapshot.val().picture;
        });
      } else {
        // No user is signed in. Redirected to home page
        window.location.href = "./index.html";
      }
    });
  }
  btnUploadImage.addEventListener('click', e => {
    if(btnUploadImage.value == "SAVE PIC")
    {
      btnUploadImage.value = "Upload Pic"; //Begin uploading new profile photo
      const profilePic = document.getElementById('image-file').files[0];
      const auth = firebase.auth();
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var filename = auth.currentUser.uid + '.' + profilePic.name.split('.').pop();
          var storageRef = firebase.storage().ref().child('Users/' + filename);
          storageRef.put(profilePic).then(function(snapshot)
          {
            //Uploading to the storage

            var profileDatabase = firebase.database().ref();
            var profileNeeded = profileDatabase.child('Users').child(user.uid).child('Profile');
            profileNeeded.set({
              picture : snapshot.downloadURL
            });
          });
        } else {
          // No user is signed in.
        }
      });
    }
    else document.getElementById('image-file').click();
  });
  var called = pullProfile();
})();

// Displays selected image before submission.
function previewFile() {
  var btnUploadImage = document.getElementById('upload-image-btn');
  var submitButton = document.getElementById('submitButton');
  btnUploadImage.value = "SAVE PIC";
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
$('#submitButton').on('click', function(e) {

  //This is to update the users password.
  //The user must enter old password to update
  //for new password.
  var password =  document.getElementById('password');
  var newPassword =  document.getElementById('newPassword');

  newPassword.placeholder = "Enter New Password";
  var user = firebase.auth().currentUser;
  if(submitButton.value != "SAVE")
  {
    var txtEmail = document.getElementById('email');
    var txtPassword = document.getElementById('password');
    var newPassword =  document.getElementById('newPassword');
    txtEmail.style.border = '';
    txtPassword.style.border = '';

    var credential = firebase.auth.EmailAuthProvider.credential(user.email, password.value);
    if(credential)
    {
      user.reauthenticate(credential).then(function() {
        // User re-authenticated.
        txtPassword.value = "";
        txtPassword.placeholder = 'Enter Old Password';

        user.updatePassword(newPassword.value).then(function() {
          // Update successful.

          txtPassword.style.border = '';
          txtPassword.value = '';
          $('p').text('You have successfully updated your password.');
          newPassword.placeholder = "Enter New Password";
          newPassword.value = "";
          // Reset placeholders.

          txtPassword.placeholder = 'Enter Current Password';
          submitButton.value="EDIT"

        }, function(error) {
          console.log(error);
          $('p').text('Please submit current password to update new password.');
          // An error happened.
          switch(error.code) {
            case 'auth/weak-password':
            newPassword.value = "";
            newPassword.style.border = '3px solid #FF6138';
            newPassword.placeholder = 'Weak Password';
            break;
            case 'auth/email-already-in-use':
            txtEmail.value = "";
            txtEmail.style.border = '3px solid #FF6138';
            txtEmail.placeholder = 'Email Already Exists';
            break;
          }
        });
      }, function(error) {
        // An error happened.
        console.log(error);
        // Visual queue depends on error code.
        $('p').text('Please submit current password to update new password.');
        switch(error.code) {

          case 'auth/wrong-password':
          txtPassword.style.border = '3px solid #FF6138';
          txtPassword.value = "";
          txtPassword.placeholder = 'Invalid Password';
          break;
          case 'auth/user-not-found':

          txtEmail.value = "";
          txtPassword.value = "";
          txtPassword.placeholder = 'Invalid Password';
          break;
        }
      });}}
    });
