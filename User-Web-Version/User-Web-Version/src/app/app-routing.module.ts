/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { ErrorsComponent } from './layouts/errors/errors.component';
import { UsersComponent } from './layouts/users/users.component';
import { LeaveGuard } from './leaved/leaved.guard';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'order',
        loadChildren: () => import('./pages/order/order.module').then(m => m.OrderModule),
        data: { title: 'Orders' },
        canActivate: [AuthGuard]
      },
      {
        path: 'order-detail',
        loadChildren: () => import('./pages/order-detail/order-detail.module').then(m => m.OrderDetailModule),
        data: { title: 'Order Details' },
        canActivate: [AuthGuard]
      },
      {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
        data: { title: 'Home' }
      },
      {
        path: 'cart',
        loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule),
        canActivate: [AuthGuard],
        data: { title: 'Cart' }
      },
      {
        path: 'shop/:id/:name',
        loadChildren: () => import('./pages/shop/shop.module').then(m => m.ShopModule),
        data: { title: 'Shop' }
      },

      {
        path: 'product/:name/:id',
        loadChildren: () => import('./pages/product/product.module').then(m => m.ProductModule),
        data: { title: 'Product' }
      },
      {
        path: 'categories/:id/:name',
        loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule),
        data: { title: 'Categories' }
      },
      {
        path: 'sub/:id/:name/:sub_id/:sub_name',
        loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule),
        data: { title: 'Categories' }
      },
      {
        path: 'paytmcallback',
        loadChildren: () => import('./pages/paytmcallback/paytmcallback.module').then(m => m.PaytmcallbackModule),
        data: { title: 'Success' },
      },
      {
        path: 'instamojocallback',
        loadChildren: () => import('./pages/instamojocallback/instamojocallback.module').then(m => m.InstamojocallbackModule),
        data: { title: 'Success' }
      },
      {
        path: 'flutterwavecallback',
        loadChildren: () => import('./pages/flutterwavecallback/flutterwavecallback.module').then(m => m.FlutterwavecallbackModule),
        data: { title: 'Success' }
      },
      {
        path: 'user/:id/:from',
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
        data: { title: 'User Informations' },
        canActivate: [AuthGuard]
      },

      {
        path: 'contact',
        loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule),
        data: { title: 'Contact' }
      },

      {
        path: 'chats',
        loadChildren: () => import('./pages/chats/chats.module').then(m => m.ChatsModule),
        data: { title: 'Chats' },
        canActivate: [AuthGuard]
      },

      {
        path: 'home-products/:from',
        loadChildren: () => import('./pages/home-products/home-products.module').then(m => m.HomeProductsModule),
        data: { title: 'Top Products' }
      },
      {
        path: 'stores-near-me',
        loadChildren: () => import('./pages/stores/stores.module').then(m => m.StoresModule),
        data: { title: 'Stores Near me' }
      },
      {
        path: 'about',
        loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule),
        data: { title: 'About us' }
      },
      {
        path: 'faq',
        loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqModule),
        data: { title: 'FAQs' }
      },
      {
        path: 'help',
        loadChildren: () => import('./pages/help/help.module').then(m => m.HelpModule),
        data: { title: 'Help' }
      },
      {
        path: 'privacy-policy',
        loadChildren: () => import('./pages/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule),
        data: { title: 'Privacy Policy' }
      },
      {
        path: 'refund-policy',
        loadChildren: () => import('./pages/refund-policy/refund-policy.module').then(m => m.RefundPolicyModule),
        data: { title: 'Refund Policy' }
      },
      {
        path: 'await-payments',
        loadChildren: () => import('./pages/await-payments/await-payments.module').then(m => m.AwaitPaymentsModule),
        data: { title: 'Confirm Payments' },
        canDeactivate: [LeaveGuard]
      }
    ]
  },
  {
    path: '**',
    component: ErrorsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
