const countButton = document.querySelector(".count-button");
const resetButton = document.querySelector(".reset-button");
const playPauseButton = document.querySelector(".play-pause-button");
const lowerLimitInput = document.querySelector(".lower-limit");
const upperLimitInput = document.querySelector(".upper-limit");

let count = 0;
let lowerLimit = null;
let upperLimit = null;
let playState = false;
let intervalId;

function updateCount() {
  countButton.textContent = count;
}

function playTone() {
  const context = new AudioContext();
  const osc = context.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 440;
  osc.connect(context.destination);
  osc.start();
  osc.stop(context.currentTime + 0.1);
}

function incrementCounter() {
  lowerLimit = lowerLimitInput.value !== "." ? parseInt(lowerLimitInput.value, 10) : null;
  upperLimit = upperLimitInput.value !== "." ? parseInt(upperLimitInput.value, 10) : null;

  if ((lowerLimit === null || count > lowerLimit) && (upperLimit === null || count < upperLimit)) {
    count++;
    updateCount();
    playTone();
  }
}

function resetCounter() {
  count = 0;
  updateCount();
}

function togglePlayState() {
  playState = !playState;

  if (playState) {
    playPauseButton.textContent = "Pause";
    intervalId = setInterval(() => {
      incrementCounter();
    }, 1000);
  } else {
    playPauseButton.textContent = "Play";
    clearInterval(intervalId);
  }
}

countButton.addEventListener("click", incrementCounter);
resetButton.addEventListener("click", resetCounter);
playPauseButton.addEventListener("click", togglePlayState);

// Registering service worker for offline functionality
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(registration => {
    console.log("Service Worker registered with scope:", registration.scope);
  }).catch(error => {
    console.log("Service Worker registration failed:", error);
  });
}
