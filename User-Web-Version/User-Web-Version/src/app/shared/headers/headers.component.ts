/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
declare var google;
@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit {
  @ViewChild('sideMenu') public sideMenu: ModalDirective;
  @ViewChild('locationPicker') public locationPicker: ModalDirective;
  @ViewChild('locationPickerBottom') public locationPickerBottom: ModalDirective;
  @ViewChild('zipCodePicker') public zipCodePicker: ModalDirective;
  @ViewChild('zipCodePickerBottom') public zipCodePickerBottom: ModalDirective;
  active_val = 'Home';
  qty = 1;

  terms: any = '';
  products: any[] = [];

  cityId: any;
  languageClicked: boolean = false;
  zipCode: any = '';
  constructor(
    private router: Router,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService) {
    this.router.events.subscribe(() => {
      this.products = [];
      this.terms = '';
    });
    this.util.subscribeLocationPicker().subscribe(() => {
      if (this.util.deviceType == 'desktop') {
        this.locationPicker.show();
      } else {
        this.locationPickerBottom.show();
      }
    })
  }

  ngOnInit(): void {
  }

  onLocaionPermission() {
    console.log('open location permission');
    try {
      this.util.start();
      navigator.geolocation.getCurrentPosition(position => {
        this.util.stop();
        console.log('got the posistion', position);
        this.locationPicker.hide();
        this.locationPickerBottom.hide();
        localStorage.setItem('userLat', position.coords.latitude.toString());
        localStorage.setItem('userLng', position.coords.longitude.toString());
        this.getAddress(position.coords.latitude, position.coords.longitude);
      }, error => {
        this.util.stop();
        console.log('callback error', error);
        this.locationError(error.message);
      }, { timeout: 10000, enableHighAccuracy: true, });
    } catch (error) {
      this.util.stop();
      console.log('cathc', error);
      this.locationError();
    }
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

  locationError(msg?) {
    this.util.errorMessage(msg ? msg : 'Location Error');
  }

  saveZipCode() {
    console.log('this.', this.zipCode);
    if (this.zipCode == '' || this.zipCode == null) {
      this.util.errorMessage('Please enter your zipcode');
      return false;
    }
    this.zipCodePicker.hide();
    this.zipCodePickerBottom.hide();
    this.util.deliveryZipCode = this.zipCode;
    localStorage.setItem('zipcodes', this.util.deliveryZipCode);
    this.util.publishCity(this.util.deliveryZipCode);
    this.zipCode = '';
  }

  accountAction(action: any) {
    if (action == 'settings') {
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, 'profile']);
    } else if (action == 'orders') {
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, 'order']);
    } else if (action == 'address') {
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, 'address']);
    } else if (action == 'help') {
      this.router.navigate(['help']);
    } else if (action == 'chats') {
      this.router.navigate(['chats']);
    } else if (action == 'faqs') {
      this.router.navigate(['faq']);
    } else {
      this.logout();
    }
  }


  haveSigned() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid != 'null') {
      return true;
    }
    return false;
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToAccount() {
    this.router.navigate(['/account']);
  }

  goToHome(val: any) {
    this.active_val = val;
    this.router.navigate(['/home']);
  }

  minus() {
    if (this.qty > 1) {
      this.qty = this.qty - 1;
    }
  }

  plus() {
    this.qty = this.qty + 1;
  }

  inputChange() {
    console.log(this.terms);
    if (this.terms && this.terms.trim() != '') {
      console.log('search data', this.terms);
      this.api.post_public('v1/products/searchQuery', { param: this.terms, stores: this.util.active_store.join() }).then((data: any) => {
        console.log(data);
        if (data && data.status && data.status === 200) {
          this.products = data.data;
          console.log('search result', this.products);
        }
      }, error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      }).catch((error) => {
        console.log(error);
        this.util.apiErrorHandler(error);
      });
    } else {
      this.products = [];
    }
  }

  onHome() {
    this.router.navigate(['']);
  }

  onLogin() {
    this.util.publishModalPopup('login');
  }

  selected(item: any) {
    this.cityId = item.id;
    console.log('id', this.cityId);
    localStorage.setItem('city', this.cityId);
    const city = this.util.servingCities.filter(x => x.id == this.cityId);
    this.util.city = city[0];
    this.util.selectedCityName = city[0].name;
    this.util.publishCity(city);
    this.cart.cart = [];
    this.cart.itemId = [];
    this.cart.totalPrice = 0;
    this.cart.grandTotal = 0;
    this.cart.coupon = null;
    this.cart.discount = null;
    this.util.clearKeys('cart');
    this.util.publishCity('data');
    this.router.navigate(['']);
  }

  onPage(item: any) {
    console.log(item);
    this.sideMenu.hide();
    this.router.navigate([item]);
  }

  onProfile(item: any) {
    this.sideMenu.hide();
    if (this.util && this.util.userInfo && this.util.userInfo.first_name) {
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, item]);
    } else {
      this.util.publishModalPopup('login');
    }
  }

  changeLanguage(value: any) {
    console.log(value);
    const item = this.util.allLanguages.filter(x => x.id == value.id);
    if (item && item.length > 0) {
      console.log(item);
      localStorage.setItem('translateKey', value.id);
      window.location.reload();
    }
  }

  logout() {
    console.log('logout');
    this.sideMenu.hide();
    this.util.start();
    this.api.post_private('v1/auth/logout', {}).then((data: any) => {
      this.util.stop();
      console.log(data)
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.cart.cart = [];
      this.cart.itemId = [];
      this.cart.totalPrice = 0;
      this.cart.grandTotal = 0;
      this.cart.coupon = null;
      this.cart.discount = null;
      this.router.navigate(['']);
    }, error => {
      this.util.stop();
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.stop();
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  search(event: any) {
    console.log(event);
    if (event && event != '') {

    }
  }

  openProduct(item: any) {
    this.products = [];
    this.terms = '';
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
    this.router.navigate([]).then(result => { window.open('product/' + name + '/' + item.id, '_blank'); });
  }


  subItems(item: any, sub: any) {
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const sub_name = sub.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate([]).then(result => { console.log('result', result); window.open('sub/' + item.id + '/' + name + '/' + sub.id + '/' + sub_name, '_blank'); });
  }
}
