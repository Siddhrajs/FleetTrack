import { DataFinder } from './providers/datafinder';
import { Http } from '@angular/http';
export class Language
{
    dataFinder : DataFinder;
    disSignUp = '';
    disLogIn = '';
    disCompName = '';
    disGetOtp = '';
    disPhoneNumber = '';
    disOtp = '';
    disPass = '';
    disRePass = '';
    disComp = '';
    disPhone = '';
    disRPass = '';
    warnMismatch = '';
    warnPassSize = '';
    warnEmpty = '';
    warnValid = '';
    disSignIn = '';
    disNoAcc = '';
    disSignHere = '';
    title = '';
    profile = '';
    assigned = '';
    logout = '';
    vehicle = '';
    driver = '';
    speed = '';
    time = '';
    add = '';
    assign = '';
    del = '';
    edit = '';
    showpath = '';
    hidepath = '';
    modify = '';
    continous = '';
    confirm = '';
    list = '';
    editc = '';
    deletec = '';
    unassign = '';
    minute = '';
    hours = '';
    name = '';
    constructor(private http : Http, lang : string)
    {
        this.dataFinder = new DataFinder(this.http);
        this.getData(lang);
    }
    getData(lang : string)
    {
        this.dataFinder.getJSONDataAsync("../assets/"+lang+".json").then(data => {
            this.disSignUp=data.SignUpPage.SIGNUP;
            this.disLogIn=data.SignInPage.LOGIN;
            this.disCompName=data.SignUpPage.COMPANYNAME;
            this.disGetOtp=data.SignUpPage.GETOTP;
            this.disPhoneNumber=data.SignUpPage.PHONENUMBER;
            this.disOtp=data.SignUpPage.OTP;
            this.disPass=data.SignUpPage.PASSWORD;
            this.disRePass=data.SignUpPage.REPASSWORD;
            this.disComp=data.SignUpPage.COMPANY;
            this.disPhone=data.SignUpPage.PHONE;
            this.disRPass=data.SignUpPage.REPASS;
            this.warnMismatch=data.SignUpPage.Warnings.MISMATCH;
            this.warnPassSize=data.SignUpPage.Warnings.PSIZE;
            this.warnEmpty=data.SignUpPage.Warnings.EMPTY;
            this.warnValid=data.SignUpPage.Warnings.VALID;
            this.disSignIn=data.SignInPage.SIGNIN;
            this.disNoAcc=data.SignInPage.NOACCOUNT;
            this.disSignHere=data.SignInPage.SIGNHERE;
            this.title = data.DashBoardPage.TITLE;
            this.profile = data.DashBoardPage.PROFILE;
            this.assigned = data.DashBoardPage.ASSIGNED;
            this.logout = data.DashBoardPage.LOGOUT;
            this.vehicle = data.DashBoardPage.VEHICLE;
            this.driver = data.DashBoardPage.DRIVER;
            this.speed = data.DashBoardPage.SPEED;
            this.time = data.DashBoardPage.TIME;
            this.add = data.DashBoardPage.ADD;
            this.assign = data.DashBoardPage.ASSIGN;
            this.del = data.DashBoardPage.DEL;
            this.edit = data.DashBoardPage.EDIT;
            this.showpath = data.DashBoardPage.SHOWPATH;
            this.hidepath = data.DashBoardPage.HIDEPATH;
            this.modify = data.DashBoardPage.MODIFY;
            this.continous = data.DashBoardPage.CONTINOUS;
            this.confirm = data.DashBoardPage.CONFIRM;
            this.list = data.DashBoardPage.LIST;
            this.editc = data.DashBoardPage.EDITC;
            this.deletec = data.DashBoardPage.DELETE;
            this.unassign = data.DashBoardPage.UNASSIGN;
            this.minute = data.DashBoardPage.MINUTE;
            this.hours = data.DashBoardPage.HOURS;
            this.name = data.DashBoardPage.NAME;
        });
    }
}