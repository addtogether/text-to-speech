textarea = document.querySelector("textarea"),
voiceList = document.querySelector("select"),
speechBtn = document.getElementById("speech");
textBtn = document.getElementById("text");

let synth = speechSynthesis,
isSpeaking = true;
isRecording = true;

voices();

function voices(){
    for(let voice of synth.getVoices()){  //getvoices() returns a list of voice objects available on current device
        let selected = voice.name === "Google US English" ? "selected" : ""; //selecting Google US English as default
        // creating an option tag with passing voice and voice language
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option); //inserting this tag beforeend of select tag
    }
}

synth.addEventListener("voiceschanged", voices);

function textToSpeech(text){
    console.log("text")
    let utterance = new SpeechSynthesisUtterance(text);  //new request for speech
    for(let voice of synth.getVoices()){
        if(voice.name === voiceList.value){  //if the avilable device voice name is equal to user selected voice then set the speech voice as that
            utterance.voice = voice;
        }
    }
    synth.speak(utterance); //speak the speech(utterance)
}

speechBtn.addEventListener("click", e =>{
    e.preventDefault(); //preventing form from submitting
    console.log("speech")
    if(textarea.value !== ""){
        if(!synth.speaking){  //if a speech is not currently in the process of speaking
            textToSpeech(textarea.value);
        }
        if(textarea.value.length > 80){  //if the text is more than 80 characters then pause and resume speech is enabled

            // check to see if speech in speaking process or not every 100ms
            // if not then set isSpeaking to true and change button text
            setInterval(()=>{
                if(!synth.speaking && !isSpeaking){
                    isSpeaking = true;
                    speechBtn.innerText = "Convert To Speech";
                }
            }, 500); 
            if(isSpeaking){    // if isSpeaking is true then change it's value and resume the speech and display pause speech on button
                synth.resume();
                isSpeaking = false;
                speechBtn.innerText = "Pause Speech";
            }
            else{  // else pause the speech
                synth.pause();
                isSpeaking = true;
                speechBtn.innerText = "Resume Speech";
            }
        }
        else{
            speechBtn.innerText = "Convert To Speech";
        }
    }
});

// speech to text

var SpeechRecognition = window.webkitSpeechRecognition;
  
var recognition = new SpeechRecognition();

var Content = '';

recognition.continuous = true;

recognition.onresult = function(event) {

    var current = event.resultIndex;

    var transcript = event.results[current][0].transcript;

    Content += transcript;
    textarea.value = Content;
  
};

recognition.onstart = function() { 
    console.log('Voice recognition is ON.');
}

recognition.onspeechend = function() {
    console.log('No activity.');
}

recognition.onerror = function(event) {
    if(event.error == 'no-speech') {
        console.log('Try again.');  
    }
}

textBtn.addEventListener("click", e =>{
    e.preventDefault();
    if (Content.length) {
        Content += ' ';
    }
    if(isRecording){
        textarea.value = "";
        recognition.start();
        isRecording = false;
        textBtn.innerText = "Stop Converting";
    }
    else{  // else pause the speech
        recognition.stop();
        isRecording = true;
        textBtn.innerText = "Convert To Word";
    }
    
});