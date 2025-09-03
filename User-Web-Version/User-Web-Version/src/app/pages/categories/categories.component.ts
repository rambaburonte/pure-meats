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
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  tabID: any;
  catID: any;
  subId: any;
  dummys = Array(20);

  limit: any;
  maxLimit: any;
  haveSub: boolean = false;
  categories: any[] = [];
  dummyProducts: any[] = [];
  products: any[] = [];
  filter: any = '1';
  loaded: boolean;
  banners: any[] = [];
  dummyBanners = Array(5);

  myCarouselOptions = {
    loop: false,
    margin: 20,
    nav: false,
    dots: true,
    autoplay: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1
      },
      800: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  }

  min: any;
  max: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService
  ) {
    this.init();
  }

  init() {
    console.log('current route', this.router.url);
    if (this.router.url.includes('/sub/')) {
      console.log('its sub category')
      this.haveSub = true;
      this.catID = this.route.snapshot.paramMap.get('id');
      this.subId = this.route.snapshot.paramMap.get('sub_id');
    } else if (this.router.url.includes('/categories/')) {
      console.log('it category');
      this.catID = this.route.snapshot.paramMap.get('id');
    }
    this.limit = 1;
    this.loaded = false;
    this.categories = [];
    this.banners = [];
    this.products = [];
    this.getCates();
  }

  getCates() {
    this.api.get_public('v1/category/getHome').then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.categories = data.data;
        if (this.haveSub == false) {
          const index = this.categories.findIndex(x => x.id == this.catID);
          console.log('index', index);
          this.subId = this.categories[index].subCates[0].id;
          console.log('sub id-----', this.subId);
        }
        this.getData();
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
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

  parseResponse(data) {
    console.log('parse', data);
    this.maxLimit = (this.limit * 12) - 1;
    console.log('Max Limit0000', this.maxLimit);
    window.scrollTo(0, 0);
    this.dummyBanners = [];
    this.products = [];
    this.dummys = [];
    this.banners = data.banners;
    this.products = data.products;
    this.max = Math.max(...this.products.map(o => o.original_price), 0);
    console.log('maxValueOfPrice', this.max);
    this.min = Math.min.apply(null, this.products.map(item => item.original_price))
    console.log('min', this.min);
    this.products.forEach((info: any) => {
      if (info.variations && info.size == 1 && info.variations != '') {
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.status)) {
          info.variations = JSON.parse(info.variations);
          info['variant'] = 0;
        } else {
          info.variations = [];
          info['variant'] = 1;
        }
      } else {
        info.variations = [];
        info['variant'] = 1;
      }
      if (this.cart.itemId.includes(info.id)) {
        const index = this.cart.cart.filter(x => x.id == info.id);
        info['quantiy'] = index[0].quantiy;
      } else {
        info['quantiy'] = 0;
      }
    });
    this.dummyProducts = this.products;
    this.onChange(this.filter);
    if (this.loaded) {
      this.loaded = false;
    }
  }

  getHomeDataWithCity() {
    console.log('with city');
    const param = {
      id: localStorage.getItem('city'),
      catID: this.catID,
      subId: this.subId,
      limit: this.limit * 12
    }
    this.api.post_public('v1/home/getProductsWithCity', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.parseResponse(data.data);
      } else {
        this.dummyBanners = [];
        this.dummys = [];
        this.dummyProducts = [];
        this.products = [];
      }

    }, error => {
      console.log(error);
      this.dummyBanners = [];
      this.dummys = [];
      this.dummyProducts = [];
      this.products = [];
    }).catch(error => {
      console.log(error);
      this.dummyBanners = [];
      this.dummys = [];
      this.dummyProducts = [];
      this.products = [];
    });
  }

  getHomeDataWithGeoLocation() {
    console.log('geo location');
    const param = {
      lat: localStorage.getItem('userLat'),
      lng: localStorage.getItem('userLng'),
      catID: this.catID,
      subId: this.subId,
      limit: this.limit * 12
    }
    this.api.post_public('v1/home/getProductsWithLocation', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.parseResponse(data.data);
      } else {
        this.dummyBanners = [];
        this.dummys = [];
        this.dummyProducts = [];
        this.products = [];
      }

    }, error => {
      console.log(error);
      this.dummyBanners = [];
      this.dummys = [];
      this.dummyProducts = [];
      this.products = [];
    }).catch(error => {
      console.log(error);
      this.dummyBanners = [];
      this.dummys = [];
      this.dummyProducts = [];
      this.products = [];
    });
  }

  getHomeDataWithZipCode() {
    console.log('with zipcode');
    const param = {
      zipcode: localStorage.getItem('zipcodes'),
      catID: this.catID,
      subId: this.subId,
      limit: this.limit * 12
    }
    this.api.post_public('v1/home/getProductsWithZipCodes', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.parseResponse(data.data);
      } else {
        this.dummyBanners = [];
        this.dummys = [];
        this.dummyProducts = [];
        this.products = [];
      }

    }, error => {
      console.log(error);
      this.dummyBanners = [];
      this.dummys = [];
      this.dummyProducts = [];
      this.products = [];
    }).catch(error => {
      console.log(error);
      this.dummyBanners = [];
      this.dummys = [];
      this.dummyProducts = [];
      this.products = [];
    });
  }


  ngOnInit(): void {
  }

  catChange(val) {
    console.log(val);
    this.catID = val;
  }

  goToShopDetail() {
    this.router.navigate(['/shop-detail']);
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
      this.cart.removeItem(product.id)
    } else {
      this.products[index].quantiy = this.products[index].quantiy - 1;
      this.cart.addQuantity(this.products[index].quantiy, product.id);
    }
  }

  loadData() {
    this.limit = this.limit + 1;
    this.loaded = true;
    this.getData();
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
      this.router.navigate([]).then(result => { window.open('categories/' + item.link + '/' + routeName, '_blank'); });
    } else if (item.type == 1) {
      console.log('open product');
      const name = item.message.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
      this.router.navigate(['product', name, item.link]);
    } else {
      console.log('open link');
      window.open(item.link, '_blank');
    }
  }

  onUserChange(event) {
    console.log(event);
    const products = [];
    this.dummyProducts.forEach(element => {
      if (parseFloat(element.original_price) >= event.value && parseFloat(element.original_price) <= event.highValue) {
        products.push(element);
      }
      this.products = products;
    });
  }

}
