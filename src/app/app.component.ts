/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { environment } from './../environments/environment';
import { Component, ViewChild, HostListener, ChangeDetectorRef, ElementRef } from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  NavigationExtras
} from '@angular/router';
import { ToasterConfig } from 'angular2-toaster';
import { ApiService } from './services/api.service';
import { UtilService } from './services/util.service';
import { CartService } from './services/cart.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { Title } from '@angular/platform-browser';
import { login } from './interfaces/login';
import { mobile } from './interfaces/mobile';
import { mobileLogin } from './interfaces/mobileLogin';
import { register } from './interfaces/register';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
declare var google;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('cartModel') public cartModel: ModalDirective;
  @ViewChild('verifyModal') public verifyModal: ModalDirective;
  @ViewChild('registerModal') public registerModal: ModalDirective;
  @ViewChild('loginModal') public loginModal: ModalDirective;
  @ViewChild('otpModal') public otpModal: ModalDirective;
  @ViewChild('forgotPwd') public forgotPwd: ModalDirective;
  @ViewChild('topScrollAnchor') topScroll: ElementRef;
  @ViewChild('scrollMe') private scrollMe: ElementRef;
  @ViewChild('firebaseOTP') public firebaseOTP: ModalDirective;
  @ViewChild('otpModalRegisterEmail') public otpModalRegisterEmail: ModalDirective;
  @ViewChild('redeemModal') public redeemModal: ModalDirective;
  @ViewChild('firebaseOTPRegistrations') public firebaseOTPRegistrations: ModalDirective;
  @ViewChild('otpModalRegsiter') public otpModalRegsiter: ModalDirective;

  title = 'groceryee';
  loaded: boolean;
  deviceType = 'desktop';
  innerHeight: string;
  windowWidth: number;

  verticalNavType = 'expanded';
  verticalEffect = 'shrink';
  isShow: boolean;
  topPosToStartShowing = 100;
  loading = true;
  login: login = { email: '', password: '' };
  mobile: mobile = { country_code: '', mobile: '', password: '' };
  mobileLogin: mobileLogin = { country_code: '', mobile: '' };
  registerForm: register = {
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    mobile: '',
    fcm_token: '',
    type: '',
    lat: '',
    lng: '',
    cover: '',
    others: '',
    date: '',
    stripe_key: '',
    country_code: '',
    check: false,
    status: 1,
    referral_code: ''
  };

  submitted = false;
  ccCode: any;
  userCode: any = '';
  resendCode: boolean;
  otpId: any;
  uid: any;

  languageClicked: boolean = false;

  isLogin: boolean = false;

  div_type;
  sent: boolean;
  reset_email: any;
  reset_otp: any;
  reset_myOPT: any;
  reset_verified: any;
  reset_userid: any;
  reset_password: any;
  reset_repass: any;
  reset_loggedIn: boolean;
  reset_id: any;

  reset_phone: any;
  reset_cc: any = '91';

  public config: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: true,
      timeout: 2000,
      positionClass: 'toast-bottom-right'
    });

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    console.log('scrollposition', scrollPosition)
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  isPopState = false;
  router$: Subscription;


  name: any;
  msg: any = '';
  messages: any[] = [];
  uid_chat: any;
  id_chat: any;
  loaded_chat: boolean;
  yourMessage: boolean;
  interval: any;
  recaptchaVerifier: firebase.default.auth.RecaptchaVerifier;
  firebaseOTPText: any = '';

  contactNumber: any = '';
  redeeemText: any = '';
  tempToken: any = '';
  // Find 0 = city 1 = location based 2 = zipcode
  constructor(
    private router: Router,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private chmod: ChangeDetectorRef,
    private titleService: Title,
  ) {
    this.div_type = 1;
    const scrollHeight = window.screen.height - 150;
    this.innerHeight = scrollHeight + 'px';
    this.windowWidth = window.innerWidth;
    this.setMenuAttributs(this.windowWidth);
    this.util.subscribeCartBtn().subscribe((data) => {
      this.cartModel.show();
    });
    this.util.subscribeModalPopup().subscribe((data) => {
      console.log('data', data);
      if (data && data === 'login') {
        this.loginModal.show();
      } else if (data && data === 'register') {
        this.registerModal.show();
      }
    });
    this.loaded = false;
    const language = localStorage.getItem('translateKey');
    if (language && language != null && language != 'null') {
      this.getByLanguagesID(language);
    } else {
      this.getDefaultSettings();
    }

    if (localStorage.getItem('uid') != null && localStorage.getItem('uid') && localStorage.getItem('uid') != '' && localStorage.getItem('uid') != 'null') {
      this.getUserByID();
    }

    this.util.getPriceOfCart().subscribe(() => {
      console.log('get Price');
    });
    this.router.events.subscribe((e: RouterEvent) => {
      this.navigationInterceptor(e);
    });
  }

  getUserByID() {
    const body = {
      id: localStorage.getItem('uid')
    }
    this.api.post_private('v1/profile/byId', body).then((data: any) => {
      console.log(">>>>><<<<<", data);
      if (data && data.success && data.status === 200) {
        this.util.userInfo = data.data;

        if (data && data.fav) {
          this.util.haveFav = true;
          try {
            this.util.favIds = data.fav.ids.split(',').map(Number);
            console.log(this.util.favIds, 'fav ids');
          } catch (error) {
            console.log('eroor', error);
          }
        } else {
          this.util.haveFav = false;
        }

      } else {
        localStorage.removeItem('uid');
        localStorage.removeItem('token');
      }
    }, err => {
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.util.userInfo = null;
      console.log(err);
    }).catch((err) => {
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.util.userInfo = null;
      console.log(err);
    });
  }

  getByLanguagesID(languageId) {
    this.api.post_public('v1/settings/getByLanguageIdWeb', { id: languageId }).then((data: any) => {
      console.log('settings by id', data);
      if (data && data.status && data.status == 200) {
        this.saveSettings(data);
      } else {
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  getDefaultSettings() {
    this.api.get_public('v1/settings/getDefaultWeb').then((data: any) => {
      console.log('default settings', data);
      if (data && data.status && data.status == 200) {
        this.saveSettings(data);
      } else {
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  saveSettings(data) {
    const lang = data && data.data && data.data.language ? data.data.language : null;
    if (lang && lang != null) {
      this.util.translations = JSON.parse(lang.content);
      localStorage.setItem('translateKey', lang.id);
      this.util.savedLanguages = lang.name;
    }
    const settings = data && data.data && data.data.settings ? data.data.settings : null;
    if (settings) {
      this.util.appLogo = settings.logo;
      this.util.direction = settings.appDirection;
      this.util.app_status = settings.app_status === 1 ? true : false;
      this.util.app_color = settings.app_color;
      this.util.findType = settings.findType;
      this.util.currecny = settings.currencySymbol;
      this.util.cside = settings.currencySide;
      this.util.makeOrders = settings.makeOrders;
      this.util.smsGateway = settings.sms_name;
      this.util.user_login = settings.user_login;
      this.util.user_verification = settings.user_verify_with;
      this.util.reset_pwd = settings.reset_pwd;
      this.util.default_city_id = settings.default_city_id;
      this.util.default_delivery_zip = settings.default_delivery_zip;
      localStorage.setItem('theme', 'primary');
      console.log('------------------------------------------------------------------');
      console.log(this.util.findType);
      console.log('------------------------------------------------------------------');
      if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(settings.country_modal)) {
        this.util.countrys = JSON.parse(settings.country_modal);
      }
      if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(settings.social)) {
        this.util.social = JSON.parse(settings.social);
      }
      this.util.default_country_code = settings && settings.default_country_code ? settings.default_country_code : '91';
      this.mobile.country_code = this.util.default_country_code;
      this.mobileLogin.country_code = this.util.default_country_code;
      this.registerForm.country_code = this.util.default_country_code;
      document.documentElement.dir = this.util.direction;
    }

    if (this.util.findType == 1) {
      console.log('find type set to location');
      const userLat = localStorage.getItem('userLat');
      const userLng = localStorage.getItem('userLng');
      console.log(userLat, userLng);
      if (userLat == null || !userLat || userLat == 'null' || userLat == '' || userLng == null || !userLng || userLng == 'null' || userLng == '') {
        this.util.publishLocatioPicker();
      } else {
        this.getAddress(userLat, userLng);
      }
    }

    if (this.util.findType == 2) {
      const zipcodes = localStorage.getItem('zipcodes');
      if (!zipcodes || zipcodes == null || zipcodes == 'null' || zipcodes == '') {
        localStorage.setItem('zipcodes', this.util.default_delivery_zip);
        this.util.deliveryZipCode = this.util.default_delivery_zip;
        this.util.publishCity(this.util.deliveryZipCode);
      } else {
        this.util.deliveryZipCode = localStorage.getItem('zipcodes');
        this.util.publishCity(this.util.deliveryZipCode);
      }
    }

    const general = data && data.data && data.data.general ? data.data.general : null;
    if (general) {
      this.util.appName = general.name;
      this.util.general = general;
      this.cart.minOrderPrice = parseFloat(general.min);
      this.cart.shipping = general.shipping;
      this.cart.shippingPrice = parseFloat(general.shippingPrice);
      this.cart.orderTax = parseFloat(general.tax);
      this.cart.freeShipping = parseFloat(general.free);
      this.util.publishPriceOfCart();
    }

    const served = data && data.data && data.data.we_served ? data.data.we_served : null;
    if (served) {
      if (served && served.length) {
        this.util.servingCities = served;

        if (this.util.findType == 0) {
          const city = localStorage.getItem('city');
          if (!city || city == null || city == 'null' || city == '') {
            const cityName = this.util.servingCities.filter(x => x.id == this.util.default_city_id);
            console.log('city name', cityName);
            localStorage.setItem('city', this.util.default_city_id);
            if (cityName && cityName.length) {
              this.util.publishCity(cityName);
              this.util.selectedCityName = cityName[0].name;
            }
          } else {
            const cityName = this.util.servingCities.filter(x => x.id == localStorage.getItem('city'));
            console.log('city name', cityName);
            if (cityName && cityName.length) {
              this.util.publishCity(cityName);
              this.util.selectedCityName = cityName[0].name;
            }
          }

        }

      }

    }
    const allLanguages = data && data.data && data.data.allLanguages ? data.data.allLanguages : null;
    if (allLanguages) {
      this.util.allLanguages = allLanguages;
    }

    const topCates = data && data.data && data.data.categories ? data.data.categories : null;
    if (topCates) {
      this.util.headerCategories = topCates;
    }

    const admin = data && data.data && data.data.support ? data.data.support : null;
    if (admin) {
      this.util.adminInfo = admin;
    }

    this.getHeaderTitle();
    this.getCart();
    console.log(this.util);
    // this.util.navigateRoot('');
  }

  getHeaderTitle() {
    const data = this.getTitle(this.router.routerState, this.router.routerState.root);
    const name = this.util && this.util.appName && this.util.appName != '' ? ' | ' + this.util.appName : ' | initappz'
    this.titleService.setTitle(data && data[0] ? this.util.translate(data[0]) + name :
      this.util.translate('Home') + name);
  }

  getAddress(lat, lng) {
    if (typeof google === 'object' && typeof google.maps === 'object') {
      const geocoder = new google.maps.Geocoder();
      const location = new google.maps.LatLng(lat, lng);

      geocoder.geocode({ 'location': location }, (results, status) => {
        console.log(results);
        console.log('status', status);
        if (results && results.length) {
          localStorage.setItem('location', 'true');
          localStorage.setItem('address', results[0].formatted_address);
          this.util.deliveredAddress = results[0].formatted_address;
          this.util.publishCity(results[0]);
        } else {
          this.util.errorMessage('Something went wrong please try again later');
        }
      });
    } else {
      this.util.errorMessage(this.util.translate('Error while fetching google maps... please check your google maps key'));
      return false;
    }
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
      this.loaded = false;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
      this.loaded = true;
      // window.scrollTo(0, 0);
      window.scrollTo({ top: 0 });
      this.getHeaderTitle();
    }

    if (event instanceof NavigationCancel) {
      this.loading = false;
      this.loaded = true;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
      this.loaded = true;
    }
  }

  getTitle(state, parent) {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  ngOnInit() {
    this.router$ = this.router.events.subscribe(next => this.onRouteUpdated(next));
    setTimeout(() => {
      if (!firebase.default.app.length) {
        firebase.default.initializeApp(environment.firebase);
      } else {
        firebase.default.app();
      }

      this.recaptchaVerifier = new firebase.default.auth.RecaptchaVerifier('sign-in-button', {
        size: 'invisible',
        callback: (response) => {

        },
        'expired-callback': () => {
        }
      });
    }, 5000);

  }

  ngOnDestroy() {
    if (this.router$ != null) {
      this.router$.unsubscribe();
    }
  }

  private onRouteUpdated(event: any): void {
    if (event instanceof NavigationEnd) {
      this.smoothScrollTop();
    }
  }

  private smoothScrollTop(): void {
    this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  onNavigate(event): any {

  }

  getCart() {
    this.loaded = true;
    this.util.getKeys('cart').then((data) => {
      if (data && data != null && data != 'null') {
        const cart = JSON.parse(data);
        console.log('cart===>>', cart);
        this.cart.cart = cart;
        this.cart.itemId = [];
        this.cart.cart.forEach(element => {
          this.cart.itemId.push(element.id);
        });
        console.log('cartitemss ----><>>>>', this.cart.cart);
        console.log('subitem=====>>>', this.cart.itemId);
        this.cart.calcuate();
      }
    });
  }

  onResize(event) {
    this.innerHeight = event.target.innerHeight + 'px';
    /* menu responsive */
    this.windowWidth = event.target.innerWidth;
    let reSizeFlag = true;
    if (this.deviceType === 'tablet' && this.windowWidth >= 768 && this.windowWidth <= 1024) {
      reSizeFlag = false;
    } else if (this.deviceType === 'mobile' && this.windowWidth < 768) {
      reSizeFlag = false;
    }
    this.util.deviceType = this.deviceType;
    console.log(this.util.deviceType);
    if (reSizeFlag) {
      this.setMenuAttributs(this.windowWidth);
    }
  }

  setMenuAttributs(windowWidth) {
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'push';
    } else if (windowWidth < 768) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
    } else {
      this.deviceType = 'desktop';
      this.verticalNavType = 'expanded';
      this.verticalEffect = 'shrink';
    }
    this.util.deviceType = this.deviceType;

  }

  openLink(link) {
    this.router.navigate([link]);
  }

  add(product, index) {
    if (this.cart.cart[index].quantiy > 0) {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
      this.cart.addQuantity(this.cart.cart[index].quantiy, product.id);
    }
  }

  remove(product, index) {
    if (this.cart.cart[index].quantiy === 1) {
      this.cart.cart[index].quantiy = 0;
      this.cart.removeItem(product.id);
    } else {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy - 1;
      this.cart.addQuantity(this.cart.cart[index].quantiy, product.id);
    }
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  checkout() {
    this.cartModel.hide();
    this.router.navigate(['checkout']);
  }

  getMyFavList() {
    this.api.post_private('v1/favourite/getMyFavList', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.util.haveFav = true;
        try {
          this.util.favIds = data.data.ids.split(',').map(Number);
          console.log(this.util.favIds, 'fav ids');
        } catch (error) {
          console.log('eroor', error);
        }
      } else {
        this.util.haveFav = false;
      }
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }
  // login system
  loginWithEmailPassword(form: NgForm, modal) {
    console.log('form', form, this.login);
    this.submitted = true;
    if (form.valid && this.login.email && this.login.password) {
      console.log('valid');
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.login.email)) {
        this.util.errorMessage(this.util.translate('Please enter valid email'));
        return false;
      }
      console.log('login');
      this.isLogin = true;
      this.api.post_public('v1/auth/login', this.login).then((data: any) => {
        this.isLogin = false;
        console.log('data=>', data);
        if (data && data.status && data.status == 200 && data.user && data.user.id) {
          if (data && data.user && data.user.type == 'user') {
            if (data.user.status == 1) {
              modal.hide();
              localStorage.setItem('uid', data.user.id);
              localStorage.setItem('token', data.token);
              this.util.userInfo = data.user;
              this.login.email = '';
              this.login.password = '';
              this.submitted = false;
              this.getMyFavList();
            } else {
              // blocked
              this.util.errorMessage(this.util.translate('Your account is blocked, please contact administrator'));
            }
          } else {
            this.util.errorMessage(this.util.translate('Not valid user'));
          }
        } else if (data && data.status == 401 && data.error.error) {
          this.util.errorMessage(data.error.error);
        } else {
          this.util.errorMessage('Something went wrong');
        }
      }, error => {
        this.isLogin = false;
        console.log('Error', error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        this.isLogin = false;
        console.log('Err', error);
        this.util.apiErrorHandler(error);
      });

    } else {
      console.log('not valid');
    }
  }

  scrollToBottom() {
    console.log(this.scrollMe.nativeElement.scrollTop);
    this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
    console.log(this.scrollMe.nativeElement.scrollTop);
    // try {

    // } catch (err) { }
  }

  loginWithMobileAndPassword(form: NgForm, modal) {
    console.log('form', form, this.mobile);
    this.submitted = true;
    if (form.valid && this.mobile.country_code && this.mobile.mobile && this.mobile.password) {
      console.log('valid');
      this.isLogin = true;
      const param = {
        country_code: '+' + this.mobile.country_code,
        mobile: this.mobile.mobile,
        password: this.mobile.password
      }
      this.api.post_public('v1/auth/loginWithPhonePassword', param).then((data: any) => {
        this.isLogin = false;
        console.log('data=>', data);
        if (data && data.status && data.status == 200 && data.user && data.user.id) {
          if (data && data.user && data.user.type == 'user') {
            if (data.user.status == 1) {
              localStorage.setItem('uid', data.user.id);
              localStorage.setItem('token', data.token);
              this.util.userInfo = data.user;
              this.mobile.mobile = '';
              this.mobile.password = '';
              this.submitted = false;
              this.getMyFavList();
              modal.hide();
            } else {
              // blocked
              this.util.errorMessage(this.util.translate('Your account is blocked, please contact administrator'));
            }
          } else {
            this.util.errorMessage(this.util.translate('Not valid user'));
          }
        } else if (data && data.status == 401 && data.error.error) {
          this.util.errorMessage(data.error.error);
        } else {
          this.util.errorMessage('Something went wrong');
        }
      }, error => {
        this.isLogin = false;
        console.log('Error', error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        this.isLogin = false;
        console.log('Err', error);
        this.util.apiErrorHandler(error);
      });
    } else {
      console.log('not valid');
    }
  }

  otpLogin() {
    console.log('with mobile and otp', this.userCode);
    if (this.userCode === '' || !this.userCode) {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
    if (this.userCode) {
      this.isLogin = true;
      const param = {
        id: this.otpId,
        otp: this.userCode
      };
      this.api.post_public('v1/otp/verifyOTP', param).then((data: any) => {
        console.log(data);
        this.isLogin = false;
        if (data && data.status && data.status === 200 && data.data) {
          this.otpModal.hide();
          this.loginModal.hide();
          this.loginWithPhoneOTPVerified();
        }
      }, error => {
        this.isLogin = false;
        console.log(error);
        if (error && error.status === 401 && error.error.error) {
          this.util.errorMessage(error.error.error);
          return false;
        }
        if (error && error.status === 500 && error.error.error) {
          this.util.errorMessage(error.error.error);
          return false;
        }
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Wrong OTP'));
      }).catch((error) => {
        this.isLogin = false;
        console.log(error);
        if (error && error.status === 401 && error.error.error) {
          this.util.errorMessage(error.error.error);
          return false;
        }
        if (error && error.status === 500 && error.error.error) {
          this.util.errorMessage(error.error.error);
          return false;
        }
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Wrong OTP'));
      });


    } else {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
  }

  onRegisterVerify() {
    console.log('with mobile and otp', this.userCode);
    if (this.userCode === '' || !this.userCode) {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
    if (this.userCode) {
      this.isLogin = true;
      const param = {
        id: this.otpId,
        otp: this.userCode
      };
      this.api.post_public('v1/otp/verifyOTP', param).then((data: any) => {
        console.log(data);
        this.isLogin = false;
        if (data && data.status && data.status === 200 && data.data) {
          this.otpModalRegsiter.hide();
          this.registerModal.hide();
          this.createAccount();
        }
      }, error => {
        this.isLogin = false;
        console.log(error);
        if (error && error.status === 401 && error.error.error) {
          this.util.errorMessage(error.error.error);
          return false;
        }
        if (error && error.status === 500 && error.error.error) {
          this.util.errorMessage(error.error.error);
          return false;
        }
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Wrong OTP'));
      }).catch((error) => {
        this.isLogin = false;
        console.log(error);
        if (error && error.status === 401 && error.error.error) {
          this.util.errorMessage(error.error.error);
          return false;
        }
        if (error && error.status === 500 && error.error.error) {
          this.util.errorMessage(error.error.error);
          return false;
        }
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Wrong OTP'));
      });


    } else {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
  }

  onVerifyOTPFirebase() {
    if (this.firebaseOTPText == '' || !this.firebaseOTPText || this.firebaseOTPText == null) {
      this.util.errorMessage('OTP Missing');
      return false;
    }
    this.util.start();
    this.api.enterVerificationCode(this.firebaseOTPText).then(
      userData => {
        this.util.stop();
        this.loginModal.hide();
        this.firebaseOTP.hide();
        this.loginWithPhoneOTPVerified();
        console.log(userData);
      }
    ).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }

  onVerifyOTPFirebaseRegister() {
    if (this.firebaseOTPText == '' || !this.firebaseOTPText || this.firebaseOTPText == null) {
      this.util.errorMessage('OTP Missing');
      return false;
    }
    this.util.start();
    this.api.enterVerificationCode(this.firebaseOTPText).then(
      userData => {
        this.util.stop();
        this.registerModal.hide();
        this.firebaseOTPRegistrations.hide();
        this.createAccount();
        console.log(userData);
      }
    ).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }

  loginWithPhoneOTPVerified() {
    console.log('login now .. it is verifieds');
    this.util.start();
    const param = {
      country_code: '+' + this.mobileLogin.country_code,
      mobile: this.mobileLogin.mobile
    }
    this.api.post_public('v1/auth/loginWithMobileOtp', param).then((data: any) => {
      this.util.stop();
      console.log(data);
      if (data && data.status == 200) {
        if (data && data.user && data.user.type == 'user') {
          if (data.user.status == 1) {
            localStorage.setItem('uid', data.user.id);
            localStorage.setItem('token', data.token);
            this.util.userInfo = data.user;
            this.getMyFavList();
            this.router.navigate(['']);
          } else {
            // blocked
            this.util.errorMessage(this.util.translate('Your account is blocked, please contact administrator'));
          }
        } else {
          this.util.errorMessage(this.util.translate('Not valid user'));
        }
      } else if (data && data.status == 401 && data.error.error) {
        this.util.errorMessage(data.error.error);
      } else {
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch((error) => {
      this.util.stop();
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  onOtpChangeFirebase(event) {
    console.log(event);
    this.firebaseOTPText = event;
  }

  sendSmsToPhone(id, to) {
    this.otpId = id;
    this.contactNumber = to;
    this.otpModal.show();
  }

  loginWithMobileAndOTP(form: NgForm, modal) {
    console.log('form', form, this.mobileLogin);
    this.submitted = true;
    if (form.valid && this.mobileLogin.country_code && this.mobileLogin.mobile) {
      console.log('valid');
      if (this.util.smsGateway == '2') { // Firebase OTP ON WEB PWA
        console.log('pwa window');
        this.isLogin = true;
        const params = {
          country_code: '+' + this.mobileLogin.country_code,
          mobile: this.mobileLogin.mobile
        }
        this.api.post_public('v1/auth/verifyPhoneForFirebase', params).then((data: any) => {
          console.log(data);
          if (data && data.status && data.status == 200 && data.data) {
            console.log('open firebase web version');
            this.api.signInWithPhoneNumber(this.recaptchaVerifier, '+' + this.mobileLogin.country_code + this.mobileLogin.mobile).then(
              success => {
                this.isLogin = false;
                this.firebaseOTP.show();
              }
            ).catch(error => {
              this.isLogin = false;
              console.log(error);
              this.util.errorMessage(error);
            });
          } else {
            this.isLogin = false;
          }
        }, error => {
          this.isLogin = false;
          this.util.apiErrorHandler(error);
        }).catch((error) => {
          this.isLogin = false;
          console.log(error);
          this.util.apiErrorHandler(error);
        });

      } else {
        console.log('twilio others');
        this.isLogin = true;
        const params = {
          country_code: '+' + this.mobileLogin.country_code,
          mobile: this.mobileLogin.mobile
        }
        this.api.post_public('v1/otp/verifyPhone', params).then((data: any) => {
          console.log(data);
          this.isLogin = false;
          if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
            this.sendSmsToPhone(data.otp_id, this.mobileLogin.country_code + this.mobileLogin.mobile);
          } else if (data && data.status && data.status == 500 && data.data == false) {
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        }, error => {
          this.isLogin = false;
          this.util.apiErrorHandler(error);
        }).catch((error) => {
          this.isLogin = false;
          console.log(error);
          this.util.apiErrorHandler(error);
        });
      }

    } else {
      console.log('not valid');
    }
  }

  onOtpChange(event) {
    console.log(event);
    this.userCode = event;
  }

  onOtpChangeReset1(event) {
    this.reset_otp = event;
  }

  redeemCode() {
    this.api.post_private('v1/referral/redeemReferral', { id: localStorage.getItem('uid'), code: this.registerForm.referral_code }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        // 1 = inviter
        // 2 = redeemer
        // 3 = both
        let text = '';
        if (data && data.data && data.data.who_received == 1) {
          text = 'Congratulations your friend have received the $' + data.data.amount + ' on wallet';
        } else if (data && data.data && data.data.who_received == 2) {
          text = 'Congratulations you have received the $' + data.data.amount + ' on wallet';
        } else if (data && data.data && data.data.who_received == 3) {
          text = 'Congratulations you & your friend have received the $' + data.data.amount + ' on wallet';
        }

        this.redeeemText = text;
        this.redeemModal.show();
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  createAccount() {
    this.isLogin = true;
    const param = {
      email: this.registerForm.email,
      first_name: this.registerForm.first_name,
      last_name: this.registerForm.last_name,
      password: this.registerForm.password,
      mobile: this.registerForm.mobile,
      fcm_token: 'NA',
      type: 'user',
      lat: '',
      lng: '',
      cover: 'NA',
      others: '',
      date: '',
      stripe_key: 'NA',
      country_code: '+' + this.registerForm.country_code,
      check: false,
      status: 1,
      referral_code: this.registerForm.referral_code
    }
    // no account found create it
    this.api.post_public('v1/auth/create_account', param).then((data: any) => {
      this.isLogin = false;
      console.log(data);

      if (data && data.status === 200) {

        this.util.userInfo = data.user;
        localStorage.setItem('uid', data.user.id);
        localStorage.setItem('token', data.token);
        if (this.registerForm.referral_code != '' && this.registerForm.referral_code) {
          this.redeemCode();
        }
        this.router.navigate(['']);
      } else if (data && data.error && data.error.msg) {
        this.util.errorMessage(data.error.msg);
      } else if (data && data.error && data.error.message === 'Validation Error.') {
        for (let key in data.error[0]) {
          console.log(data.error[0][key][0]);
          this.util.errorMessage(data.error[0][key][0]);
        }
      } else {
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.isLogin = false;
      if (error && error.error && error.error.status === 500 && error.error.message) {
        this.util.errorMessage(error.error.message);
      } else if (error && error.error && error.error.error && error.error.status === 422) {
        for (let key in error.error.error) {
          console.log(error.error.error[key][0]);
          this.util.errorMessage(error.error.error[key][0]);
        }
      } else {
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    }).catch(error => {
      console.log(error);
      this.isLogin = false;
      if (error && error.error && error.error.status === 500 && error.error.message) {
        this.util.errorMessage(error.error.message);
      } else if (error && error.error && error.error.error && error.error.status === 422) {
        for (let key in error.error.error) {
          console.log(error.error.error[key][0]);
          this.util.errorMessage(error.error.error[key][0]);
        }
      } else {
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    });
  }

  sendEmailForSignUp(id, to) {
    this.otpId = id;
    this.otpModalRegisterEmail.show();
  }

  onRegisterEmailVerify() {
    console.log('with mobile and otp', this.userCode);
    if (this.userCode === '' || !this.userCode) {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
    if (this.userCode) {
      this.isLogin = true;
      const param = {
        id: this.otpId,
        otp: this.userCode
      };
      this.api.post_public('v1/otp/verifyOTP', param).then((data: any) => {
        console.log(data);
        this.isLogin = false;
        if (data && data.status && data.status === 200 && data.data) {
          this.registerModal.hide();
          this.otpModalRegisterEmail.hide();
          this.createAccount();
        }
      }, error => {
        this.isLogin = false;
        console.log(error);
        if (error && error.status === 401 && error.error.error) {
          this.util.errorMessage(error.error.error);
          return false;
        }
        if (error && error.status === 500 && error.error.error) {
          this.util.errorMessage(error.error.error);
          return false;
        }
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Wrong OTP'));
      }).catch((error) => {
        this.isLogin = false;
        console.log(error);
        if (error && error.status === 401 && error.error.error) {
          this.util.errorMessage(error.error.error);
          return false;
        }
        if (error && error.status === 500 && error.error.error) {
          this.util.errorMessage(error.error.error);
          return false;
        }
        this.isLogin = false;
        this.util.errorMessage(this.util.translate('Wrong OTP'));
      });


    } else {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
  }

  sendSmsToPhoneRegister(id, to) {
    this.otpId = id;
    this.contactNumber = to;
    this.otpModalRegsiter.show();
  }

  onRegister(form: NgForm, registerModal, verification) {
    console.log(form);

    console.log('form', this.registerForm, this.ccCode);
    console.log(this.util.twillo);
    this.submitted = true;
    console.log(this.registerForm.check);
    if (form.valid && this.registerForm.check && this.registerForm.email && this.registerForm.password && this.registerForm.first_name
      && this.registerForm.last_name && this.registerForm.mobile && this.registerForm.country_code) {
      console.log('valid data');
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.registerForm.email)) {
        this.util.errorMessage(this.util.translate('Please enter valid email'));
        return false;
      }

      if (this.util.user_verification == 1) {
        console.log('verify with phone');
        if (this.util.smsGateway === '2') {
          this.isLogin = true;
          this.api.post_public('v1/auth/verifyPhoneForFirebaseRegistrations', { email: this.registerForm.email, country_code: '+' + this.registerForm.country_code, mobile: this.registerForm.mobile }).then((data: any) => {
            console.log(data);
            this.isLogin = false;
            if (data && data.status && data.status === 200 && data.data === true) {
              // send otp from api
              console.log('open firebase modal');
              this.isLogin = true;
              this.api.signInWithPhoneNumber(this.recaptchaVerifier, '+' + this.registerForm.country_code + this.registerForm.mobile).then(
                success => {
                  this.isLogin = false;
                  this.firebaseOTPRegistrations.show();
                }
              ).catch(error => {
                this.isLogin = false;
                console.log(error);
                this.util.errorMessage(error);
              });
            } else if (data && data.status && data.status === 500 && data.data === false) {
              this.util.errorMessage(data.message);
            }
          }, error => {
            console.log(error);
            this.isLogin = false;
            if (error && error.error && error.error.status === 500 && error.error.message) {
              this.util.errorMessage(error.error.message);
            } else if (error && error.error && error.error.error && error.error.status === 422) {
              for (let key in error.error.error) {
                console.log(error.error.error[key][0]);
                this.util.errorMessage(error.error.error[key][0]);
              }
            } else {
              this.util.errorMessage(this.util.translate('Something went wrong'));
            }
          }).catch(error => {
            console.log(error);
            this.isLogin = false;
            if (error && error.error && error.error.status === 500 && error.error.message) {
              this.util.errorMessage(error.error.message);
            } else if (error && error.error && error.error.error && error.error.status === 422) {
              for (let key in error.error.error) {
                console.log(error.error.error[key][0]);
                this.util.errorMessage(error.error.error[key][0]);
              }
            } else {
              this.util.errorMessage(this.util.translate('Something went wrong'));
            }
          });
        } else {
          this.isLogin = true;
          this.api.post_public('v1/verifyPhoneSignup', { email: this.registerForm.email, country_code: '+' + this.registerForm.country_code, mobile: this.registerForm.mobile }).then((data: any) => {
            console.log(data);
            this.isLogin = false;
            if (data && data.status && data.status === 200 && data.data === true && data.otp_id) {
              // send otp from api
              this.sendSmsToPhoneRegister(data.otp_id, '+' + this.registerForm.country_code + this.registerForm.mobile);

            } else if (data && data.status && data.status === 500 && data.data === false) {
              this.util.errorMessage(data.message);
            }
          }, error => {
            console.log(error);
            this.isLogin = false;
            if (error && error.error && error.error.status === 500 && error.error.message) {
              this.util.errorMessage(error.error.message);
            } else if (error && error.error && error.error.error && error.error.status === 422) {
              for (let key in error.error.error) {
                console.log(error.error.error[key][0]);
                this.util.errorMessage(error.error.error[key][0]);
              }
            } else {
              this.util.errorMessage(this.util.translate('Something went wrong'));
            }
          }).catch(error => {
            console.log(error);
            this.isLogin = false;
            if (error && error.error && error.error.status === 500 && error.error.message) {
              this.util.errorMessage(error.error.message);
            } else if (error && error.error && error.error.error && error.error.status === 422) {
              for (let key in error.error.error) {
                console.log(error.error.error[key][0]);
                this.util.errorMessage(error.error.error[key][0]);
              }
            } else {
              this.util.errorMessage(this.util.translate('Something went wrong'));
            }
          });
        }
      } else {
        console.log('verify with email');

        this.isLogin = true;
        const param = {
          email: this.registerForm.email,
          subject: this.util.translate('Verification'),
          header_text: this.util.translate('Use this code for verification'),
          thank_you_text: this.util.translate("Don't share this otp to anybody else"),
          mediaURL: this.api.mediaURL,
          country_code: this.registerForm.country_code,
          mobile: this.registerForm.mobile
        }
        this.api.post_public('v1/sendVerificationOnMail', param).then((data: any) => {
          console.log(data);
          this.isLogin = false;
          if (data && data.status && data.status === 200 && data.data === true && data.otp_id) {
            // send otp from api
            this.sendEmailForSignUp(data.otp_id, this.registerForm.email);
          } else if (data && data.status && data.status === 500 && data.data === false) {
            this.util.errorMessage(data.message);
          }
        }, error => {
          console.log(error);
          this.isLogin = false;
          if (error && error.error && error.error.status === 500 && error.error.message) {
            this.util.errorMessage(error.error.message);
          } else if (error && error.error && error.error.error && error.error.status === 422) {
            for (let key in error.error.error) {
              console.log(error.error.error[key][0]);
              this.util.errorMessage(error.error.error[key][0]);
            }
          } else {
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        }).catch(error => {
          console.log(error);
          this.isLogin = false;
          if (error && error.error && error.error.status === 500 && error.error.message) {
            this.util.errorMessage(error.error.message);
          } else if (error && error.error && error.error.error && error.error.status === 422) {
            for (let key in error.error.error) {
              console.log(error.error.error[key][0]);
              this.util.errorMessage(error.error.error[key][0]);
            }
          } else {
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        });

      }

    } else {
      console.log('not valid data...');
    }
  }
  // reset password
  sendResetLink() {
    console.log(this.reset_email, ';sendOTPDriver');
    if (!this.reset_email) {
      this.util.errorMessage(this.util.translate('email is required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.reset_email)) {
      this.util.errorMessage(this.util.translate('Please enter valid email'));
      return false;
    }
    this.isLogin = true;
    this.api.post_public('v1/auth/verifyEmailForReset', { email: this.reset_email }).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status && data.status === 200 && data.data === true && data.otp_id) {
        // send otp from api
        // this.openVerificationModal(data.otp_id, this.login.email, this.login);
        this.otpId = data.otp_id;
        this.div_type = 2;
      } else if (data && data.status && data.status === 500 && data.data === false) {
        this.util.errorMessage(data.message);
      }
    }, error => {
      this.isLogin = false;
      this.util.apiErrorHandler(error);
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      this.util.apiErrorHandler(error);
    });

  }

  verifyOTPOfReset() {
    if (!this.reset_otp || this.reset_otp === '') {
      this.util.errorMessage(this.util.translate('otp is required'));
      return false;
    }
    this.isLogin = true;
    const param = {
      id: this.otpId,
      otp: this.reset_otp,
      type: 'email',
      email: this.reset_email,
      country_code: 'NA',
      mobile: 'NA'
    };
    this.api.post_public('v1/otp/verifyOTPReset', param).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status && data.status === 200 && data.data) {
        this.tempToken = data.temp;
        this.div_type = 3;
        console.log('temp token', this.tempToken);
      }
    }, error => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Wrong OTP'));
    });

  }

  sendEmailResetPasswordMail() {
    if (!this.reset_password || !this.reset_repass || this.reset_password === '' || this.reset_repass === '') {
      this.util.errorMessage(this.util.translate('All Field are required'));
      return false;
    }

    this.isLogin = true;
    const param = {
      id: this.otpId,
      email: this.reset_email,
      password: this.reset_password
    };
    this.api.post_temp('v1/password/updateUserPasswordWithEmail', param, this.tempToken).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status && data.status === 200 && data.data) {
        this.util.toast('success', 'Password Updated', 'Password Updated')
        this.forgotPwd.hide();
      }
    }, error => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Wrong OTP'));
    });

  }

  sendResetOTPFirebase() {
    this.isLogin = true;
    this.api.post_public('v1/auth/verifyPhoneForFirebase', { country_code: '+' + this.reset_cc, mobile: this.reset_phone }).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status && data.status == 200 && data.data) {
        console.log('open firebase web version');
        this.api.signInWithPhoneNumber(this.recaptchaVerifier, '+' + this.reset_cc + this.reset_phone).then(
          success => {
            this.isLogin = true;
            this.util.start();
            this.api.post_public('v1/otp/generateTempToken', { country_code: '+' + this.reset_cc, mobile: this.reset_phone }).then((data: any) => {
              this.isLogin = false;
              console.log(data);
              this.util.stop();
              if (data && data.status && data.status == 200) {
                this.div_type = 2
                this.tempToken = data.temp;
                console.log('temp token', this.tempToken);
              }
            }, error => {
              this.util.stop();
              this.isLogin = false;
              this.util.apiErrorHandler(error);
            }).catch((error) => {
              this.util.stop();
              console.log(error);
              this.isLogin = false;
              this.util.apiErrorHandler(error);
            });

          }
        ).catch(error => {
          this.isLogin = false;
          console.log(error);
          this.util.errorMessage(error);
        });

      }
    }, error => {
      this.isLogin = false;
      this.util.apiErrorHandler(error);
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  sendResetOTPMobile() {
    this.isLogin = true;
    this.api.post_public('v1/otp/verifyPhone', { country_code: '+' + this.reset_cc, mobile: this.reset_phone }).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
        this.otpId = data.otp_id;
        this.div_type = 2;
      } else if (data && data.status && data.status == 500 && data.data == false) {
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.isLogin = false;
      this.util.apiErrorHandler(error);
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }


  sendOTPOnMobile() {
    if (this.util.smsGateway == '2' && this.util.reset_pwd == 1) {
      this.sendResetOTPFirebase();
    } else if (this.util.reset_pwd == 1 && this.util.smsGateway != '2') {
      this.sendResetOTPMobile();
    }
  }

  verifyResetFirebaseCode() {
    this.isLogin = true;
    this.api.enterVerificationCode(this.reset_otp).then(
      userData => {
        this.isLogin = false;
        this.div_type = 3;
        console.log(userData);
      }
    ).catch(error => {
      console.log(error);
      this.isLogin = false;
      this.util.apiErrorHandler(error);
    });
  }

  verifyResetMobileCode() {
    const param = {
      id: this.otpId,
      otp: this.reset_otp,
      type: 'phone',
      email: 'NA',
      country_code: '+' + this.reset_cc,
      mobile: this.reset_phone
    };
    this.api.post_public('v1/otp/verifyOTPReset', param).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status && data.status === 200 && data.data) {
        this.tempToken = data.temp;
        this.div_type = 3;
      }
    }, error => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Wrong OTP'));
    });
  }

  verifyResetCode() {
    console.log(this.reset_otp);
    if (this.reset_otp === '' || !this.reset_otp) {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
    if (this.reset_otp) {
      if (this.util.smsGateway == '2' && this.util.reset_pwd == 1) {
        this.verifyResetFirebaseCode();
      } else if (this.util.reset_pwd == 1 && this.util.smsGateway != '2') {
        this.verifyResetMobileCode();
      }
    } else {
      this.util.errorMessage(this.util.translate('Not valid code'));
      return false;
    }
  }

  updatePasswordFromFirebase() {
    if (!this.reset_password || !this.reset_repass || this.reset_password === '' || this.reset_repass === '') {
      this.util.errorMessage(this.util.translate('All Field are required'));
      return false;
    }
    this.submitted = false;
    this.isLogin = true;
    const param = { country_code: '+' + this.reset_cc, mobile: this.reset_phone, password: this.reset_password }
    this.api.post_temp('v1/password/updatePasswordFromFirebase', param, this.tempToken).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status && data.status === 200 && data.data) {
        this.util.toast('success', 'Password Updated', 'Password Updated')
        this.forgotPwd.hide();
      }
    }, error => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Wrong OTP'));
    });
  }

  updatePasswordWithPhone() {
    this.isLogin = true;
    const param = {
      id: this.otpId,
      country_code: '+' + this.reset_cc,
      mobile: this.reset_phone,
      password: this.reset_password,
      key: '+' + this.reset_cc + this.reset_phone
    };
    this.api.post_temp('v1/password/updateUserPasswordWithPhone', param, this.tempToken).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status && data.status === 200 && data.data) {
        this.util.toast('success', 'Password Updated', 'Password Updated')
        this.forgotPwd.hide();
      }
    }, error => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status === 401 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      if (error && error.status === 500 && error.error.error) {
        this.util.errorMessage(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorMessage(this.util.translate('Wrong OTP'));
    });
  }

  resetPasswordWithPhone() {
    console.log('pwddd0<<<<<<', this.reset_password);
    if (!this.reset_password || !this.reset_repass || this.reset_password === '' || this.reset_repass === '') {
      this.util.errorMessage(this.util.translate('All Field are required'));
      return false;
    }

    if (this.util.smsGateway == '2' && this.util.reset_pwd == 1) {
      this.updatePasswordFromFirebase();
    } else if (this.util.reset_pwd == 1 && this.util.smsGateway != '2') {
      this.updatePasswordWithPhone();
    }

  }
  // reset password
  // login system
  getContent() {
    return 'By clicking on the I agree button click, download or if you use the Application, you agree to be bound by the';
  }
}
