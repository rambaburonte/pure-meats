/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlutterwavecallbackComponent } from './flutterwavecallback.component';

describe('FlutterwavecallbackComponent', () => {
  let component: FlutterwavecallbackComponent;
  let fixture: ComponentFixture<FlutterwavecallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlutterwavecallbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlutterwavecallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
