import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';
import {Subject, Observable} from 'rxjs';
import { Http, Response, RequestOptions, Headers} from '@angular/http';
import 'rxjs/Rx';
import * as _ from 'lodash';
import {waterfall, parallel} from 'async';

interface Account {
    name: string;
    image: string;
}

@Injectable()
export class AccountService {
    private rootApi: String = 'https://api.projectoxford.ai/';
    private face_options: RequestOptions;
    private voice_options: RequestOptions;
    private account: Account;

    constructor(private http: Http) {                
        let face_headers = new Headers({ 'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': '7a7c53b8130d4a88a3519480d33c7102' });
        this.face_options = new RequestOptions({ headers: face_headers });        
    }

    createFacePerson(done) {
        let body = JSON.stringify({ name: this.account.name });
        let url = `${this.rootApi}face/v1.0/persongroups/smart_lock/persons`;
        this.http
            .post(url, body, this.face_options)
            .toPromise()
            .then((response) => {
                let person = response.json();
                done(null, person.personId);
            }, (error) => {
                done(error);
            })
    }

    private uploadFaceImage(id, done) {
        let imgUrl = 'https://api.imgur.com/3/image';
        let body = JSON.stringify({ image: this.account.image, type: 'base64' });

        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Client-ID 6e18d3e73957398' });
        let options = new RequestOptions({ headers: headers });
        this.http
            .post(imgUrl, body, options)
            .toPromise()
            .then((response) => {
                let imgData = response.json();
                done(null, id, imgData.data.link);
            }, (error) => {
                done(error)
            });
    }

    private addFace(personId, imgUrl, done) {
        let body = JSON.stringify({ url: imgUrl });
        let url = `${this.rootApi}face/v1.0/persongroups/smart_lock/persons/${personId}/persistedFaces?userData=Lawrence`

        this.http
            .post(url, body, this.face_options)
            .toPromise()
            .then((response) => {
                done();
            }, (error) => {
                done(error)
            });
    }

    private trainGroup(done) {
        let url = `${this.rootApi}face/v1.0/persongroups/smart_lock/train`;
        this.http
            .post(url, JSON.stringify({}), this.face_options)
            .toPromise()
            .then((response) => {
                done();
            }, (error) => {
                done(error)
            });
    }
        
    private registerImage(done) {
        waterfall([
            (callback) => {
                this.createFacePerson(callback);
            },
            (personId, callback) => {
                this.uploadFaceImage(personId, callback);
            },
            (personId, imgUrl, callback) => {
                this.addFace(personId, imgUrl, callback);
            },
            (callback) => {
                this.trainGroup(callback);
            }
        ], (error) => {
            done(error);
        })
    }

    public addAccount(account: Account, done) {
        this.account = account;
        this.registerImage((error) => {
            done(error);
        });
    }

    public validateImage(image) {
        let url = 'http://demo1.reekoh.com:8069/reekoh/data';
        this.http
            .post(url, JSON.stringify({
                image: image,
                device: 'smart-lock',
                personGroupId: 'smart_lock'
            }), this.face_options)
            .toPromise()
            .then((response) => {
            }, (error) => {
                alert('Error:' + error);
            });
    }
}