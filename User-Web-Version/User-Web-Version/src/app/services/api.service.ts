/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: any = '';
  mediaURL: any = '';
  confirmationResult: firebase.default.auth.ConfirmationResult;
  constructor(
    private http: HttpClient,
    private fireAuth: AngularFireAuth
  ) {
    this.baseUrl = environment.baseUrl;
    this.mediaURL = environment.imageUrl;
  }

  public signInWithPhoneNumber(recaptchaVerifier, phoneNumber) {
    return new Promise<any>((resolve, reject) => {
      console.log(phoneNumber);
      this.fireAuth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          this.confirmationResult = confirmationResult;
          resolve(confirmationResult);
        }).catch((error) => {
          console.log(error);
          reject('SMS not sent');
        });
    });
  }

  public async enterVerificationCode(code) {
    return new Promise<any>((resolve, reject) => {
      this.confirmationResult.confirm(code).then(async (result) => {
        console.log(result);
        const user = result.user;
        resolve(user);
      }).catch((error) => {
        reject(error.message);
      });

    });
  }

  uploadFile(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('image', f))
    return this.http.post(this.baseUrl + 'v1/' + 'uploadImage', formData)
  }

  JSON_to_URLEncoded(element: any, key?: any, list?: any) {
    let new_list = list || [];
    if (typeof element === 'object') {
      for (let idx in element) {
        this.JSON_to_URLEncoded(
          element[idx],
          key ? key + '[' + idx + ']' : idx,
          new_list
        );
      }
    } else {
      new_list.push(key + '=' + encodeURIComponent(element));
    }
    return new_list.join('&');
  }

  public post_public(url: string, body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public post_private(url: string, body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public post_temp(url, body, temp): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${temp}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  public get_public(url: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public get_private(url: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public externalGet(url: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get(url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  httpGet(url: any, key: any) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${key}`)
    };

    return this.http.get(url, header);
  }

  externalPost(url: any, body: any, key: any) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${key}`)
    };
    const order = this.JSON_to_URLEncoded(body);
    console.log(order)
    return this.http.post(url, order, header);
  }
}
