import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Promotion} from "../shared/cta.service";


@Component({
  selector: 'player',
  providers: [],
  styleUrls: [ 'player.component.scss' ],
  templateUrl: './player.component.html'

})
export class PlayerComponent {
  @Input() promotion: Promotion;
  @Output() onPlay = new EventEmitter<boolean>();
  public playing = false;
  private _audio: any;
  private _firstLoad = true;
  constructor(
  ) {
    this._audio = new Audio();
  }

  ngOnInit(){
    this._audio.src = "http://a859.phobos.apple.com/us/r30/Music6/v4/68/34/f1/6834f1f8-8fdb-4247-492a-c0caea580082/mzaf_3920281300599106672.plus.aac.p.m4a";
    this._audio.onended = () => {
      this.pause();
    };

  }

  play(){
    if(this._firstLoad){
      this._audio.load();
      this._firstLoad = false;
    }
    this._audio.play();
    this.playing = true;
    this.onPlay.emit(true);
  }

  pause(){
    this._audio.pause();
    this.playing = false;
    this.onPlay.emit(false);
  }

}
