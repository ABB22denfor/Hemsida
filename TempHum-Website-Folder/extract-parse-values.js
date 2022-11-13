const firebaseConfig = {
  apiKey: "AIzaSyDLclgVeRlX41rhbNlMkZ5Pd-dcz4J-1tM",
  authDomain: "kylskap-c5f3b.firebaseapp.com",
  databaseURL:
    "https://kylskap-c5f3b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kylskap-c5f3b",
  storageBucket: "kylskap-c5f3b.appspot.com",
  messagingSenderId: "281312305230",
  appId: "1:281312305230:web:9b313112114bcb7148a31f",
  measurementId: "G-HVPMQXDD53",
};

firebase.initializeApp(firebaseConfig); // importar firebase så att vi kan läsa databasen.

var openedCount = 0;
var dataPoints = [];
var timeArray = []; //Definerar de två arrays som vi använder

dataBase = firebase.database();

var streamData = dataBase.ref("/"); //Säger var koden ska läsa på firebase.

streamData.on("child_added", (snapshot) => {
  const dataPoint = snapshot.val(); // ger dataPoint valuerna av den nya mätningen på firebase.

  dataPoints.push(dataPoint); // lägger till det som ligger i den nya mätningen till arryn med mätningarna.

  let [tempValue, humValue, countValue, perValue, lastValue] =
    create_page_values(dataPoints); // använder funktionen för att ge varieblerna värden.

  console.log(
    `tempvalue: ${tempValue}   
      humValue: ${humValue}
     countValue: ${countValue}`
  ); // visar temperaturen, humidityn och hur många gånger kylskåpet har öppnats i consolen för debugging.

  update_page_values(
    tempValue,
    humValue,
    countValue,
    totalValue,
    perValue,
    lastValue // uppdaterar valuerna med hjälp av en funktion
  );
}); // Loopen som körs varje gång en ny mätning kommer in.

function calculate_total_time(time) {
  totalValue = (time - 1667928163) / 3600;
  totalValue = round_values(totalValue, 1);
  return totalValue;
} // en funktion för att ränka ut länge det har gått sen arduinon startade mäta

function calculate_per_hour(countValue, totalValue) {
  openPerHour = countValue / totalValue;
  openPerHour = round_values(openPerHour, 1);
  return openPerHour;
} // ränkar hur många gånger kylskåpet har öppnats per timme genom att dela hur många gånger den har öppnats med totala timmar.

function calculate_last_opened(currentTime, currentTemp, prevTemp) {
  let lastValue;
  if (currentTemp <= 8.5 && prevTemp >= 8.6) {
    lastValue = currentTime;
    console.log(`lastValue: ${lastValue}`);
    return lastValue;
  }
  return 0;
} // räknar hur länge det var sedan kylskåpet öppnades. Den gör det genom att ha samma condiitoner som countValue, och sedan göra current time till lastValue.

/* streamData.once("value", (snapshot) => {
  snapshot.ref.remove();
}); */ // kod som Jeton skrev för att ta bort allting i firebase ifall det blev fullt.

function update_count_value(dataPoints, countValue) {
  let currentTemp = dataPoints[dataPoints.length - 1].temperature;

  let prevTemp;
  if (dataPoints.length < 2) prevTemp = currentTemp;
  else prevTemp = dataPoints[dataPoints.length - 2].temperature;

  if (currentTemp >= 8.6 && prevTemp <= 8.5) return countValue + 1;
  else return countValue;
} // uppdaterar countValue som visar hur ofta kylskåpet har öppnats genom att kolla om den senaste och förra temperaturen möter konditionerna tillsamans.

function round_values(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  value = Math.round(value * multiplier) / multiplier;
  return value;
} // funktion som förskjuter talet, avrundar det, och förskjuter tillbaka det

function create_page_values(dataPoints) {
  let dataPoint = dataPoints[dataPoints.length - 1];

  openedCount = update_count_value(dataPoints, openedCount); // definerar openedCount med hjälp av funktionen innan.

  let currentTemp = dataPoint.temperature;
  let currentHum = dataPoint.humidity;
  let currentTime = dataPoint.epochTime; // splittrar den senaste mättningen i arryn till de olika variabeln.

  let prevTemp;
  if (dataPoints.length < 2) prevTemp = currentTemp;
  // ser till att prevTemp inte blir assigned en value som inte finns ännu.
  else prevTemp = dataPoints[dataPoints.length - 2].temperature; // ger prevTemp den näst senaste valuen i datapoints.temperature.

  let totalValue = calculate_total_time(currentTime);
  let perValue = calculate_per_hour(openedCount, totalValue);
  let lastValue = calculate_last_opened(currentTime, currentTemp, prevTemp); // ger variablerna values med hjälp av funktioner.
  console.log(`Last Opened: ${lastValue}`); //skickar till consolen LastValue for debugging

  let TimeBetween = currentTime - dataPoints[0].epochTime; // Ger variablen tiden mellann den senaste mättningen och den första mättningen som en value

  let Timmar = (TimeBetween - (TimeBetween % 3600)) / 3600; // räknar hur många timmar det har gått eftersom TimeBetween är i sekunder
  console.log(`Timmar: ${Timmar}`); // till consolen för debugging
  Timmar = JSON.stringify(Timmar); // stringify timmer så att det fungerar till grafen.

  update_graph(Timmar); // uppdaterar grafen med hjälp av en funktion

  return [currentTemp, currentHum, openedCount, perValue, lastValue];
} // funktionen som ger variablerna som temp deras senaste values.

function update_graph(time) {
  timeArray.push(time);
} // funktion som skickar hur många timmar det har gått till en array som används för grafen

function update_page_values(
  tempValue,
  humValue,
  countValue,
  totalValue,
  perValue,
  lastValue
) {
  document.getElementById("tempValue").innerHTML = tempValue;

  document.getElementById("humValue").innerHTML = humValue;

  document.getElementById("countValue").innerHTML = countValue;

  document.getElementById("totalValue").innerHTML = totalValue;

  document.getElementById("perValue").innerHTML = perValue;

  document.getElementById("lastValue").innerHTML = lastValue;
} // koden som gör så att variablerna som tempValue visas på hemsidan.
