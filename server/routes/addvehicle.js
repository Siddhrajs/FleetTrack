var database = require('../../database.js');

module.exports = function(app){


app.post('/addVehicle', (req, res) => {
 

		database.addVehicle(req,res);

});

app.post('/delete', (req, res) => {
 

    database.deleteItem(req,res);

});

app.post('/edit', (req, res) => {
 
    database.editItem(req,res);

});

app.post('/unassign', (req, res) => {
 
    database.unassign(req,res);

});

}
