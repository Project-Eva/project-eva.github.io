
roomsf = document.getElementById('holder/rooms');

if(document.getElementById("power/mains/button")){
    DefinePowerMainControl()
}

function generateButtonsLazy(rooms) {
    for (const room in rooms) {
        roomSwitches = rooms[room]["switches"];
        powerOfDevices={ }
        
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

    <div class="w3-container w3-d-blue w3-padding-16" style="height:170px;position:relative;"  title="`+room+"/"+switches+`" id="`+room+"/"+switches+`">
        <div class="w3-left w3-large"><i class="material-icons w3-xxxlarge">light</i></div>
        <h6 style="text-align: right;" id="`+room+"/"+switches+"/room"+`">`+roomname+`</h6>
        <h4 style="text-align: right;" id="`+room+"/"+switches+"/name"+`">`+nickname+`</h4>
        <div class="w3-container" >
            <button class="w3-button w3-switch-scheduler" onclick="addNewSchedule('`+room+"/"+switches+`')" title="Schedule ON/OFF Time"><i class="material-icons w3-center">timer</i></button>
            <button id="`+room+"/"+switches+"/state"+`" class=" w3-right `+(state=="ON" ? "w3-white":"")+` w3-button w3-small w3-border w3-switch-toggler" >`+state+`</button>
        </div>
    </div>
`;
                    roomsf.insertBefore(div,document.getElementsByClassName('blank-button-card')[0]);
                    ButtonizeSwitches(room,switches);
                    document.getElementsByClassName('blank-button-card')[0].parentElement.removeChild(document.getElementsByClassName('blank-button-card')[0])
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

function DefinePowerMainControl(){
    document.getElementById("power/mains/button").addEventListener('click',()=>{
        if(document.getElementById("power/mains/button").innerText=="Off All"){
            s="OFF"
            document.getElementById("power/mains").classList.remove("w3-red")
            document.getElementById("power/mains/button").innerText="On All"
            document.getElementById("power/mains").style.opacity=0.5
        }else{
            s="ON"
            document.getElementById("power/mains").classList.add("w3-red")
            document.getElementById("power/mains/button").innerText="Off All"
            document.getElementById("power/mains").style.opacity=1
        }
        rooms = Lcache["rooms"];
        for (const room in rooms) {
            roomSwitches = rooms[room]["switches"];
            for (const switches in roomSwitches) {
                firebase.database().ref(UserID+"/rooms/"+room+"/switches/"+switches).update({
                    state: s
                })
            }
        }
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