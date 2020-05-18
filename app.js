var mysql = require('mysql');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
// app.use(session({secret: "Shh, its a secret!"}));
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nutritojs"
});

const mimetypes = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'png': 'image/png',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpg'
};


function getData(){
  var sql = "SELECT sum(Protein) FROM IntakeData" ;
  con.query(sql, function (err, rows, result) {
    if (err) throw err;
    Object.keys(result).forEach(function(key) {
      var arr = JSON.stringify(rows[0]);
      var arred = JSON.parse(arr);
      // console.log(arred["sum(Protein)"]);
      sumPro = arred["sum(Protein)"];
    });
  })

  var sql = "SELECT sum(Carbohydrates) FROM IntakeData" ;
  con.query(sql, function (err, rows, result) {
    if (err) throw err;
    Object.keys(result).forEach(function(key) {
      var arr = JSON.stringify(rows[0]);
      var arred = JSON.parse(arr);
      // console.log(arred["sum(Carbohydrates)"]);
      sumCarbs = arred["sum(Carbohydrates)"];
  });
  })

  var sql = "SELECT sum(Fat) FROM IntakeData" ;
  con.query(sql, function (err, rows, result) {
    if (err) throw err;
    Object.keys(result).forEach(function(key) {
      var arr = JSON.stringify(rows[0]);
      var arred = JSON.parse(arr);
      // console.log(arred["sum(Fat)"]);
      sumFat = arred["sum(Fat)"];
  });
  })

  var sql = "SELECT sum(Calories) FROM IntakeData" ;
  con.query(sql, function (err, rows, result) {
    if (err) throw err;
    Object.keys(result).forEach(function(key) {
      var arr = JSON.stringify(rows[0]);
      var arred = JSON.parse(arr);
      // console.log(arred["sum(Calories)"]);
      sumCal = arred["sum(Calories)"];
  });
  })
}

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE IF NOT EXISTS IntakeData (InName VARCHAR(255), Protein VARCHAR(55), Carbohydrates VARCHAR(55), Fat VARCHAR(55), Calories VARCHAR(55))";
  var sql1 = "CREATE TABLE IF NOT EXISTS userdb (userName VARCHAR(255), email VARCHAR(255), age VARCHAR(15), height VARCHAR(55), weight VARCHAR(55), gender VARCHAR(55), password VARCHAR(255))";

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Done!");
  })

  con.query(sql1, function (err, result) {
    if (err) throw err;
    console.log("Done!");
  })
  getData();
});

app.get('/', function(req, res) {
  getData();
   res.cookie('sumPro', sumPro);
   res.cookie('sumCarbs', sumCarbs);
   res.cookie('sumFat', sumFat);
   res.cookie('sumCal', sumCal);
    res.sendFile(path.join(__dirname + '/homepage.html'));
});

app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/signup', function(req, res) {
    res.sendFile(path.join(__dirname + '/regPage.html'));
});

app.get('/loginPage', function(req, res) {
    res.sendFile(path.join(__dirname + '/loginPage.html'));
});

app.post('/save', urlencodedParser, function(req, res){
    //if (err) throw err;
    var p = req.body.protein;
    var c = req.body.carbo;
    var f = req.body.fat;
    var inName = req.body.inName;
    var calories = req.body.cal;
    var sql = "insert into IntakeData (InName, Protein, Carbohydrates, Fat, Calories) values ('"+inName+"','"+p+"','"+c+"','"+f+"','"+calories+"')" ;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("input saved!");
    })
  res.sendFile(path.join(__dirname + '/redirect.html'));
})

app.post('/signup', urlencodedParser, function(req, res){
    //if (err) throw err;
    var name = req.body.userName;
    var email = req.body.userEmail;
    var age = req.body.userAge;
    var height = req.body.userHeight;
    var weight = req.body.userWeight;
    var gender = req.body.gender;
    var password = req.body.password;

    var sqlcheck = "select * from userdb where userName= '"+name+"'";
    var sql = "insert into userdb (userName, email, age, height, weight, gender, password) values ('"+name+"','"+email+"','"+age+"','"+height+"','"+weight+"','"+gender+"','"+password+"')" ;
    var sqluser = "CREATE TABLE IF NOT EXISTS "+name+" (InName VARCHAR(255), Protein VARCHAR(55), Carbohydrates VARCHAR(55), Fat VARCHAR(55), Calories VARCHAR(55))" ;

    con.query(sqlcheck, function (err, rows, result) {
      if (err) throw err;
      console.log("UserName check");
        // Object.keys(result).forEach(function(key) {
        // var arr = JSON.stringify(rows[0]);
        // var arred = JSON.parse(arr);
        // console.log(arred["userName"]);
        if (rows.length > 0) {
          console.log("Username is already taken");
          res.cookie('usernameCheck', 1);
          res.sendFile(path.join(__dirname + '/regPage.html'));
        } else {
          res.cookie('usernameCheck', 0);
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("input saved!");
          })
          con.query(sqluser, function (err, result) {
            if (err) throw err;
            console.log("User registered");
          })
          console.log("Registration successful!");
          res.sendFile(path.join(__dirname + '/loginPage.html'));
        }
  });
})

app.use(function(req, res, next) {
    res.status(404).send("It no work");
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080.');
});
