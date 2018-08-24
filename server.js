var express = require('express');
const bodyParser = require('body-parser');
//var SendOtp = require('sendotp');
//var sendOtp = new SendOtp('217185ASckRx215b07feb6');
const ejs = require('ejs');
var signup = require('./server/routes/signup');
var login = require('./server/routes/login');
var addDriver = require('./server/routes/adddriver');
var addVehicle = require('./server/routes/addvehicle');
var assignVehicle = require('./server/routes/assignvehicle');
var fetchlist = require('./server/routes/fetchlist');
var database = require('./database');
var app = express();

app.set('views',__dirname + '/dist/mean-app')
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.static(__dirname + '/dist/mean-app'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

database.putListener();
signup(app);
login(app);
addDriver(app);
addVehicle(app);
assignVehicle(app);
fetchlist(app);
app.get('/', (req, res) => {
  res.send('invaild endpoint');
});

var server=app.listen(process.env.PORT || 3000);
console.log('you are listening to port 3000');

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
console.log("oye");
  socket.on('add-user', function(data){
    var clients_obj = {
      "username" : data.username,
      "socket": socket.id
    };
  //  clients.push(clients_obj);
      database.getCurrentLocationData("91-"+data.username,io,socket.id);

  });
  

socket.on('disconnect', function() {
 /*   for(var name in clients) {
      if(clients[name].socket === socket.id) {
        delete clients[name];
        break;
      }
    } */
  })

});