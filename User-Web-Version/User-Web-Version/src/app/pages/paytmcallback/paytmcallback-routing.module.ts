/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaytmcallbackComponent } from './paytmcallback.component';

const routes: Routes = [
  {
    path: '',
    component: PaytmcallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaytmcallbackRoutingModule { }
