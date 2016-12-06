import { Component, Input } from '@angular/core';
import {PlayButtonService} from "./playButton.service";

@Component({
  selector: 'play-button',
  providers: [],
  styleUrls: [ 'playButton.component.scss' ],
  templateUrl: './playButton.component.html'
})
export class PlayButtonComponent {
  @Input() songUrl: string;
  constructor(private _playButtonService: PlayButtonService) {

  }

  ngOnChanges() {
    //http://itunes.apple.com/us/lookup?id=823593456
    console.log(this.songUrl);
    if(this.songUrl) {
      this._playButtonService.getItunesPreview('823593456');
    }
  }

}
