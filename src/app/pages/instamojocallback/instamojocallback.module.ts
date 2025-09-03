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

import { InstamojocallbackRoutingModule } from './instamojocallback-routing.module';
import { InstamojocallbackComponent } from './instamojocallback.component';


@NgModule({
  declarations: [
    InstamojocallbackComponent
  ],
  imports: [
    CommonModule,
    InstamojocallbackRoutingModule
  ]
})
export class InstamojocallbackModule { }
