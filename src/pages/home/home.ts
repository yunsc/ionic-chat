import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFireDatabase} from '@angular/fire/database';
//import { Observable } from 'rxjs-compat';
//import {map} from 'rxjs/operators';
//import {ActionSheetController} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
//import { stringify } from '@angular/compiler/src/util';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //items: Observable<any[]>;
  email: string;
  password: string;

  constructor(public navCtrl: NavController, private db: AngularFireDatabase, private af: AngularFireAuth ) {
    
  }
  login() {

    this.af.auth.signInWithEmailAndPassword(	
      this.email, this.password )
      .then( user => {
        //alert("Login success");
        this.navCtrl.setRoot('TabsPage', {uid:user.user.uid});
        console.log(user);
        console.log(user.user.uid);
      })
      .catch( 
        reason=> alert(reason)
      );
  }

  async register() {	
    this.navCtrl.push('RegisterPage');

    // await this.af.auth. createUserWithEmailAndPassword(
    //   "hello@hello.com", "helloworld" )
    //   .catch( reason=> alert(reason));
  }

  onDelete(item) {
    this.db.list('shopping-list').remove(item.key);
  }

  // onUpdate(item) {
  //   this.db.list('shopping-list').update(item.key, {name: item.name, price: item.price});
  // }

  onEdit(item) {
    this.navCtrl.push('EditPage', {myparam: item});
  }

  onAdd() {
    this.navCtrl.push('AddPage');

  }

  // onListClick(item) {
  //   this.as.create( 
  //     { title: "Menu",	
  //       buttons: [		
  //         { text: "Delete", 		  
  //         role: "destructive", 		  handler: ()=> {console.log(item);}
  //         } ,
  //         { text: "Cancel",
  //       role: "cancel"}
  //       ]
  //     }).present();
  // }
}
