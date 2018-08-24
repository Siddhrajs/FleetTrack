import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Ajax } from '../Ajax';
import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { UserService } from '../providers/user.service';
import * as io from 'socket.io-client';
import { Language } from '../Language';
import { Http } from '@angular/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  lang = new Language(this.http,"en");
  latitude = 23;
  longitude = 72;
  ajax = new Ajax(this.router,this.user);
  public modalRef: BsModalRef;
  visible=false;
  assList=[];
  currList=[];
  cont:boolean =false;
  data:string;
  path;
  currentItem="";
  currentCategory="Vehicle";
  public i:number;
  socket: SocketIOClient.Socket;

  constructor(private http:Http, private modalService: BsModalService, private cookieService:CookieService,private router : Router,private user: UserService)
  {
    this.user.check=false;
    this.socket = io.connect('http://localhost:3000');
    this.socket.emit('add-user', {
      username: this.cookieService.get("pnum")
    });
    this.refreshList();
    setTimeout(()=>this.refreshAssignedList(),500);
    this.ajax.post('/changetrack',JSON.stringify({pnum : this.cookieService.get('pnum'),track : "0"}));
    setTimeout(()=>this.ajax.post('/changetrack',JSON.stringify({pnum : this.cookieService.get('pnum'),track : "1"})),100);
    setTimeout(()=>this.ajax.post('/changetrack',JSON.stringify({pnum : this.cookieService.get('pnum'),track : "0"})),5000);
  }

  ngOnInit() {
    this.socket.on('add-message', (msg: any) => {
      var obj=JSON.parse(msg);
      var prevlat=-1;
      var prevlong=-1;
      var prevtime="00:00:00";
      if(this.user.locationKey[obj.vehiclekey]==undefined)
      {
        this.user.locationKey[obj.vehiclekey]=this.user.vehicleLocation.length;
      }
      else{
        prevlat=this.user.vehicleLocation[this.user.locationKey[obj.vehiclekey]][0];
        prevlong=this.user.vehicleLocation[this.user.locationKey[obj.vehiclekey]][1];
        prevtime=this.user.vehicleLocation[this.user.locationKey[obj.vehiclekey]][6];
      }
      this.user.vehicleLocation[this.user.locationKey[obj.vehiclekey]]=[obj.location.lat,obj.location.long,obj.vehiclekey,prevlat,prevlong,this.getSpeed(obj.location.lat,obj.location.long,prevlat,prevlong,obj.location.time,prevtime),obj.location.time];
    });
  }

  showInfo(infoWindow){
    infoWindow.open();
  }

  getSpeed(lat1,lon1,lat2,lon2,time2,time1)
  {
    var R = 6371e3; 
    var φ1 = lat1*Math.PI/180;
    var φ2 = lat2*Math.PI/180;
    var Δφ = (lat2-lat1)*Math.PI/180;
    var Δλ = (lon2-lon1)*Math.PI/180;

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    if(lat2==-1)
      d=null;
    return d/(this.getTime(time2)-this.getTime(time1));
  }

  getTime(time1:string)
  {
    var tarr=[];
    tarr[0]=time1.substring(0,2);
    tarr[1]=time1.substring(3,5);
    tarr[2]=time1.substring(6,8);
    var t=parseInt(tarr[0],10)*3600+parseInt(tarr[1],10)*60+parseInt(tarr[2],10);
    return t;
  }

  setLatLng(){
    this.latitude+=0.00001;
    this.longitude+=0.00001;
    setTimeout(()=>this.latitude=this.user.vehicleLocation[this.user.locationKey[this.user.keyMap[this.currentItem]]][0],0);
    setTimeout(()=>this.longitude=this.user.vehicleLocation[this.user.locationKey[this.user.keyMap[this.currentItem]]][1],0);
  }

  showPath() {
    this.visible=true;
    this.ajax.post('/getLocation',JSON.stringify({pnum : this.cookieService.get('pnum'),vehiclekey : this.user.keyMap[this.currentItem]}));
  }

  hidePath() {
   this.visible=false;
  }

  showActive(event) {
    event.className += " active";
  }

  changeTrack(time,timeType){
    console.log("changeTrackTime");
    if(time===2&&timeType==="secs")
    {
      if(this.cont==false)
      {
        this.cont=true;
        this.ajax.post('/changetrack',JSON.stringify({pnum : this.cookieService.get('pnum'),track : "1"}));
      }
      else{
        this.cont=false;
        this.ajax.post('/changetrack',JSON.stringify({pnum : this.cookieService.get('pnum'),track : "0"}));
      }
    }
    else{
      if(this.currentItem!=="")
      {
        if(timeType==="mins")
        {
          time=time*1000*60;
        }
        else
        {
          time=time*1000*60*60;
        }
        this.ajax.post('/modifyTrack',JSON.stringify({pnum : this.cookieService.get('pnum'),vehiclekey : this.user.keyMap[this.currentItem],interval: time}))
      }
    }
  }
  refreshList(){
    this.ajax.post('/getDriverList',JSON.stringify({pnum : this.cookieService.get('pnum')}));
    this.ajax.post('/getVehicleList',JSON.stringify({pnum : this.cookieService.get('pnum')}));
    this.currentCategory="Vehicle";
    this.currentItem="";
  }
  refreshAssignedList(){
    this.ajax.post('/getAssignedList',JSON.stringify({pnum : this.cookieService.get('pnum')}));
  }

  addDorV(addSel,addVal)
  {
    this.ajax.post('/add'+addSel.value,JSON.stringify({pnum:this.cookieService.get('pnum'),name: addVal.value}));
    this.refreshList();
    this.closeModal();
  }

  assignDV(selDriver,selVehicle)
  {
    this.ajax.post('/assign',JSON.stringify({pnum:this.cookieService.get('pnum'),driverkey : this.user.keyMap[selDriver.value],vehiclekey : this.user.keyMap[selVehicle.value]}));
    this.closeModal();
  }

  unassignDV()
  {
    if(this.currentItem!=="")
    {
    var assignedItem=this.currentItem.split("/");
    this.ajax.post('/unassign',JSON.stringify({pnum:this.cookieService.get('pnum'),vehiclekey:this.user.keyMap[assignedItem[1]],driverkey:this.user.keyMap[assignedItem[0]]}));
    this.refreshAssignedList();
    this.currentItem="";
    }
  }

  deleteItem()
  {
    if(this.currentItem!=="")
    {
    console.log(this.currentCategory);
    console.log(this.currentItem);
    this.ajax.post('/delete',JSON.stringify({pnum:this.cookieService.get('pnum'),category: this.currentCategory,key: this.user.keyMap[this.currentItem]}));
    this.refreshList();
    }
  }

  editItem(name)
  {
    if(this.currentItem!=="")
    {
    console.log(this.currentCategory);
    console.log(this.currentItem);
    console.log(name);
    this.ajax.post('/edit',JSON.stringify({pnum:this.cookieService.get('pnum'),category: this.currentCategory,key: this.user.keyMap[this.currentItem],name: name}));
    this.refreshList();
    this.refreshAssignedList();
    this.closeModal();
    }
  }

  logout()
  {
    this.user.setUserLoggedIn(false);
    this.cookieService.removeAll();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  closeModal() {
    this.modalRef.hide();
  }
}