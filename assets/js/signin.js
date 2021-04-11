var userName = document.getElementById('holder/name');
//var email = document.getElementById('holder/location');
var profile = document.getElementById('holder/profile');
var UserID = false
if (typeof(Storage) !== "undefined") {
  if(localStorage.userID){
    UserID=localStorage.userID;
  } 
  console.log("Retrieving UserID",UserID,localStorage.userID)
} else {
  console.log("Sorry, your browser does not support web storage...");
}
function init(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          userName.innerText = user.displayName;
          //email.innerText = user.email;
          console.log(user)
          profile.src = user.photoURL;
          UserID = user.uid;
          if (typeof(Storage) !== "undefined") {
            localStorage.userID = UserID;
            console.log("Saving UserID",UserID,localStorage.userID)
          } else {
            console.log("Sorry, your browser does not support web storage...");
          }
        } else {
          // No user is signed in.
          userName.innerText = "Sign In";
          //email.innerText = "Sign In";
          window.location.replace("https://elvistony.me/main-project/login/");
        }
    });
}



function logOut(){
    firebase.auth().signOut().then(function(){
        console.log('success');
        window.location.replace("https://elvistony.me/main-project/login/");
    },function(){})
}

init();