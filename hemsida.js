/*document.getElementById("countValue").innerText = "1";
document.getElementById("tempValue").innerText = "2";
document.getElementById("totalValue").innerText = "3";
document.getElementById("perValue").innerText = "4";
document.getElementById("lastValue").innerText = "5";
document.getElementById("humValue").innerText = "6";*/

var checkbox1 = document.getElementById('checkbox1');
var adv = document.getElementById('adv');
var none = document.getElementById('none');

none.style.display = 'none';

checkbox1.onchange = function () {
  if (checkbox1.checked) {
    adv.style.display = "flex";
  } else {
    adv.style.display = "none";
  }
};
