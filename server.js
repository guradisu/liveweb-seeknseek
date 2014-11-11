var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');

httpServer.listen(8080);

console.log("Listening on 8080");

function requestHandler(req, res) {

  var parsedUrl = url.parse(req.url);
  parsedUrl.somethingElse = parsedUrl.pathname;

  console.log("The Request is: " + parsedUrl.pathname);
  
  if (parsedUrl.somethingElse == "/"){
    parsedUrl.somethingElse = "/index.html";
  }

  fs.readFile(__dirname + parsedUrl.somethingElse, 
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + parsedUrl.pathname);
      }
      // Otherwise, send the data, the contents of the file

      res.writeHead(200);
      res.end(data);
      }
    );
}

//================ SOCKET.IO =====================

var io = require('socket.io').listen(httpServer);

var connectedSockets = [];

io.sockets.on('connection',function(socket){
  console.log("New client: " + socket.id);
  connectedSockets.push(socket);
  console.log("Connected clients: "+connectedSockets.length);

  socket.on('disconnect',function(){
    for (var i=0;i<connectedSockets.length;i++){
      if (connectedSockets[i]===socket){
        connectedSockets.splice(i,1);
      }
      break;
    }
    console.log("Connected clients: "+connectedSockets.length);
  });

});