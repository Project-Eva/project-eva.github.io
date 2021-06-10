schedulesTable = document.getElementById('holder/schedules');

function generateSchedulesLazy(schedules){
    console.log(schedules);
    while(schedulesTable.firstChild)schedulesTable.removeChild(schedulesTable.firstChild);
    for (const nth in schedules) {
        if(nth=="state") continue;
        schedule = schedules[nth];
        row = `
            <td>`+schedule["title"]+`</td>
            <td>`+schedule["switch"]+`</td>
            <td>`+schedule["action"]+`</td>
            <td>`+schedule["time"]+`</td>
            <td> <button class="w3-button" onclick="if(confirm('Delete Schedule?'))deleteSchedule('`+nth+`');"><i class="material-icons">delete</i></button> </td>`;
        tr = document.createElement("tr")
        tr.innerHTML = row;
        schedulesTable.appendChild(tr);
    }
}

function deleteSchedule(nth){
    firebase.database().ref(UserID+"/schedules/"+nth).remove().then(
        function(){
            console.log("Removed Schedule");
        }
    )
    FetchSchedules();
}

function FetchSchedules(){
    firebase.database().ref(UserID+"/schedules/").once('value', (snapshot) => {
        console.log(snapshot.val())
        generateSchedulesLazy(snapshot.val());
    });
}

function addNewSchedule(switchpath){
    firebase.database().ref(UserID+"/schedules/").push({
        title:prompt("Enter Title for Schedule"),
        switch:switchpath,
        action:prompt("Enter Action (ON/OFF)"),
        time:prompt("Enter Time")
    }
    )
    FetchSchedules()
}