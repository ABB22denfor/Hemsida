
var advCheckbox = document.getElementById('checkbox1');
var advancedBox = document.getElementById('adv');

advCheckbox.onchange = () =>
{ advancedBox.style.display = (advCheckbox.checked) ? "flex" : "none"; };
