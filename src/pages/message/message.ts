import { AngularFireAuth } from 'angularfire2/auth';
import { Message } from './../../model/message.interface';
import { MESSAGE_LIST } from './../../mockup/message.mockup';
import { Profile } from './../../model/profile.interface';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';

interface MessageKey {
  msgkey: string,
  content: string,
  name: string,
  when: string,
  id: string,
}

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  peerProf: Profile;
  content_: string;
  msgList: Message[] = MESSAGE_LIST;
  myid: string;
  peerid: string;
  myname: string;
  peername: string;
  messageList: Observable<any[]>;
  msgsub: Subscription;
  
  @ViewChild('content') ct : Content;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private afAuth: AngularFireAuth,private db: AngularFireDatabase) {
      
      // this.peerProf = navParams.get('peerProf');
      this.peerid = navParams.get('peerId');
      this.peername = navParams.get('peername');
      this.myid = this.afAuth.auth.currentUser.uid;
      this.myname = navParams.get('myname');
      console.log('myname = ' + this.myname);
      console.log('myid = '+this.myid);
      console.log('peerid = '+this.peerid);
      console.log('peerName = '+this.peername);
         
  }

  
  ionViewDidLoad(){
    console.log(this.peerid)

    this.messageList = this.db.list(`message-by-user/${this.myid}/${this.peerid}`)
    .valueChanges().pipe(map((msgs) => {
      this.db.database.ref(`message-by-user/${this.peerid}/${this.myid}`).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          child.ref.update({
          unread: 0
          });
        });
      });
      console.log(msgs);
      msgs.map( (mkey:MessageKey) => {
        console.log(typeof(mkey));
            this.db.object(`/messages/${mkey.msgkey}`).valueChanges().subscribe(
               (x:{content: string, fromName: string, when: string, fromID: string})=> {
              console.log(x);
              mkey.content = x.content;
              mkey.id = x.fromID;
              mkey.name = x.fromName;
              mkey.when = x.when;
            });
      });
      console.log(msgs);
      return msgs; 
    }));
    
    this.msgsub = this.db.list(`message-by-user/${this.myid}/${this.peerid}`)
    .valueChanges().subscribe(
      (x) => {
        this.db.object(`last-messages/${this.myid}/${this.peerid}`).update({unread: 0});

        // if(this.ct) this.ct.scrollToBottom(0);
        if(this.ct) this.ct.scrollTo(0, 10000, 0);
      });
    }

  ionViewDidEnter(){
    if(this.ct) this.ct.scrollToBottom(0);
    this.db.database.ref(`message-by-user/${this.peerid}/${this.myid}`).once("value", function(snapshot) {
          snapshot.forEach(function(child) {
            child.ref.update({
            unread: 0
        });
      });
    });
  }

  async send() {
    let message = {fromID: this.myid, toID: this.peerid, content: this.content_, when: this.getTimeNow(), fromName: this.myname, toName: this.peername };
    let key = await this.db.list('messages').push(message).key;

    await this.db.list(`message-by-user/${this.myid}/${this.peerid}`).push({msgkey: key, unread:1});
    await this.db.list(`message-by-user/${this.peerid}/${this.myid}`).push({msgkey: key, unread:0});
 
    this.db.database.ref(`last-messages/${this.peerid}/${this.myid}`)
      .transaction(function(msg) { 
          return {msgkey: key, unread: (msg ? msg.unread+1: 0)}; 
        }
    );
    this.db.object(`last-messages/${this.myid}/${this.peerid}`).set(
      {msgkey: key, unread:0}
    );
    this.content_=""
  }
  
  getTimeNow() : string {
    let d = new Date();
    return `${d.getMonth()}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  }

}
