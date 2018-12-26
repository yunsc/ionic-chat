import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs-compat';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { AngularFireAuth } from 'angularfire2/auth';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../../model/profile.interface';

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {

  profile : Profile;
  profileList: Observable<any[]>;
  myuid: String;
  myname: String;
  subscription: any;
  subscription2: any;

  constructor(public navCtrl: NavController, private db: AngularFireDatabase, public navParams: NavParams,
    private afAuth: AngularFireAuth) {
    console.log(navParams.data.uid);
    this.myuid = navParams.data.uid;
    this.db.object(`profiles/${this.myuid}`).valueChanges().subscribe(
      (x: Profile) => this.myname = `${x.firstName}`
    )
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsPage');
    this.profileList = this.db.list('profiles')
    .snapshotChanges().pipe(map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))));
    console.log('myuid='+this.myuid);

    this.subscription = this.db.object(`profiles/${this.myuid}`)
    .valueChanges().subscribe( (result:Profile) => this.profile = result );
    
  }

  onClick(profile) {
    this.navCtrl.push('MessagePage', {peerProf: profile, peerId: profile.key,
       peername: profile.firstName, myname: this.myname} );
  }
}
