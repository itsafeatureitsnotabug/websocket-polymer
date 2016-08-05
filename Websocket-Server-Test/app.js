var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

app.ws('/', function(ws,req){
	console.log("Client Request received !")
	ws.on('message', function(msg){
		console.log("Server Received Message : " + msg)
		ws.send(msg);
	})
});


var port = process.env.PORT || 8000;
app.listen(port);

console.log('\n\n HTTP server started at port : ' + port + ' !!')