Text=false;
      const recognize = function(evt){
        const files = evt.target.files;

        Tesseract.recognize(
        files[0],
        'eng',
        { logger: m => {
          console.log(m);
          Progress(m.progress,m.status);
        } }
      ).then(({ data: { text } }) => {
        console.log(text);
        Text=text;
        GetDates()
      })
      }
      const elm = document.getElementsByClassName('drop-zone__input')[0];
      elm.addEventListener('change', recognize);
      
      function Progress(progress,text){
        if(progress>0){
          document.getElementsByClassName('ocr-progress-bar')[0].style.opacity=1;
        }else{
          document.getElementsByClassName('ocr-progress-bar')[0].style.opacity=0;
        }
        document.getElementsByClassName('ocr-progress')[0].style.width=(progress*100)+"%"
        document.getElementsByClassName('ocr-progress-text')[0].innerText=text
      }
      Text=`
      WO e e
Denand/Disconriect jon flot 128
(‘Electricity Act 2003 P 56/
Custoner Care 1912
HulankunathukaSect 101
0487-220023¢
KSE&I.*G‘SIM JOMRECREL ““1 1
Il
M
CH561 L0009 38
Bille Segoan210009
Gom. 1+ 8567478
Hane + E0 HaNoJ
$/0 MTONYEDRKKATTU
Pole ATRE/3
Trans SEEKEND
tieters 1306719
oill rea : B01/24/50
Bill Date * 24/12/2020
Due Date - 0/01/2021
Discom Dt: 19/01/2021
Tariff < LT-1A Don
Purpose * Dorestic
§ Denosit : 873
Heter (it Status O
Load 1Kk
C Denand < 0.4 i
Phase ]
Prv Rd 0t ¢ 23/10/2020
Prs Rd Dt ¢ 20/12/2020
Kt Rd(ONF): 1
i 3
‘Prv Paid Dt - 02-11-2020
Pry Paid fint * 257
Unit Curr Prev Cons Ay
Kif/a/1 2686 2742 145 128
Fixed Charges 5000
Heter Rent ¢ 142
Energy Charges 485 20
Duty 1852
fovt Subsidies : -100.00
Bill Anount 2 an
Payable : 337 00
Renarks
Htr Rent: 12 CGST 8% 105 S6ST % 1.08
CESS 15:0
%4 Unling httes bl
SHED dosea )
SN Heter finade it
BRSNS 103 /e
23-12-2000 Baisc ol`
      function GetDates(){
        lines = Text.split('\n');
        dates = []
        amounts=[]
        biller=false
        for (i=0; i<lines.length;i++){
          date = lines[i].match(/[0-9][0-9][\/-][0-9]{2}[\/-][0-9]{4}/)
          if(date && lines[i].toLowerCase().includes('bill')){
            Progress(1,"Processed Text")
            dates.push(date[0])
          }
          if((lines[i].toLowerCase().includes("bill") || lines[i].toLowerCase().includes("payable") || lines[i].toLowerCase().includes("amount") ) && (lines[i].match(/\s[0-9]+\s/)!=null) ){
            amounts.push(lines[i].match(/\s[0-9]+\s/)[0]*1)
          }
          if(lines[i].toLowerCase().includes('kseb')){
            biller="KSEB"
          }
        }
        console.log(dates,amounts,biller)
        PrintResults("------------------------")
        if(biller){
          PrintResults("Biller: "+biller)
        }else{
          PrintResults("Biller: <Not scanned>")
        }
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];


        if(dates.length){
          dates = [...new Set(dates)].sort()
          var parts = dates[0].split("/");
          var dt = new Date(parseInt(parts[2], 10),
                    parseInt(parts[1], 10) - 1,
                    parseInt(parts[0], 10));
          PrintResults("Bill Date: "+ dates[0])
        }else{
          PrintResults("Bill Date: <Not scanned>")
        }

        if(amounts.length){
          amounts = [...new Set(amounts)].reverse()
          PrintResults("Amount: Rs. "+amounts[0]+".0/-")
        }else{
          PrintResults("Amount: <Not scanned>")
        }
        PrintResults("------------------------")
      }

      function PrintResults(text){
        document.getElementsByClassName('ocr-text')[0].innerText+=text+"\n"
      }
