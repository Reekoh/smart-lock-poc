import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AccountService} from '../../shared/account.service';
declare var navigator:any;
declare var plugins:any;
@Component({
  templateUrl: 'build/pages/registration/registration.html',
  providers: [AccountService]
})
export class RegistrationPage {
  constructor() {

  }

  sendImage() {
    // Camera.getPicture({}).then((imageData) => {
    //   // imageData is either a base64 encoded string or a file URI
    //   // If it's base64:
    //   console.log(imageData);
    // let base64Image = 'data:image/jpeg;base64,' + imageData;
    // }, (err) => {
    // // Handle error
    // });

    // this.account.addAccount({
    //   name: 'lawrence',
    //   image: '',
    //   voices: ['']
    // });
  }
}
