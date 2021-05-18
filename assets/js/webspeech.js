//Button
const voiceSearch = document.getElementById('eva-search');
const voiceStatus = document.getElementById('eva-status');
const voicebar = document.getElementsByName('eva-bar')[0];
const voiceOutput = document.getElementById('eva-output');




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

        recognition.addEventListener("result", getText);
    }else{
        console.log("Browser Doesn't Support Speech Recognition.")
        voiceOutput.innerText = "Browser Doesn't Support Speech Recognition."
        voiceStatus.innerText = "Error - Not Supported"
    }
}

triggers = {
    "switches":["turn","switch","make","put","start","stop"],
    "state":{
        "ON":["running","on","alive","start"],
        "OFF":["dead","off","stop","kill"],
        "Invert":["not"]
    },
    "navigate":["goto","go","to","navigate","open"]
}

var words = [ 'eva' , 'evaa' , 'turn', 'switch','kill','on','off','stop','alive','dead','make','put','not','running','navigate','exit','open','goto','go','to'];
var grammar = '#JSGF V1.0; grammar words; public <words> = ' + words.join(' | ') + ' ;'



function getText(event){
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    console.log(transcript);
    if(transcript.toLowerCase().trim()==="stop listening" || transcript.toLowerCase().trim()==="star plus me" || transcript.toLowerCase().trim()==="star plus live") {
        IdleMode=true;
        voiceStatus.innerText = "Idle";
        voiceOutput.innerText = "Idle";
        voicebar.value="";
        voiceSearch.classList.remove("voice-active");
        VoiceModalClose();
        return;
    }
    else if(transcript.toLowerCase().trim()==="start listening") {
        IdleMode=false;
        voiceStatus.innerText = "Listening...";
        voiceOutput.innerText = "Listening...";
        voicebar.value=""
        voiceSearch.classList.add("voice-active");
        return;
    }
    if(transcript.toLowerCase().trim()==="exit") {
        IdleMode=false;
        voiceStatus.innerText = "Idle";
        voiceOutput.innerText = "Idle";
        voicebar.value="";
        VoiceModalClose();
        voiceSearch.classList.remove("voice-active");
        recognition.stop();
        return;
    }
    // Dont ask me why... they only hear Shiva when we say Eva ...
    if(transcript.toLowerCase().trim()==="eva" || transcript.toLowerCase().trim()==="shiva") {
        IdleMode=false;
        voicebar.value="";
        VoiceModalOpen();
        return;
    }
    if(!IdleMode){
        voicebar.value = transcript;
        text = transcript.toLowerCase().trim();
        state=false
        if(triggers["switches"].some(trigger=>text.includes(trigger))) {
            if(triggers["state"]["ON"].some(trigger=>text.includes(trigger))) {
                state=true
                voiceOutput.innerText = "Yeah Turn "+(state?"ON":"OFF")+" what?"
            }
            if(triggers["state"]["OFF"].some(trigger=>text.includes(trigger))) {
                state=false
                voiceOutput.innerText = "Yeah Turn "+(state?"ON":"OFF")+" what?"
            }
            if(triggers["state"]["Invert"].some(trigger=>text.includes(trigger))) {
                state=(state?false:true);
                voiceOutput.innerText = "Yeah Turn "+(state?"ON":"OFF")+" what?"
                
            }
        }else if(triggers["navigate"].some(trigger=>text.includes(trigger))) {
            voiceOutput.innerText = "Yeah Go Where?"
        }
    }
}

function SpeechToText(){
        if(!SpeechRecognition){
            InitializeSpeech();
        }
        recognition.start();
}

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
    //recognition.stop();
}

voiceSearch.addEventListener('click',()=>{
    if(!IdleMode){
        VoiceModalOpen();
        SpeechToText();
        if(!voiceSearch.classList.contains("voice-active")){
            voiceSearch.classList.add("voice-active");
        }
    }else{
        IdleMode=false;
        recognition.stop();
        VoiceModalClose();
        if(voiceSearch.classList.contains("voice-active")){
            voiceSearch.classList.remove("voice-active");
        }
    }
})

function VoiceModalOpen(){
    modal.style.opacity = 0;
    modal.style.display = "block";
    setTimeout(()=>{
      
      modal.style.opacity = 1;
    },100)
}