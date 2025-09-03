
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

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule, WavesModule, CardsModule, IconsModule } from 'angular-bootstrap-md';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardsModule,
    ButtonsModule,
    WavesModule,
    IconsModule,
    NgxSkeletonLoaderModule
  ],
  declarations: [
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CardsModule,
    ButtonsModule,
    WavesModule,
    IconsModule,
    NgxSkeletonLoaderModule
  ],
  providers: [
  ]
})
export class SharedModule { }
