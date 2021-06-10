eve = false;
var db = firebase.database().ref('GPDPROlOwsX9aAWDcM54y6jzDY12');
db.once('value',(s)=>{
    console.log(s);
    eve = s;
    LoadData()
});

function LoadData(){
    listOfBills = eve.child("expenditure/transaction").val()
    listOfBills.shift()
    
    nativeList = [];
    for (var bill of listOfBills){
        nativeList.push([bill["date"],bill["category"],bill["type"],bill["amount"]]) 
    }
    RenderTable(nativeList);
    segregated = segregate(listOfBills);
    values = CalculateAverage(segregated);
    
    peaks = PeakOfYear(segregated)
    nextDate = GetGasNextBookDate(segregated)
    setValues(values[2],values[1],peaks,nextDate)
}
months = ["Jan", "Feb", "Mar", "Apr","May","Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

function CalculateAverage(bills,month = new Date()){
    monthtotals = {}
    averages = {}
    totals = {}
    for (var category in bills){
        listOfBills = bills[category];
        totals[category]=0;
        counts = 0
        monthtotals[category]=0;
        for(var bill of listOfBills){
            billDate = new Date(bill["date"])
            console.log(billDate,month)
            if((billDate.getMonth()==month.getMonth()-1)&&(billDate.getFullYear()==month.getFullYear())){
                monthtotals[category]+=bill["amount"]*1;
            }
            if(billDate.getFullYear()==month.getFullYear()){
                totals[category]+=bill["amount"]*1;
                counts+=1;
            }
        }
        averages[category]=totals[category]/counts;
    }
    return [monthtotals,averages,totals]
}

function PeakOfYear(bills,year = new Date()){
    peaks = {}
    for (var category in bills){
        listOfBills = bills[category];
        peaks[category]=0;
        for(var bill of listOfBills){
            billDate = new Date(bill["date"])
            if(billDate.getFullYear()==year.getFullYear()){
                if(bill["amount"]*1>peaks[category]){
                    peaks[category]=bill["amount"]*1;
                }
            }
        }
    }
    return peaks;
}

function GetGasNextBookDate(listOfBills){
    bookdates = []
    differenceOfDays = 0
    prevBookDate = false
    avgNumberofDays = 0
    sumDays = 0
    count = 0
    newBookDate = 0
    for (var bill of listOfBills["gas"]){
        if(prevBookDate){
            thisdate = new Date(bill["bookdate"])
            differenceOfDays = Math.abs(thisdate.getTime() - prevBookDate.getTime()) / (1000 * 3600 * 24)
            bookdates.push(Math.floor(differenceOfDays))
            console.log(thisdate,prevBookDate, differenceOfDays)
            prevBookDate = new Date(bill["bookdate"])
        }else{
            prevBookDate = new Date(bill["bookdate"])
        }
        sumDays+=differenceOfDays
        count+=1
    }
    avgNumberofDays = sumDays/count
    console.log(bookdates)
    return{
        duration:avgNumberofDays,
        next:""
    }
    newBookDate =Math.abs(prevBookDate.getTime(prevBookDate.getTime() + (avgNumberofDays * 24 * 60 * 60 * 1000)))
    // TODO
}

function setValues(totals,averages,peaks,dates){
    // Household
    var Htotal = document.getElementById("holder/household/total")
    var Haverage = document.getElementById("holder/household/average")
    var HpeakValue = document.getElementById("holder/household/lastmonth")
    // Electricity
    var Etotal = document.getElementById("holder/electricity/total")
    var Eaverage = document.getElementById("holder/electricity/average")
    var EpeakValue = document.getElementById("holder/electricity/peakValue")
    var EpeakMonth = document.getElementById("holder/electricity/peakMonth")    // Month
    // Gas
    var Gduration = document.getElementById("holder/gas/duration")
    var GnextDate = document.getElementById("holder/gas/nextdate")
    var GlastRate = document.getElementById("holder/gas/lastrate")

    // Rendering Data
    Htotal.innerText = totals["household"];
    Haverage.innerText = averages["household"];
    HpeakValue.innerText = peaks["household"];

    Etotal.innerText = totals["electricity"];
    Eaverage.innerText = averages["electricity"];
    EpeakValue.innerText = peaks["electricity"];
    
    GlastRate.innerText = peaks["gas"];
    Gduration.innerText = dates["duration"]        ; //TODO
    GnextDate.innerText = dates["next"]  + "13/06/2021"    ;//TODO
}

function segregate(listOfBills){
    bills = {
        electricity:[],
        gas:[],
        repairs:[],
        groceries:[],
        misc:[]
    }
    for(var bill of listOfBills){
        if(bill["type"]=="expense"){
            if(bills[bill["category"].toLowerCase()]){
                bills[bill["category"].toLowerCase()].push(bill);
            }else{
                console.log("Unknown Category",bill)
            }
        }
    }
    console.log("Bills:",bills)
    return bills;
}

function RenderTable(list){
    console.log(list)
    var datatable = new DataTable(document.querySelector('#first-datatable-output'), {
        pageSize: 10,
        data:list,
        sort: [false, true, true,false],
        filters: [true, 'select', 'select',false],
        filterText: 'Type to find Bill',
        pagingDivSelector: "#paging-first-datatable"
    });
}