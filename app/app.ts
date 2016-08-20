import {Component} from '@angular/core';
import {Platform, MenuController, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {RegistrationPage} from './pages/registration/registration';
import {AboutPage} from './pages/about/about';

@Component({
  template: `
    <ion-menu class="menu-nav" [content]="content">
      <ion-toolbar>
        <ion-title>
        Menu
        <img class="back-ico" src="../../images/left-icon.png">
        </ion-title>
      </ion-toolbar>
      <ion-content>
        <ion-list>
          <button ion-item (click)="openPage(homePage)">
            <img class="img-icon" src="../../images/home-icon.png" >
            Home
          </button>
          <button ion-item (click)="openPage(registrationPage)">
            <img class="img-icon" src="../../images/register-icon.png" >
            Register Profile
          </button>
          <button ion-item (click)="openPage(aboutPage)">
            <img class="img-icon" src="../../images/about-icon.png" >
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

  constructor(private platform: Platform, private menu: MenuController) {
    this.rootPage = HomePage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    this.rootPage = page;
    this.menu.close();
  }
}

ionicBootstrap(MyApp);
