/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { uniq } from 'lodash';

@Component({
  selector: 'app-home-products',
  templateUrl: './home-products.component.html',
  styleUrls: ['./home-products.component.scss']
})
export class HomeProductsComponent implements OnInit {

  products: any[] = [];
  dummyTopProducts: any[] = [];
  filter: any = 1;
  limit: any;
  maxLimit: any;
  loaded: boolean;
  from: any;
  stores: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private router: Router
  ) {
    this.from = this.route.snapshot.paramMap.get('from');
    if (this.from && this.from == 'top-picked') {
      this.limit = 5;
      this.loaded = false;
      this.dummyTopProducts = Array(30);
      this.getTop();
    } else {
      this.limit = 5;
      this.loaded = false;
      this.dummyTopProducts = Array(30);
      this.getOffers();
    }
  }

  parseResponse(data) {
    console.log('parse', data);
    this.dummyTopProducts = [];
    this.maxLimit = (this.limit * 12) - 1;
    this.products = data.products;
    this.products.forEach(element => {
      if (element.variations && element.size == 1 && element.variations != '') {
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
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
    this.products = uniq(this.products, 'id');
    if (this.loaded) {
      this.loaded = false;
    }
  }

  getHomeDataWithCityTop() {
    console.log('city top');
    const param = {
      id: localStorage.getItem('city'),
      limit: this.limit * 12
    }
    this.api.post_public('v1/home/getTopRateProductsWithCity', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.parseResponse(data.data);
      } else {
        this.dummyTopProducts = [];
        this.products = [];
      }

    }, error => {
      console.log(error);
      this.dummyTopProducts = [];
      this.products = [];
    }).catch(error => {
      console.log(error);
      this.dummyTopProducts = [];
      this.products = [];
    });
  }

  getHomeDataWithGeoLocationTop() {
    console.log('geo top');
    const param = {
      lat: localStorage.getItem('userLat'),
      lng: localStorage.getItem('userLng'),
      limit: this.limit * 12
    }
    this.api.post_public('v1/home/getTopRateProductsWithLocation', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.parseResponse(data.data);
      } else {
        this.dummyTopProducts = [];
        this.products = [];
      }

    }, error => {
      console.log(error);
      this.dummyTopProducts = [];
      this.products = [];
    }).catch(error => {
      console.log(error);
      this.dummyTopProducts = [];
      this.products = [];
    });
  }

  getHomeDataWithZipCodeTop() {
    console.log('zip top');
    const param = {
      zipcode: localStorage.getItem('zipcodes'),
      limit: this.limit * 12
    }
    this.api.post_public('v1/home/getTopRateProductsWithZipcodes', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.parseResponse(data.data);
      } else {
        this.dummyTopProducts = [];
        this.products = [];
      }

    }, error => {
      console.log(error);
      this.dummyTopProducts = [];
      this.products = [];
    }).catch(error => {
      console.log(error);
      this.dummyTopProducts = [];
      this.products = [];
    });
  }

  getTop() {
    if (this.util.findType == 0) {
      this.getHomeDataWithCityTop();
    } else if (this.util.findType == 1) {
      this.getHomeDataWithGeoLocationTop();
    } else if (this.util.findType == 2) {
      this.getHomeDataWithZipCodeTop();
    }
  }

  ngOnInit(): void {
  }


  addToCart(item, index) {
    console.log(item);
    if (this.util && this.util.makeOrders == 0) {
      this.products[index].quantiy = 1;
      this.cart.addItem(item);
    } else if (this.util && this.util.makeOrders == 1) {
      // check existing items and store
      console.log('exist item and store id');
      if (this.cart.cart.length == 0) {
        this.products[index].quantiy = 1;
        this.cart.addItem(item);
      } else if (this.cart.cart.length >= 0) {
        const products = this.cart.cart.filter(x => x.store_id != item.store_id);
        console.log(products);
        if (products && products.length) {
          this.cart.clearCartAlert().then((data: any) => {
            console.log(data);
            if (data && data == true) {
              this.products.forEach(element => {
                element.quantiy = 0;
              });
            }
          });
        } else {
          this.products[index].quantiy = 1;
          this.cart.addItem(item);
        }
      }
    }
  }

  add(product, index) {
    console.log(product);
    if (this.products[index].quantiy > 0) {
      this.products[index].quantiy = this.products[index].quantiy + 1;
      this.cart.addQuantity(this.products[index].quantiy, product.id);
    }
  }

  remove(product, index) {
    console.log(product, index);
    if (this.products[index].quantiy == 1) {
      this.products[index].quantiy = 0;
      this.cart.removeItem(product.id);
    } else {
      this.products[index].quantiy = this.products[index].quantiy - 1;
      this.cart.addQuantity(this.products[index].quantiy, product.id);
    }
  }
  loadData() {
    this.limit = this.limit + 1;
    this.loaded = true;
    if (this.from && this.from == 'top-picked') {
      this.getTop();
    } else {
      this.getOffers();
    }
  }

  getHomeDataWithCityOffers() {
    console.log('city offers');
    const param = {
      id: localStorage.getItem('city'),
      limit: this.limit * 12
    }
    this.api.post_public('v1/home/getOffersProductsWithCity', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.parseResponse(data.data);
      } else {
        this.dummyTopProducts = [];
        this.products = [];
      }

    }, error => {
      console.log(error);
      this.dummyTopProducts = [];
      this.products = [];
    }).catch(error => {
      console.log(error);
      this.dummyTopProducts = [];
      this.products = [];
    });
  }

  getHomeDataWithGeoLocationOffers() {
    console.log('location offers');
    const param = {
      lat: localStorage.getItem('userLat'),
      lng: localStorage.getItem('userLng'),
      limit: this.limit * 12
    }
    this.api.post_public('v1/home/getOffersProductsWithLocation', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.parseResponse(data.data);
      } else {
        this.dummyTopProducts = [];
        this.products = [];
      }

    }, error => {
      console.log(error);
      this.dummyTopProducts = [];
      this.products = [];
    }).catch(error => {
      console.log(error);
      this.dummyTopProducts = [];
      this.products = [];
    });
  }

  getHomeDataWithZipCodeOffers() {
    console.log('zipcode offers');
    const param = {
      zipcode: localStorage.getItem('zipcodes'),
      limit: this.limit * 12
    }
    this.api.post_public('v1/home/getOffersProductsWithZipcodes', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.parseResponse(data.data);
      } else {
        this.dummyTopProducts = [];
        this.products = [];
      }

    }, error => {
      console.log(error);
      this.dummyTopProducts = [];
      this.products = [];
    }).catch(error => {
      console.log(error);
      this.dummyTopProducts = [];
      this.products = [];
    });
  }

  getOffers() {
    if (this.util.findType == 0) {
      this.getHomeDataWithCityOffers();
    } else if (this.util.findType == 1) {
      this.getHomeDataWithGeoLocationOffers();
    } else if (this.util.findType == 2) {
      this.getHomeDataWithZipCodeOffers();
    }

  }

  onChange(value) {
    this.filter = value;
    switch (this.filter) {
      case 1:
        console.log('its rating');
        // this.products = this.products.sort((a, b) => parseInt(b.total_rating) - parseInt(a.total_rating));
        this.products = this.products.sort((a, b) =>
          parseFloat(b.total_rating) < parseFloat(a.total_rating) ? -1
            : (parseFloat(b.total_rating) > parseFloat(a.total_rating) ? 1 : 0));
        break;

      case 2:
        console.log('its low to high');
        this.products = this.products.sort((a, b) =>
          parseFloat(a.original_price) < parseFloat(b.original_price) ? -1
            : (parseFloat(a.original_price) > parseFloat(b.original_price) ? 1 : 0));
        break;

      case 3:
        console.log('its highht to low');
        this.products = this.products.sort((a, b) =>
          parseFloat(b.original_price) < parseFloat(a.original_price) ? -1
            : (parseFloat(b.original_price) > parseFloat(a.original_price) ? 1 : 0));
        break;

      case 4:
        console.log('its a - z');
        this.products = this.products.sort((a, b) => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
        break;

      case 5:
        console.log('its z - a');
        this.products = this.products.sort((a, b) => {
          if (a.name > b.name) { return -1; }
          if (a.name < b.name) { return 1; }
          return 0;
        });
        break;

      case 6:
        console.log('its % off');
        this.products = this.products.sort((a, b) =>
          parseFloat(b.discount) < parseFloat(a.discount) ? -1
            : (parseFloat(b.discount) > parseFloat(a.discount) ? 1 : 0));
        break;

      default:
        break;
    }
  }

  singleProduct(item) {
    console.log('-->', item);
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
    this.router.navigate(['product', name, item.id]);
  }

}
