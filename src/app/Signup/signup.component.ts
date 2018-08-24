import { Component, TemplateRef, OnInit } from '@angular/core';
import { Ajax } from '../Ajax';
import { Http } from '@angular/http';
import { Language } from '../Language';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../providers/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit {

  lang = new Language(this.http,"en");
  ajax = new Ajax(this.router,this.user);

  public modalRef: BsModalRef;
  constructor(private http : Http,private modalService: BsModalService,private user:UserService,private router:Router) {
    this.user.check=false;
    console.log(this.user.getUserLoggedIn());
  }
  ngOnInit() {
  }

  number = '';
  companyname = '';
  pswd = '';
  rpswd = '';
  otpnum = '';
  warning = '';

  otp(event,template: TemplateRef<any>) {
    this.number = this.number.replace(/\D/g, '');
    const text = "OTP";
    console.log('OTP Generate');
    if(this.handleWarnings(template,false))
      return;
    this.ajax.post('/register',JSON.stringify({number: this.number,type: text}));
  }

  signup(event,template: TemplateRef<any>){

    console.log('SIGNING UP');

    this.number =  this.number.replace(/\D/g, '');
    this.otpnum = this.otpnum.replace(/\D/g, '');
    if(this.handleWarnings(template,true))
      return;
    const text = "SIGNUP";
    this.ajax.post('/register',JSON.stringify({companyname: this.companyname,pswd:this.pswd,rpswd:this.rpswd ,pnum: this.number ,otpnum: this.otpnum,type:text}))
  
  }

  handleWarnings(template: TemplateRef<any>, flag: boolean)
  {
    this.warning='';
    if(this.pswd!=this.rpswd&&flag)
      this.warning=this.lang.warnMismatch;
    if(this.pswd.length<5&&flag)
      this.warning+=this.lang.warnPassSize;
    if(this.companyname.length==0&&flag)
      this.warning+=this.lang.disComp+this.lang.warnEmpty;
    if(this.number.length!=10)
      this.warning+=this.lang.warnValid;
    if(this.otpnum.length==0&&flag)
      this.warning+=this.lang.disOtp+this.lang.warnEmpty;
    if(this.warning.length!=0)
    {
      this.openModal(template);
      return true;
    }
    return false;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
