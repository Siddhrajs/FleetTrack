import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isUserLoggedIn;
  private vehicleList : JSON;
  private driverList : JSON;
  private assignedList : JSON;
  public vehicleArr = [];
  public driverArr = [];
  public assignedArr = [];
  public keyMap = [];
  public nameMap = [];
  public vehicleDriver = [];
  public vehicleLocation = [];
  public locationKey = [];
  public pathOrigin;
  public pathDest;
  public pathWaypoints:any=[];
  private pathKeys = [];
  public check:boolean;
  constructor() {
      this.isUserLoggedIn=false;
      this.vehicleLocation = [];
      this.locationKey = [];
  }

  setAssignedList(list : JSON) {
    this.assignedList=list;
  }

  getAssignedList() {
    return this.assignedList;
  }

  setDriverList(list:JSON) {
    this.driverList=list;
  }

  getDriverList() {
    return this.driverList;
  }

  setVehicleList(list:JSON) {
    this.vehicleList=list;
  }

  getVehicleList(){
    return this.vehicleList;
  }

  setUserLoggedIn(set:boolean) {
    this.isUserLoggedIn=set;
  }

  getUserLoggedIn()
  {
    return this.isUserLoggedIn;
  }
  jsonToArr(jsonData){
    var Arr =[];
    for(var key in jsonData)
    {
      Arr.push([jsonData[key].name,key]);
      this.keyMap[jsonData[key].name]=key;
      this.nameMap[key]=jsonData[key].name;
    }
    return Arr
  }
  assignedToArr(assignedJson)
  {
    var assList=[];
    for(var key in assignedJson)
    {
      assList.push([this.driverList[key].name+"/"+this.vehicleList[assignedJson[key].assign].name]);
      this.vehicleDriver[assignedJson[key].assign]=this.driverList[key].name;
    }
    return assList;
  }
  jsonTocurrentPath(data)
  {
    this.pathKeys = [];
    this.pathWaypoints = [];
    for(var key in data)
    {
      this.pathKeys.push(key);
    }
    this.pathOrigin={lat:data[this.pathKeys[0]].lat,lng:data[this.pathKeys[0]].long};
    console.log(this.pathOrigin);
    var i;
    for(i=1;i<this.pathKeys.length-1;i++)
    {
      this.pathWaypoints.push({location:{lat:data[this.pathKeys[i]].lat,lng:data[this.pathKeys[i]].long},stopover:false})
    }
    console.log(this.pathWaypoints);
    this.pathDest={lat:data[this.pathKeys[this.pathKeys.length-1]].lat,lng:data[this.pathKeys[this.pathKeys.length-1]].long};
  }
}
