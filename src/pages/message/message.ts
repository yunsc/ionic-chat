import { AngularFireAuth } from 'angularfire2/auth';
import { Message } from './../../model/message.interface';
import { MESSAGE_LIST } from './../../mockup/message.mockup';
import { Profile } from './../../model/profile.interface';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private afAuth: AngularFireAuth,private db: AngularFireDatabase) {
      
      this.peerProf = navParams.get('peerProf');
      this.peerid = navParams.get('peerId');
      this.peername = navParams.get('peername');
      this.myid = this.afAuth.auth.currentUser.uid;
      this.myname = navParams.get('myname');
      console.log('myname = ' + this.myname);
  }

  
  ionViewWillLoad(){
    console.log(this.peerid)

    this.messageList = this.db.list(`message-by-user/${this.myid}/${this.peerid}`).valueChanges().map( (msgs) => {
      console.log(msgs);
      msgs.map( (mkey:MessageKey) => {
        console.log(typeof(mkey));
            this.db.object(`/messages/${mkey.msgkey}`).valueChanges().subscribe( (x:{content: string, fromName: string, when: string, fromID: string})=> {
              console.log(x);
              mkey.content = x.content;
              mkey.id = x.fromID;
              mkey.name = x.fromName;
              mkey.when = x.when;
            });
      });
      console.log(msgs);
      return msgs; 
    });
  }

  async send() {
    let message = {fromID: this.myid, toID: this.peerid, content: this.content_, when: this.getTimeNow(), fromName: this.myname, toName: this.peername };
    let key = await this.db.list('messages').push(message).key;

    await this.db.list(`message-by-user/${this.myid}/${this.peerid}`).push({msgkey: key});

    this.db.object(`last-messages/${this.myid}/${this.peerid}`).set(
      {msgkey: key}
    );
    
    // this.msgList = this.db.list(`message-by-user/${this.myid}/${this.peerid}`)
    // .valueChanges().pipe(map(changes =>{
    //   changes.map( mkey =>{
    //     this.db.object(`/messages/${mkey.msgkey}`).valueChanges().subscribe(
    //       (x) =>{
    //         mkey.msg = x.msg;
    //         mkey.fromID = x.fromID
    //       }
    //     )
    //   });
    //   return changes;
    // }));

    this.content_=""
  }
  
  getTimeNow() : string {
    let d = new Date();
    return `${d.getMonth()}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  }

}
