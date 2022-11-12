//Använder Chart.js bibliotek

//Hämta chart context från canvasen i 2D
const ctx = document.getElementById('myChart').getContext("2d");
if(myChart != null){
    myChart.destroy();
}


//Skapa backgroundGradient
let backgroundGradient = ctx.createLinearGradient(0, 0, 0, 400);
backgroundGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
backgroundGradient.addColorStop(1, "rgba(255, 255, 255, 0.1)")

//Skapa borderGradient
let borderGradient = ctx.createLinearGradient(0, 0, 0, 400);
borderGradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
borderGradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");

//Labels = Tid/X-axeln
let labels = [];


//Beskriver vad för data som grafen ska använda
//x,
//y
//Datasets har attributerna: data som är värdena på Y-axeln,
//label som säger vad det är som mäts,
//backgroundColor osv är likt CSS
let data = {
    labels,
    datasets: [
        {
            data: [],
            label: "Temperatur",
            fill: true,
            backgroundColor: backgroundGradient,
            borderColor: borderGradient,
        },
    ],
};


//Fäster data och inställningar till grafen
const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        scales: {
            y:{ //Sätter enhet
                ticks:{
                    callback: function(value){
                        return value + "°C"
                    }
                }
            }
        },
        elements:{ //Tar bort punkterna från grafen
            point:{
                radius:0
            }
        }
    },
};
//Skapar grafen
myChart = new Chart(ctx, config);

//Sätter värdena på grafen
function update_graph_values(chart){
    chart.data.datasets[0].data = tempArray;
    chart.data.labels = timeArray;
    chart.update();
}
//Hanterar användar input
function handle_value_input(){
    let value = document.getElementById("numberInsert").value;

    set_visible_values(value, myChart)
    
}
//Sätter värdena på grafen efter användarens input
function set_visible_values(numberOfValues, chart){
    let visibleTemps = chart.data.datasets[0].data.slice(-numberOfValues);
    let visibleTimes = chart.data.labels.slice(-numberOfValues);
    chart.data.datasets[0].data = visibleTemps;
    chart.data.labels = visibleTimes;
    chart.update();
}

// function update_graph(chart){
//     const temps = tempArray.slice(-30);
//     const times = timeArray.slice(-30);
//     for(i = 0; i < temps.length; i++){
//         chart.data.datasets[0].data.push(temps[i]);
//     }
//     for(i = 0; i < times.length; i++){
//         chart.data.labels.push(times[i]);
//     }
//     console.log(`Temps: ${temps}`);
//     console.log(`Times: ${times}`);
//     console.log(`Data: ${chart.data.datasets[0].data}`);
//     console.log(`Labels: ${chart.data.labels}`);
// }



//Försök att göra graf med hjälp av D3-biblioteket:
/*
let seconds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let temp = [7, 7, 8, 7, 7, 7.5, 8, 8.1, 8, 7.9];
let recenttemp = temp[temp.length-1];
let recentseconds = seconds[seconds.length-1];

document.addEventListener("DOMContentLoaded", (e) =>{
    drawChart(recenttemp, recentseconds, temp, seconds);
});

function drawChart(value, definition, valuearray, definitionarray){
    var svgWidth = 500, svgHeight = 250;
    var margin ={top: 20, right: 20, bottom: 30, left: 50};
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    var g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.right})`);

    var x = d3.scaleLinear()
        .domain([0, d3.max(definition)])
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(value)])
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function() {return x(definition)})
        .y(function() {return y(value)})
        x.domain(d3.extent(definitionarray[0], definition));
        y.domain(d3.extent(valuearray[0], value));
    
    g.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Grader (°C)");

    g.append("path")
        .datum(valuearray)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

};


//Försök att göra graf med SVG (Scalable-Vector-Graphics) och ren JS:

const svgPathParent = document.getElementById("svg-path");
let tempa = [180, 60, 90, 150, 42, 66, 114, 162, 222, 294, 390, 252, 180, 288, 360, 468, 540, 294, 414, 300, 480, 270, 228, 90, 234, 354, 396, 264, 132];
let time = [330, 400, 300, 200, 186, 406, 256, 348, 421, 185, 217, 295, 124, 249, 320, 219, 298, 399, 499, 230, 172, 237, 318, 247, 205, 415, 192, 272, 271];

function dataVisualization(temparray, timearray, frequency, linecount) {
    const svgElment = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const time = timearray.length;
    const maxVal = Math.max(...temparray);
    const widthSvg = time * frequency;
    const heightSvg = (maxVal + 30)/2;
    const graphLine = (maxVal / (linecount - 1));

    svgElment.setAttributeNS(null, "width", widthSvg);
    svgElment.setAttributeNS(null, "height", heightSvg);

    const gElCircle = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gElCircle.id = "graph-points";

    const gElLine = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gElLine.id = "graph-lines";

    const gElText = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gElText.id = "graph-texts";

    let pathString = "M" + widthSvg + " " + heightSvg + " L" + 0 + " " + widthSvg;

    for (let t = 0; t < time; t++) {
        const yValue = heightSvg - tempa[t]/2, xValue = t * frequency;
        const newString = " L" + xValue + " " + yValue;
        pathString += newString;

        const circleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        circleEl.setAttributeNS(null, "cx", xValue);
        circleEl.setAttributeNS(null, "cy", yValue);
        circleEl.setAttributeNS(null, "r", "5");
        circleEl.addEventListener("mouseover", (e) => { 
            const card = document.createElement("section");
            card.id="card";     
            card.style = `top:${yValue}px; left:${xValue - 75}px; display: block;`
            card.innerHTML = `Temp: ${tempa[t]}°C <br>Time: ${timearray[t]}`
            svgPathParent.appendChild(card);
        });
        circleEl.addEventListener("mouseout", (e) => {svgPathParent.removeChild(card);})
        gElCircle.appendChild(circleEl);
    }
    
    


    const ends = heightSvg - timearray[time - 1];
    pathString += " L" + widthSvg + " " + ends;
    pathString += " Z";
    svgPath.setAttributeNS(null, "d", pathString);

    for (let l = 0; l < linecount; l++) {
        const lineEl = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const yPosition = (heightSvg - (l * graphLine));
        lineEl.setAttributeNS(null, "x1", "0");
        lineEl.setAttributeNS(null, "y1", yPosition);
        lineEl.setAttributeNS(null, "x2", widthSvg);
        lineEl.setAttributeNS(null, "y2", yPosition);
        gElLine.appendChild(lineEl);

        const txt = (l * graphLine) *2;
        textEl.setAttributeNS(null, "dx", "-20");
        textEl.setAttributeNS(null, "x", widthSvg);
        textEl.setAttributeNS(null, "y", yPosition);
        textEl.textContent = txt;

        gElText.appendChild(textEl);

    }

    svgElment.appendChild(gElCircle);
    svgElment.appendChild(gElLine);
    svgElment.appendChild(gElText);
    svgElment.appendChild(svgPath);

    svgPathParent.appendChild(svgElment);
}

dataVisualization(tempa, time, 20, 10);*/
