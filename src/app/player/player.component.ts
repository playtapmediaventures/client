import { Component, Input } from '@angular/core';
import {Promotion} from "../shared/cta.service";


@Component({
  selector: 'player',
  providers: [],
  styleUrls: [ 'player.component.scss' ],
  templateUrl: './player.component.html'

})
export class PlayerComponent {
  @Input() promotion: Promotion;
  constructor(
  ) {
  }

}
