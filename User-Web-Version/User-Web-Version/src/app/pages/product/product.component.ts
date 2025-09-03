/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  name: any = '';
  realPrice: any;
  sellPrice: any;
  discount: any;
  description: any;
  is_single: any;
  subId: any;
  status: any;
  coverImage: any = '';
  veg: any;

  have_gram: any;
  gram: any;
  have_kg: any;
  kg: any;
  have_pcs: any;
  pcs: any;
  have_liter: any;
  liter: any;
  have_ml: any;
  ml: any;
  exp_date: any;

  in_stoke: any;
  in_offer: any;
  key_features: any = '';
  disclaimer: any = '';

  id: any;

  gallery: any[] = [];

  related: any[] = [];
  dummyTopProducts = Array(5);
  quantiy: any = 0;
  productt: any;
  loaded: boolean;
  storeId: any;
  storeName: any;

  size: any;
  variations: any;
  variant: any;


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

  storeIsActive: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public util: UtilService,
    public api: ApiService,
    public cart: CartService,
    private chMod: ChangeDetectorRef
  ) {
    if (this.route.snapshot.paramMap.get('id') && this.route.snapshot.paramMap.get('name')) {
      console.log('ok');
      this.id = parseInt(this.route.snapshot.paramMap.get('id'));
      this.getProduct();
    } else {
      this.util.errorMessage(this.util.translate('Something went wrong'));
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
  }


  getProduct() {
    const param = {
      id: this.id
    };
    this.loaded = false;
    this.dummyTopProducts = Array(5);
    this.api.post_public('v1/products/getById', param).then((data: any) => {
      this.loaded = true;
      console.log(data);
      this.gallery = [];
      if (data && data.status && data.status == 200 && data.data && data.data) {
        const info = data.data;
        this.productt = info;
        this.productt['quantiy'] = 0;
        this.name = info.name;
        this.description = info.descriptions;
        this.subId = info.sub_cate_id;
        this.coverImage = info.cover;
        this.key_features = info.key_features;
        this.disclaimer = info.disclaimer;
        this.discount = info.discount;
        this.exp_date = info.exp_date;
        this.gram = info.gram;
        this.have_gram = info.have_gram;
        this.kg = info.kg;
        this.have_kg = info.have_kg;
        this.liter = info.liter;
        this.have_liter = info.have_liter;
        this.ml = info.ml;
        this.have_ml = info.have_ml;
        this.pcs = info.pcs;
        this.have_pcs = info.have_pcs;
        this.in_offer = info.in_offer;
        this.in_stoke = info.in_stoke;
        this.is_single = info.is_single;
        this.veg = info.kind;
        this.realPrice = parseFloat(info.original_price);
        this.sellPrice = parseFloat(info.sell_price);
        this.status = info.status;
        this.storeId = info.store_id;
        this.storeIsActive = data.soldby.status == 1 ? true : false;
        this.storeName = data.soldby.name;
        this.gallery.push(this.coverImage);
        this.size = info.size;
        if (info.variations && info.size == 1 && info.variations != '') {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.status)) {
            this.variations = JSON.parse(info.variations);
            this.variant = 0;
            this.productt['variations'] = JSON.parse(info.variations);
            this.productt['variant'] = 0;
          } else {
            info.variations = [];
            this.productt['variations'] = [];
            this.variant = 1;
            this.productt['variant'] = 1;
          }
        } else {
          this.variations = [];
          this.variant = 1;
          this.productt['variations'] = [];
          this.productt['variant'] = 1;
        }
        this.checkCartItems();
        if (info.images) {
          const images = JSON.parse(info.images);
          console.log('images====>>>', images);
          if (images[0]) {
            this.gallery.push(images[0]);
          }
          if (images[1]) {
            this.gallery.push(images[1]);
          }
          if (images[2]) {
            this.gallery.push(images[2]);
          }
          if (images[3]) {
            this.gallery.push(images[3]);
          }
          if (images[4]) {
            this.gallery.push(images[4]);
          }
          if (images[5]) {
            this.gallery.push(images[5]);
          }
        }
        this.chMod.detectChanges();
      } else {
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
      this.dummyTopProducts = [];
      this.related = [];
      data.related.forEach(element => {
        if (element.variations && element.size == 1 && element.variations != '') {
          element.variations = JSON.parse(element.variations);
        } else {
          element.variations = [];
        }
      });
      this.related = data.related.filter(x => x.id != this.id);
    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.apiErrorHandler(error);
    }).catch((error) => {
      console.log(error);
      this.loaded = true;
      this.util.apiErrorHandler(error);
    });
  }

  onFav() {
    if (this.util.favIds.includes(this.id)) {
      console.log('remove this')
      this.util.removeFav(this.id);
      console.log('after removed', this.util.favIds);
      console.log('edit');
      const param = {
        id: localStorage.getItem('uid'),
        ids: this.util.favIds.join()
      };
      this.util.haveFav = true;
      console.log('parama', param)
      this.api.post_private('v1/favourite/update', param).then((data: any) => {
        console.log('save response', data);
        if (data && data.status !== 200) {
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      }, error => {
        console.log('error on save', error);
        this.util.apiErrorHandler(error);
      });
    } else {
      console.log('add new');
      this.util.setFav(this.id);
      console.log('after added', this.util.favIds);
      if (this.util.haveFav) {
        console.log('edit');
        const param = {
          id: localStorage.getItem('uid'),
          ids: this.util.favIds.join()
        };
        this.util.haveFav = true;
        console.log('parama', param)
        this.api.post_private('v1/favourite/update', param).then((data: any) => {
          console.log('save response', data);
          if (data && data.status !== 200) {
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log('error on save', error);
          this.util.apiErrorHandler(error);
        });
      } else {
        console.log('save');
        const param = {
          uid: localStorage.getItem('uid'),
          ids: this.util.favIds.join()
        };
        this.util.haveFav = true;
        console.log('parama', param)
        this.api.post_private('v1/favourite/create', param).then((data: any) => {
          console.log('save response', data);
          if (data && data.status !== 200) {
            this.util.errorMessage(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log('error on save', error);
          this.util.apiErrorHandler(error);
        });
      }
    }

  }

  changes(index) {
    this.variant = index;
    this.cart.calcuate();
    this.productt['variant'] = this.variant;
  }

  checkCartItems() {
    const item = this.cart.cart.filter(x => x.id == this.id);
    console.log('cart====>>>>>>', item);
    if (item && item.length) {
      this.quantiy = item[0].quantiy;
    }
  }

  addToCart() {
    // this.quantiy = 1;
    // this.productt.quantiy = 1;
    // this.cart.addItem(this.productt);
    if (this.util && this.util.makeOrders == 0) {
      this.quantiy = 1;
      this.productt.quantiy = 1;
      this.cart.addItem(this.productt);
    } else if (this.util && this.util.makeOrders == 1) {
      // check existing items and store
      console.log('exist item and store id');
      if (this.cart.cart.length == 0) {
        this.quantiy = 1;
        this.productt.quantiy = 1;
        this.cart.addItem(this.productt);
      } else if (this.cart.cart.length >= 0) {
        const products = this.cart.cart.filter(x => x.store_id != this.storeId);
        console.log(products);
        if (products && products.length) {
          this.cart.clearCartAlert().then((data: any) => {
            console.log(data);
            if (data && data == true) {
              this.quantiy = 1;
              this.productt.quantiy = 1;
            }
          });
        } else {
          this.quantiy = 1;
          this.productt.quantiy = 1;
          this.cart.addItem(this.productt);
        }
      }
    }
    console.log(this.cart.itemId.includes(this.id), this.id);
  }


  add() {
    this.quantiy = this.quantiy + 1;
    this.cart.addQuantity(this.quantiy, this.id);
  }

  remove() {
    if (this.quantiy == 1) {
      this.quantiy = 0;
      this.cart.removeItem(this.id);
    } else {
      this.quantiy = this.quantiy - 1;
      this.cart.addQuantity(this.quantiy, this.id);
    }
  }
  getQuanity() {
    const data = this.cart.cart.filter(x => x.id == this.id);
    this.quantiy = data[0].quantiy;
    return data[0].quantiy;
  }

  goToProductDetail(item) {
    this.id = item.id;
    this.name = '';
    this.loaded = false;
    this.getProduct();
  }

  goToSingleProduct(product) {
    console.log('-->', product);
    const name = product.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();;
    this.router.navigate([]).then(result => { window.open('product/' + name + '/' + product.id, '_blank'); });
  }

  onStorePage() {
    const name = this.storeName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['shop', this.storeId, name]);
  }
}
