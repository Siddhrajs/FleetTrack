import { Component } from '@angular/core';
import { Ajax } from './Ajax';
import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { UserService } from './providers/user.service';
import { Language } from './Language';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ajax = new Ajax(this.router,this.user);
  lang = new Language(this.http,"en")
  constructor(private http:Http,private router:Router,private cookieService:CookieService,private user:UserService){
    this.user.check=true;
  }
}
