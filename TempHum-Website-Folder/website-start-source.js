let totalH = 0, timesO = 0, lastO = 0, hourAmount = 0;
let tempSum = 0, minSum = 0;
let hour = [12, 12, 12, 13];
let temp = [];
let minO = [1, 2, 4, 1];
let avgTemp = 0;
let hum = 0;

function sum(sum, array){
    for(i = 0; i < array.length; i++){
        sum += array[i];
    }
    return sum
}
function avg(sum, array){
    average = sum/array.length;
    return average;
}
function round(value, precision){
    var multiplier = Math.pow(10, precision || 0)
    return Math.round(value * multiplier) / multiplier;
}
sum(tempSum, temp)
minSum = sum(minSum, minO);
totalH = minSum / 60
totalH = round(totalH, 2);

lastO = hour[hour.length - 1];

avg(tempSum, temp)
for(i = 0; i< temp.length; i++){
    if(temp[i] > avgTemp){
        timesO++;
    }
}

console.log("Total minutes opened: " + sum(minSum, minO))
console.log("Opened " + timesO + " times");
console.log("Total hours opened: " + totalH + "h");
console.log('Last Opened: ' + lastO);
