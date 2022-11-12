
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
var timeArray = [];
var tempArray = [];

dataBase = firebase.database();

var streamData = dataBase.ref("/"); //Säger var koden ska läsa.

streamData.on("child_added", (snapshot) => {
  // När en ny mätning kommer in, så ska denna kod köras.
  const dataPoint = snapshot.val();

  dataPoints.push(dataPoint);

  let [tempValue, humValue, countValue] = create_page_values(dataPoints);

  console.log(
    `tempvalue: ${tempValue}   
    humValue: ${humValue}
    countValue: ${countValue}
    tempArray ${tempArray}
    timeArray ${timeArray}`
  );

  update_page_values(tempValue, humValue, countValue);
  update_graph(null, tempValue);
  calculate_total_time(dataPoints)
  calculate_per_hour(dataPoints) 
});

function calculate_total_time, temp(dataPoints) {
  return ((dataPoints.currentTime - 1667928163)/3600)
}

function calculate_per_hour(dataPoints) {
  return (dataPoints.countValue/dataPoints.totalValue)
  tempArray.push(temp)
}

function calculate_last_opened(dataPoints) {
  if (dataPoints.currentTemp <= 8.5 && dataPoints.prevTemp >= 8.6) {dataPoints.currentTime = dataPoints.lastValue}
  else return (dataPoints.currentTime - dataPoints.lastValue)
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


function create_page_values(dataPoints) {
  let dataPoint = dataPoints[dataPoints.length - 1];

  let currentTemp = dataPoint.temperature;
  let currentHum = dataPoint.humidity;
  let currentTime = dataPoint.epochTime;
  let totalValue = calculate_total_time(dataPoints);
  let perValue = calculate_per_hour(dataPoints);
  let lastValue = calculate_last_opened(dataPoints);

  openedCount = update_count_value(dataPoints, openedCount);

  //let totalTime = calculate_total_time(dataPoints);
  /*let perHourValue = calcualte_per_hour(dataPoints);
  let lastOpened = calculate_last_opened(dataPoints);*/
  let stringTime = JSON.stringify(currentTime);

  update_graph(stringTime, null);
  
  return [currentTemp, currentHum, openedCount];
}

function update_page_values(tempValue, humValue, countValue, totalValue, perValue, lastValue) {
  document.getElementById("tempValue").innerHTML = tempValue;

  document.getElementById("humValue").innerHTML = humValue;

  document.getElementById("countValue").innerHTML = countValue;

  document.getElementById("totalValue").innerHTML = totalValue;

  document.getElementById("perValue").innerHTML = perValue;

  document.getElementById("lastValue").innerHTML = lastValue
}
