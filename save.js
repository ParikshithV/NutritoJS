var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nutritojs"
});

console.log("Entered save.js");

//--- Condition to save on button press ---
if (sessionStorege.clickcount > 0) {
  var p = sessionStorage.getItem("protein");
  var c = sessionStorage.getItem("carbo");
  var f = sessionStorage.getItem("fat");
  var inName = sessionStorage.getItem("inName");
  var calories = sessionStorage.getItem("calories");

  if (err) throw err;
  console.log("DB Connected");
  var sql = "insert into IntakeData (InName, Protein, Carbohydrates, Fat) values (inName, p, c, f, calories)" ;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("input saved!");
    sessionStorage.clear();
  })
}

else {
  console.log("Entered save.js but no browser support");
}

// function saveFunc() {
//   sessionStorage.setItem("protein", p);
//   sessionStorage.setItem("carbo", c);
//   sessionStorage.setItem("fat", f);
//   sessionStorage.setItem("inName", inName);
//   sessionStorage.setItem("calories", Calories);
//   sessionStorage.setItem("clickcount", "1");
// }
