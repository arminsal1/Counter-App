var count = {
  start: 0,
  current: 0,
  minTotal: 20,
  maxTotal: 100,
  minBPM: 60,
  maxBPM: 80,
};

// Selectable options for joining logical rules
var logicOpts = ['AND', 'OR'];
// Selectable options for variables
var varOpts = []

// [String]: User-typed (freeform) logical/numerical rules for audio playback on next count.current value
var audioRules = [];

var audioLogic = [true];

var autoCounting = false;

function updateHTML(manualInput) {
  // Update Current Count
  var countButton = document.getElementById('countButton');
  countButton.innerHTML = count.current;
  // Update Total Params
  var maxTotalInput = document.getElementById('maxTotalInput');
  var minTotalInput = document.getElementById('minTotalInput');
  if (manualInput) {
    count.maxTotal = Number(maxTotalInput.value);
    count.minTotal = Number(minTotalInput.value);
  } else {
    maxTotalInput.value = count.maxTotal;
    minTotalInput.value = count.minTotal;
  }
  // Update BPM Params
  var maxBPMInput = document.getElementById('maxBPMInput');
  var minBPMInput = document.getElementById('minBPMInput');
  if (manualInput) {
    count.maxBPM = Number(maxBPMInput.value);
    count.minBPM = Number(minBPMInput.value);
  } else {
    maxBPMInput.value = count.maxBPM;
    minBPMInput.value = count.minBPM;
  }
  // Update Play Button
  var playButton = document.getElementById('playButton');
  playButton.innerHTML = autoCounting ? 'Pause' : 'Play';
};

function addCount() {
  count.current += 1;
  updateHTML();
};

function resetCount() {
  count.current = count.start;
  updateHTML();
}

function startAutoCount() {
  // TODO
  console.log(count);
}

function stopAutoCount() {
  // TODO
}

function autoCount() {
  autoCounting = !autoCounting;
  if (autoCounting) {
    startAutoCount();
  } else {
    stopAutoCount();
  }
  updateHTML();
}

function onlyNumberKey(evt) {
  // RegExp Numbers
  if (/^-?\d+$/.test(evt.key)) {
    return true;
  }
  // Allow Backspace
  if (evt.which == 8) {
    return true;
  }
  // Decimal Check
  if (evt.which == 190 && !isNaN(`${evt.originalTarget.value}${evt.key}`)) {
    return true;
  }
  return false;
}

const audioCtx = new AudioContext();

let tempo = 60.0;
const bpmControl = document.querySelector("#bpm");

bpmControl.addEventListener(
  "input",
  (ev) => {
    tempo = parseInt(ev.target.value, 10);
  },
  false
);

const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

let currentNote = 0;
let nextNoteTime = 0.0; // when the next note is due.

function nextNote() {
  const secondsPerBeat = 60.0 / tempo;

  nextNoteTime += secondsPerBeat; // Add beat length to last beat time

  // Advance the beat number, wrap to zero when reaching 4
  currentNote = (currentNote + 1) % 4;
}

const notesInQueue = [];

let attackTime = 0.2;
const attackControl = document.querySelector("#attack");
attackControl.addEventListener(
  "input",
  (ev) => {
    attackTime = parseInt(ev.target.value, 10);
  },
  false
);

let releaseTime = 0.5;
const releaseControl = document.querySelector("#release");
releaseControl.addEventListener(
  "input",
  (ev) => {
    releaseTime = parseInt(ev.target.value, 10);
  },
  false
)

const sweepLength = 2;
function playSweep(time) {
  const osc = new OscillatorNode(audioCtx, {
    frequency: 380,
    type: "custom",
    periodicWave: wave,
  });

  const sweepEnv = new GainNode(audioCtx);
  sweepEnv.gain.cancelScheduledValues(time);
  sweepEnv.gain.setValueAtTime(0, time);
  sweepEnv.gain.linearRampToValueAtTime(1, time + attackTime);
  sweepEnv.gain.linearRampToValueAtTime(0, time + sweepLength - releaseTime);

  osc.connect(sweepEnv).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + sweepLength);
}


function scheduleNote(beatNumber, time) {
  // Push the note on the queue, even if we're not playing.
  notesInQueue.push({ note: beatNumber, time });

  if (pads[0].querySelectorAll("input")[beatNumber].checked) {
    playSweep(time);
  }
  if (pads[1].querySelectorAll("input")[beatNumber].checked) {
    playPulse(time);
  }
  if (pads[2].querySelectorAll("input")[beatNumber].checked) {
    playNoise(time);
  }
}

let timerID;
function scheduler() {
  // While there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
    scheduleNote(currentNote, nextNoteTime);
    nextNote();
  }
  timerID = setTimeout(scheduler, lookahead);
}

document.addEventListener('DOMContentLoaded', (event) => {
  applyCountToHTML();
});
