/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatsRoutingModule } from './chats-routing.module';
import { ChatsComponent } from './chats.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [
    ChatsComponent
  ],
  imports: [
    CommonModule,
    ChatsRoutingModule,
    SharedModule,
    MDBBootstrapModule.forRoot(),
  ]
})
export class ChatsModule { }
