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
let count = 0;
let temp = [];
let hump = [];
firebase.initializeApp(firebaseConfig);

db = firebase.database();

var x = db.ref("/");

x.on("child_added", (snapshot) => {
  const newdata = snapshot.val();
  console.log(newdata);

  let tmp = JSON.stringify(newdata.temperature);
  let hum = JSON.stringify(newdata.humidity);

  document.getElementById("tempValue").innerHTML = tmp;
  temp.push(tmp);
  console.log(temp);

  document.getElementById("humValue").innerHTML = hum;
  hump.push(hum);
  console.log(hump);

  let recent = temp[temp.length - 1];
  let prev = temp[temp.length - 2];
  console.log(temp[temp.length - 2]);

  if (recent < 10 && prev > 15) {
    count++;
  }
  document.getElementById("countValue").innerHTML = count;
  console.log(count);
});
