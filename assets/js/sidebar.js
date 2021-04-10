var mySidebar = document.getElementById("navBar");
var overlayBg = document.getElementById("myOverlay");
function w3_open() {
    if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
    } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
    }
}

// Close the sidebar with the close button
function w3_close() {
    mySidebar.style.display = "none";
    overlayBg.style.display = "none";
    MaxiBar()
}

navSmall = false;
navBar = document.getElementById('navBar');
mainPage = document.getElementsByClassName('w3-main')[0];
spans = navBar.querySelectorAll("span");
icons = navBar.querySelectorAll(".fa");
voiceEva = document.getElementById('eva-search')
navBotLogo = navBar.querySelectorAll("#navBottomLogo")[0];
navLogo = document.getElementById('nav-logo');
function NavMinimize(){
    if(navSmall){
        MaxiBar()
    }else{
        MiniBar();
        w3_open()
    }
}

function MiniBar(){
    navBar.style.width="80px";
    navLogo.innerText = "EVA"
    mainPage.style.marginLeft="100px";
    navLogo.style.width="80px";
    voiceEva.style.width="55px";
    voiceEva.style.height="55px";
    navBotLogo.innerHTML = "<b>EVA</b>";
    [].forEach.call(spans, (span)=>{
        span.classList.add("w3-hide")
    });
    [].forEach.call(icons, (icon)=>{
        icon.classList.add("w3-icon-only")
    });
    navSmall=true;
    SavePref()
}

function MaxiBar(){
    mainPage.style.marginLeft="200px";
    navBar.style.width="200px";
    navLogo.innerText = "Project EVA"
    navLogo.style.width="200px";
    voiceEva.style.width="90px";
    voiceEva.style.height="90px";
    navBotLogo.innerHTML = "EEFA | Project <b>EVA</b>";
    [].forEach.call(icons, (icon)=>{
        icon.classList.remove("w3-icon-only")
    });
    [].forEach.call(spans, (span)=>{
        setTimeout(()=>{span.classList.remove("w3-hide")},80)
    });
    navSmall=false;
    SavePref()
}

function SavePref() {
    if (typeof(Storage) !== "undefined") {
        localStorage.MiniBar = navSmall;
        console.log("Saving Navsmall",navSmall,localStorage.MiniBar)
    } else {
        console.log("Sorry, your browser does not support web storage...");
    }
}

function RunPref(){
    if (typeof(Storage) !== "undefined") {
        if (localStorage.MiniBar) {
            if(navSmall!=localStorage.MiniBar){
                navSmall=(localStorage.MiniBar==="true"?true:false);
                console.log("Retrieving Navsmall",navSmall,localStorage.MiniBar)
                if(navSmall){
                    console.log("Doing Navsmall",navSmall,localStorage.MiniBar);
                    MiniBar()
                    console.log("Minimizing")
                }
            }
            
            
        }
    }
    setTimeout(()=>{navBar.classList.add('w3-animation');},2000)
}
    
RunPref()
