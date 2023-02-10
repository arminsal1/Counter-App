var maxCount = 100;
var minCount = 20;
var currentCount = 0;

window.onload = function() {
  applyTapCountHTML();
};

const applyTapCountHTML = () => {
  var button = document.getElementById('countButton');
  button.innerHTML = currentCount;
};

const addCount = (event) => {
  currentCount += 1;
  applyTapCountHTML();
};
