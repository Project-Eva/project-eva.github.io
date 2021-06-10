var eve = false;
var months = ["Jan", "Feb", "Mar", "Apr","May","Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

firebase.database().ref('GPDPROlOwsX9aAWDcM54y6jzDY12/device-params/logs').on('value',(s)=>{
    FetchLogs(s.val())
});

firebase.database().ref(UserID).child("device-params/").update({
    state: "Logging"
})

function FetchLogs(Logs){
    logs = Object.values(Logs)
    for (log of logs){
        document.getElementById("holder/logs").innerHTML+=RenderLogs(log["message"],log["timestamp"])
    }
    
}

function Reboot(){
    firebase.database().ref(UserID).child("device-params/").update({
        state: "Reboot"
    })
}
function Refresh(){
    firebase.database().ref(UserID).child("device-params/").update({
        state: "Logging"
    })
}
function Shutdown(){
    firebase.database().ref(UserID).child("device-params/").update({
        state: "Shutdown"
    })
}


function RenderLogs(title,timestamp){
    log = `<tr>
    <td>`+title+`</td>
    <td><i>`+timestamp+`</i></td>
    </tr>`
    return log
}

