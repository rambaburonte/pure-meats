/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilService } from '../services/util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private util: UtilService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const uid = localStorage.getItem('uid');
    console.log('uid', localStorage.getItem('uid'));
    if (uid && uid != null && uid != 'null') {
      return true;
    }
    localStorage.removeItem('uid');
    localStorage.removeItem('token');
    this.router.navigate(['']);
    this.util.publishModalPopup('login');
    return false;
  }
}
