var database = require('../../database.js');

module.exports = function(app){

/*app.get('/addVehicle',function(req,res){
   

       res.render(__dirname + '/public/addvehicle.html');
});*/

app.post('/assign', (req, res) => {
 

		database.assignVehicle(req,res);

});

}
