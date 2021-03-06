import { AfterContentInit, Component, OnInit } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { PhoneService } from '../../services/phone';
import { FacebookPage } from "../login/facebook";

@Component({
  selector: 'verification',
  templateUrl: 'verification.html'
})
export class VerificationPage implements OnInit, AfterContentInit {
  private code: string = '';
  private phone: string;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private phoneService: PhoneService
  ) {}

  ngOnInit() {
    this.phone = this.navParams.get('phone');
  }

  ngAfterContentInit() {
    this.phoneService.getSMS()
      .then((code: string) => {
        this.code = code;
        this.verify();
      })
      .catch((e: Error) => {
        if (e) {
          console.error(e.message);
        }
      });
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      this.verify();
    }
  }

  verify(): void {
    this.phoneService.login(this.phone, this.code).then(() => {
      this.navCtrl.setRoot(FacebookPage, {}, {
        animate: true
      });
    })
    .catch((e) => {
      this.handleError(e);
    });
  }

  handleError(e: Error): void {
    console.error(e);

    const alert = this.alertCtrl.create({
      title: 'Oops!',
      message: e.message,
      buttons: ['OK']
    });

    alert.present();
  }
}
