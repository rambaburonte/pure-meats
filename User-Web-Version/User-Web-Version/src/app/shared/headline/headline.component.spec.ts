/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlineComponent } from './headline.component';

describe('HeadlineComponent', () => {
  let component: HeadlineComponent;
  let fixture: ComponentFixture<HeadlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeadlineComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
