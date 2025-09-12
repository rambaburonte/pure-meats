/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {
  // Remove item from cart (for top picked products)
  remove(item: any, i: number) {
    // Find the product in topProducts
    const idx = this.topProducts.findIndex(x => x.id === item.id);
    if (idx !== -1) {
      this.topProducts[idx].quantiy = this.getQuanity(item.id);
      if (this.topProducts[idx].quantiy === 1) {
        this.topProducts[idx].quantiy = 0;
        this.cart.removeItem(item.id);
      } else {
        this.topProducts[idx].quantiy = this.topProducts[idx].quantiy - 1;
        this.cart.addQuantity(this.topProducts[idx].quantiy, item.id);
      }
    }
  }

  // Navigate to home products filtered by type (e.g., 'top-picked', 'best-deals')
  homeProducts(type: string) {
    // Example: this.router.navigate(['products'], { queryParams: { type } });
    // For now, just log or implement as needed
    console.log('Navigate to home products of type:', type);
  }
  @ViewChild('basicModal') public basicModal: ModalDirective;

  // undefined = loading/not fetched yet, true = stores found, false = no stores
  haveData: boolean = undefined;
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
  loop: true,
    margin: 20,
    nav: true,
    dots: false,
    autoplay: true,
  autoplayTimeout: 3000,
  autoplayHoverPause: true,
  autoplaySpeed: 800,
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

  bannerCarouselOptions = {
    loop: true,
    margin: 0,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 4000,
    responsive: {

      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }
    }
  };

  myCategoryOptions = {
  loop: false,
    margin: 20,
    nav: true,
    dots: false,
  autoplay: false,
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
  autoplay: false,
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
  // auto-scroll handles for bottom category native stage scrolling
  private bottomAutoData: Array<any> = [];
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
    // attempt to load data on component init
    try {
      // if no city stored but default exists, set it so city-based API returns data
      const storedCity = localStorage.getItem('city');
      if ((!storedCity || storedCity === 'null') && this.util.default_city_id) {
        localStorage.setItem('city', this.util.default_city_id);
      }
    } catch (e) {
      console.log('init city fallback error', e);
    }
    // fetch initial data
    this.getData();
  }

  getData() {
    if (this.util.findType == 0) {
      // ensure a city id exists
      const cityId = localStorage.getItem('city');
      if (!cityId || cityId === 'null') {
        if (this.util.default_city_id) {
          localStorage.setItem('city', this.util.default_city_id);
        }
      }
      this.getHomeDataWithCity();
    } else if (this.util.findType == 1) {
      // if geo coords missing, fallback to city
      const lat = localStorage.getItem('userLat');
      const lng = localStorage.getItem('userLng');
      if (!lat || !lng) {
        // try city fallback
        this.getHomeDataWithCity();
      } else {
        this.getHomeDataWithGeoLocation();
      }
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
  // preserve existing banners/stores/topProducts during fetch so admin-uploaded content doesn't disappear
  // only reset placeholders and non-visible lists; actual displayed arrays (banners, bottomBanners,
  // betweenBanners, topProducts, stores) are left intact and will be replaced atomically in parseResponse().
  this.dummyBottomCates = Array(2);
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
    // mark as loading
    this.haveData = undefined;
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
    this.haveData = undefined;
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
        // fallback to city-based search when geo lookup returns no stores
        this.clearDummy();
        this.getHomeDataWithCity();
      }
    }, error => {
      console.log('geo lookup error, falling back to city', error);
      this.clearDummy();
      this.getHomeDataWithCity();
    }).catch(error => {
      console.log('geo lookup catch, falling back to city', error);
      this.clearDummy();
      this.getHomeDataWithCity();
    });
  }

  getHomeDataWithZipCode() {
    this.resetData();
    this.haveData = undefined;
    this.api.post_public('v1/home/searchWithZipCode', { zipcode: localStorage.getItem('zipcodes') }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data && data.data.stores && data.data.stores.length) {
        this.haveData = true;
        this.parseResponse(data.data);
      } else {
        // fallback to city search when zipcode doesn't return stores
        this.clearDummy();
        this.getHomeDataWithCity();
      }
    }, error => {
      console.log('zipcode lookup error, falling back to city', error);
      this.clearDummy();
      this.getHomeDataWithCity();
    }).catch(error => {
      console.log('zipcode lookup catch, falling back to city', error);
      this.clearDummy();
      this.getHomeDataWithCity();
    });
  }

  parseResponse(data) {
  console.log('parseResponse data:', data);
    this.clearDummy();
    this.allcates = data.category;
    this.categories = data.category;

    // Use backend store list as-is so display order and duplicates are preserved.
    // Then compute isOpen in-place to avoid modifying order or creating a new array.
    this.stores = data.stores || [];
    try {
      this.stores.forEach(element => {
        try {
          element['isOpen'] = this.isOpen(element.open_time, element.close_time);
        } catch (e) {
          element['isOpen'] = false;
        }
      });
    } catch (e) {
      // fallback: ensure stores is at least set
      this.stores = data.stores || [];
    }

    // build new banner arrays then assign in one shot to avoid intermediate empty states
    const newBanners = [];
    const newBottom = [];
    const newBetween = [];
    (data.banners || []).forEach(element => {
      if (element.position == 0) {
        newBanners.push(element);
      } else if (element.position == 1) {
        newBottom.push(element);
      } else {
        newBetween.push(element);
      }
    });

    // build products
    const finalProducts = [...(data.homeProducts || []), ...(data.topProducts || [])];
    finalProducts.forEach(element => {
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

    // build offers
    const newOffers = (data.inOffers || []).map(element => {
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
      return element;
    });

  // stores already assigned above
    this.banners = newBanners;
    this.bottomBanners = newBottom;
    this.betweenBanners = newBetween;
    this.util.active_store = [...new Set(this.stores.map(item => item.uid))];
    this.topProducts = finalProducts;
    this.offers = newOffers;

    this.chMod.detectChanges();
    // initialize native auto-scroll for bottom category stages after view update
    setTimeout(() => {
      this.initBottomAutoScroll();
    }, 250);

    // If user location exists, ensure we don't show 'No Stores' when any store is within 5km.
    setTimeout(() => {
      this.filterStoresByProximityKm(5);
    }, 300);
  console.log('stores loaded:', this.stores ? this.stores.length : 0, 'topProducts:', this.topProducts ? this.topProducts.length : 0);
  }

  private getStoreCoordinates(store: any): { lat: number, lng: number } | null {
    if (!store || typeof store !== 'object') return null;
    const candidates = [
      ['lat','lng'], ['latitude','longitude'], ['store_lat','store_lng'], ['store_latitude','store_longitude'], ['latit','long'], ['lat','long']
    ];
    for (const [a,b] of candidates) {
      if (store[a] !== undefined && store[b] !== undefined) {
        const lat = parseFloat(store[a]);
        const lng = parseFloat(store[b]);
        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
      }
    }
    // also support nested location object
    if (store.location && (store.location.lat || store.location.latitude) && (store.location.lng || store.location.longitude)) {
      const lat = parseFloat(store.location.lat || store.location.latitude);
      const lng = parseFloat(store.location.lng || store.location.longitude);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
    return null;
  }

  private haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (v: number) => v * Math.PI / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * If user location exists and stores include coordinates, filter stores to those within radiusKm.
   * If any store is found within the radius, ensure haveData=true and show those stores.
   */
  private filterStoresByProximityKm(radiusKm: number) {
    try {
      const latStr = localStorage.getItem('userLat');
      const lngStr = localStorage.getItem('userLng');
      if (!latStr || !lngStr) return; // no user location available
      const userLat = parseFloat(latStr);
      const userLng = parseFloat(lngStr);
      if (isNaN(userLat) || isNaN(userLng)) return;

      if (!this.stores || !this.stores.length) return;

      const storesWithCoords: Array<{ store: any, lat: number, lng: number }> = [];
      for (const s of this.stores) {
        const coords = this.getStoreCoordinates(s);
        if (coords) {
          storesWithCoords.push({ store: s, lat: coords.lat, lng: coords.lng });
        }
      }
      if (!storesWithCoords.length) return; // no coordinate data to act on

      const within: any[] = [];
      for (const s of storesWithCoords) {
        const d = this.haversineKm(userLat, userLng, s.lat, s.lng);
        if (d <= radiusKm) within.push(s.store);
      }

      if (within.length) {
        // show only nearby stores to the user
        this.stores = within;
        this.haveData = true;
        this.chMod.detectChanges();
      }
    } catch (e) {
      console.log('filterStoresByProximityKm error', e);
    }
  }

  /**
   * Initialize auto-scroll for each bottom category owl stage (native overflow stage fallback).
   * This performs a smooth pixel-by-pixel scroll and loops back to start when reaching the end.
   * It also pauses on mouse/touch interaction.
   */
  initBottomAutoScroll() {
    // clear any previously running timers/listeners
    this.clearBottomAutoScroll();

    try {
      // only target the native fallback horizontal row (when owl-carousel isn't available)
      const stages = Array.from(document.querySelectorAll('.btm_category .sub-row')) as HTMLElement[];
      stages.forEach((el, idx) => {
        if (!el) return;
        // only enable if there is overflow (more content than container width)
        if (el.scrollWidth <= el.clientWidth) return;

        const config = {
          speedPxPerTick: 1, // pixels to move per interval
          tickMs: 16 // interval in ms (~60fps)
        };

        let timer: any = null;

        const start = () => {
          if (timer) return; // already running
          timer = setInterval(() => {
            if (!el) return;
            // advance
            el.scrollLeft = el.scrollLeft + config.speedPxPerTick;
            // loop when reaching end
            if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
              // small smooth reset to start
              el.scrollLeft = 0;
            }
          }, config.tickMs);
        };

        const stop = () => {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
        };

        // pause on pointer enter / touchstart
        const onMouseEnter = () => stop();
        const onMouseLeave = () => start();
        const onTouchStart = () => stop();
        const onTouchEnd = () => start();

        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchend', onTouchEnd, { passive: true });

        // store references for cleanup
        this.bottomAutoData.push({ el, start, stop, onMouseEnter, onMouseLeave, onTouchStart, onTouchEnd, timerRef: () => timer });

        // start auto-scrolling
        start();
      });
    } catch (e) {
      console.error('initBottomAutoScroll error', e);
    }
  }

  clearBottomAutoScroll() {
    try {
      this.bottomAutoData.forEach((d) => {
        try {
          // stop timer if running
          d.stop && d.stop();
        } catch (e) {}
        try {
          // remove listeners
          d.el && d.el.removeEventListener('mouseenter', d.onMouseEnter);
          d.el && d.el.removeEventListener('mouseleave', d.onMouseLeave);
          d.el && d.el.removeEventListener('touchstart', d.onTouchStart);
          d.el && d.el.removeEventListener('touchend', d.onTouchEnd);
        } catch (e) {}
      });
    } catch (e) {}
    this.bottomAutoData = [];
  }

  ngOnDestroy() {
    this.clearBottomAutoScroll();
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

  add(product, index) {
    console.log(product, index);
    this.topProducts[index].quantiy = this.getQuanity(product.id);
    if (this.topProducts[index].quantiy > 0) {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy + 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.id);
    }
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

  getQuanity(productId: any) {
    try {
      if (!this.cart || !this.cart.cart) return 0;
      const found = this.cart.cart.filter((x: any) => x.id == productId);
      if (found && found.length) {
        return found[0].quantiy || 0;
      }
      return 0;
    } catch (e) {
      return 0;
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

  getUniqueSubCates(subCates: any[]): any[] {
    if (!subCates || subCates.length === 0) {
      return [];
    }
    
    const uniqueItems = subCates.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );
    
    return uniqueItems;
  }

  goToSingleProduct(item: any) {
    console.log('go to single product', item);
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['product', name, item.id]);
  }
}
