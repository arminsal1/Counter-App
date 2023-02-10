var maxCount = 100;
var minCount = 20;
var currentCount = 0;

function applyTapCountHTML() {
  var button = document.getElementById('countButton');
  button.innerHTML = currentCount;
};

function addCount(event) {
  currentCount += 1;
  applyTapCountHTML();
};

window.onload = function() {
  applyTapCountHTML();
};
