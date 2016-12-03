import { Component } from '@angular/core';
import { MlHttp } from '../shared/mlHttp.service'

@Component({
  selector: 'home',
  providers: [],
  styleUrls: [ 'home.component.scss' ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(private _mlHttp: MlHttp) {

  }

  ngOnInit() {
    console.log('hello `Home` component');
    this._mlHttp.get('https://api.myjson.com/bins/3cljt').subscribe( (response) => {
      console.log(response);
    });
  }

}
