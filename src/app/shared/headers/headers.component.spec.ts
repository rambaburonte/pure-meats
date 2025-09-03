/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadersComponent } from './headers.component';

describe('HeadersComponent', () => {
  let component: HeadersComponent;
  let fixture: ComponentFixture<HeadersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeadersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
