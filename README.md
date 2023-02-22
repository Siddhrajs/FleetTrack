# FleetTrack

A fleet tracking system combines the use of vehicle location from android
device with software that collects these fleet data for a comprehensive picture of
vehicle locations. This system can also be use to get other details like speed, paths,
stop points etc of particular vehicle.

## Problem Description
Transport companies require to track their vehicles. The traditional way of doing
this, is to call a driver and ask his/her location.To get precise details of vehicle, fleet
tracking in digital way is important. Main idea is to track all vehicles of the company.
Following questions must be answered in real time:
#### Which route driver has followed?
#### At a particular time where are all the vehicles?
#### What is their speed?
#### Motivation
Transport companies often wants to know reasons behind late delivery,where
are their vehicles, which path drivers have followed to reach destination, where they
have wasted their time etc.

## Applications
● Analysis of previous data to improve efficiency.
● Real time tracking.
● Using geofencing, we can detect liquor shop to avoid alcohol consumption by
drivers.
● Overspeed detection.
● Driver who needs help can ask for help to his nearby drivers.
● We can track trip time,summary and vehicle status.

## System Working
### sign up

User sign ups using two factor authentication.Using sendotp api,system generates
otp and verifies it and register the user(company owner) in system.

### login

Login using mobile number and password, cookies are stored to maintain session.

### DashBoard

Used google maps api to show location of driver and rest of the front-end is
built in angular.Dashboard shows maps on which we can point the location of
vehicles. Additional features like driver list, vehicle list, assigned driver, modify
tracking, show path, continues tracking, add, delete, edit and assign driver/vehicle
can be accessed which are shown in above screenshot.

### Add,edit,delete and assign driver

#### Continues Track

Toggling the continues track will track all vehicles with interval of 2 sec.

#### Modify Track

It will change the tracking interval of a particular vehicle.

#### Show path

We will ping driver’s phone at interval set by owner using firebase
cloud messaging service. In response to this phone will send location to
particular date in firebase real-time database. This data can be used to show
path of that vehicle.

## Firebase Database

Here,firebase root node consist of registered users.It contains all information of
drivers,vehicles and assigned drivers of company.
Locations sections contains vehicle and their locations according to their tracking
interval and also tracking by date.

## Technologies Used
● NodeJs
● Angular
● Firebase realtime database
● sendotp API
● socketIO
● React Native
● Firebase cloud messaging services

NodeJs used to create real time application.In this project it used to
create server,Accessing firebase database,to send data using socket etc.The
Firebase Realtime Database is a cloud-hosted database. Data is stored as
JSON and synchronized in realtime to every connected client. Sendotp api
used for two-factor authentication.socketIO is used for sending and receiving
data between front-end and back-end. React native is used for developing
cross platform mobile application.Firebase cloud messaging services is used## o send push notifications to phone.Angular is used for developing single page
application.

## Limitations
Here we are using mobile phone devices which has inbuilt GPS to track
vehicle. So it depends on driver location rather than vehicle location. Also this
system is highly depended on internet connectivity and it wouldn’t work in offline
mode.

## Extensions
● We can locate liquor shop and using geo-fencing we can track driver’s activity
around that area.
● We can use GPS module rather than using GPS of Mobile phone to enhance
tracking.
● We can include fuel monitoring, GPS tracking camera to record activities.
● Driver can see nearby drivers to ask for help in emergency.
● We can include fuel monitoring, GPS tracking camera to record activities.