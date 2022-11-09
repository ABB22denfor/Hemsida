var checkbox1 = document.getElementById('checkbox1');
var adv = document.getElementById('adv');
var none = document.getElementById('none');

none.style.display = 'none';

//Används för att få Advanced knappen att visa en viss div
checkbox1.onchange = function () {
  if (checkbox1.checked) {
    adv.style.display = "flex";
  } else {
    adv.style.display = "none";
  }
};
