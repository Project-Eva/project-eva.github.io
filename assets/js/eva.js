
// chatmsg = document.getElementsByName("chatText")[0];
const voiceStatus = document.getElementById('eva-status');
const voicebar = document.getElementsByName('eva-bar')[0];
const voiceOutput = document.getElementById('eva-output');
//Button
const voiceSearch = document.getElementById('eva-search');
const chatContainer = document.getElementsByClassName('chat-container')[0];
const eva_send = document.getElementById('eva-send');

var EVA_Mode = 0;

SpeechRecognition=false
recognition = false
IdleMode = false
var SpeechGrammarList = false
var speechRecognitionList = false

function InitializeSpeech(){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // if none exists -> undefined
    if(SpeechRecognition){
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
        if(SpeechGrammarList){
            speechRecognitionList = new SpeechGrammarList();
            speechRecognitionList.addFromString(grammar, 1);
            recognition.grammars = speechRecognitionList;
        }

        recognition.addEventListener("start", ()=>{
            voiceStatus.innerText = "Listening...";
            voiceOutput.innerText = "Listening...";
        });

        recognition.addEventListener("end", ()=>{
            voiceStatus.innerText = "Stopped";
            voiceOutput.innerText = "Stopped";
            console.log("Stopped Listening");
        });

        recognition.addEventListener("result", parseSpeechText);
    }else{
        console.log("Browser Doesn't Support Speech Recognition.")
        voiceOutput.innerText = "Browser Doesn't Support Speech Recognition."
        voiceStatus.innerText = "Error - Not Supported"
    }
}

function ManualTrigger(){
    message = voicebar.value;
    parseText(message);
}

function parseText(message){
    answer = whichAct.classify(message);
    voiceOutput.innerText = message;
    response = document.createElement('p')
    response.classList.add("you-chat")
    response.innerText = message;
    response.scrollIntoView();
    chatContainer.appendChild(response)
    RefineOne(answer,message)
}

function parseSpeechText(event){
    const current = event.resultIndex;
    const message = event.results[current][0].transcript;
    parseText(message)
}

    
function RefineOne(action,message){
    voicebar.value=message;
    console.log("Heard: ",message)
    switch (action){
        case "assistant":
            Assistant(message)
            break;
        case "system":
            SystemControl(message);
            break;
        case "navigation":
            console.log("navigation",message)
            path = navigation.classify(message);
            NavAction(path)
            break;
        case "switch-control":
            mode = SwitchMode.classify(message)
            SwitchControl(mode,message)
            break;
        case "other":
            say("Sorry !, Could you rephrase that?");break;
    }
}

function Assistant(message){
    action = assistant.classify(message)
    console.log(action)
    switch (action){
        case "introduce":
            say("Hello There!, I'm E-Vah. Your Digital Assistant");break;
        case "stop":
            say("See you later!");break;
        case "start":
            ListenMode(1)
            say("I'm Listening!");break;
        case "exit":
            say("Bye!");
            ListenMode(0)
            break;
            
    }
}

function ListenMode(mode){
    if(mode==1){
        EVA_Mode = 1;
    }else if(mode==2){
        EVA_Mode = 2;
    }else{
        EVA_Mode = 0;
        // recognition.stop();
    }
}

function SystemControl(message){
    action = System.classify(message);
    say(action+"ing the System");
}

function SwitchControl(mode,message){
    console.log(mode);
    say("Switching "+mode+" the Device.")
}
    
function NavAction(path){
    pages={
        home:"",
        switches:"control",
        finance:"finance",
        insights:"insights",
        settings:"device",
    }
    say ("Navigating to "+pages[path]+" page");
    parsed = pages[path]
    setTimeout(()=>{
        location.replace("http://localhost:5500/"+parsed)
    },2000)
}

// Synth
function say(text) {
  if ('speechSynthesis' in window) {
	var msg = new SpeechSynthesisUtterance();
  	msg.text = text;
    msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Microsoft Hazel - English (United Kingdom)" })[0];
	window.speechSynthesis.speak(msg);
    voiceOutput.innerText = text;
    response = document.createElement('p')
    response.classList.add("eva-chat")
    response.innerText = text;
    chatContainer.appendChild(response)
    response.scrollIntoView();
    setTimeout(()=>{voiceOutput.innerText = "Listening...";},4000)
  }else{
      console.log("Speech Synth not supported on this Browser")
  }
}



//  Modal Controls
var modal = document.getElementById('eva-modal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    VoiceModalClose()
  }
}

function VoiceModalClose(){
    modal.style.opacity = 0;
    setTimeout(()=>{
      modal.style.display = "none";
      modal.style.opacity = 1;
    },2000)
    if(voiceSearch.classList.contains("voice-active")){
        voiceSearch.classList.remove("voice-active");
    }
    //recognition.stop();
}

function VoiceModalOpen(){
    modal.style.opacity = 0;
    modal.style.display = "block";
    setTimeout(()=>{
        modal.style.opacity = 1;
    },2000)
    if(!voiceSearch.classList.contains("voice-active")){
        voiceSearch.classList.add("voice-active");
    }
    //recognition.stop();
}

eva_send.addEventListener('click',()=>{
    ManualTrigger();
})

function SpeechToText(){
    if(!SpeechRecognition){
        InitializeSpeech();
    }
    recognition.start();
}


voiceSearch.addEventListener('click',()=>{
    if(!EVA_Mode){
        VoiceModalOpen();
        SpeechToText();
        if(!voiceSearch.classList.contains("voice-active")){
            voiceSearch.classList.add("voice-active");
        }
    }else{
        EVA_Mode=0;
        recognition.stop();
        VoiceModalClose();
        if(voiceSearch.classList.contains("voice-active")){
            voiceSearch.classList.remove("voice-active");
        }
    }
})