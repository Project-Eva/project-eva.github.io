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

//ADD Transaction

var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);