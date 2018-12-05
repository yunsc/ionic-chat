import { PROFILE_LIST } from './../../mockup/profile.mockup';
import { LASTMSG_LIST } from './../../mockup/lastmessage.mockup';
import { LastMessage } from './../../model/lastmessage.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the InboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {

  messageList: LastMessage[] = LASTMSG_LIST;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InboxPage');
  }

  onMsgClick(msg) {
    this.navCtrl.push('MessagePage', {peerProf: PROFILE_LIST[1]});
  }
}
