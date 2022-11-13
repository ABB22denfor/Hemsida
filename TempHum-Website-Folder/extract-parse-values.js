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
var stringTime;
var dataPoints = [];
var timeArray = [];
var tempArray = [];
var myChart = null

dataBase = firebase.database();

var streamData = dataBase.ref("/"); //Säger var koden ska läsa.

//Sätter ett promise så att alla värdena har laddats in innan grafen skapas
let myPromise = new Promise(function(myResolve, myReject){

  streamData.on("child_added", (snapshot) => {
    // När en ny mätning kommer in, så ska denna kod köras.
    const dataPoint = snapshot.val();
  
    dataPoints.push(dataPoint);
  
    let [tempValue, humValue, countValue, totalValue, perValue, lastValue, Timmar] = create_page_values(dataPoints);
  
    console.log(
      `tempvalue: ${tempValue}   
      humValue: ${humValue}
      countValue: ${countValue}
      `
    );
    update_page_values(tempValue, humValue, countValue, totalValue, perValue, lastValue);
    update_graph_lists(Timmar, tempValue)
    
    myResolve();
    myReject("Error");
  });

})

//Hanterar om koden innuti promise skickade en error eller blev färdig
myPromise.then(
  function() {update_graph_values(myChart)},
  function(error) {console.error(error)}
)


//Uppdaterar listorna som grafen använder
function update_graph_lists(time, temp){
  timeArray.push(time)
  tempArray.push(temp)
}

function calculate_total_time(time) {
  return ((time - 1667928163)/3600)
}

function calculate_per_hour(countValue, totalValue) {
  openPerHour = countValue / totalValue;
  openPerHour = round_values(openPerHour, 1);
  return (openPerHour);
}

function calculate_last_opened(currentTime) {
  lastValue = currentTime
  return lastValue;
}


/* streamData.once("value", (snapshot) => {
  snapshot.ref.remove();
}); */

function update_count_value(dataPoints, countValue) {
  let currentTemp = dataPoints[dataPoints.length - 1].temperature;

  let prevTemp;
  if (dataPoints.length < 2) prevTemp = currentTemp;
  else prevTemp = dataPoints[dataPoints.length - 2].temperature;

  if (currentTemp >= 8.6 && prevTemp <= 8.5) return countValue + 1;
  else return countValue;
}
function round_values(value, precision){
  var multiplier = Math.pow(10, precision || 0)
  value = Math.round(value * multiplier) / multiplier;
  return value
}


function create_page_values(dataPoints) {
  let dataPoint = dataPoints[dataPoints.length - 1];

  openedCount = update_count_value(dataPoints, openedCount);

  let currentTemp = dataPoint.temperature;
  let currentHum = dataPoint.humidity;
  let currentTime = dataPoint.epochTime;


  let prevTemp;
  if (dataPoints.length < 2) prevTemp = currentTemp;
  else prevTemp = dataPoints[dataPoints.length - 2].temperature;

  
  let totalValue = calculate_total_time(currentTime);
  let perValue = calculate_per_hour(openedCount, totalValue);
  perValue = round_values(perValue, 1);
  totalValue = round_values(totalValue, 1);
  let lastValue;
  if (currentTemp <= 8.5 && prevTemp >= 8.6) {
    lastValue = calculate_last_opened(currentTime);
  }

  console.log(`Last Opened: ${lastValue}`);


  let TimeBetween = (currentTime - dataPoints[0].epochTime);

  let Timmar = (TimeBetween - (TimeBetween % 3600)) / 3600;
  console.log(`Timmar: ${Timmar}`);
  Timmar = JSON.stringify(Timmar);


  return [currentTemp, currentHum, openedCount, totalValue, perValue, lastValue, Timmar];
}



function update_page_values(tempValue, humValue, countValue, totalValue, perValue, lastValue) 
{
  document.getElementById("tempValue").innerHTML = tempValue;

  document.getElementById("humValue").innerHTML = humValue;

  document.getElementById("countValue").innerHTML = countValue;

  document.getElementById("totalValue").innerHTML = totalValue;

  document.getElementById("perValue").innerHTML = perValue;

  document.getElementById("lastValue").innerHTML = lastValue;
}
