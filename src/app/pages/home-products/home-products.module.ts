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

import { HomeProductsRoutingModule } from './home-products-routing.module';
import { HomeProductsComponent } from './home-products.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    HomeProductsComponent
  ],
  imports: [
    CommonModule,
    HomeProductsRoutingModule,
    HomeProductsRoutingModule,
    MDBBootstrapModule.forRoot(),
    NgbModule,
    NgxSkeletonLoaderModule,
  ]
})
export class HomeProductsModule { }
