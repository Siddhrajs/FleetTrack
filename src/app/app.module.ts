import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction' 
import { CookieService } from 'angular2-cookie';

import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { DataFinder } from './providers/datafinder';
import { UserService } from './providers/user.service';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    AppRoutingModule,
    AgmCoreModule.forRoot({
    	apiKey:  'AIzaSyCL7T7Dz5cEVbK1aEtGP7Q2WlYgD4NGSI0'
    }),
    AgmDirectionModule
  ],
  providers: [
    CookieService,
    DataFinder,
    UserService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
