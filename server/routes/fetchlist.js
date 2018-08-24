var database = require('../../database.js');

module.exports = function(app){

app.post('/getDriverList',function(req,res){
  
      database.getDriverList(req,res);
});

app.post('/getVehicleList', (req, res) => {

	database.getVehicleList(req,res);
});

app.post('/getAssignedList', (req, res) => {
      database.getAssignedList(req,res);
});

app.post('/getLocation',(req,res) =>{
      database.getTodaysLocation(req,res);
});
app.post('/changetrack',(req,res)=>{
database.tracking(req,res);
});

app.post('/modifyTrack',(req,res) =>{
      database.ModifyTracking(req,res);
});
}

