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
const pug = require('pug');
app.set('view engine', "pug");


var myArgs = process.argv.slice(2);
console.log(`MyArgs: ${myArgs}`);
if(myArgs[0]){
        mongoPort = myArgs[0];
}
if(myArgs[1]){
        portServer = myArgs[1];
}

const mongoConnectionURL = `mongodb://webhookMongo:${mongoPort}/Webhook`;
const  mongoConnectionURL2 = `mongodb://webhookMongo:${mongoPort}`;
//The //mongo comes from the docker-compose.yml 

var dbPool;

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
	res.end();
    }
    catch(e){
        res.send(e);
    }
    res.end();
});

app.get("/list", async function(req, res){
	const hookList = await MongoDB.db("Webhook").collection("hooks").distinct("hook");
	res.render("list.pug", {"names":hookList});
	res.end();
});

app.post("/webhook/:name", async function(req, res){
        console.log(`Webhook hit: ${req.params.name}`);
	
	name = sanitize(req.params.name)
	var ts = Date.now();
	const result = await MongoDB.db("Webhook").collection("hooks").insertOne({time: ts, hook: name, headers: req.headers, data: sanitize(req.body)} );
	if(result){
		res.send("204 No Content");
		res.end();
	}else{
		console.error("No result for add");
	}

});

app.put("/webhok/:name", async function(req, res){
        console.log(`Webhook hit: ${req.params.name}`);
        callback = function(){
                res.send("204 No Content");
        }
	name = sanitize(req.params.name)
	var ts = Date.now();
	const result = await MongoDB.db("Webook").collection("hooks").insertOne({time: ts, hook: name, headers: req.headers, data: sanitize(req.body)});
	if(result){
		res.send(`204 No Content`);
		res.end();
	}else{
		console.error(`Could not insert record`);
	}
});

app.get("/webhook/:name/count", async function(req, res){

	var myCount = await MongoDB.db("Webhook").collection("hooks").countDocuments({hook:sanitize(req.params.name)});
	res.send(`Count is: ${myCount}`);
	res.end();
});

app.get("/webhook/:name/count/:startTime/:duration", async function(req, res){
	//Finds count of entries :duration seconds after :startTime where :startTime is milliseconds from Unix Epoch
	name = sanitize(req.params.name);
        time = parseInt(sanitize(req.params.startTime));
	oTime = time;
	duration = parseInt(sanitize(req.params.duration));
	time += (duration * 1000);

	const result = await MongoDB.db("Webhook").collection("hooks").countDocuments({hook: name, time: {$lt: time} });
	res.send(`Count ${duration} seconds after ${oTime} is: ${result}`);
	res.end();

});

app.get("/webhook/:name/first", async function(req, res){
	name = sanitize(req.params.name);
	const result = await MongoDB.db("Webhook").collection("hooks").find({hook:name}).sort({time:1}).toArray();
	res.send(result);
	res.end();
});

app.get("/webhook/:name/delete", async function(req, res){
	const result = await MongoDB.db("Webhook").collection("hooks").deleteMany({"hook":sanitize(req.params.name)});
	res.redirect("/webhook/" + sanitize(req.params.name) + "/display");

});

app.get("/webhook/:name/display", async function(req, res){
	const result = await MongoDB.db("Webhook").collection("hooks").find({"hook":sanitize(req.params.name)}).sort({$natural:-1}).toArray();
	res.send(result);
	res.end();
});

app.get("/webhook/:name", function(req, res){
	res.redirect(301, "/webhook/" + sanitize(req.params.name) + "/display");
});

const MongoDB = new MongoClient(mongoConnectionURL2, { useUnifiedTopology: true });
async function DBSetup(){
	try{
		await MongoDB.connect();
	}catch(e){
		console.error(`Database connection error!\n ${e}`);
	}finally{
		//await MongoDB.close();
	}
}

const httpServer = http.createServer(app);
var server = httpServer.listen(portServer, function () {
           var host = server.address().address
           var port = server.address().port
		DBSetup().catch(console.error);
           console.log("Webhook listening at http://%s:%s", host, port)
});

