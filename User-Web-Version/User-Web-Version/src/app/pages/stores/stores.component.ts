/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { Router, NavigationExtras } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {
  stores: any[] = [];
  dummystores: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
    private router: Router
  ) {
    this.dummystores = Array(30);
    this.getStore();
  }

  ngOnInit(): void {
  }

  parseResponse(data) {
    console.log(data);
    this.dummystores = [];
    this.stores = data;
    this.stores.forEach(async (element) => {
      element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
    });
    console.log('stores', this.stores);
  }

  getHomeDataWithCity() {
    this.api.post_public('v1/home/searchStoreWithCity', { id: localStorage.getItem('city') }).then((data: any) => {
      console.log(data);
      this.stores = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.parseResponse(data.data);
      } else {
        this.stores = [];
      }
    }, error => {
      this.stores = [];
      this.dummystores = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.stores = [];
      this.dummystores = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  getHomeDataWithGeoLocation() {
    const param = {
      lat: localStorage.getItem('userLat'),
      lng: localStorage.getItem('userLng')
    }
    this.api.post_public('v1/home/searchStoreWithGeoLocation', param).then((data: any) => {
      console.log(data);
      this.stores = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.parseResponse(data.data);
      } else {
        this.stores = [];
      }
    }, error => {
      this.stores = [];
      this.dummystores = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.stores = [];
      this.dummystores = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  getHomeDataWithZipCode() {
    this.api.post_public('v1/home/searchStoreWithZipCode', { zipcode: localStorage.getItem('zipcodes') }).then((data: any) => {
      console.log(data);
      this.stores = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.parseResponse(data.data);
      } else {
        this.stores = [];
      }
    }, error => {
      this.stores = [];
      this.dummystores = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.stores = [];
      this.dummystores = [];
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  getStore() {
    if (this.util.findType == 0) {
      this.getHomeDataWithCity();
    } else if (this.util.findType == 1) {
      this.getHomeDataWithGeoLocation();
    } else if (this.util.findType == 2) {
      this.getHomeDataWithZipCode();
    }
    // const param = {
    //   id: localStorage.getItem('city')
    // };
    // this.api.post('stores/getByCity', param).then((stores: any) => {
    //   console.log('stores by city', stores);
    //   this.stores = [];
    //   this.dummystores = [];
    //   if (stores && stores.status === 200 && stores.data && stores.data.length) {

    //     console.log('store====>>>', this.stores);
    //   }
    // }, error => {
    //   this.dummystores = [];
    //   console.log(error);
    //   this.util.toast('error', this.util.translate('Error'), this.util.translate('Something went wrong'));
    // });
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
    return false;
  }

  openStore(item) {
    console.log('open store', item);
    const name = item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    this.router.navigate(['shop', item.uid, name]);
  }

  getTime(time) {
    return moment(time, ['h:mm A']).format('hh:mm A');
  }

}
