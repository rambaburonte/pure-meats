/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstamojocallbackComponent } from './instamojocallback.component';

describe('InstamojocallbackComponent', () => {
  let component: InstamojocallbackComponent;
  let fixture: ComponentFixture<InstamojocallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstamojocallbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstamojocallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
