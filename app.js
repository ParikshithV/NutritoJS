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
// var server = require('http').createServer();
// var io = require('socket.io')(server);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
// app.use(session({secret: "Shh, its a secret!"}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
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
  //getData();
});

app.get('/', function(req, res) {
  // Homepage yet to be made
});

app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/loginPage', function(req, res) {
    res.sendFile(path.join(__dirname + '/loginPage.html'));
});

app.post('/loginSession', function(req, res) {
    var userName = req.body.userName;
    var password = req.body.password;
    console.log("Login check...");

    var sql = "SELECT * FROM userdb where userName = '"+userName+"' and password = '"+password+"'" ;
    con.query(sql, function (error,  results) {
    if (error) {
   console.log("error ocurred",error);
      }
      else{
            if(results.length >0)
              {
                return res.send("200");
                req.session.name = userName;
                //redirect
               }
        else
          {
          return res.send("300");
          }
        }
      });
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
    var name = req.body.name;
    var email = req.body.email;
    var age = req.body.age;
    var height = req.body.height;
    var weight = req.body.weight;
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
          // res.cookie('usernameCheck', 1);
          res.sendFile(path.join(__dirname + '/regPage.html'));
        } else {
          res.cookie('usernameCheck', 0);
          con.query(sql, function (err, result) {
            if (err) throw err;
            return res.send('200');
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


function getData(userName){
  var sql = "SELECT sum(Protein) FROM "+userName+"" ;
  con.query(sql, function (err, rows, result) {
    if (err) throw err;
    Object.keys(result).forEach(function(key) {
      var arr = JSON.stringify(rows[0]);
      var arred = JSON.parse(arr);
      // console.log(arred["sum(Protein)"]);
      sumPro = arred["sum(Protein)"];
    });
  })

  var sql = "SELECT sum(Carbohydrates) FROM "+userName+"" ;
  con.query(sql, function (err, rows, result) {
    if (err) throw err;
    Object.keys(result).forEach(function(key) {
      var arr = JSON.stringify(rows[0]);
      var arred = JSON.parse(arr);
      // console.log(arred["sum(Carbohydrates)"]);
      sumCarbs = arred["sum(Carbohydrates)"];
  });
  })

  var sql = "SELECT sum(Fat) FROM "+userName+"" ;
  con.query(sql, function (err, rows, result) {
    if (err) throw err;
    Object.keys(result).forEach(function(key) {
      var arr = JSON.stringify(rows[0]);
      var arred = JSON.parse(arr);
      // console.log(arred["sum(Fat)"]);
      sumFat = arred["sum(Fat)"];
  });
  })

  var sql = "SELECT sum(Calories) FROM "+userName+"" ;
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

app.use(function(req, res, next) {
    res.status(404).send("It no work");
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080.');
});
