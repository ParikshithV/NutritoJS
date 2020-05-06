var mysql = require('mysql');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var fs = require('fs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
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
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Done!");
  })
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/homepage.html'));
});

app.post('/save.html', urlencodedParser, function(req, res){
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

app.use(function(req, res, next) {
    res.status(404).send("It no work");
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080.');
});

//-----------------------------------------------------------------------------------------------

// var server = http.createServer(function(req,res){
//   console.log('request was made: ' + req.url);
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   var myReadStream = fs.createReadStream(__dirname + req.url, 'utf8');
//   myReadStream.pipe(res);
// });
//
// server.listen(8080);
// console.log('listening to port 8080');

//-----------------------------------------------------------------------------------------------

// function onRequest(req, res) {
//     res.writeHead(200,{'Content-Type': 'text/html'});
//   fs.readFile('./homepage.html', null, function(error, data){ //write a response to the client
//       if (error) {
//         res.writehead(404);
//         res.write('file not found');
//       }else{
//         res.write(data);
//       }
//   res.end(); //end the response
// });
// }
// http.createServer(onRequest).listen(8080); //the server object listens on port 8080
