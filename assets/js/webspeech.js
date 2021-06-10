


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




// voiceSearch.addEventListener('click',()=>{
//     if(!IdleMode){
//         VoiceModalOpen();
//         SpeechToText();
//         if(!voiceSearch.classList.contains("voice-active")){
//             voiceSearch.classList.add("voice-active");
//         }
//     }else{
//         IdleMode=false;
//         recognition.stop();
//         VoiceModalClose();
//         if(voiceSearch.classList.contains("voice-active")){
//             voiceSearch.classList.remove("voice-active");
//         }
//     }
// })

