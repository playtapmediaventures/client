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
    this._audio.src = this.promotion.previewSongUrl;
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
