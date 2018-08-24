var SendOtp = require('sendotp');
var sendOtp = new SendOtp('222455ASdYLCRwVqHv5b30fdf4');
var database = require('../../database');
module.exports = function(app){

app.get('/register',function(req,res){
   
         res.render('./index.html');
});
app.post('/register', (req, res) => {
 
		const type = req.body.type;
 		if("OTP"===type)
 		{
 			const number = req.body.number;
			var contactNumber = "+91"+String(number);
			sendOtp.send(contactNumber,"FLEETTRACK",function (error, data, response) {
  			console.log(data);
			});
			sendOtp.setOtpExpiry('5');
			res.json({msg:"OTP SENT"});
		}
		if("SIGNUP"==type)
		{
			const number = req.body.pnum;
			var contactNumber = "+91"+String(number);
			var otp  = req.body.otpnum;
			var otpforver = String(otp);
			sendOtp.verify(contactNumber,otpforver, function (error, data, response) {
  			console.log(data);
 			 if(data.type == 'success') {
  			console.log('OTP verified successfully');


  					database.registerUser(req,res);

  	
  		}
  			if(data.type == 'error'){ console.log('OTP verification failed');
  				res.json({msg:"Invalid OTP"});
  		}

  		});
			
  			
  		}

});

}
