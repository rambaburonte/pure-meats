/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
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

  // header dropdown data
  headerStores: any[] = [];
  headerCategories: any[] = [];
  headerLoading: boolean = false;
  showHeaderDropdown: boolean = false;
  showStoresDropdown: boolean = false;

  // selected category for the two-column dropdown
  selectedHeaderCategoryIndex: number = 0;
  selectedHeaderCategory: any = null;

  cityId: any;
  languageClicked: boolean = false;
  zipCode: any = '';
  constructor(
    private router: Router,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private elRef: ElementRef) {
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
    // subscribe to city changes so header updates automatically
    this.util.subscribeCity().subscribe((data: any) => {
      try {
        if (!data) { return; }
        // data can be: geocoder result object, city array, or a string (zipcode/name)
        if (Array.isArray(data) && data.length && data[0].name) {
          this.util.selectedCityName = data[0].name;
        } else if (typeof data === 'object' && data.address_components) {
          const city = this.extractCityFromGeocoder(data);
          if (city) { this.util.selectedCityName = city; }
        } else if (typeof data === 'string') {
          this.util.selectedCityName = data;
        }
      } catch (e) {
        console.log('subscribeCity error', e);
      }
    });
  }

  // close dropdowns when user clicks outside this component
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    try {
      const target = event.target as HTMLElement;
      if (!this.elRef.nativeElement.contains(target)) {
        this.showHeaderDropdown = false;
        this.showStoresDropdown = false;
      }
    } catch (e) {
      // ignore
    }
  }

  ngOnInit(): void {
    // on init, try to set selectedCityName from stored address if available
    try {
      const stored = localStorage.getItem('address');
      if (stored && stored !== 'null') {
        this.util.deliveredAddress = stored;
        const city = this.extractCityFromString(stored);
        if (city) { this.util.selectedCityName = city; }
      }
      // if deliveredAddress already present in util (runtime), use it
      if (!this.util.selectedCityName && this.util.deliveredAddress) {
        const city2 = this.extractCityFromString(this.util.deliveredAddress);
        if (city2) { this.util.selectedCityName = city2; }
      }
      // fallback to deliveryZipCode if nothing else
      if (!this.util.selectedCityName && this.util.deliveryZipCode) {
        this.util.selectedCityName = this.util.deliveryZipCode;
      }
    } catch (e) {
      console.log('init city load error', e);
    }
  }

  toggleHeaderDropdown() {
    this.showHeaderDropdown = !this.showHeaderDropdown;
    // if opening header dropdown, ensure stores dropdown is closed
    if (this.showHeaderDropdown) {
      this.showStoresDropdown = false;
    }
    if (this.showHeaderDropdown && (!this.headerCategories.length && !this.headerStores.length)) {
      this.loadHeaderData();
    }
  }

  toggleStoresDropdown() {
    this.showStoresDropdown = !this.showStoresDropdown;
    // if opening stores dropdown, ensure header categories dropdown is closed
    if (this.showStoresDropdown) {
      this.showHeaderDropdown = false;
    }
    if (this.showStoresDropdown && (!this.headerStores.length && !this.headerCategories.length)) {
      this.loadHeaderData();
    }
  }

  loadHeaderData() {
    this.headerLoading = true;
    let promise: Promise<any>;
    try {
      if (this.util.findType == 0) {
        const cityId = localStorage.getItem('city') || this.util.default_city_id;
        promise = this.api.post_public('v1/home/searchWithCity', { id: cityId });
      } else if (this.util.findType == 1) {
        const lat = localStorage.getItem('userLat');
        const lng = localStorage.getItem('userLng');
        if (!lat || !lng) {
          const cityId = localStorage.getItem('city') || this.util.default_city_id;
          promise = this.api.post_public('v1/home/searchWithCity', { id: cityId });
        } else {
          promise = this.api.post_public('v1/home/searchWithGeoLocation', { lat: lat, lng: lng });
        }
      } else {
        promise = this.api.post_public('v1/home/searchWithZipCode', { zipcode: localStorage.getItem('zipcodes') });
      }
    } catch (e) {
      console.log('loadHeaderData error', e);
      this.headerLoading = false;
      return;
    }

    promise.then((data: any) => {
      if (data && data.status && data.status == 200 && data.data) {
        this.headerStores = data.data.stores || [];
        this.headerCategories = data.data.category || [];
        this.util.headerCategories = this.headerCategories;
        // default select first category
        if (this.headerCategories && this.headerCategories.length) {
          this.selectedHeaderCategoryIndex = 0;
          this.selectedHeaderCategory = this.headerCategories[0];
        } else {
          this.selectedHeaderCategoryIndex = -1;
          this.selectedHeaderCategory = null;
        }
      }
    }, error => {
      console.log('header load error', error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log('header load catch', error);
      this.util.apiErrorHandler(error);
    }).finally(() => {
      this.headerLoading = false;
    });
  }

  goToCategory(cat: any) {
    try {
      const routeName = cat.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      this.showHeaderDropdown = false;
      this.router.navigate(['categories', cat.id, routeName]);
    } catch (e) { console.log(e); }
  }

  openStoreFromHeader(item: any) {
    try {
      const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      this.showHeaderDropdown = false;
      this.router.navigate(['shop', item.uid, name]);
    } catch (e) { console.log(e); }
  }

  // helper: extract city from geocoder result object
  extractCityFromGeocoder(result: any): string {
    try {
      const comps = result.address_components || [];
      const priority = ['locality', 'postal_town', 'administrative_area_level_2', 'administrative_area_level_1', 'sublocality_level_1', 'sublocality', 'neighborhood', 'route'];
      for (const type of priority) {
        const comp = comps.find((c: any) => c.types && c.types.indexOf(type) !== -1);
        if (comp && comp.long_name) { return comp.long_name; }
      }
      if (result.formatted_address) { return result.formatted_address.split(',')[0]; }
    } catch (e) { console.log('extractCityFromGeocoder error', e); }
    return '';
  }

  // helper: extract city from a free-form address string
  extractCityFromString(address: string): string {
    try {
      if (!address) { return ''; }
      // address like: 'Hyderabad, Telangana, India' -> take first part
      return address.split(',')[0].trim();
    } catch (e) {
      console.log('extractCityFromString error', e);
      return '';
    }
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
  console.log('geocode results:', results);
  console.log('geocode status:', status);
  console.log('input lat,lng:', lat, lng);
        if (results && results.length) {
          localStorage.setItem('location', 'true');
          localStorage.setItem('address', results[0].formatted_address);
          this.util.deliveredAddress = results[0].formatted_address;
          // Try to extract a city/locality name from Google Geocoder result
          try {
            let cityName = '';
            const comps = results[0].address_components || [];
            console.log('address_components:', comps);
            // Priority list for city-like components
            const priority = ['locality', 'postal_town', 'administrative_area_level_2', 'administrative_area_level_1', 'sublocality_level_1', 'sublocality', 'neighborhood', 'route'];
            for (const type of priority) {
              const comp = comps.find((c: any) => c.types && c.types.indexOf(type) !== -1);
              if (comp && comp.long_name) {
                cityName = comp.long_name;
                console.log('found city candidate by type', type, cityName);
                break;
              }
            }
            if (!cityName && results[0].formatted_address) {
              cityName = results[0].formatted_address.split(',')[0];
              console.log('fallback city from formatted_address', cityName);
            }
            console.log('final cityName candidate:', cityName);
            if (cityName) {
              this.util.selectedCityName = cityName;
            }
          } catch (e) {
            console.log('city parse error', e);
          }
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
  // set the selected city name to the zipcode for display (fallback)
  this.util.selectedCityName = this.util.deliveryZipCode;
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
    console.log('Fetching',item);
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
