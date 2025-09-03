/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2021-present initappz.
*/
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ModalDirective } from 'angular-bootstrap-md';
import * as moment from 'moment';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  @ViewChild('basicModal') public basicModal: ModalDirective;
  @ViewChild('scrollMe') private scrollMe: ElementRef;

  dummy: any[] = [];
  users: any[] = [];

  id: any;
  name: any;
  msg: any = '';
  messages: any[] = [];
  uid: any;
  loaded: boolean;
  yourMessage: boolean;
  interval: any;

  receiver_id: any = '';
  roomId: any = '';
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router
  ) {
    this.uid = parseInt(localStorage.getItem('uid'));
    this.getChats();
  }

  ngOnInit(): void {
  }
  getChats() {
    this.dummy = Array(10);

    this.api.post_private('v1/chats/getChatListBUid', { id: this.uid }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.data && data.data.length) {
        this.users = data.data;
        console.log('users', this.users);
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });

  }

  onAdmin() {
    this.messages = [];
    this.receiver_id = this.util.adminInfo.id;
    this.name = this.util.adminInfo.first_name + ' ' + this.util.adminInfo.last_name;
    this.getInbox();
    this.loaded = false;
    this.basicModal.show();
  }

  onChat(id, type, userName) {
    console.log(id, type, userName);
    this.messages = [];
    this.receiver_id = id;
    this.name = userName;
    this.getInbox();
    this.loaded = false;
    this.basicModal.show();
  }

  getInbox() {
    const param = {
      uid: this.uid,
      participants: this.receiver_id
    };
    this.api.post_private('v1/chats/getChatRooms', param).then((data: any) => {
      console.log(data);

      if (data && data.status && data.status === 200) {
        if (data && data.data && data.data.id) {
          this.roomId = data.data.id;
        } else if (data && data.data2 && data.data2.id) {
          this.roomId = data.data2.id;
        }
        this.interval = setInterval(() => {
          console.log('calling in interval');
          this.getChatsList();
        }, 12000);
        this.getChatsList();
      } else {
        this.createChatRooms();
      }
    }, error => {
      console.log('error', error);
      this.loaded = false;
      this.createChatRooms();
    }).catch(error => {
      this.loaded = false;
      this.createChatRooms();
      console.log('error', error);
    });
    
  }

  createChatRooms() {
    const param = {
      uid: this.uid,
      participants: this.receiver_id,
      status: 1
    };
    this.api.post_private('v1/chats/createChatRooms', param).then((data: any) => {
      console.log(data);
      this.loaded = true;

      if (data && data.status && data.status === 200 && data.data) {
        this.roomId = data.data.id;
        this.getChatsList();
        this.interval = setInterval(() => {
          console.log('calling in interval');
          this.getChatsList();
        }, 12000);
      }
    }, error => {
      console.log('error', error);
      this.loaded = true;
    }).catch(error => {
      this.loaded = true;
      console.log('error', error);
    });
  }

  getChatsList() {
    this.api.post_private('v1/chats/getById', { room_id: this.roomId }).then((data: any) => {
      console.log(data);
      this.loaded = true;
      this.yourMessage = true;
      if (data && data.status && data.status === 200 && data.data.length) {
        this.messages = data.data;
        this.scrollToBottom();
      }
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }

  scrollToBottom() {
    console.log(this.scrollMe.nativeElement.scrollTop);
    this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
    console.log(this.scrollMe.nativeElement.scrollTop);
    // try {

    // } catch (err) { }
  }
  closeModal() {
    clearInterval(this.interval);
    this.basicModal.hide();
  }

  sendMessage() {
    console.log(this.msg);
    if (!this.msg || this.msg === '') {
      return false;
    }
    const msg = this.msg;
    this.msg = '';
    const param = {
      room_id: this.roomId,
      uid: this.uid,
      from_id: this.uid,
      message: msg,
      message_type: 0,
      status: 1,
    };
    this.scrollToBottom();
    this.yourMessage = false;
    this.api.post_private('v1/chats/sendMessage', param).then((data: any) => {
      console.log(data);
      this.yourMessage = true;

      if (data && data.status === 200) {
        this.getChatsList();
      } else {
        this.yourMessage = true;
      }
    }, error => {
      console.log(error);
      this.yourMessage = true;
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.yourMessage = true;
      this.util.apiErrorHandler(error);
    });
  }

}
