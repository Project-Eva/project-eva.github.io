namef = document.getElementById('holder/name');
locf = document.getElementById('holder/location');
statusf = document.getElementById('holder/status');
expensef = document.getElementById('holder/expense');
incomef = document.getElementById('holder/income');

Lcache = false

var db = firebase.database().ref(UserID);
db.once('value', (snapshot) => {
    Lcache = snapshot.val()
    //namef.innerText = snapshot.val().name;
    //locf.innerText = snapshot.val().location;
    if(expensef){
        expensef.innerText = snapshot.val().expenditure.m_expense;
    }
    if(incomef){
        incomef.innerText = snapshot.val().expenditure.m_income;
    }
    if(statusf){
        statusf.innerText = snapshot.val()["device-params"]["state"];
    }
    db.child("device-params/").update({
        state: "Pinging"
    })
    if(document.getElementById('holder/rooms')){
        generateButtonsLazy(snapshot.val().rooms)
    }
    startUpTimeCounter(snapshot.val()["device-params"]["last-seen"])
})

function startUpTimeCounter(from){
    if(document.getElementsByClassName('sys-uptime')[0]){
        setInterval(()=>{
            var dt = new Date(from);
            var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
            document.getElementsByClassName('sys-uptime')[0].innerText = time;
        },1000)    
    }
}

firebase.database().ref(UserID+'/device-params/state').on('value',(snap)=>{
    if(statusf){
        statusf.innerText = snap.val();
        setTimeout(()=>{
            if(statusf.innerText!="Online"){
                statusf.parentElement.parentElement.classList.remove("w3-indigo")
                statusf.parentElement.parentElement.classList.add("w3-red")
                statusf.innerText="Offline"
            }else{
                statusf.parentElement.parentElement.classList.add("w3-indigo")
                statusf.parentElement.parentElement.classList.remove("w3-red")
            }
        },5000)
    }
})