var mainApp = {};
(function(){
  var mainContainer = document.getElementById("main_container");

    var logtout =  function(){
        firebase.auth().signOut().then(function(){
            console.log('success');
            window.location.replace("login.html");
        },function(){})
    }

    function init(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log("stay");
          document.getElementById("info").innerText = user.displayName;
          console.log(user)
          mainContainer.style.display = "";
        } else {
          // No user is signed in.
          mainContainer.style.display = "none";
          console.log("redirect");
          window.location.replace("login.html");
        }
    });
    }
    
init();

mainApp.logout = logtout;
})();