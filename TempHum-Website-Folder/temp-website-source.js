
var advCheckbox = document.getElementById('checkbox1');
var advancedBox = document.getElementById('adv');

//Används för att få Advanced knappen att visa en viss div
advCheckbox.onchange = () =>
{ advancedBox.style.display = (advCheckbox.checked) ? "flex" : "none"; };
