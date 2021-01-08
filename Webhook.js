var portServer = 8000;
var mongoPort = 27017;
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var http = require('http');
//var https = require('https');
var MongoClient = require('mongodb').MongoClient;
var sanitize = require('mongo-sanitize');

var mongoConnectionURL = `mongodb://mongo:${mongoPort}/Webhook`;
//The //mongo comes from the docker-compose.yml 

secretEndpointData = {
    "name":"Trogdor",
    "title":"The Burninator",
};
app.get("/endpoint", function(req, res){
    res.write(JSON.stringify(secretEndpointData));
    res.end();
});
app.post("/endpoint", function(req, res){
    try{
        var obj = JSON.parse(req.body)
        secretEndpointData = JSON.stringify(obj);
        res.send("204 No Content");
    }
    catch(e){
        res.send(e);
    }
    res.end();
});


app.post("/webhook/:name", function(req, res){
        console.log(`Webhook hit: ${req.params.name}`);
        callback = function(){
                res.send("204 No Content");
        }

        MongoClient.connect(mongoConnectionURL , { useUnifiedTopology: true })
                .then( (db) => {
                        return db.db().collection('hooks');
                })
                .then( (hooks) => {
                        name = sanitize(req.params.name)
                        var ts = Date.now();
                        hooks.insertOne({time: ts, hook: name, data: sanitize(req.body)}, function(){ res.send("204 No Content") });
                } )
                .catch(function(err){ console.log(err) });

});

app.get("/webhook/:name/delete", function(req, res){
        MongoClient.connect(mongoConnectionURL ,{ useUnifiedTopology: true }, function (err, db) {
                        if(err) throw err;
                db.db().collection("hooks").deleteMany({"hook":sanitize(req.params.name)});
        });
        res.redirect(req.headers.host + "/webhook/"+req.params.name +"/display");
});

app.get("/webhook/:name/display", function(req, res){

        MongoClient.connect(mongoConnectionURL ,{ useUnifiedTopology: true }, function (err, db) {
                if(err) throw err;

                db.db().collection("hooks", function(err, collection){
                        db.db().collection("hooks").find({"hook": sanitize(req.params.name)}).toArray(function(err,arr){
                                    res.send(arr);
                                 });
                        });
        });
});

const httpServer = http.createServer(app);
var server = httpServer.listen(portServer, function () {
           var host = server.address().address
           var port = server.address().port

           console.log("Webhook listening at http://%s:%s", host, port)
});

