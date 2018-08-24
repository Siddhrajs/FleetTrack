var firebase = require('firebase');
var request = require('request');
var vehiclekey = [];
 var config = {
    apiKey: "AIzaSyDZiarvhBiFUQQBt7_jyQYvuHtzemc7iUk",
    authDomain: "fleet-track-2018.firebaseapp.com",
    databaseURL: "https://fleet-track-2018.firebaseio.com",
    projectId: "fleet-track-2018",
    storageBucket: "fleet-track-2018.appspot.com",
    messagingSenderId: "803513680370"
  };
  firebase.initializeApp(config);

module.exports = {
    registerUser: function(req,res) {
      var refpswd = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/pswd");
      var refcompanyname = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/companyName");
      var refdriverlist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/driverlist");
      var refvehiclelist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/vehiclelist");
      var track= firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/track/value");
      firebase.database().ref("/usernames").push("91-"+req.body.pnum);
      refcompanyname.set(String(req.body.companyname));
      refpswd.set(String(req.body.pswd));
      refdriverlist.set("");
      refvehiclelist.set("");
      track.set("0");
      res.json({msg:"REG OK"});
    },
    tracking: function(req,res){

      firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/track/value").set(req.body.track);
    } ,
    sendNotification : function(token , vehiclekey){
             request({
                 url: 'https://fcm.googleapis.com/fcm/send',
                  method: 'POST',
                  headers: {
                  'Content-Type' :'application/json',
                'Authorization': 'key=AIzaSyA6oHQGMZGYWHq1wy46uIKndeoXMffZiqE'
    
                    },
                 body: JSON.stringify(
                 { "data": {
                "vehiclekey": vehiclekey
                 },
               "to" : token
                 }
             )
      }, function(error, response, body) {
        if (error) { 
          console.error(error, response, body); 
        }
        else if (response.statusCode >= 400) { 
          console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
        }
        else {
          console.log('Done!')
        }
      });
    },
    putListener : function() {
        
      var driverlist = {};
      var vehiclelist = {};
      var interval = {};
      var interval_ref = {};
      
      firebase.database().ref('/usernames')
          .on('child_added' , (user_snap) => {
          var username = user_snap.val();
          
          firebase.database().ref('/Registered/'+username+'/driverlist')
              .on('child_added' , (add_snap) => {
              console.log('driver added : ' + add_snap.key);
              driverlist[add_snap.key] = add_snap.val();
          });
          firebase.database().ref('/Registered/'+username+'/driverlist')
              .on('child_changed', (change_snap) => {
              console.log('driver changed : ' + change_snap.key);
              driverlist[change_snap.key] = change_snap.val();
          });
          firebase.database().ref('/Registered/'+username+'/driverlist')
              .on('child_removed', (remove_snap) => {
              console.log('driver removed : ' + remove_snap.key);
              delete driverlist[remove_snap.key];
          });
          
          firebase.database().ref('/Registered/'+username+'/vehiclelist')
              .on('child_added' , (add_snap) => {
              console.log('vehicle added : ' + add_snap.key);
              vehiclelist[add_snap.key] = add_snap.val();
              
              if(vehiclelist[add_snap.key].driver !== ""){
                interval[add_snap.key] = vehiclelist[add_snap.key].interval;
                  interval_ref[add_snap.key] = setInterval(()=>{
                    if(vehiclelist[add_snap.key].driver!=="" && driverlist[vehiclelist[add_snap.key].driver].token!==""){
                   this.sendNotification(driverlist[vehiclelist[add_snap.key].driver].token,add_snap.key);
                      console.log(
                          add_snap.key + " : " + interval[add_snap.key] + " : " + interval_ref[add_snap.key].toString()
                      );}
                  },interval[add_snap.key]);
              }
          });
          var check = false;
          firebase.database().ref('/Registered/'+username+'/track').on('child_changed',(snap)=>{
            if(snap.val()==="1")
            {
              check =true;
              for(var key in vehiclekey[username])
              {
                console.log(key);
                clearInterval(interval_ref[key]);
              interval_ref[key] = setInterval(() => {
                if(vehiclelist[key].driver!=="" && driverlist[vehiclelist[key].driver].token!==""){
                  this.sendNotification(driverlist[vehiclelist[key].driver].token,key);
                console.log(key + " : " + "2000" + " : " + interval_ref[key].toString());
                }
              },2000);
            }
            }
            else{
              check = false;
              for(var key in vehiclekey[username])
              {
                console.log(key);
                clearInterval(interval_ref[key]);
              interval_ref[key] = setInterval(() => {
                if(vehiclelist[key].driver!=="" && driverlist[vehiclelist[key].driver].token!==""){
                  this.sendNotification(driverlist[vehiclelist[key].driver].token,key);
                console.log(key + " : " + interval[key] + " : " + interval_ref[key].toString());
                }
              },interval[key]);
            }
            } 
          });
          firebase.database().ref('/Registered/'+username+'/vehiclelist')
              .on('child_changed', (change_snap) => {
              console.log('vehicle changed : ' + change_snap.key);
              vehiclelist[change_snap.key] = change_snap.val();
              var inter = vehiclelist[change_snap.key].interval;
              if(inter != interval[change_snap.key]){
                  interval[change_snap.key] = vehiclelist[change_snap.key].interval;
                  clearInterval(interval_ref[change_snap.key]);
                  if(interval[change_snap.key] !== "" && vehiclelist[change_snap.key].driver !== ""){
                      interval_ref[change_snap.key] = setInterval(() => {
                          if(vehiclelist[change_snap.key].driver!=="" && driverlist[vehiclelist[change_snap.key].driver].token!==""){
                            this.sendNotification(driverlist[vehiclelist[change_snap.key].driver].token,change_snap.key);
                          console.log(
                              change_snap.key + " : " + interval[change_snap.key] + " : " + interval_ref[change_snap.key].toString()
                          );
                        }
                      },interval[change_snap.key]);
                  }
              }
          });
          firebase.database().ref('/Registered/'+username+'/vehiclelist')
              .on('child_removed', (remove_snap) => {
              console.log('vehicle removed : ' + remove_snap.key);
              delete interval[remove_snap.key];
              clearInterval(interval_ref[remove_snap.key]);
              delete interval_ref[remove_snap.key];
              delete vehiclelist[remove_snap.key];
          });
      });        
  },
  getLocationDataOnDate : function (vehiclekey,date) {
      firebase.database()
          .ref('/locations/'+vehiclekey+"/"+date)
          .once('value' , (location_snap) => {
          var loc_data = location_snap.val();
          loc_data = JSON.stringify(loc_data);
      });
  },
  getCurrentLocationData :function (username,io,socket) {
    console.log("yup");
    var today_obj = new Date();
    var day = today_obj.getDate().toString();
    var month = (today_obj.getMonth() + 1).toString();
    var year = today_obj.getFullYear().toString();
    
    if(day.length==1){
        day = "0"+day;
    }
    if(month.length==1){
        month = "0"+month;
    }
    var date=year+'-'+month+'-'+day;
    
    var yesterday = new Date();
    yesterday.setDate(today_obj.getDate()-1);
    var yd = yesterday.getDate().toString();
    var ym = (yesterday.getMonth()+1).toString();
    var yy = yesterday.getFullYear().toString();

      if(yd.length==1){
        yd = "0"+yd;
    }
    if(ym.length==1){
        ym = "0"+ym;
    }
    var yesterDate=yy+'-'+ym+'-'+yd;

    firebase.database().ref('/Registered/'+username+'/vehiclelist').on('child_added' , (vehicle_snap) => {

            var vehiclekey = vehicle_snap.key;

            firebase.database().ref('/locations/'+vehiclekey+"/"+yesterDate).off();
            firebase.database()
                .ref('/locations/'+vehiclekey+"/"+date).limitToLast(2)
                .on('child_added' , (snapshot)=>{
                var key_val = snapshot.key;
                console.log(key_val);
                firebase.database()
                   .ref('/locations/'+vehiclekey+"/"+date+'/'+key_val)
                    .once('value' , (loc_val) =>{
                    var obj = {
                        'vehiclekey' : vehiclekey,
                       'location' : snapshot.val()
                    };
                    var loc_data = JSON.stringify(obj);
                  console.log(loc_data);
                  if(typeof io.sockets.connected[socket]!=='undefined')
                  { io.sockets.connected[socket].emit("add-message",loc_data);
            }


                    });
        });
    });
  },
   loginUser: function(req,res) {
     
      var ref = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/pswd");
      if(ref)
      {
              ref.once('value',ref_val=>{
                console.log(ref_val.val());
                if(req.body.pswd===ref_val.val())
                { 
          
                res.json({msg: req.body.pswd});
               }
               else
             {  
            res.json({msg:'PSW WRONG'});
             }
          });
      }
      else
      {
       res.json({msg: 'NUM WRONG'});
      }

    },
    authUser: function(req,res) {
     
      var ref = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/pswd");
      if(ref)
      {
              ref.once('value',ref_val=>{
                console.log(ref_val.val());
                if(req.body.pswd===ref_val.val())
                { 
          
                res.json({msg: 'true'});
               }
               else
             {  
            res.json({msg:'PSW WRONG'});
             }
          });
      }
      else
      {
       res.json({msg: 'NUM WRONG'});
      }
    },
    addDriver: function(req,res){
      var refdriverlist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/driverlist");
     console.log(req.body.name);
       refdriverlist.push({
         assign : "",
         name : req.body.name
       });
     res.json({msg:"DRI OK"});
   },
   addVehicle: function(req,res){
     var refvehiclelist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/vehiclelist");
    
      refvehiclelist.push({
        
        driver : "",
        interval : "5000",

        name : req.body.name

      });
    res.json({msg:"VEH OK"});
  },
  getDriverList: function(req,res){
         var refdriverlist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/driverlist");

        refdriverlist.once('value',(snapshot)=>{
          var newset ={};
          var allobj = snapshot.val();
          for(var key in allobj){
            var obj = allobj[key];
            newset[key] = {
              name : allobj[key].name

            };
          }

          res.json(newset);
        });


  },
   getVehicleList: function(req,res){

        var refvehiclelist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/vehiclelist");

        refvehiclelist.once('value',(snapshot)=>{
          res.json(snapshot.val());
          vehiclekey["91-"+req.body.pnum]=snapshot.val();
        });

  },
  assignVehicle: function(req,res){

         var refdriverlist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/driverlist/"+req.body.driverkey+"/assign");
    
          var refvehiclelist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/vehiclelist/"+req.body.vehiclekey);
       refdriverlist.once('value',(vehicle_snap)=>{
        var vehiclekey = vehicle_snap.val();
        if(vehiclekey!=="")
        {
          firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/vehiclelist/"+vehiclekey+"/driver").set("");
        }
         refvehiclelist.child('driver').once('value',(snapshot)=>{
            if(snapshot.val()!=="")
            firebase.database().ref('/Registered/'+"91-"+req.body.pnum+"/driverlist/"+snapshot.val()+"/assign").set("");
            console.log(snapshot.val());
             refvehiclelist.child('driver').set(req.body.driverkey);
            refdriverlist.set(req.body.vehiclekey);
          });
    });       
  },
  deleteItem: function(req,res){

    if(req.body.category==="Driver")
    {
         var refdriverlist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/driverlist/"+req.body.key);
          refdriverlist.child('assign').once('value',(snapshot)=>{
          if(snapshot.val()!=="")
          {
           var refvehiclelist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/vehiclelist/"+snapshot.val());
           refvehiclelist.child('driver').set("");
          }
           firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/driverlist/").child(req.body.key).remove();
    
    });
    }
    else if(req.body.category==="Vehicle")
    {
        var refvehiclelist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/vehiclelist/"+req.body.key);
        refvehiclelist.child('driver').once('value',(snapshot)=>{
    if(snapshot.val()!=="")
    {
      firebase.database().ref('/Registered/'+"91-"+req.body.pnum+"/driverlist/"+snapshot.val()+"/assign").set("");

      refvehiclelist.child('driver').set("");
    }
     firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/vehiclelist/").child(req.body.key).remove();

  });
    }
  },
editItem: function(req,res){


  if(req.body.category==="Driver")
  {
       var refdriverlist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/driverlist/"+req.body.key);
        refdriverlist.child('name').set(req.body.name);
  }
  else
  {
      var refvehiclelist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/vehiclelist/"+req.body.key);
    refvehiclelist.child('name').set(req.body.name);
  }

},    
  getAssignedList: function(req,res){
    var refdriverlist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/driverlist");

     refdriverlist.once('value',(snapshot)=>{
       var newset ={};
       var allobj = snapshot.val();
       for(var key in allobj){
         var obj = allobj[key];
         if(allobj[key].assign!==""){
         newset[key] = {
           assign : allobj[key].assign,
         };
       }
       }
       res.json(newset);
     });
  },
  unassign:function(req,res){
    var refdriverlist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/driverlist/"+req.body.driverkey+"/assign");
   refdriverlist.set("");

   var refvehiclelist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/vehiclelist/"+req.body.vehiclekey+"/driver");
   refvehiclelist.set("");

  },
  getTodaysLocation : function(req,res)
    {
       var date_obj = new Date();
        var day = date_obj.getDate().toString();
        var month = (date_obj.getMonth() + 1).toString();
        var year = date_obj.getFullYear().toString();
        
        if(day.length==1){
            day = "0"+day;
        }
        if(month.length==1){
            month = "0"+month;
        }
        var date=year+'-'+month+'-'+day;
        
        firebase.database()
            .ref('/locations/'+req.body.vehiclekey+"/"+date)
            .once('value' , (location_snap) => {
          
            res.json(location_snap.val());

        });
    },
    ModifyTracking : function(req,res){

      var refvehiclelist = firebase.database().ref("/Registered/"+"91-"+req.body.pnum+"/vehiclelist/"+req.body.vehiclekey+"/interval");
    refvehiclelist.set(req.body.interval);
    }
}
