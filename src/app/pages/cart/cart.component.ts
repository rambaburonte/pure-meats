/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
import { ModalDirective } from 'angular-bootstrap-md';
declare var google;

declare let FlutterwaveCheckout: any;
declare let PaystackPop: any;
declare let Razorpay: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @ViewChild('offersModal') public offersModal: ModalDirective;
  @ViewChild('addressFromMap') public addressFromMap: ModalDirective;
  @ViewChild('redeemModal') public redeemModal: ModalDirective;
  @ViewChild('payPalModal') public payPalModal: ModalDirective;
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  @ViewChild('changedPlace') public changedPlace: ModalDirective;
  @ViewChild('frame') public frame: ModalDirective;
  @ViewChild('topScrollAnchor') topScroll: ElementRef;

  deliveryOption: any = 'home';
  datetime: any;
  tabID = 1;
  myaddress: any[] = [];
  selectedAddress: any;
  public payPalConfig?: IPayPalConfig;
  payId: any;
  offers: any[] = [];
  cards: any[] = [];
  token: any;
  storeAddress: any[] = [];
  isCOD: any = false;
  time: any;
  addCard: boolean;
  today: any;
  nextDay: any;

  offerName: any;
  address_id: any;
  lat: any;
  lng: any;
  address: any = '';
  house: any = '';
  landmark: any = '';
  title: any = 'home';
  pincode: any = '';
  map: any;
  marker: any;

  // autocomplete1: { 'query': string };
  query: any = '';
  autocompleteItems1: any = [];
  GoogleAutocomplete;
  geocoder: any;
  addressSelected: boolean;
  payMethods: any;
  editClicked: boolean;
  dummyAddress = Array(10);
  cnumber: any = '';
  cname: any = '';
  cvc: any = '';
  date: any = '';
  email: any = '';
  storeIds: any[] = [];

  balance: any = 0;
  walletCheck: boolean = false;

  dummyPayments: any[] = [];
  payments: any[] = [];
  pay_method: any = '';
  payName: any = '';
  payMethodName: any = '';
  currency_code: any = '';
  constructor(
    private router: Router,
    public api: ApiService,
    public cart: CartService,
    public util: UtilService,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
  ) {
    this.addCard = false;
    if (this.cart.cart.length > 0) {
      this.getStoreList();
      this.getWallet();
    }
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.query = '';
    this.autocompleteItems1 = [];
    this.addressSelected = false;
    this.getOffers();
    this.datetime = 'today';
    this.time = this.util.translate('Today - ') + moment().format('dddd, MMMM Do YYYY');

    this.today = moment().format('dddd, MMMM Do YYYY');
    this.nextDay = moment().add(1, 'days').format('dddd, MMMM Do YYYY');
  }
  ngOnInit(): void {
  }
  smoothScrollTop() {
    this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth', top: -200 });
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  selectPayMethod(item) {
    console.log('paymethod', item);
    this.pay_method = item.id;
  }

  handleChange(event) {
    console.log(event);
    this.deliveryOption = event;
  }

  getPayments() {
    console.log('get payments list');
    this.dummyPayments = Array(5);
    this.payments = [];
    this.api.get_private('v1/payments/getPayments').then((data: any) => {
      console.log('payments->', data);
      this.dummyPayments = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.payments = data.data;
        // load libraries
        const haveFlutterwave = this.payments.filter(x => x.id == 8); // flutterwave id
        if (haveFlutterwave.length) {
          this.util.loadScript('https://checkout.flutterwave.com/v3.js');
        }
        const havePaystack = this.payments.filter(x => x.id == 7);
        if (havePaystack.length) {
          this.util.loadScript('https://js.paystack.co/v1/inline.js'); // paystack id
        }

        const haveRazorPay = this.payments.filter(x => x.id == 5); // razorpay id
        if (haveRazorPay.length) {
          this.util.loadScript('https://checkout.razorpay.com/v1/checkout.js');
        }

      }
    }, error => {
      console.log(error);
      this.dummyPayments = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummyPayments = [];
      this.util.apiErrorHandler(error);
    });
  }


  getName() {
    return this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' +
      this.util.userInfo.last_name : 'Groceryee';
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'info@groceryee.com';
  }


  getOffers() {
    this.api.get_public('v1/offers/getMyOffers').then((data: any) => {
      console.log(data);
      if (data && data.status == 200 && data.data && data.data.length) {
        const info = data.data;
        this.offers = info;
        this.offers = info;
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });

  }

  getStripeCards() {
    console.log('get cards');
    const param = {
      id: this.util.userInfo.stripe_key
    }
    this.cards = [];
    this.api.post_private('v1/payments/getStripeCards', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status === 200 && data.success && data.success.data && data.success.data.length) {
        this.cards = data.success.data;
        this.token = this.cards[0].id;
      }
    }, error => {
      console.log(error);
      this.cards = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.cards = [];
      this.util.apiErrorHandler(error);
    });
  }

  getCards() {
    if (this.util.userInfo && this.util.userInfo.stripe_key && this.util.userInfo.stripe_key !== '') {
      this.addCard = false;
      this.getStripeCards();
    }

  }

  haveSigned() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid != 'null') {
      return true;
    }
    return false;
  }

  login() {
    this.util.publishModalPopup('login');
  }

  getAddress() {
    const param = {
      id: localStorage.getItem('uid')
    }
    this.myaddress = [];
    this.dummyAddress = Array(10);
    this.api.post_private('v1/address/getByUid', param).then((data: any) => {
      console.log(data);
      this.dummyAddress = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.myaddress = data.data;
      }
    }, error => {
      this.dummyAddress = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummyAddress = [];
      this.util.apiErrorHandler(error);
    });

  }

  getStoreList() {
    const info = [...new Set(this.cart.cart.map(item => item.store_id))];
    console.log('store iddss=>>', info);

    const param = {
      id: info.join()
    };
    this.api.post_private('v1/stores/getStoresData', param).then((data: any) => {
      console.log(data);
      if (data && data.status == 200 && data.data.length) {
        this.storeAddress = data.data;
        this.cart.stores = this.storeAddress;
        this.storeIds = [...new Set(this.storeAddress.map(item => item.uid))];
        console.log('store uid', this.storeIds);
      } else {
        this.util.errorMessage(this.util.translate('No Stores Found'));
      }
    }, error => {
      console.log('error', error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  add(product, index) {
    if (this.cart.cart[index].quantiy > 0) {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
      this.cart.addQuantity(this.cart.cart[index].quantiy, product.id);
    }
  }

  remove(product, index) {
    if (this.cart.cart[index].quantiy == 1) {
      this.cart.cart[index].quantiy = 0;
      this.cart.removeItem(product.id);
    } else {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy - 1;
      this.cart.addQuantity(this.cart.cart[index].quantiy, product.id);
    }
  }

  selectedOffers(item) {
    console.log(item);
    if (this.cart && this.cart.walletDiscount && this.cart.walletDiscount > 0) {
      this.util.errorMessage('Sorry you have already added a wallet discount to cart');
      return false;
    }
    const min = parseFloat(item.min);
    if (this.cart.totalPrice >= min) {
      this.cart.coupon = item;
      this.offerName = item.name;
      this.cart.calcuate();
      console.log(this.cart.discount);
      this.offersModal.hide();
    } else {
      console.log('not valid with minimum amout', min);
      this.util.errorMessage(this.util.translate('Sorry') + ' ' + this.util.translate('minimum cart value must be')
        + ' ' + min + ' ' + this.util.translate('or equal'));
    }
  }

  getTime(time) {
    return moment(time).format('LLLL');
  }

  getWallet() {
    this.api.post_private('v1/profile/getMyWalletBalance', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.balance = parseFloat(data.data.balance);

      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  removeOffers() {
    this.cart.coupon = null;
    this.offerName = '';
    this.cart.discount = 0;
    this.cart.calcuate();
  }

  walletChange(event) {
    console.log(event);
    if (event && event.checked == true) {
      if (this.cart && this.cart.coupon && this.cart.coupon.id) {
        this.util.errorMessage('Sorry you have already added a offers discount to cart');
        this.walletCheck = false;
        return false;
      }
      this.cart.walletDiscount = parseFloat(this.balance);
      this.cart.calcuate();
    } else {
      this.cart.walletDiscount = 0;
      this.cart.calcuate();
    }
  }

  applyOffers() {
    if (this.cart && this.cart.walletDiscount && this.cart.walletDiscount > 0) {
      this.util.errorMessage('Sorry you have already added a wallet discount to cart');
      return false;
    }
    this.cart.coupon = undefined;
    if (this.offerName) {
      const entered = this.offers.filter(x => x.name == this.offerName);
      if (entered && entered.length > 0) {
        const min = parseFloat(entered[0].min);
        if (this.cart.totalPrice >= min) {
          this.cart.coupon = entered[0];
          this.cart.calcuate();
          console.log(this.cart.discount);
          this.util.suucessMessage(this.util.translate('counpon applied'));
        } else {
          console.log('not valid with minimum amout', min);
          this.util.errorMessage(this.util.translate('Sorry') + ' ' + this.util.translate('minimum cart value must be')
            + ' ' + min + ' ' + this.util.translate('or equal'));
        }
      } else {
        this.util.errorMessage(this.util.translate('Offer not found'));
      }
    }
  }

  addNewAddress() {
    ///
    // this.newAddress.show();
    this.editClicked = false;
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position);
          this.addressSelected = false;
          this.addressFromMap.show();
          this.getAddressFromMaps(position.coords.latitude, position.coords.longitude);
        },
        error => {
          switch (error.code) {
            case 1:
              console.log('Permission Denied');
              this.util.errorMessage(this.util.translate('Location Permission Denied'));
              break;
            case 2:
              console.log('Position Unavailable');
              this.util.errorMessage(this.util.translate('Position Unavailable'));
              break;
            case 3:
              console.log('Timeout');
              this.util.errorMessage(this.util.translate('Failed to fetch location'));
              break;
          }
        }
      );
    };
  }

  getAddressFromMaps(lat, lng) {
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'location': location }, (results, status) => {
      console.log(results);
      console.log('status', status);
      if (results && results.length) {
        this.address = results[0].formatted_address;
        this.cd.detectChanges();
        this.loadMap(lat, lng);

      }
    });
  }

  loadMap(lat, lng) {
    const location = new google.maps.LatLng(lat, lng);
    const style = [
      {
        featureType: 'all',
        elementType: 'all',
        stylers: [
          { saturation: -100 }
        ]
      }
    ];

    const mapOptions = {
      zoom: 16,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
      overviewMapControl: false,
      center: location,
      mapTypeControl: false,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'Foodies by initappz']
      }
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    const mapType = new google.maps.StyledMapType(style, { name: 'Grayscale' });
    this.map.mapTypes.set('Foodies by initappz', mapType);
    this.map.setMapTypeId('Foodies by initappz');
    this.cd.detectChanges();
    this.addMarker(location);
  }

  addMarker(location) {
    const dot = {
      url: 'assets/map-marker.png',
      scaledSize: new google.maps.Size(50, 50), // scaled size
    };
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: dot
    });
  }

  changeAddress() {
    this.addressFromMap.hide();
    this.changedPlace.show();
  }

  deleteAddress(item) {
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('to delete this address'),
      icon: 'question',
      confirmButtonText: this.util.translate('Yes'),
      backdrop: false,
      background: 'white',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: this.util.translate('cancel')
    }).then(data => {
      console.log(data);
      if (data && data.value) {
        const param = {
          id: item.id
        };
        this.util.start();
        this.api.post_private('v1/address/deleteMyAddress', param).then(info => {
          console.log(info);
          this.util.stop();
          this.getAddress();
        }, error => {
          console.log(error);
          this.util.stop();
          this.util.apiErrorHandler(error);
        }).catch(error => {
          console.log(error);
          this.util.stop();
          this.util.apiErrorHandler(error);
        });
      }
    });
  }

  chooseFromMaps() {
    // console.log(this.mapElement);
    this.addressSelected = true;
    document.getElementById('map').style.height = '150px';
  }

  addAddress() {
    this.addressFromMap.hide();
    if (this.address == '' || this.landmark == '' || this.house == '' || this.pincode == '') {
      this.util.errorMessage(this.util.translate('All Fields are required'));
      return false;
    }
    if (typeof google == 'object' && typeof google.maps == 'object') {
      const geocoder = new google.maps.Geocoder;
      this.util.start();
      geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
        console.log(results, status);
        if (status == 'OK' && results && results.length) {
          this.lat = results[0].geometry.location.lat();
          this.lng = results[0].geometry.location.lng();
          console.log('----->', this.lat, this.lng);
          console.log('call api');
          const param = {
            uid: localStorage.getItem('uid'),
            address: this.address,
            lat: this.lat,
            lng: this.lng,
            title: this.title,
            house: this.house,
            landmark: this.landmark,
            pincode: this.pincode
          };
          this.api.post_private('v1/address/addNew', param).then((data: any) => {
            this.util.stop();
            if (data && data.status == 200) {
              this.getAddress();
              // this.util.showToast('Address added', 'success', 'bottom');
              const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });

              Toast.fire({
                icon: 'success',
                title: this.util.translate('Address added')
              });
            } else {
              this.util.errorMessage(this.util.translate('Something went wrong'));
            }
          }, error => {
            console.log(error);
            this.util.stop();
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }).catch(error => {
            console.log(error);
            this.util.stop();
            this.util.errorMessage(this.util.translate('Something went wrong'));
          });

        } else {
          this.util.stop();
          this.util.errorMessage(this.util.translate('Something went wrong'));
          return false;
        }
      });
    } else {
      this.util.errorMessage(this.util.translate('Error while fetching google maps... please check your google maps key'));
      return false;
    }
  }

  editAddress(item) {
    console.log(item);
    this.editClicked = true;
    this.address = item.address;
    this.lat = item.lat;
    this.lng = item.lng;
    this.pincode = item.pincode;
    this.landmark = item.landmark;
    this.house = item.house;
    this.title = item.title;
    this.address_id = item.id;
    this.addressFromMap.show();
    this.getAddressFromMaps(this.lat, this.lng);
    this.chooseFromMaps();
  }

  editMyAddress() {
    this.addressFromMap.hide();
    if (this.address == '' || this.landmark == '' || this.house == '' || !this.pincode || this.pincode == '') {
      this.util.errorMessage(this.util.translate('All Fields are required'));
      return false;
    }
    if (typeof google == 'object' && typeof google.maps == 'object') {
      const geocoder = new google.maps.Geocoder;
      this.util.start();
      geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
        console.log(results, status);
        if (status == 'OK' && results && results.length) {
          this.lat = results[0].geometry.location.lat();
          this.lng = results[0].geometry.location.lng();
          console.log('----->', this.lat, this.lng);
          const param = {
            id: this.address_id,
            uid: localStorage.getItem('uid'),
            address: this.address,
            lat: this.lat,
            lng: this.lng,
            title: this.title,
            house: this.house,
            landmark: this.landmark,
            pincode: this.pincode
          };
          this.util.start();
          this.api.post_private('v1/address/updateMyAddress', param).then((data: any) => {
            this.util.stop();
            if (data && data.status == 200) {
              this.getAddress();
              const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });

              Toast.fire({
                icon: 'success',
                title: this.util.translate('Address updated')
              });
            } else {
              this.util.errorMessage(this.util.translate('Something went wrong'));
            }
          }, error => {
            console.log(error);
            this.util.stop();
            this.util.errorMessage(this.util.translate('Something went wrong'));
          });
        } else {
          this.util.stop();
          this.util.errorMessage(this.util.translate('Something went wrong'));
          return false;
        }
      });
    } else {
      this.util.errorMessage(this.util.translate('Error while fetching google maps... please check your google maps key'));
      return false;
    }
  }

  onSearchChange(event) {
    console.log(event);
    if (this.query == '') {
      this.autocompleteItems1 = [];
      return;
    }
    const addsSelected = localStorage.getItem('addsSelected');
    if (addsSelected && addsSelected != null) {
      localStorage.removeItem('addsSelected');
      return;
    }

    this.GoogleAutocomplete.getPlacePredictions({ input: this.query }, (predictions, status) => {
      console.log(predictions);
      if (predictions && predictions.length > 0) {
        this.autocompleteItems1 = predictions;
        console.log(this.autocompleteItems1);
      }
    });
  }

  selectSearchResult1(item) {
    console.log('select', item);
    localStorage.setItem('addsSelected', 'true');
    this.autocompleteItems1 = [];
    this.query = item.description;
    this.geocoder.geocode({ placeId: item.place_id }, (results, status) => {
      if (status == 'OK' && results[0]) {
        console.log(status);
        this.address = this.query;
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        this.changedPlace.hide();
        this.addressFromMap.show();
        this.cd.detectChanges();
        this.loadMap(this.lat, this.lng);
      }
    });
  }

  async selectAddress(item) {
    this.cart.deliveryAddress = item;
    this.selectedAddress = item.id;
    this.cart.calcuate();
  }

  onSelect(data) {
    if (data == 'today') {
      this.datetime = 'today';
      this.time = this.util.translate('Today - ') + moment().format('dddd, MMMM Do YYYY');
    } else {
      this.datetime = 'tomorrow';
      this.time = this.util.translate('Tomorrow - ') + moment().add(1, 'days').format('dddd, MMMM Do YYYY');
    }
  }

  next() {
    console.log('next', this.tabID, this.deliveryOption);
    console.log('deliveryadddress', this.selectedAddress);
    this.cart.deliveryAt = this.deliveryOption;
    this.cart.datetime = this.datetime;
    if (this.cart.totalPrice < this.cart.minOrderPrice) {
      let text;
      if (this.util.cside == 'left') {
        text = this.util.currecny + ' ' + this.cart.minOrderPrice;
      } else {
        text = this.cart.minOrderPrice + ' ' + this.util.currecny;
      }
      this.util.errorMessage(this.util.translate('Minimum order amount must be') + text + ' ' + this.util.translate('or more'));
      return false;
    }
    if (this.tabID == 1 && this.deliveryOption == 'home') {
      this.getAddress();
      this.tabID = 2;
    } else if (this.tabID == 1 && this.deliveryOption == 'store') {
      this.tabID = 3;
      this.getPayments();
    } else if (this.tabID == 2 && this.selectedAddress) {
      const selecte = this.myaddress.filter(x => x.id == this.selectedAddress);
      const item = selecte[0];
      console.log('item', item);
      this.cart.deliveryAddress = item;
      this.tabID = 3;
      this.getPayments();
    } else if (!this.selectedAddress) {
      this.util.errorMessage(this.util.translate('Please select address'));
    }
    this.smoothScrollTop();
    this.cart.calcuate();
  }

  prev() {
    console.log('prev', this.tabID);
    if (this.tabID == 2) {
      this.tabID = 1;
    } else if (this.tabID == 3 && this.deliveryOption == 'home') {
      this.tabID = 2;
    } else {
      this.tabID = 1;
    }
    this.smoothScrollTop();
  }

  payMethod(method) {
    console.log(method);
    this.payMethods = method;
  }

  proceed() {
    console.log(this.pay_method);
    const payMethod = this.payments.filter(x => x.id == this.pay_method);
    console.log(payMethod);
    if (payMethod && payMethod.length) {
      this.payName = payMethod[0].name;
      this.currency_code = payMethod[0].currency_code;
    }

    if (this.pay_method === 1) {
      console.log('cod');
      this.payMethodName = 'cod';
      this.createOrder('cod');
    } else if (this.pay_method === 2) {
      console.log('stripe');
      this.payMethodName = 'stripe';
      this.getCards();
      this.frame.show();
    } else if (this.pay_method === 3) {
      console.log('paypal');
      this.payMethodName = 'paypal';
      this.payPalWebPay();
    } else if (this.pay_method === 4) {
      console.log('paytm');
      this.payMethodName = 'paytm';
      this.payTmWeb();
    } else if (this.pay_method === 5) {
      console.log('razorpay');
      this.payMethodName = 'razorpay';
      this.razoryPayWeb();
    } else if (this.pay_method === 6) {
      console.log('instamojo');
      this.payMethodName = 'instamojo';
      this.payWithInstaMOJOWeb();
    } else if (this.pay_method === 7) {
      this.payMethodName = 'paystack';
      console.log('paystack');
      this.paystackWeb();
    } else if (this.pay_method === 8) {
      console.log('flutterwave');
      this.payMethodName = 'flutterwave';
      this.flutterwaveWeb();
    } else if (this.pay_method === 9) {
      console.log('paykun');
    }

  }

  paystackWeb() {
    this.util.start();
    this.api.get_private('v1/getPaystackKey').then((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status && data.status === 200 && data.data) {
        const payMethod = this.payments.filter(x => x.id === this.pay_method);
        console.log(payMethod);
        const handler = PaystackPop.setup({
          key: data.data,
          currency: payMethod[0].currency_code,
          email: this.util.userInfo.email,
          amount: this.cart.grandTotal * 100,
          firstname: this.util.userInfo.first_name,
          lastname: this.util.userInfo.last_name,
          ref: '' + Math.floor((Math.random() * 1000000000) + 1),
          onClose: () => {
            console.log('closed');
          },
          callback: (response) => {
            console.log(response);
            // response.reference
            this.createOrder(response.reference);
          }
        });
        handler.openIframe();
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }

  flutterwaveWeb() {
    this.util.start();
    this.api.get_private('v1/getFlutterwaveKey').then((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status && data.status === 200 && data.data) {
        const payMethod = this.payments.filter(x => x.id === this.pay_method);
        console.log(payMethod);
        FlutterwaveCheckout({
          public_key: data.data,
          tx_ref: '' + Math.floor((Math.random() * 1000000000) + 1),
          amount: this.cart.grandTotal,
          currency: payMethod[0].currency_code,
          payment_options: 'card, mobilemoneyghana, ussd',

          meta: {
            consumer_id: 23,
            consumer_mac: '92a3-912ba-1192a',
          },
          customer: {
            email: this.getEmail(),
            phone_number: this.util.userInfo.mobile,
            name: this.getName(),
          },
          callback: (data) => {
            console.log(data);
            document.getElementsByName('checkout')[0].setAttribute('style',
              'position:fixed;top:0;left:0;z-index:-1;border:none;opacity:0;pointer-events:none;width:100%;height:100%;');
            document.body.style.overflow = '';
            this.createOrder(JSON.stringify(data));
          },
          onclose: (data) => {
            console.log('closed', data);
          },
          customizations: {
            title: this.util.appName,
            description: this.util.appName + ' Order',
            logo: this.api.mediaURL + this.util.appLogo,
          },
        });


      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });

  }

  payWithInstaMOJOWeb() {

    const storeId = [...new Set(this.cart.cart.map(item => item.store_id))];
    const orderStatus = [];
    storeId.forEach(element => {
      const info = {
        id: element,
        status: 'created'
      }
      orderStatus.push(info)
    });
    const notes = [
      {
        status: 1,
        value: 'Order Created',
        time: moment().format('lll'),
      }
    ];
    const param = {
      uid: localStorage.getItem('uid'),
      store_id: storeId.join(),
      date_time: this.cart.datetime === 'today' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      paid_method: this.payMethodName,
      order_to: this.cart.deliveryAt,
      orders: JSON.stringify(this.cart.cart),
      notes: JSON.stringify(notes),
      address: this.cart.deliveryAt === 'home' ? JSON.stringify(this.cart.deliveryAddress) : '',
      driver_id: '',
      total: this.cart.totalPrice,
      tax: this.cart.orderTax,
      grand_total: this.cart.grandTotal,
      delivery_charge: this.cart.deliveryPrice,
      coupon_code: this.cart.coupon ? JSON.stringify(this.cart.coupon) : '',
      discount: this.cart.discount,
      pay_key: 'NA',
      status: JSON.stringify(orderStatus),
      assignee: '',
      extra: JSON.stringify(this.cart.userOrderTaxByStores),
      payStatus: 0,
      wallet_used: this.cart.walletDiscount > 0 ? 1 : 0,
      wallet_price: this.cart.walletDiscount
    }
    console.log(param);
    this.util.start();
    this.api.post_private('v1/orders/create', param).then(async (data: any) => {
      console.log(data);
      this.util.stop();

      if (data && data.status && data.status === 200 && data.data && data.data.id) {
        const grandTotal = this.cart.grandTotal;
        this.cart.clearCart();
        this.cart.clearCart();
        this.cd.detectChanges();
        const orderId = data.data.id;
        this.sendNotification(orderId);
        const params = {
          id: data.data.id,
          mediaURL: this.api.mediaURL,
          subject: this.util.translate('New Order Created'),
          email: this.getEmail(),
          username: this.getName(),
          store_phone: this.util.general.mobile,
          store_email: this.util.general.email
        };
        this.api.post_private('v1/orders/sendMailForOrders', params).then((data: any) => {
          console.log(data);
        }, error => {
          console.log(error);
        }).catch((error) => {
          console.log(error);
        });
        const param = {
          allow_repeated_payments: 'False',
          amount: grandTotal,
          buyer_name: this.getName(),
          purpose: this.util.appName + ' Orders',
          redirect_url: this.api.baseUrl + 'v1/instaMOJOWebSuccess?id=' + orderId,
          phone: this.util.userInfo && this.util.userInfo.mobile ? this.util.userInfo.mobile : '',
          send_email: 'True',
          webhook: this.api.baseUrl,
          send_sms: 'True',
          email: this.getEmail()
        };

        this.util.start();
        this.api.post_private('v1/payments/instamojoPay', param).then((data: any) => {
          console.log('instamojo response', data);
          this.util.stop();
          if (data && data.status && data.status === 200 && data.success && data.success.success === true) {

            const navParma: NavigationExtras = {
              queryParams: {
                id: orderId,
                payLink: data.success.payment_request.longurl
              }
            }
            this.cart.clearCart();
            this.cart.clearCart();
            this.cd.detectChanges();
            this.router.navigate(['/await-payments'], navParma);
            // Instamojo.open();

          } else {
            const error = JSON.parse(data.error);
            console.log('error message', error);
            if (error && error.message) {
              this.util.errorMessage(error.message);
              return false;
            }
            this.util.errorMessage(this.util.translate('Something went wrong while payments. please contact administrator'));
          }
        }, error => {
          console.log(error);
          this.util.stop();
          this.util.apiErrorHandler(error);
        }).catch(error => {
          console.log(error);
          this.util.stop();
          this.util.apiErrorHandler(error);
        });


      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });

  }

  razoryPayWeb() {
    this.util.start();
    this.api.get_private('v1/getRazorPayKey').then((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status && data.status === 200 && data.data) {
        const payMethod = this.payments.filter(x => x.id === this.pay_method);
        console.log(payMethod);

        var options = {
          amount: this.cart.grandTotal ? this.cart.grandTotal * 100 : 5,
          email: this.getEmail(),
          logo: this.util && this.util.appLogo ? this.api.mediaURL + this.util.appLogo : 'null',
          name: this.getName(),
          app_color: this.util && this.util.app_color ? this.util.app_color : '#f47878',
          key: data.data, // Enter the Key ID generated from the Dashboard
          currency: payMethod[0].currency_code,
          description: this.util.appName + ' Order Of ' + this.cart.grandTotal + ' amount',

          handler: (response) => {
            console.log(response);
            this.verifyPurchaseRazorPay(response.razorpay_payment_id);
          }
        };
        console.log(options);
        var rzp1 = new Razorpay(options);
        rzp1.open();
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }

  verifyPurchaseRazorPay(paymentId) {
    this.util.start();
    this.api.get_private('v1/payments/VerifyRazorPurchase?id=' + paymentId).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status === 200 && data.success && data.success.status && data.success.status === 'captured') {
        this.util.stop();
        this.createOrder(JSON.stringify(data.success));
      } else {
        this.util.stop();
        this.util.errorMessage(this.util.translate('Something went wrong while payments. please contact administrator'));
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong while payments. please contact administrator'));
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong while payments. please contact administrator'));
    });
  }
  createOrder(payKey) {

    const storeId = [...new Set(this.cart.cart.map(item => item.store_id))];
    const orderStatus = [];
    storeId.forEach(element => {
      const info = {
        id: element,
        status: 'created'
      }
      orderStatus.push(info)
    });
    const notes = [
      {
        status: 1,
        value: 'Order Created',
        time: moment().format('lll'),
      }
    ];
    const param = {
      uid: localStorage.getItem('uid'),
      store_id: storeId.join(),
      date_time: this.cart.datetime == 'today' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      paid_method: this.payMethodName,
      order_to: this.cart.deliveryAt,
      orders: JSON.stringify(this.cart.cart),
      notes: JSON.stringify(notes),
      address: this.cart.deliveryAt == 'home' ? JSON.stringify(this.cart.deliveryAddress) : '',
      driver_id: '',
      total: this.cart.totalPrice,
      tax: this.cart.orderTax,
      grand_total: this.cart.grandTotal,
      delivery_charge: this.cart.deliveryPrice,
      coupon_code: this.cart.coupon ? JSON.stringify(this.cart.coupon) : '',
      discount: this.cart.discount,
      pay_key: payKey,
      status: JSON.stringify(orderStatus),
      assignee: '',
      extra: JSON.stringify(this.cart.userOrderTaxByStores),
      payStatus: 1,
      wallet_used: this.cart.walletDiscount > 0 ? 1 : 0,
      wallet_price: this.cart.walletDiscount
    }
    console.log(param);
    this.util.start();
    this.api.post_private('v1/orders/create', param).then((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status && data.status == 200 && data.data && data.data.id) {

        this.cart.clearCart();
        this.cart.clearCart();
        this.cd.detectChanges();
        this.sendNotification(data.data.id);
        const param = {
          id: data.data.id,
          mediaURL: this.api.mediaURL,
          subject: this.util.translate('New Order Created'),
          email: this.getEmail(),
          username: this.getName(),
          store_phone: this.util.general.mobile,
          store_email: this.util.general.email
        };
        this.api.post_private('v1/orders/sendMailForOrders', param).then((data: any) => {
          console.log(data);
        }, error => {
          console.log(error);
        }).catch((error) => {
          console.log(error);
        });
        const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
        this.router.navigate(['user', name, 'order']);
        this.zone.run(() => {
          this.openSuccess(data.data.id);
        });
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }

  async openSuccess(orderID) {
    this.redeemModal.show();
  }

  sendNotification(orderId) {
    const param = {
      id: this.storeIds.join(),
      title: 'New Order ' + ' #' + orderId,
      message: 'New Order'
    };
    this.api.post_private('v1/notification/sendToStore', param).then((data: any) => {
      console.log('notification response', data);
    }, error => {
      console.log('error in notification', error);
    }).catch(error => {
      console.log('error in notification', error);
    });
  }

  payPalWebPay() {
    this.util.start();
    this.api.get_private('v1/getPayPalKey').then(async (data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status && data.status === 200 && data.data) {
        const payMethod = this.payments.filter(x => x.id === this.pay_method);
        console.log(payMethod);
        this.payPalModal.show();
        this.initConfig(payMethod[0].currency_code, data.data);
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    })


  }

  private initConfig(code, clientId): void {
    this.payPalConfig = {
      currency: code,
      clientId: clientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: code,
            value: this.cart.grandTotal,
            breakdown: {
              item_total: {
                currency_code: code,
                value: this.cart.grandTotal
              }
            }
          },
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);

        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.payPalModal.hide();
        this.createOrder(JSON.stringify(data));

      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
        // this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      },
    };
  }

  payWithCard() {
    if (this.token && this.token != null) {
      const param = {
        amount: parseInt(this.cart.grandTotal) * 100,
        currency: this.currency_code && this.currency_code !== null && this.currency_code !== '' ? this.currency_code : 'USD',
        customer: this.util.userInfo.stripe_key,
        card: this.token
      };
      this.util.start();
      this.api.post_private('v1/payments/createStripePayments', param).then((data: any) => {
        console.log(data);
        this.util.stop();
        if (data && data.status && data.status === 200 && data.success && data.success.id) {
          this.frame.hide();
          this.createOrder(JSON.stringify(data.success));
        }
      }, (error) => {
        this.util.stop();
        console.log(error);
        this.util.stop();
        if (error && error.error && error.error.error && error.error.error.message) {
          this.util.errorMessage(error.error.error.message);
          return false;
        }
        this.util.apiErrorHandler(error);
      }).catch(error => {
        this.util.stop();
        console.log(error);
        this.util.stop();
        if (error && error.error && error.error.error && error.error.error.message) {
          this.util.errorMessage(error.error.error.message);
          return false;
        }
        this.util.apiErrorHandler(error);
      });
    }
    console.log(this.token);
    if (this.token) {
      // const options = {
      //   amount: Math.ceil(this.cart.grandTotal * 100),
      //   currency: this.util.stripeCode,
      //   customer: this.util.userInfo.stripe_key,
      //   card: this.token,
      // };
      // console.log('options', options);
      // const url = 'https://api.stripe.com/v1/charges';
      // this.util.start();
      // this.api.externalPost(url, options, this.util.stripe).subscribe((data: any) => {
      //   console.log('------------------------->', data);
      //   this.payId = data.id;
      //   this.util.stop();
      //   const Toast = Swal.mixin({
      //     toast: true,
      //     position: 'bottom-end',
      //     showConfirmButton: false,
      //     timer: 3000,
      //     timerProgressBar: true,
      //   });

      //   Toast.fire({
      //     icon: 'success',
      //     title: this.util.translate('Payment Success')
      //   });
      //   this.createOrder('stripe', this.payId);
      // }, (error) => {
      //   this.util.stop();
      //   console.log(error);
      //   if (error && error.error && error.error.error && error.error.error.message) {
      //     this.util.errorMessage(error.error.error.message);
      //     return false;
      //   }
      //   this.util.errorMessage(this.util.translate('Something went wrong'));
      // });
    } else {
      this.util.errorMessage(this.util.translate('Please select card'));
    }
  }

  async payTmWeb() {

    const storeId = [...new Set(this.cart.cart.map(item => item.store_id))];
    const orderStatus = [];
    storeId.forEach(element => {
      const info = {
        id: element,
        status: 'created'
      }
      orderStatus.push(info)
    });
    const notes = [
      {
        status: 1,
        value: 'Order Created',
        time: moment().format('lll'),
      }
    ];
    const param = {
      uid: localStorage.getItem('uid'),
      store_id: storeId.join(),
      date_time: this.cart.datetime === 'today' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      paid_method: this.payMethodName,
      order_to: this.cart.deliveryAt,
      orders: JSON.stringify(this.cart.cart),
      notes: JSON.stringify(notes),
      address: this.cart.deliveryAt === 'home' ? JSON.stringify(this.cart.deliveryAddress) : '',
      driver_id: '',
      total: this.cart.totalPrice,
      tax: this.cart.orderTax,
      grand_total: this.cart.grandTotal,
      delivery_charge: this.cart.deliveryPrice,
      coupon_code: this.cart.coupon ? JSON.stringify(this.cart.coupon) : '',
      discount: this.cart.discount,
      pay_key: 'NA',
      status: JSON.stringify(orderStatus),
      assignee: '',
      extra: JSON.stringify(this.cart.userOrderTaxByStores),
      payStatus: 0,
      wallet_used: this.cart.walletDiscount > 0 ? 1 : 0,
      wallet_price: this.cart.walletDiscount
    }
    console.log(param);
    this.util.start();
    this.api.post_private('v1/orders/create', param).then(async (data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status && data.status === 200 && data.data && data.data.id) {
        const grandTotal = this.cart.grandTotal;
        this.cart.clearCart();
        this.cart.clearCart();
        this.cd.detectChanges();
        this.sendNotification(data.data.id);
        const param = {
          id: data.data.id,
          mediaURL: this.api.mediaURL,
          subject: this.util.translate('New Order Created'),
          email: this.getEmail(),
          username: this.getName(),
          store_phone: this.util.general.mobile,
          store_email: this.util.general.email
        };
        this.api.post_private('v1/orders/sendMailForOrders', param).then((data: any) => {
          console.log(data);
        }, error => {
          console.log(error);
        }).catch((error) => {
          console.log(error);
        });
        const navParma: NavigationExtras = {
          queryParams: {
            id: data.data.id,
            payLink: this.api.baseUrl + 'v1/payNowWeb?amount=' + grandTotal + '&standby_id=' + data.data.id
          }
        }
        this.cart.clearCart();
        this.cart.clearCart();
        this.cd.detectChanges();
        this.router.navigate(['/await-payments'], navParma);


      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }

  addcard() {
    if (this.email === '' || this.cname === '' || this.cnumber === '' ||
      this.cvc === '' || this.date === '') {
      this.util.errorMessage('All Fields are required');
      return false;
    }

    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(this.email))) {
      this.util.errorMessage('Please enter valid email');
      return false;
    }
    const year = this.date.split('-')[0];
    const month = this.date.split('-')[1];
    //
    if (this.util.userInfo && this.util.userInfo.stripe_key && this.util.userInfo.stripe_key !== '') {
      console.log('add new card');
      const param = {
        'number': this.cnumber,
        'exp_month': month,
        'exp_year': year,
        'cvc': this.cvc,
        'email': this.email
      };
      this.util.start();
      this.api.post_private('v1/payments/createStripeToken', param).then((data: any) => {
        console.log(data);
        if (data && data.status === 200 && data.success && data.success.id && data.success.card && data.success.card.id) {
          const customerParam = {
            token: data.success.id,
            id: this.util.userInfo.stripe_key
          }
          this.api.post_private('v1/payments/addStripeCards', customerParam).then((data: any) => {
            console.log('new card  response', data);
            this.util.stop();
            if (data && data.status && data.status === 200 && data.success && data.success.id) {
              this.addCard = false;
              this.getCards();
            } else {
              this.util.errorMessage(this.util.translate('Something went wrong, please contact administrator!'));
            }
          }, error => {
            console.log(error);
            this.util.stop();
            this.util.apiErrorHandler(error);
          }).catch(error => {
            console.log(error);
            this.util.stop();
            this.util.apiErrorHandler(error);
          });
        } else {
          this.util.stop();
          this.util.apiErrorHandler(data);
        }
      }, error => {
        console.log(error);
        this.util.stop();
        this.util.apiErrorHandler(error);
      }).catch(error => {
        console.log(error);
        this.util.stop();
        this.util.apiErrorHandler(error);
      });
    } else {
      console.log('create new customer');
      const param = {
        'number': this.cnumber,
        'exp_month': month,
        'exp_year': year,
        'cvc': this.cvc,
        'email': this.email
      };
      this.util.start();
      this.api.post_private('v1/payments/createStripeToken', param).then((data: any) => {
        console.log(data);
        if (data && data.status === 200 && data.success && data.success.id && data.success.card && data.success.card.id) {
          const customerParam = {
            source: data.success.id,
            email: this.email
          }
          this.api.post_private('v1/payments/createCustomer', customerParam).then((data: any) => {
            console.log('customer response', data);
            this.util.stop();
            if (data && data.status && data.status === 200 && data.success && data.success.id) {
              this.updateProfile(data.success.id);
            } else {
              this.util.errorMessage(this.util.translate('Something went wrong, please contact administrator!'));
            }
          }, error => {
            console.log(error);
            this.util.stop();
            this.util.apiErrorHandler(error);
          }).catch(error => {
            console.log(error);
            this.util.stop();
            this.util.apiErrorHandler(error);
          });
        } else {
          this.util.stop();
          this.util.apiErrorHandler(data);
        }
      }, error => {
        console.log(error);
        this.util.stop();
        this.util.apiErrorHandler(error);
      }).catch(error => {
        console.log(error);
        this.util.stop();
        this.util.apiErrorHandler(error);
      });
    }

  }

  updateProfile(key) {
    const param = {
      id: localStorage.getItem('uid'),
      stripe_key: key
    };
    this.util.start();
    this.api.post_private('v1/profile/update', param).then((data: any) => {
      console.log(data);
      const param = {
        id: localStorage.getItem('uid')
      }
      this.api.post_private('v1/profile/byId', param).then((data: any) => {
        console.log(data);
        this.util.stop();
        if (data && data.status === 200 && data.data) {
          if (data.data.status === 1) {
            this.util.userInfo = data.data;
          }
        }
        this.addCard = false;
        this.getCards();
      }, error => {
        this.util.stop();
        console.log(error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      })
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }
}
