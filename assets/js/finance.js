var eve = false;
var db = firebase.database().ref('GPDPROlOwsX9aAWDcM54y6jzDY12/expenditure/transaction');
var months = ["Jan", "Feb", "Mar", "Apr","May","Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

db.once('value',(s)=>{
    eve = s;
    LoadData()
});

function LoadData(){
    listOfBills = Object.values(eve.val())
    // listOfBills.pop()
    console.log(listOfBills);
    nativeList = [];
    for (var bill of listOfBills){
        nativeList.push([bill["date"],bill["category"],bill["type"],bill["amount"]]) 
    }
    RenderTable(nativeList);
    segregated = segregate(listOfBills);
    values = CalculateCategoryAverage(segregated);
    CalculateAllAverage(nativeList)
    getMonthlyBills(nativeList)
    peaks = PeakOfYear(segregated)
    nextDate = GetGasNextBookDate(segregated)
    setValues(values[2],values[1],peaks,nextDate)
    GetLists()
}

function CalculateAllAverage(bills){
    var TotalIncome = 0
    var TotalExpense = 0
    var date = new Date();
    for (var bill of bills){
        bill_date = new Date(bill[0])
        if(bill_date<date)              date = bill_date;
        if(bill[2]=="expense")          TotalExpense  += bill[3]*1;
        if(bill[2]=="income")           TotalIncome  += bill[3]*1;
        
    }
    months = monthDiff(date,new Date());
    document.getElementById("holder/household/average").innerText = (TotalExpense/months).toFixed(2)
    document.getElementById("holder/household/income").innerText = (TotalIncome/months).toFixed(2)
    document.getElementById("holder/household/savings").innerText = (TotalIncome - TotalExpense).toFixed(2)

}

function CalculateCategoryAverage(bills,month = new Date()){
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
            // console.log(billDate,month)
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
            // console.log(thisdate,prevBookDate, differenceOfDays)
            prevBookDate = new Date(bill["bookdate"])
        }else{
            prevBookDate = new Date(bill["bookdate"])
        }
        sumDays+=differenceOfDays
        count+=1
    }
    avgNumberofDays = Math.floor(sumDays/count)
    // console.log(bookdates)
    var newBookDate = new Date(prevBookDate);
    // console.log(prevBookDate," + ",avgNumberofDays);
    newBookDate.setDate(prevBookDate.getDate() + avgNumberofDays);
    // console.log(newBookDate);
    return{
        duration:avgNumberofDays,
        next:newBookDate
    }
}

// Set DOM values
function setValues(totals,averages,peaks,dates){
    // Household
    // Electricity
    var Etotal = document.getElementById("holder/electricity/total")
    var Eaverage = document.getElementById("holder/electricity/average")
    var EpeakValue = document.getElementById("holder/electricity/peakValue")
    var EpeakMonth = document.getElementById("holder/electricity/peakMonth")    // Month
    // Gas
    var Gduration = document.getElementById("holder/gas/duration")
    var GnextDate = document.getElementById("holder/gas/nextdate")
    var GlastRate = document.getElementById("holder/gas/lastrate")

    Etotal.innerText = totals["electricity"].toFixed(2);;
    Eaverage.innerText = averages["electricity"].toFixed(2);;
    EpeakValue.innerText = peaks["electricity"].toFixed(2);;
    
    GlastRate.innerText = peaks["gas"];
    Gduration.innerText = dates["duration"].toFixed(2);        ; //TODO
    GnextDate.innerText = printDate(dates["next"])    ;//TODO
}

function printDate(date){
    var months = ["Jan", "Feb", "Mar", "Apr","May","Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
    var datestring =  months[date.getMonth()]+ " "+ date.getDate() + ", " + date.getFullYear()
    return datestring
}

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
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
    // console.log("Bills:",bills)
    return bills;
}

function RenderTable(list){
    // console.log(list)
    var datatable = new DataTable(document.querySelector('#first-datatable-output'), {
        pageSize: 10,
        data:list,
        sort: [false, true, true,false],
        filters: [true, 'select', 'select',false],
        filterText: 'Type to find Bill',
        pagingDivSelector: "#paging-first-datatable"
    });
}

function movingAvg(array, count, qualifier=function(val){ return val != 0; }){
    
    // calculate average for subarray
    var avg = function(array, qualifier){

        var sum = 0, count = 0, val;
        for (var i in array){
            val = array[i];
            if (!qualifier || qualifier(val)){
                sum += val;
                count++;
            }
        }

        return sum / count;
    };

    var result = [], val;

    // pad beginning of result with null values
    for (var i=0; i < count-1; i++)
        result.push(null);

    // calculate average for each subarray and add to result
    for (var i=0, len=array.length - count; i <= len; i++){

        val = avg(array.slice(i, i + count), qualifier);
        if (isNaN(val))
            result.push(null);
        else
            result.push(val.toFixed(2));
    }

    return result;
}

monthly={}

function getMonthlyBills(bills){
    console.log(bills)
    for (bill of bills){
        billDate = new Date (bill[0])
        if(bill[2]=="income") continue
        if(billDate.getFullYear()=="2021"){
            if(billDate.getMonth()+1 in monthly){
                // monthly[billDate.getMonth()+1].push({
                //     amount:bill[3]*1,
                //     category: bill[1]
                // })
                category = bill[1];
                monthly[billDate.getMonth()+1][category]=bill[3]*1
                console.log(bill)
            }else{
                category = bill[1];
                monthly[billDate.getMonth()+1]={}
                monthly[billDate.getMonth()+1][category]=bill[3]*1
            }
        }
    }
    console.log(monthly)
}

function GetLists(){
    last_gas=0;
    last_elec=0;
    gas = []
    electricity = []
    totals = []
    lastMonth = Object.keys(monthly).reverse()[0]
    for (i = 1;i<=lastMonth;i++){
        if(i in monthly){
            if("gas" in monthly[i]){
                last_gas = monthly[i]["gas"];
            }
            if("electricity" in monthly[i]){
                last_elec = monthly[i]["electricity"];
            }
            electricity.push(last_elec)
            gas.push(last_gas)
            totals.push(last_elec+last_gas)
        }else{
            electricity.push(last_elec)
            gas.push(last_gas)
            totals.push(last_elec+last_gas)
        }
    }
    for (j = 0; j<(12-gas.length);j++){
        gas.push(null)
        electricity.push(null)
        totals.push(null)
    }
    console.log(gas)
    console.log(electricity)
    CreateChart(electricity,gas,totals)
}

// Chart Begins
// function movingAverage(array, countBefore, countAfter) {
//     if (countAfter == undefined) countAfter = 0;
//     const result = [];
//     for (let i = 0; i < array.length; i++) {
//       const subArr = array.slice(Math.max(i - countBefore, 0), Math.min(i + countAfter + 1, array.length));
//       const avg = subArr.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0) / subArr.length;
//       result.push(avg.toFixed(2));
//     }
//     return result;
//   }

function CreateChart(electricity,gas,totals){
    var options = {
        series: [{
        name: 'Electricity',
        type: 'column',
        data: electricity
      }, {
        name: 'Gas',
        type: 'column',
        data: gas
      },
      {
        name: 'Total',
        type: 'line',
        data: totals
      },
      {
        name: 'Predicted',
        type: 'line',
        data: movingAvg(totals,6)
      }],
        chart: {
        height: 330,
        type: 'line',
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [1, 5,3,2]
      },
      title: {
        text: 'Finance Overview',
        align: 'center',
        offsetX: 0
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr","May","Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
        title: {
          text: "Time of the Year",
          color: "#008FFB"
        }
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            style: {
              colors: '#008FFB',
            }
          },
          title: {
            text: "Rupees Spent",
            style: {
              color: '#008FFB',
            }
          },
          tooltip: {
            enabled: true
          }
        },
      ],
      tooltip: {
        fixed: {
          enabled: false,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        },
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40
      }
      };
    
      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    
}