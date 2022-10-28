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
let temp = [];
firebase.initializeApp(firebaseConfig);

db = firebase.database();

var x = db.ref("/");

x.on("child_added", (snapshot) => {
  const newdata = snapshot.val();
  console.log(newdata);

  let str = JSON.stringify(newdata.temperature);

  document.getElementById("temp").innerHTML = str;
});

temp.push(str);
