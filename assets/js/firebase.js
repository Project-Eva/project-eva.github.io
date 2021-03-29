var firebaseConfig = {
    apiKey: "AIzaSyDsJy7ZXM2114WjsAIvyYv9PsWpWjcqOKY",
    authDomain: "homeautomation-406fd.firebaseapp.com",
    databaseURL: "https://homeautomation-406fd.firebaseio.com",
    projectId: "homeautomation-406fd",
    storageBucket: "homeautomation-406fd.appspot.com",
    messagingSenderId: "803752531879",
    appId: "1:803752531879:web:ac8ad43c1c0d2953348882",
    measurementId: "G-87QPN2H6DP"
};
firebase.initializeApp(firebaseConfig);

namef = document.getElementById('holder/name');
locf = document.getElementById('holder/location');
statusf = document.getElementById('holder/status');
roomsf = document.getElementById('holder/rooms');
expensef = document.getElementById('holder/expense');

var db = firebase.database().ref('username1');
db.once('value', (snapshot) => {
    namef.innerText = snapshot.val().name;
    locf.innerText = snapshot.val().location;
    expensef.innerText = snapshot.val().expenditure.total;
    statusf.innerText = snapshot.val()["device-state"];
    generateButtonsLazy(snapshot.val().rooms)
})

function generateButtonsLazy(rooms) {
    for (const room in rooms) {
        roomSwitches = rooms[room];
        console.log(room)
        buttons = ""
        button = document.createElement('button')
        button.id = room+"/toggle";
        button.classList.add('w3-block','w3-button','w3-hover-white','no-border','w3-white','w3-border','w3-left-align')
        button.innerText = room;
        button.addEventListener('click',()=>{accordian(room)})
        div = document.createElement('div')
        div.id = room;
        div.classList.add('w3-container','w3-padding')
        for (const switches in roomSwitches) {
            const element = roomSwitches[switches];
            console.log(element)
            firebase.database().ref('username1/rooms/' + room + "/" + switches).on('value', (snap) => {
                if (document.getElementById(room +"/"+ switches)) {
                    state = snap.val().state;
                    if (state=="ON"){
                        document.getElementById(room +"/"+ switches+"/state").classList.add('toggle-state-on')
                        //document.getElementById(room +"/"+ switches).classList.remove('w3-border')
                    }else{
                        document.getElementById(room +"/"+ switches+"/state").classList.remove('toggle-state-on')
                        //document.getElementById(room +"/"+ switches).classList.remove('w3-blue','w3-hover-blue')
                    }
                    document.getElementById(room +"/"+ switches+"/state").innerText = state
                } else {
                    document.getElementById(room).appendChild(makeButton(room, switches, snap));
                }
            })
        }

        roomsf.appendChild(button)
        roomsf.appendChild(div)
    }
}

function makeButton(room, switches, snap) {
    // divWrapper = document.createElement('div');
    // divWrapper.id = switches;
    // divWrapper.classList.add('w3-row')
    var button = document.createElement('button');
    button.id = room +"/"+ switches;
    button.classList.add('w3-button','w3-border','toggle-button')
    var state = snap.val().state;
    
    buttonState = document.createElement('span')
    buttonState.classList.add('toggle-state','w3-small','w3-text-black')
    buttonName = document.createElement('span')
    buttonName.classList.add('w3-large')
    buttonName.innerText = switches
    buttonState.innerText = state;
    buttonState.id = room +"/"+ switches+"/state";
    if (state=="ON"){
        buttonState.classList.add('toggle-state-on')
    }
    button.appendChild(buttonName).appendChild(buttonState)
    button.addEventListener('click', () => {
        toggle('username1/rooms/' + room + "/" + switches, room +"/"+ switches);
    })
    //divWrapper.appendChild(button);
    return button;
}

function toggle(path, id) {
    //console.log(id+"/state")
    if (document.getElementById(id+"/state").innerText == "ON") {
        document.getElementById(id+"/state").innerText = "OFF";
        
        //document.getElementById(id).classList.remove('w3-blue').add('w3-border')
        firebase.database().ref(path).update({
            state: "OFF"
        })
    } else {
        //document.getElementById(id).classList.remove('w3-border').add('w3-blue')
        document.getElementById(id+"/state").innerText = "ON";
        firebase.database().ref(path).update({
            state: "ON"
        })
    }
}