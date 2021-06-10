// document.getElementById('add_form').classList.toggle('w3-show'); 
// openTab(false, 'credit');
var category = ""
var Tmode = ""
function nextField(ele) {
  value = ele.value;
  if (value == "gas") {
    if (document.getElementById(category)) {
      document.getElementById(category).style.display = "none";
    }
    category = "gas"
    document.getElementById(category).style.display = "block";
  } else if (value == "electricity") {
    if (document.getElementById(category)) {
      document.getElementById(category).style.display = "none";
    }
    category = "electricity"
    document.getElementById(category).style.display = "block";
  } else {
    if (document.getElementById(category)) {
      document.getElementById(category).style.display = "none";
    }
  }
}

function SubmitForm(){
  data={}
  if(Tmode=="debit"){
    data = {
      units:(document.getElementsByName("debit-units")[0].value)?document.getElementsByName("debit-units")[0].value:null,
      category:document.getElementsByName("debit-cat")[0].value,
      date:DateConvert(document.getElementsByName("debit-date")[0].value),
      bookdate: DateConvert((document.getElementsByName("debit-bookdate")[0].value)?document.getElementsByName("debit-bookdate")[0].value:null) ,
      amount:document.getElementsByName("debit-amount")[0].value,
      type:"expense"
    }
  }else{
    data = {
      category:document.getElementsByName("credit-cat")[0].value,
      date:DateConvert(document.getElementsByName("credit-date")[0].value),
      amount:document.getElementsByName("credit-amount")[0].value,
      type:"income"
    }
  }
  firebase.database().ref(UserID+"/expenditure/transaction/").push(data)
  console.log(data);
}

function DateConvert(date){
  if(date==null) return null;
  ndate = new Date(date);
  newdate = (ndate.getMonth()+1)+"/"+ndate.getDate()+"/"+ndate.getFullYear()
  return newdate
}

function openTab(evt, mode) {
  var i, x, tablinks;
  x = document.getElementsByClassName("city");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" w3-d-blue", "");
  }
  document.getElementById(mode).style.display = "block";
  evt.currentTarget.className += " w3-d-blue";
  Tmode = mode;
}
