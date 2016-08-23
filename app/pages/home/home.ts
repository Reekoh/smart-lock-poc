import {Component} from '@angular/core';
import {Platform, LoadingController} from 'ionic-angular';
import {AccountService} from '../../shared/account.service';
import { SpinnerDialog } from 'ionic-native';

declare var navigator:any;
declare var cordova;
declare var window;
@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  constructor(private platform: Platform, private accountService: AccountService) {
    platform.ready().then(() => {
      var self = this;
      var permissions = cordova.plugins.permissions;
      permissions.hasPermission(permissions.CAMERA, checkPermissionCallback, null);
      
      function checkPermissionCallback(status) {
        if(!status.hasPermission) {
          var errorCallback = function() {
            console.warn('Camera permission is not turned on');
          }
      
          permissions.requestPermission(
            permissions.CAMERA,
            (status) => {
              if(!status.hasPermission) errorCallback();
              else {
                self.showPreviewCamera();              
              }
            },
            errorCallback);
        } else {
          self.showPreviewCamera();
        }
      }
    });
  }

  showPreviewCamera() {
    let tapEnabled = false;
    let dragEnabled = false;
    let toBack = true;
    let rect = {
        x: 0, 
        y: 0, 
        width: this.platform.width(), 
        height: this.platform.height()
    };
    cordova.plugins.camerapreview.startCamera(rect, "front", tapEnabled, dragEnabled, toBack);
  }
  validate() {
    SpinnerDialog.show();
    let self = this;
    cordova.plugins.camerapreview.takePicture({maxWidth:640, maxHeight:640});
    cordova.plugins.camerapreview.setOnPictureTakenHandler(function(result){
      console.log(result[0]);

      window.resolveLocalFileSystemURL('file://' + result[1], gotFile, fail);
            
      function fail(e) {
            alert('Cannot found requested file');
      }

      function gotFile(fileEntry) {
            fileEntry.file((file) => {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    var content = this.result.split(',')[1];
                    console.log(content)
                    self.accountService.validateImage(content);
                };
                // The most important point, use the readAsDatURL Method from the file plugin
                reader.readAsDataURL(file);
            });
      }
    });
  }
}
