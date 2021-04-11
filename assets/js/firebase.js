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
incomef = document.getElementById('holder/income');


var db = firebase.database().ref(UserID);
db.once('value', (snapshot) => {
    namef.innerText = snapshot.val().name;
    locf.innerText = snapshot.val().location;
    expensef.innerText = snapshot.val().expenditure.m_expense;
    incomef.innerText = snapshot.val().expenditure.m_income;
    statusf.innerText = snapshot.val()["device-params"]["state"];
    db.child("device-params/").update({
        state: "Pinging"
    })
    generateButtonsLazy(snapshot.val().rooms)
    startUpTimeCounter(snapshot.val()["device-params"]["last-seen"])
})

firebase.database().ref(UserID+'/device-params/state').on('value',(snap)=>{
    statusf.innerText = snap.val();
})

function generateButtonsLazy(rooms) {
    for (const room in rooms) {
        roomSwitches = rooms[room]["switches"];
        
        for (const switches in roomSwitches) {
            const element = roomSwitches[switches];
            console.log(element)
            var roomname = rooms[room]["nickname"];
            firebase.database().ref(UserID+'/rooms/' + room + "/switches/" + switches).on('value', (snap) => {
                state = snap.val().state;
                nickname = "Generic Device"
                if("nickname" in snap.val()){
                    nickname = snap.val().nickname;
                }
                if (document.getElementById(room +"/"+ switches)) {
                    if (state=="ON"){
                        document.getElementById(room +"/"+ switches+"/state").classList.add('w3-white')
                    }else{
                        document.getElementById(room +"/"+ switches+"/state").classList.remove('w3-white')
                    }
                    document.getElementById(room +"/"+ switches+"/state").innerText = state
                } else {
                    div = document.createElement('div')
                    div.classList.add("w3-quarter","w3-margin-top")
                    div.innerHTML=`

    <div class="w3-container w3-indigo w3-padding-16" title="`+room+"/"+switches+`" id="`+room+"/"+switches+`">
        <div class="w3-left w3-large"><i class="fa fa fa-lightbulb-o w3-xxxlarge"></i></div>
        <h6 style="text-align: right;" id="`+room+"/"+switches+"/room"+`">`+roomname+`</h6>
        <h4 style="text-align: right;" id="`+room+"/"+switches+"/name"+`">`+nickname+`</h4>
        <div class="w3-container">
            <button class="w3-hover-indigo w3-button" ><i class="fa  fa-pencil w3-center"></i></button>
            <button id="`+room+"/"+switches+"/state"+`" class=" w3-right `+(state=="ON" ? "w3-white":"")+` w3-button w3-small w3-border w3-padding" >`+state+`</button>
        </div>
    </div>
`;
                    roomsf.appendChild(div);
                    ButtonizeSwitches(room,switches);
                }
            })
        }
    }
}

function ButtonizeSwitches(room,switches){
    document.getElementById(room+"/"+switches+"/state").addEventListener('click', () => {
        toggle(UserID+'/rooms/' + room + "/switches/" + switches, room +"/"+ switches);
    })
}


function toggle(path, id) {
    if (document.getElementById(id+"/state").innerText == "ON") {
        document.getElementById(id+"/state").innerText = "OFF";
        firebase.database().ref(path).update({
            state: "OFF"
        })
    } else {
        document.getElementById(id+"/state").innerText = "ON";
        firebase.database().ref(path).update({
            state: "ON"
        })
    }
}

function startUpTimeCounter(from){
    setInterval(()=>{
        var dt = new Date(from);
        var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        document.getElementsByClassName('sys-uptime')[0].innerText = time;
    },1000)
}