/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { TestBed, async, inject } from '@angular/core/testing';

import { LeaveGuard } from './leaved.guard';

describe('LeaveGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaveGuard]
    });
  });

  it('should ...', inject([LeaveGuard], (guard: LeaveGuard) => {
    expect(guard).toBeTruthy();
  }));
});