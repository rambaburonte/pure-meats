/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster'
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgOtpInputModule } from 'ng-otp-input';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { UsersComponent } from './layouts/users/users.component';
import { ErrorsComponent } from './layouts/errors/errors.component';
import { HeadersComponent } from './shared/headers/headers.component';
import { FootersComponent } from './shared/footers/footers.component';
import { MenuComponent } from './shared/menu/menu.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { HeadlineComponent } from './shared/headline/headline.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { LeaveGuard } from './leaved/leaved.guard';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    ErrorsComponent,
    HeadersComponent,
    FootersComponent,
    MenuComponent,
    BlankComponent,
    HeadlineComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ToasterModule.forRoot(),
    NgxUiLoaderModule,
    NgxSkeletonLoaderModule,
    NgOtpInputModule,
    IvyCarouselModule,
    NgbModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [LeaveGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
