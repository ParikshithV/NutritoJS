var mysql = require('mysql');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false }); 

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nutritojs"
});
var fs = require('fs');

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE IF NOT EXISTS IntakeData (InName VARCHAR(255), Protein VARCHAR(55), Carbohydrates VARCHAR(55), Fat VARCHAR(55))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Done!");
  });
});

function SaveData() {

}

function onRequest(request, response) {
  response.writeHead(200,{'Content-Type': 'text/html'});
  fs.readFile('./homepage.html', null, function(error, data){ //write a response to the client
      if (error) {
        response.writehead(404);
        response.write('file not found');
      }else{
        response.write(data);
      }
  response.end(); //end the response
});
}
http.createServer(onRequest).listen(8080); //the server object listens on port 8080
