import { Component, OnInit } from '@angular/core';
import { Language } from '../Language';
import { Http } from '@angular/http';
import { Ajax } from '../Ajax';
import { Router } from '@angular/router';
import { UserService } from '../providers/user.service';
import { CookieService } from 'angular2-cookie/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  lang = new Language(this.http,"en");
  ajax=new Ajax(this.router,this.user);

  constructor(private http : Http,private cookieService:CookieService,private router:Router,private user:UserService){
    this.user.check=false;
  }

  ngOnInit() {
  }
  number : string;
  pswd :string;
  login(event){
    console.log('login');
    this.cookieService.put('pnum',this.number);
    console.log(this.ajax.post('/auth',JSON.stringify({pnum:this.number,pswd:this.pswd})));
  }
}
