import { Router } from "@angular/router";
import { UserService } from "./providers/user.service";

export class Ajax
{
  constructor(private router:Router,private user:UserService){
  }
    post(url,bodyString)
    {
    fetch(url, {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: bodyString
      })
      .then(response => { 
        return response.json(); 
      }).then(data => { 
        if(url==='/auth'&&data.msg==='true')
        {
          this.user.setUserLoggedIn(true);
          this.router.navigate(['/dashboard']);
        }
        if(url==='/getDriverList')
        {
          this.user.setDriverList(data);
          this.user.driverArr=this.user.jsonToArr(data);
        }
        if(url==='/getVehicleList')
        {
          this.user.setVehicleList(data);
          this.user.vehicleArr=this.user.jsonToArr(data);
        }
        if(url==='/getAssignedList')
        {
          this.user.setAssignedList(data);
          this.user.assignedArr=this.user.assignedToArr(data);
        }
        if(url==='/getLocation')
        {
          this.user.jsonTocurrentPath(data);
        }
      })
        .catch(function(err){
          console.log(err);
      });
    }
}