const svgPathParent = document.getElementById("svg-path");
const card = document.getElementById("card");

let temp = [180, 60, 90, 150, 42, 66, 114, 162, 222, 294, 390, 252, 180, 288, 360, 468, 540, 294, 414, 300, 480, 270, 228, 90, 234, 354, 396, 264, 132];
let time = [1200, 1240, 1241, 1300, 1450, 1500, 1510, 1520, 1530, 1540, 1550, 1600, 1700, 1710, 1720, 1730, 1800, 1810, 1820, 1830, 1840, 1850, 1900, 1910, 1920, 1930, 1940, 1950, 2000];


console.log(temp.length)
console.log(time.length)

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

    // g tags for grouping other tags
    const gElCircle = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gElCircle.id = "graph-points";

    const gElLine = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gElLine.id = "graph-lines";

    const gElText = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gElText.id = "graph-texts";

    // base line
    let pathString = "M" + widthSvg + " " + heightSvg + " L" + 0 + " " + widthSvg;

    for (let t = 0; t < time; t++) {
        const yValue = heightSvg - temp[t]/2, xValue = t * frequency;
        const newString = " L" + xValue + " " + yValue;
        pathString += newString;

        const circleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        circleEl.setAttributeNS(null, "cx", xValue);
        circleEl.setAttributeNS(null, "cy", yValue);
        circleEl.setAttributeNS(null, "r", "8");
        circleEl.addEventListener("mouseover", (e) => {card.style = `top:${yValue}px; left:${xValue - 75}px; display: block;`
        card.innerHTML = `Temp: ${temp[t]}°C <br>Time: ${timearray[t]}`});
        gElCircle.appendChild(circleEl);
    }
    
    // generate date
    //const date_ = new Date(Date.now() - ((days - d) * (24 * 60 * 60 * 1000))).toJSON().split("T")[0];


    const ends = heightSvg - timearray[time - 1];
    pathString += " L" + widthSvg + " " + ends;
    pathString += " Z";
    svgPath.setAttributeNS(null, "d", pathString);

    // lines and texts
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

    // base parent or graph container
    svgPathParent.appendChild(svgElment);
}

dataVisualization(temp, time, 20, 10);
