var hasInit = false;
var firebaseConfig = {
    apiKey: "AIzaSyBIVV5bNJenzy8jHN1R7Zm6S0V3OJs_M90",
    authDomain: "project-eva-2021.firebaseapp.com",
    databaseURL: "https://project-eva-2021-default-rtdb.firebaseio.com",
    projectId: "project-eva-2021",
    storageBucket: "project-eva-2021.appspot.com",
    messagingSenderId: "852889768430",
    appId: "1:852889768430:web:345cdf05826ec4bc0a7eff",
    measurementId: "G-WQXK92L6RT"
};

if(!hasInit){
    firebase.initializeApp(firebaseConfig);
    hasInit = true;
}



