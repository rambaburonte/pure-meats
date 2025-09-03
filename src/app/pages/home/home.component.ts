/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('basicModal') public basicModal: ModalDirective;

  haveData: boolean;
  dummyCates = Array(30);
  categories: any[] = [];

  dummyBanners: any[] = [];
  banners: any[] = [];

  bottomDummy: any[] = [];
  bottomBanners: any[] = [];

  betweenDummy: any[] = [];
  betweenBanners: any[] = [];

  dummyTopProducts: any[] = [];
  topProducts: any[] = [];

  products: any[] = [];
  dummyProducts: any[] = [];

  haveStores: boolean;

  dummyStores: any[] = [];
  stores: any[] = [];

  dummyOffers: any[] = [];
  offers: any[] = [];

  bottomcategory: any[] = [];
  dummyBottomCates = Array(2);
  haveCity: boolean;

  myCarouselOptions = {
    loop: false,
    margin: 20,
    nav: true,
    dots: false,
    autoplay: true,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 3
      },
      800: {
        items: 3
      },
      1000: {
        items: 5
      }
    }
  }

  myCategoryOptions = {
    loop: false,
    margin: 20,
    nav: true,
    dots: false,
    autoplay: true,
    responsive: {
      0: {
        items: 3,
      },
      600: {
        items: 3
      },
      800: {
        items: 3
      },
      1000: {
        items: 6
      }
    }
  };

  mystoreOptions = {
    loop: false,
    margin: 20,
    nav: true,
    dots: false,
    autoplay: true,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 3
      },
      800: {
        items: 3
      },
      1000: {
        items: 6
      }
    }
  }

  allcates: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
    public cart: CartService,
    public chMod: ChangeDetectorRef,
    private router: Router
  ) {
    this.util.subscribeCity().subscribe((data) => {
      console.log('******************************');
      console.log('fetch data', data);
      this.getData();
      console.log('******************************');
    });

    setTimeout(() => {
      const acceptedCookies = localStorage.getItem('acceptedCookies');
      if (acceptedCookies && acceptedCookies != null && acceptedCookies != 'null') {
      } else {
        this.basicModal.show();
      }
    }, 1000);
  }

  ngOnInit(): void {
  }

  getData() {
    if (this.util.findType == 0) {
      this.getHomeDataWithCity();
    } else if (this.util.findType == 1) {
      this.getHomeDataWithGeoLocation();
    } else if (this.util.findType == 2) {
      this.getHomeDataWithZipCode();
    }
  }

  resetData() {
    this.dummyCates = Array(30);
    this.dummyBanners = Array(30);
    this.bottomDummy = Array(30);
    this.betweenDummy = Array(30);
    this.dummyTopProducts = Array(30);
    this.dummyOffers = Array(30);
    this.offers = [];
    this.categories = [];
    this.banners = [];
    this.bottomBanners = [];
    this.betweenBanners = [];
    this.topProducts = [];
    this.products = [];
    this.bottomcategory = [];
    this.dummyBottomCates = Array(2);
    this.stores = [];
  }

  clearDummy() {
    this.dummyCates = [];
    this.dummyBanners = [];
    this.bottomDummy = [];
    this.betweenDummy = [];
    this.dummyTopProducts = [];
    this.dummyOffers = [];
    this.dummyBottomCates = [];
  }
  getHomeDataWithCity() {
    this.resetData();
    this.api.post_public('v1/home/searchWithCity', { id: localStorage.getItem('city') }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data && data.data.stores && data.data.stores.length) {
        this.haveData = true;
        this.parseResponse(data.data);
      } else {
        this.clearDummy();
        this.haveData = false;
      }
    }, error => {
      this.clearDummy();
      console.log(error);
      this.haveData = false;
    }).catch(error => {
      this.clearDummy();
      console.log(error);
      this.haveData = false;
    });
  }

  getHomeDataWithGeoLocation() {
    this.resetData();
    const param = {
      lat: localStorage.getItem('userLat'),
      lng: localStorage.getItem('userLng')
    }
    this.api.post_public('v1/home/searchWithGeoLocation', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data && data.data.stores && data.data.stores.length) {
        this.haveData = true;
        this.parseResponse(data.data);
      } else {
        this.clearDummy();
        this.haveData = false;
      }
    }, error => {
      this.clearDummy();
      console.log(error);
      this.haveData = false;
    }).catch(error => {
      this.clearDummy();
      console.log(error);
      this.haveData = false;
    });
  }

  getHomeDataWithZipCode() {
    this.resetData();
    this.api.post_public('v1/home/searchWithZipCode', { zipcode: localStorage.getItem('zipcodes') }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data && data.data.stores && data.data.stores.length) {
        this.haveData = true;
        this.parseResponse(data.data);
      } else {
        this.clearDummy();
        this.haveData = false;
      }
    }, error => {
      this.clearDummy();
      console.log(error);
      this.haveData = false;
    }).catch(error => {
      this.clearDummy();
      console.log(error);
      this.haveData = false;
    });
  }

  parseResponse(data) {
    console.log(data);
    this.clearDummy();
    this.allcates = data.category;
    this.categories = data.category;
    this.stores = data.stores;
    this.stores.forEach(async (element) => {
      element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
    });
    data.banners.forEach(element => {
      if (element.position == 0) {
        this.banners.push(element);
      } else if (element.position == 1) {
        this.bottomBanners.push(element);
      } else {
        this.betweenBanners.push(element);
      }
    });
    this.util.active_store = [...new Set(this.stores.map(item => item.uid))];
    const finalProducts = [...data.homeProducts, ...data.topProducts];
    this.topProducts = finalProducts;
    this.topProducts.forEach(element => {
      if (element.variations && element.size == 1 && element.variations != '') {
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.variations)) {
          element.variations = JSON.parse(element.variations);
          element['variant'] = 0;
        } else {
          element.variations = [];
          element['variant'] = 1;
        }
      } else {
        element.variations = [];
        element['variant'] = 1;
      }
      if (this.cart.itemId.includes(element.id)) {
        const index = this.cart.cart.filter(x => x.id == element.id);
        element['quantiy'] = index[0].quantiy;
      } else {
        element['quantiy'] = 0;
      }
    });

    this.offers = [];
    this.offers = data.inOffers;
    this.offers.forEach(element => {
      if (element.variations && element.size == 1 && element.variations != '') {
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.variations)) {
          element.variations = JSON.parse(element.variations);
          element['variant'] = 0;
        } else {
          element.variations = [];
          element['variant'] = 1;
        }
      } else {
        element.variations = [];
        element['variant'] = 1;
      }
      if (this.cart.itemId.includes(element.id)) {
        const index = this.cart.cart.filter(x => x.id == element.id);
        element['quantiy'] = index[0].quantiy;
      } else {
        element['quantiy'] = 0;
      }
    });
    this.chMod.detectChanges();
    console.log(this.topProducts);
  }

  isOpen(start, end) {
    const format = 'H:mm:ss';
    const ctime = moment().format('HH:mm:ss');
    const time = moment(ctime, format);
    const beforeTime = moment(start, format);
    const afterTime = moment(end, format);

    if (time.isBetween(beforeTime, afterTime)) {
      return true;
    }
    return false
  }

  acceptcookies() {
    localStorage.setItem('acceptedCookies', 'true');
    this.basicModal.hide();
  }

  returnContent() {
    return "This website uses cookies to improve your experience. We'll assume you're ok with this,but you can opt-out if you wish.";
  }

  openLink(item) {
    console.log(item);
    if (item.type == 0) {
      console.log('open category');
      const name = this.categories.filter(x => x.id == item.link);
      let cateName: any = '';
      if (name && name.length) {
        cateName = name[0].name;
      }
      const routeName = cateName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
      this.router.navigate(['categories', item.link, routeName]);
    } else if (item.type == 1) {
      console.log('open product');
      const name = item.message.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
      this.router.navigate(['product', name, item.link]);
    } else {
      console.log('open link');
      window.open(item.link, '_blank');
    }
  }

  homeProducts(from) {
    console.log(from);
    this.router.navigate(['home-products', from]);
  }

  goToSingleProduct(product) {
    console.log(product);
    console.log('-->', product);
    const name = product.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
    this.router.navigate(['product', name, product.id]);
  }

  addToCart(item, index) {
    console.log(item, index);
    if (this.util && this.util.makeOrders == 0) {
      this.topProducts[index].quantiy = 1;
      this.cart.addItem(item);
    } else if (this.util && this.util.makeOrders == 1) {
      // check existing items and store
      console.log('exist item and store id');
      if (this.cart.cart.length == 0) {
        this.topProducts[index].quantiy = 1;
        this.cart.addItem(item);
      } else if (this.cart.cart.length >= 0) {
        const products = this.cart.cart.filter(x => x.store_id != item.store_id);
        console.log(products);
        if (products && products.length) {
          this.cart.clearCartAlert().then((data: any) => {
            console.log(data);
            if (data && data == true) {
              this.topProducts.forEach(element => {
                element.quantiy = 0;
              });
            }
          });
        } else {
          this.topProducts[index].quantiy = 1;
          this.cart.addItem(item);
        }
      }
    }
  }

  getQuanity(id) {
    const data = this.cart.cart.filter(x => x.id === id);
    return data[0].quantiy;
  }

  remove(product, index) {
    console.log(product, index);
    this.topProducts[index].quantiy = this.getQuanity(product.id);
    if (this.topProducts[index].quantiy === 1) {
      this.topProducts[index].quantiy = 0;
      this.cart.removeItem(product.id);
    } else {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy - 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.id);
    }
  }

  add(product, index) {
    console.log(product, index);
    this.topProducts[index].quantiy = this.getQuanity(product.id);
    if (this.topProducts[index].quantiy > 0) {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy + 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.id);
    }
  }

  subCate(item) {
    console.log(item);
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
    this.router.navigate(['categories', item.id, name]);
  }

  allStores() {
    this.router.navigate(['stores-near-me']);
  }

  openStore(item) {
    console.log(item);
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['shop', item.uid, name]);
  }

  addOffersToCart(item, index) {
    console.log(item, index);
    if (this.util && this.util.makeOrders == 0) {
      this.offers[index].quantiy = 1;
      this.cart.addItem(item);
    } else if (this.util && this.util.makeOrders == 1) {
      // check existing items and store
      console.log('exist item and store id');
      if (this.cart.cart.length == 0) {
        this.offers[index].quantiy = 1;
        this.cart.addItem(item);
      } else if (this.cart.cart.length >= 0) {
        const products = this.cart.cart.filter(x => x.store_id != item.store_id);
        console.log(products);
        if (products && products.length) {
          this.cart.clearCartAlert().then((data: any) => {
            console.log(data);
            if (data && data == true) {
              this.offers.forEach(element => {
                element.quantiy = 0;
              });
            }
          });
        } else {
          this.offers[index].quantiy = 1;
          this.cart.addItem(item);
        }
      }
    }
  }

  removeOffers(product, index) {
    console.log(product, index);
    this.offers[index].quantiy = this.getQuanity(product.id);
    if (this.offers[index].quantiy === 1) {
      this.offers[index].quantiy = 0;
      this.cart.removeItem(product.id);
    } else {
      this.offers[index].quantiy = this.offers[index].quantiy - 1;
      this.cart.addQuantity(this.offers[index].quantiy, product.id);
    }
  }

  addOffers(product, index) {
    console.log(product, index);
    this.offers[index].quantiy = this.getQuanity(product.id);
    if (this.offers[index].quantiy > 0) {
      this.offers[index].quantiy = this.offers[index].quantiy + 1;
      this.cart.addQuantity(this.offers[index].quantiy, product.id);
    }
  }

  subItems(item, sub) {
    console.log(item, sub);
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const sub_name = sub.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['sub', item.id, name, sub.id, sub_name]);
  }
}
