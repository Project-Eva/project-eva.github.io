

eve = false;
var db = firebase.database().ref('GPDPROlOwsX9aAWDcM54y6jzDY12');
db.once('value',(s)=>{
    console.log(s);
    eve = s;
    DoSomething()
});


today = new Date();

MonthExpense=0
MonthIncome=0

TotalExpense=0
TotalIncome=0

function DoSomething(){
    list = eve.child("expenditure/transaction").val()
    keys = Object.keys(list);
    l = keys.length;
    actualList = []
//{amount: 250, category: "food", date: "02/02/2021", type: "Expense"}
    for(i=0;i<l;i++){
        bill = list[keys[i]];
        console.log(bill);
        actualList.push([bill.date,bill.category,bill.type,bill.amount])
        
        // Is it this year ?
        //today.getFullYear()
        billYear = "1999"==new Date(bill.date).getFullYear()
        billMonth= today.getMonth()==new Date(bill.date).getMonth()
        //is this bill of this year?
        if(billMonth && billYear){
            console.log("this month!",bill.date)
            if(bill.type=="expense"){
                MonthExpense+=bill.amount*1
            }
            if(bill.type=="income"){
                MonthIncome+=bill.amount*1
            }
        }

        
    }
    RenderTable(actualList);
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

var options = {
    series: [{
    name: 'Expenditure',
    type: 'column',
    data: [0.4, 1.2, ]
  }, {
    name: 'Fee',
    type: 'line',
    data: [2.4, 3.2, 4.5, 3.5, 1.6, 1.4]
  },
  {
    name: 'Expected Expense',
    type: 'column',
    data: [0, 0,2.5, 1.5, 0.6,.4]
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
    width: [1, 5]
  },
  title: {
    text: 'Expenditure Analysis',
    align: 'left',
    offsetX: 0
  },
  xaxis: {
    categories: ["Jan-Feb", "Mar-Apr", "May-Jun", "Jul-Aug", "Sept-Oct", "Nov-Dec"],
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
        text: "Expenditure",
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
