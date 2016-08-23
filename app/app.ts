import {Component} from '@angular/core';
import {Platform, MenuController, ionicBootstrap, AlertController} from 'ionic-angular';
import {StatusBar, SpinnerDialog} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {RegistrationPage} from './pages/registration/registration';
import {AboutPage} from './pages/about/about';
import {AccountService} from './shared/account.service';

@Component({
  providers: [AccountService],
  template: `
    <ion-menu class="menu-nav" [content]="content">
      <ion-toolbar>
        <ion-title>
        Menu
        <img class="back-ico" src="images/left-icon.png" (click)="closeMenu()">
        </ion-title>
      </ion-toolbar>
      <ion-content>
        <ion-list>
          <button ion-item (click)="openPage(homePage)">
            <img class="img-icon" src="images/home-icon.png" >
            Home
          </button>
          <button ion-item (click)="openPage(registrationPage)">
            <img class="img-icon" src="images/register-icon.png" >
            Register Profile
          </button>
          <button ion-item (click)="openPage(aboutPage)">
            <img class="img-icon" src="images/about-icon.png" >
            About
          </button>
        </ion-list>
      </ion-content>
    </ion-menu>

    <ion-nav id="nav" #content [root]="rootPage"></ion-nav>
`
})
export class MyApp {

  private rootPage: any;
  private homePage = HomePage;
  private registrationPage = RegistrationPage;
  private aboutPage = AboutPage;

  constructor(private platform: Platform, private menu: MenuController, private alertController: AlertController) {
    this.rootPage = HomePage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      let socket = new WebSocket('ws://demo1.reekoh.com:8071');
		  socket.onopen = (event) => {
        socket.onmessage = (event) =>{
          let result = JSON.parse(event.data);
          let subTitle = result.match_found && result.match_found[0].candidates.length > 0 ? 'Face successfully verified' : 'Can\'t verified, please try again';
          let alert = this.alertController.create({
                      title: 'Face Identification',
                      subTitle: subTitle,
                      buttons: ['OK']
            });
            alert.present();
            SpinnerDialog.hide();
          }
      }
    });
  }

  openPage(page) {
    this.rootPage = page;
    this.menu.close();
  }

  closeMenu() {
    this.menu.close();
  }
}

ionicBootstrap(MyApp);
