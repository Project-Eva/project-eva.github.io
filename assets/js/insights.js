var eve = false;
var db = firebase.database().ref('GPDPROlOwsX9aAWDcM54y6jzDY12');
var months = ["Jan", "Feb", "Mar", "Apr","May","Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]

db.once('value',(s)=>{
    eve = s;
    LoadData()
});

function LoadData(){
  var bills = Object.values(eve.child("expenditure/transaction").val())
  rooms = Object.values(eve.child("rooms").val())
  console.log(rooms)
  
  listOfBills = segregate(bills)
  console.log(PeakOfPower(listOfBills))
  ebill = LastBill(listOfBills)
  console.log(AverageUnits(listOfBills))
  getMonthlyUnits(listOfBills)
  PowerEachDevice(rooms,ebill)
}

function PowerEachDevice(rooms,last){
  var allrooms = rooms
  var devicePower = {}
  total = 0
  cats = {
    fan:"flare",
    bulb:"wb_incandescent",
    tube:"wb_iridescent"
  }
  for (room of allrooms){
    devices = Object.values(room["switches"])
    console.log(devices)
    for (device of devices){
      devicePower[device["nickname"]]=((device["power"]*1)*((device["usage"]/(60*60))*1)).toFixed(2)
      total += devicePower[device["nickname"]]*1
      AddDevice(renderDevice(device["nickname"],device["power"],devicePower[device["nickname"]],cats[device["category"]]))
    }
  }
  
  effect = ((total/(last.units/2)*1)*100).toFixed(2)
  console.log(effect)
  document.getElementById('effect/devices').innerText = effect + "%"
  document.getElementById('effect/total').innerText = 100-effect + "%"
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

function LastBill(bills){
  Ebill = bills["electricity"][0]
  
  for(var bill of bills["electricity"]){
      billDate = new Date(bill["date"])
      if(billDate.getFullYear()=="2021"){
        EbillDate = new Date(Ebill["date"])
          if(EbillDate<billDate){
            Ebill = bill
          }
      }
  }
  document.getElementById('energy/prev').innerText = Ebill["units"]
  return Ebill;
}

function AverageUnits(bills){
  total = 0;
  for(var bill of bills["electricity"]){
      billDate = new Date(bill["date"])
      if(billDate.getFullYear()=="2021"){
          total+=bill["units"]*1;
      }
  }
  average = (total/bills["electricity"].length).toFixed(2)
  document.getElementById('energy/avg').innerText = average
  return average
}

function PeakOfPower(bills,year = new Date()){
  peak_power = 0;
  peak_month = ""
  for(var bill of bills["electricity"]){
      billDate = new Date(bill["date"])
      if(billDate.getFullYear()==year.getFullYear()){
          if(bill["units"]*1>peak_power){
              peak_power=bill["units"]*1;
              peak_month=months[billDate.getMonth()-1]
          }
      }
  }
  document.getElementById("energy/peakMonth").innerText = peak_month
  document.getElementById("energy/peakVal").innerText = peak_power
  return [peak_power,peak_month];
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
  console.log(result)
  return result;
}

monthly={}

function getMonthlyUnits(bills){
  monthlyUnits = new Array(12);
  monthlyUnits.fill(null,0,12)
  for (bill of bills["electricity"]){
     billMonth = new Date(bill["date"]).getMonth()
     monthlyUnits[billMonth] = bill["units"]*1
     
  }
  console.log(monthlyUnits)
  GetLists(monthlyUnits)
}

function GetLists(monthlyUnits){
  electricity = []
  prev=0
  lastMonth = new Date().getMonth()
  for (i = 0;i<=lastMonth;i++){
      if(monthlyUnits[i]==null){
        monthlyUnits[i]=prev
      }else{
        monthlyUnits[i]/=2
      }
      prev=monthlyUnits[i]
      
  }
  console.log(monthlyUnits)
  chartRender(monthlyUnits)
}

function AddDevice(device){
   device_holder = document.getElementById("holder/devices");
   device_holder.removeChild(device_holder.firstChild);
   device_holder.innerHTML+=device
}

function renderDevice(name,units,power,type){
  innerHTML = `<div class="w3-quarter w3-d-blue w3-hover-blue w3-border-right-white w3-animation w3-margin-top">
  <div class="w3-container w3-light gray w3-padding-16">
    <div class="w3-left  w3-large"><i class="material-icons w3-xxxlarge">`+type+`</i></div>
    <h6 style="text-align: right;">`+name+`</h6>
    <h4 style="text-align: right;">`+units+` W</h4>
    <h4 style="text-align: left;">`+power+` Units</h4>
  </div>
</div>`
return innerHTML
}

function chartRender(electricity){
  var options = {
    series: [{
    name: 'Unit Consumption',
    type: 'column',
    data: electricity
  }, {
    name: 'Predicted Units',
    type: 'column',
    data: movingAvg(electricity,4)
  },],
    chart: {
    height: 330,
    type: 'line',
    stacked: false
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: [1, 5]
  },
  title: {
    text: 'Current Consumption',
    align: 'left',
    offsetX: 0
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr","May","Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
    title: {
      text: "Time",
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
        text: "Units Consumed",
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