const keys = document.querySelectorAll(".key"),
  disp_note = document.querySelector(".nowplaying"),
  hints = document.querySelectorAll(".hints");
  waiting = document.querySelector(".waiting");

var context = new AudioContext(),
    oscillators = {};

midiSequence = []
midiTiming = []

maxLength = 16    // However long the sequence string should be in midi notes

notesPerSecond = 5
msPerNote = 200

before = 0
after = 0


// Initiate Web-MIDI

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(success, failure);
}

function success (midi) {
    var inputs = midi.inputs.values();
    // inputs is an Iterator

    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
}

function failure () {
    console.error('No access to your midi devices.')
}

// MIDI Message Recieved
function onMIDIMessage (message) {
    var frequency = midiNoteToFrequency(message.data[1]);

    var note = message.data[1];

    disp_note.innerHTML = Tone.Frequency(note, 'midi').toNote();
  
    console.log(message);
    if (message.data[0] === 144 && message.data[2] > 0) {
        
        MIDI.loadPlugin({
		soundfontUrl: "soundfont/",
		instrument: "acoustic_grand_piano",
		onprogress: function(state, progress) {
			console.log(state, progress);
		},
		onsuccess: function() {
			var delay = 0; // play one note every quarter second
			// var note = message.data[1]; // the MIDI note
			var velocity = message.data[2]; // how hard the note hits
			// play the note
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0, note, velocity, delay);
			//MIDI.noteOff(0, note, delay + 0.75);
		}
	    });


        
        // playNoteMIDI(frequency);
        midiSequence.push(message.data[1])
        if(midiSequence.length > maxLength){
            midiSequence.shift()
        }

        after = new Date().getTime();
        if(before != 0){
            midiTiming.push(after-before)
        } 
        before = new Date().getTime();
    }
 
    if (message.data[0] === 128 || message.data[2] === 0) {
        //stopNoteMIDI(frequency);

        MIDI.loadPlugin({
		soundfontUrl: "soundfont/",
		instrument: "acoustic_grand_piano",
		onprogress: function(state, progress) {
			console.log(state, progress);
		},
		onsuccess: function() {
			var delay = 0; // play one note every quarter second
			// var note = message.data[1]; // the MIDI note
			var velocity = message.data[2]; // how hard the note hits
			// play the note
			MIDI.setVolume(0, 127);
			//MIDI.noteOn(0, note, velocity, delay);
			MIDI.noteOff(0, note, delay);
		}
        });
        midiSequence.push(-2);
        if(midiSequence.length > maxLength){
            midiSequence.shift()
        }
    }
}

// Helper
function midiNoteToFrequency (note) {
    return Math.pow(2, ((note - 69) / 12)) * 440;
}

function playNoteMIDI (frequency) {

    

    oscillators[frequency] = context.createOscillator();
    oscillators[frequency].frequency.value = frequency;
    oscillators[frequency].connect(context.destination);
    oscillators[frequency].start(context.currentTime);
}
 
function stopNoteMIDI (frequency) {
    oscillators[frequency].stop(context.currentTime);
    oscillators[frequency].disconnect();
}


function splitDelay(e){
  after = new Date().getTime();
  if(before != 0){
    midiTiming.push(after-before)
  } 
  before = new Date().getTime();

  midiSequence.push(-2)
  if(midiSequence.length > maxLength){
    midiSequence.shift()
  }
}

function playNoteKB(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`),
    key = document.querySelector(`.key[data-key="${e.keyCode}"]`);

  if (!key) return;

  const keyNote = key.getAttribute("data-note");
  const midiVal = key.getAttribute("data-midi");

  after = new Date().getTime();
  if(before != 0){
    midiTiming.push(after-before)
  } 
  before = new Date().getTime();

  midiSequence.push(parseInt(midiVal))
  if(midiSequence.length > maxLength){
    midiSequence.shift()
  }

  key.classList.add("playing");
  disp_note.innerHTML = keyNote;
  audio.currentTime = 0;
  audio.play();
}

function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  this.classList.remove("playing");
}

function hintsOn(e, index) {
  e.setAttribute("style", "transition-delay:" + index * 50 + "ms");
}

hints.forEach(hintsOn);

keys.forEach(key => key.addEventListener("transitionend", removeTransition));

window.addEventListener("keydown", playNoteKB);
window.addEventListener("keyup", splitDelay);

$("#clear").click(function(){
    midiTiming = [];
    midiSequence = [];
});

$("#stop").click(function(){
    MIDIjs.stop();
});

$("#submit").click(function(){

	midiEncoding = [];
    for(var i = 0; i < midiSequence.length; i++){
        midiEncoding.push(midiSequence[i])
        var timeDelay = midiTiming[i]
        var numNoEvent = Math.floor(midiTiming[i] / msPerNote);
        console.log(midiTiming[i]);
        for(var j = 0; j < numNoEvent-1; j++){;
            midiEncoding.push(-1);
        }
        //if(midiEncoding.length > maxLength){
        //    midiEncoding.shift()
        //}
    }
    console.log(midiEncoding)
     
    var progression_select = document.getElementById("progression");
    var selected_progression = progression_select.options[progression_select.selectedIndex].text;

    let data = {element: midiEncoding, progression: selected_progression};
    const url = '/melody';
    const params = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method:"POST",
        body:JSON.stringify(data)
    };

    console.log(params.body);
    
    waiting.innerHTML = "Waiting...";

    fetch(url, params).then(function(response) {return response.text()}
        ).then(function(data){ 
            MIDIjs.play(data);
        }).then(function(){waiting.innerHTML = "";});

    midiSequence =[];
    midiTiming = [];

    before = 0
    after = 0
});
