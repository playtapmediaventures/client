import { Component, Input } from '@angular/core';
import {CtaService} from "../shared/cta.service";


@Component({
  selector: 'countdown',
  providers: [],
  styleUrls: [ 'countdown.component.scss' ],
  templateUrl: './countdown.component.html',

})
export class CountdownComponent {
  @Input() redirectLink: string;
  @Input() countTime: number;
  public currentTime: number;
  public angle = 0;
  private _initialOffset = 220;
  private _interval;
  constructor(
    private _ctaService: CtaService
  ) {

  }

  ngOnInit(){
    this.currentTime = this.countTime;
    this._interval = setInterval(()=>{
      this._countDown()}, 1000
    );
  }

  private _countDown() {

    if(this.currentTime <= 0){
      clearInterval(this._interval);
      if(!this._ctaService.previewMode) {
        this._ctaService.postRedirect();
        console.log('redirect to ', this.redirectLink);
        //window.location.href = this.redirectLink;
      }

    } else {
      this.currentTime--;
      this.angle = this._initialOffset - (this.currentTime * (this._initialOffset / this.countTime))
    }
  }
}
