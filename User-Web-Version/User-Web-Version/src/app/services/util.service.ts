/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToasterService } from 'angular2-toaster';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  loader: any;
  isLoading = false;
  details: any;
  public servingCities: any[] = [];
  public appLogo: any = '';
  public user_login_with: any = 0;
  public user_verification: any = 0;
  public default_country_code: any = '';
  public appName: any;
  public app_status: any = 1;
  public app_color: any = 1;
  public findType: any = 0;
  public makeOrders: any = 0;
  public reset_pwd: any = 0;
  private address = new Subject<any>();
  private coupon = new Subject<any>();
  private review = new Subject<any>();
  orders: any;
  private changeLocation = new Subject<any>();
  private loggedIn = new Subject<any>();
  private profile = new Subject<any>();
  private newOrder = new Subject<any>();
  public appPage: any[] = [];
  public appClosed: boolean = false;
  public appClosedMessage: any = '';
  public havepopup: boolean = false;
  public popupMessage: any;
  public translations: any[] = [];
  public direction: any;
  public currecny: any;
  public cside: any;
  public userInfo: any;
  public selectedCity = new BehaviorSubject<any>([]);
  public cartBtn = new Subject<any>();
  public popupRX = new Subject<any>();
  public city: any;
  public stripe: any;
  public stripeCode: any;
  public smsGateway: any = '0';

  public paypal: any;
  public paypalCode: any;

  public razor: any;
  public razorCode: any;
  public deviceType: any = 'desktop';

  public dummyProducts: any[] = [];
  public favIds: any[] = [];
  public haveFav: boolean = false;

  public general: any;

  public twillo: any;
  public logo: any;
  public delivery: any;

  private modalPopup = new Subject<any>();

  public updatePriceOfCart = new Subject<any>();
  public locationPicker = new Subject<any>();
  public paymentLeavve = new Subject<any>();
  public countrys: any[] = [];

  public user_login: any = '0';
  public home_type: any = '0';

  public header_category: any;

  public active_store: any[] = [];

  public allLanguages: any[] = [];
  public headerCategories: any[] = [];
  public savedLanguages: any = '';
  public social: any = {
    fb: '#',
    insta: '#',
    twitter: '#',
    linkedIn: '#',
    googlePlay: '#',
    appleStore: '#'
  };

  public selectedCityName: any = '';
  public default_delivery_zip: any = '';
  public default_city_id: any = '';

  public deliveredAddress: any = '';

  public deliveryZipCode: any = '';
  public adminInfo: any;
  constructor(
    public router: Router,
    private toasterService: ToasterService,
    private ngxService: NgxUiLoaderService
  ) { }

  publishAddress(data: any) {
    this.address.next(data);
  }

  publishNewOrder() {
    this.newOrder.next();
  }

  publishModalPopup(data: any) {
    this.modalPopup.next(data);
  }

  subscribeModalPopup(): Subject<any> {
    return this.modalPopup;
  }

  publishLocatioPicker() {
    this.locationPicker.next();
  }

  subscribeLocationPicker(): Subject<any> {
    return this.locationPicker;
  }

  publishPriceOfCart() {
    this.updatePriceOfCart.next();
  }

  getPriceOfCart(): Subject<any> {
    return this.updatePriceOfCart;
  }

  updatePaymentIssue() {
    this.paymentLeavve.next();
  }

  changeIntevert(): Subject<any> {
    return this.paymentLeavve;
  }

  publishPopup() {
    this.popupRX.next();
  }

  getPopup(): Subject<any> {
    return this.popupRX;
  }

  publishCartBtn() {
    this.cartBtn.next();
  }

  subscribeCartBtn(): Subject<any> {
    return this.cartBtn;
  }

  toast(type: any, title: any, msg: any) {
    this.toasterService.pop(type, title, msg);
  }

  subscribeOrder(): Subject<any> {
    return this.newOrder;
  }

  translate(str: any) {
    if (this.translations[str]) {
      return this.translations[str];
    }
    return str;
  }

  publishReview(data: any) {
    this.review.next(data);
  }

  publishProfile(data: any) {
    this.profile.next(data);
  }

  observProfile(): Subject<any> {
    return this.profile;
  }

  getReviewObservable(): Subject<any> {
    return this.review;
  }

  publishLocation(data: any) {
    this.changeLocation.next(data);
  }
  subscribeLocation(): Subject<any> {
    return this.changeLocation;
  }

  setFav(id: any) {
    this.favIds.push(id);
  }

  removeFav(id: any) {
    this.favIds = this.favIds.filter(x => x != id);
  }

  publishLoggedIn(data: any) {
    this.loggedIn.next(data);
  }
  subscribeLoggedIn(): Subject<any> {
    return this.loggedIn;
  }

  publishCity(data: any) {
    this.selectedCity.next(data);
  }

  subscribeCity(): Subject<any> {
    return this.selectedCity;
  }

  getObservable(): Subject<any> {
    return this.address;
  }

  publishCoupon(data: any) {
    this.coupon.next(data);
  }
  getCouponObservable(): Subject<any> {
    return this.coupon;
  }

  setOrders(data: any) {
    this.orders = null;
    this.orders = data;
  }



  getKeys(key: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        resolve(localStorage.getItem(key));
      } catch (error) {
        reject(error);
      }
    });
  }

  clearKeys(key: any) {
    localStorage.removeItem(key);
  }

  setKeys(key: any, value: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        resolve(localStorage.setItem(key, value));
      } catch (error) {
        reject(error);
      }
    });
  }

  gerOrder() {
    return this.orders;
  }

  errorMessage(str: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: 'error',
      title: this.translate(str)
    });
  }

  suucessMessage(str: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: 'success',
      title: this.translate(str)
    });
  }

  makeid(length: any) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  start() {
    this.ngxService.start();
  }

  stop() {
    this.ngxService.stop();
  }

  apiErrorHandler(err) {
    // console.log('Error got in service =>', err)
    if (err && err.status === 401 && err.error.error) {
      this.errorMessage(err.error.error);
      this.publishModalPopup('login');
      return false;
    }
    if (err && err.status === 500 && err.error.error) {
      this.errorMessage(err.error.error);
      return false;
    }
    if (err.status === -1) {
      this.errorMessage('Failed To Connect With Server');
    } else if (err.status === 401) {
      this.errorMessage('Unauthorized Request!');
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      this.publishModalPopup('login');
    } else if (err.status === 500) {
      this.errorMessage('Somethimg Went Wrong');
    } else if (err.status === 422 && err.error.error) {
      this.errorMessage(err.error.error);
    } else {
      this.errorMessage('Something went wrong');
    }

  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
}
