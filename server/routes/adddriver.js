var database = require('../../database.js');

module.exports = function(app){

/*app.get('/addDriver',function(req,res){
   
console.log("sverevev");
       res.render(__dirname + '/public/adddriver.html');
});*/

app.post('/addDriver', (req, res) => {
 
 console.log("vsvevdrver");
		database.addDriver(req,res);

});

}
