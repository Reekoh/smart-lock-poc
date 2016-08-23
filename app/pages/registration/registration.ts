import {Component, ViewChild} from '@angular/core';
import {NavController, Slides, AlertController, LoadingController} from 'ionic-angular';
import {AccountService} from '../../shared/account.service';
import {HomePage} from '../home/home';
import {Camera, SpinnerDialog} from 'ionic-native';
declare var navigator:any;
declare var cordova:any;
declare var window;

@Component({
  templateUrl: 'build/pages/registration/registration.html',
  providers: [AccountService]
})
export class RegistrationPage {
    @ViewChild('mySlider') slider: Slides;

    mySlideOptions = {
      initialSlide: 0,
      loop: false
    };
    private homePage = HomePage;
    private name: String;

  constructor(private alertController: AlertController, private nav: NavController, private account: AccountService, private loadingCtrl: LoadingController) {
    cordova.plugins.camerapreview.stopCamera();
  }

  sendImage() {
    let name = this.name;
    let self = this;

    if (name.length <= 0) return alert('Please enter your name first.');

    Camera.getPicture({}).then((imageData) => {
      SpinnerDialog.show();
      window.resolveLocalFileSystemURL(imageData, gotFile, fail);
            
      function fail(e) {
            alert('Cannot found requested file');
      }

      function gotFile(fileEntry) {
            fileEntry.file((file) => {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    var content = this.result.split(',')[1];
                    self.saveImage(content);
                };
                reader.readAsDataURL(file);
            });
      }
    }, (error) => {
        alert(error);
    });
  }

  saveImage(image) {
         this.account.addAccount({
          name: this.name.toString(),
          image: image
        }, (error) => {
          SpinnerDialog.hide();
          if (error) { alert(error); }
          else {
            let alert = this.alertController.create({
              title: 'Added successfully!',
              subTitle: 'You are now be able to use your face for identification!',
              buttons: [{
                text: 'OK',
                handler: () => {
                  this.nav.setRoot(HomePage).then(() => {
                    const index = this.nav.getActive().index;
                    this.nav.remove(index-1);
                    this.nav.remove(index-2);
                  });
              }
              }]        
            });
            alert.present();
          }
        });
  }
  next() {
    this.slider.slideTo(1, 500);
  }
  back() {
    this.slider.slideTo(0, 500);
  }
}
