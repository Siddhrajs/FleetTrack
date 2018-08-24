var database = require('../../database');


module.exports = function(app){

app.get('/login',function(req,res){
   
         res.render('./index.html');
});
app.post('/login', (req, res) => {
 
		database.loginUser(req,res);
});
app.get('/dashboard',function(req,res){
   
    res.render('./index.html');
});
app.post('/auth', (req, res) => {
 
    database.authUser(req,res);
});

}
