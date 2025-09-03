/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  id: any;
  loaded: boolean;
  orderDetail: any[] = [];
  orders: any[] = [];
  payMethod: any;
  status: any[] = [];
  datetime: any;
  orderAt: any;
  address: any;
  userInfo: any;
  driverInfo: any[] = [];
  changeStatusOrder: any;
  userLat: any;
  userLng: any;
  driverId: any;

  stores: any[] = [];

  canCancle: boolean;

  isDelivered: boolean;

  assigneeDriver: any[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService,
    private navCtrl: Location
  ) {
    this.route.queryParams.subscribe((data) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.loaded = false;
        this.getOrder();
      } else {
        this.navCtrl.back();
      }
    });
  }

  getOrder() {
    this.api.post_private('v1/orders/getByOrderId', { id: this.id }).then((data: any) => {
      console.log(data);
      this.loaded = true;
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        console.log(info);
        this.orderDetail = JSON.parse(info.notes);
        console.log('driver???? ===>', this.orderDetail);
        const order = JSON.parse(info.orders);
        console.log('order===>>', order);
        const finalOrder = [];
        if (info.assignee && info.assignee !== '') {
          this.assigneeDriver = JSON.parse(info.assignee);
          console.log('ASSSIGNEE---->>>>', this.assigneeDriver);
        }
        const ids = [...new Set(order.map(item => item.store_id))];
        ids.forEach(element => {
          const param = {
            id: element,
            order: [],
            orderItemTotal: 0,
            orderDiscount: 0,
            shippingPrice: 0,
            orderWalletDiscount: 0,
            orderTaxAmount: 0
          };
          finalOrder.push(param);
        });

        ids.forEach((element, index) => {
          let total = 0;
          order.forEach(cart => {
            if (cart.variations && cart.variations !== '' && typeof cart.variations == 'string') {
              cart.variations = JSON.parse(cart.variations);
              console.log(cart['variant']);
              if (cart["variant"] == undefined) {
                cart['variant'] = 0;
              }
            }
            if (cart.store_id == element) {
              finalOrder[index].order.push(cart);
              if (cart && cart.discount == 0) {
                if (cart.size == '1' || cart.size == 1) {
                  if (cart.variations[0].items[cart.variant].discount && cart.variations[0].items[cart.variant].discount !== 0) {
                    total = total + (parseFloat(cart.variations[0].items[cart.variant].discount) * cart.quantiy);
                  } else {
                    total = total + (parseFloat(cart.variations[0].items[cart.variant].price) * cart.quantiy);
                  }
                } else {
                  total = total + (parseFloat(cart.original_price) * cart.quantiy);
                }
              } else {
                if (cart.size == '1' || cart.size == 1) {
                  if (cart.variations[0].items[cart.variant].discount && cart.variations[0].items[cart.variant].discount !== 0) {
                    total = total + (parseFloat(cart.variations[0].items[cart.variant].discount) * cart.quantiy);
                  } else {
                    total = total + (parseFloat(cart.variations[0].items[cart.variant].price) * cart.quantiy);
                  }
                } else {
                  total = total + (parseFloat(cart.sell_price) * cart.quantiy);
                }
              }
            }

          });
          if (info.discount > 0) {
            finalOrder[index].orderDiscount = info.discount / ids.length;
          }
          if (info.wallet_used == 1) {
            finalOrder[index].orderWalletDiscount = info.wallet_price / ids.length;
          }
          finalOrder[index].orderItemTotal = total;
          console.log('total', element, total);
        });


        console.log('final order', finalOrder);
        this.orders = finalOrder;
        this.status = JSON.parse(info.status);
        console.log('order status--------------------', this.status);

        const status = this.status.filter(x => x.status == 'created');
        if (status.length == this.status.length) {
          this.canCancle = true;
        } else {
          this.canCancle = false;
        }

        const delivered = this.status.filter(x => x.status == 'delivered');
        if (delivered.length == this.status.length) {
          this.isDelivered = true;
        } else {
          this.isDelivered = false;
        }

        // if()
        this.datetime = moment(info.date_time).format('dddd, MMMM Do YYYY');
        this.payMethod = info.paid_method == 'cod' ? 'COD' : 'PAID';
        this.orderAt = info.order_to;
        this.driverId = info.driver_id;
        if (this.driverId && this.driverId !== null) {
          this.driverInfo = data.driverInfo;

        }

        this.stores = data.storeInfo;
        if (this.orderAt == 'home') {
          const address = JSON.parse(info.address);
          console.log('---address', address);
          if (address && address.address) {
            this.userLat = address.lat;
            this.userLng = address.lng;
            this.address = address.landmark + ' ' + address.house + ' ' + address.address + ' ' + address.pincode;
          }
        }

        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.extra)) {
          const extras = JSON.parse(info.extra);
          console.log('extra==>>', extras);
          if (extras && extras.length && info.order_to == 'home') {
            extras.forEach(element => {
              if (element.shipping == 'km') {
                const deliveryCharge = parseFloat(element.distance) * parseFloat(element.shippingPrice);
                console.log('delivert charge of ', element.store_id, deliveryCharge);
                const index = this.orders.findIndex(x => x.id == element.store_id);
                console.log('index=>', index);
                if (this.orders && this.orders[index] && this.orders[index].id == element.store_id) {
                  this.orders[index].shippingPrice = deliveryCharge;
                  this.orders[index].orderTaxAmount = parseFloat(element.tax);
                }
              } else {
                console.log(element.shippingPrice);
                const index = this.orders.findIndex(x => x.id == element.store_id);
                console.log('index=>', index);
                if (this.orders && this.orders[index] && this.orders[index].id == element.store_id) {
                  this.orders[index].shippingPrice = parseFloat(element.shippingPrice) / this.orders.length;
                  this.orders[index].orderTaxAmount = parseFloat(element.tax);
                }
              }
            });
          } else {
            extras.forEach(element => {
              const index = this.orders.findIndex(x => x.id == element.store_id);
              console.log('index=>', index);
              if (this.orders && this.orders[index] && this.orders[index].id == element.store_id) {
                this.orders[index].orderTaxAmount = parseFloat(element.tax);
              }
            });
          }
        }
        console.log(this.orders);
      } else {
        this.util.errorMessage(this.util.translate('Something went wrong'));
      }
      
    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  getTotalBilling(item) {
    const total = item.orderItemTotal + item.orderTaxAmount + item.shippingPrice;
    const discount = item.orderDiscount + item.orderWalletDiscount;
    return total - discount > 0 ? total - discount : 0;
  }

  ngOnInit(): void {
  }


  getDrivers() {
    const param = {
      id: this.driverId
    };
    this.api.post_private('drivers/getById', param).then((data: any) => {
      console.log(data);
    }, error => {
      console.log(error);
    });
  }

  getStoreName(id) {
    const item = this.stores.filter(x => x.uid == id);
    if (item && item.length) {
      return item[0].name;
    }
    return 'Store';
  }

  getOrderStatus(id) {
    const item = this.status.filter(x => x.id == id);
    if (item && item.length) {
      return item[0].status;
    }
    return 'created';
  }

  goToTracker() {
    this.router.navigate(['/tracker']);
  }

  back() {
    this.navCtrl.back();
  }

  contanct(item) {
    console.log(item);
  }

  contanctDriver(item) {
    console.log(item);
  }

}
