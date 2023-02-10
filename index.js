var maxCount = 100;
var minCount = 20;
var currentCount = 0;

function applyTapCountHTML() {
  console.log('applyTapCountHTML...', currentCount);
  var button = document.getElementById('countButton');
  console.log('button...', button.innerHTML);
  button.innerHTML = currentCount;
};

function addCount() {
  currentCount += 1;
  applyTapCountHTML();
};

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  applyTapCountHTML();
});
