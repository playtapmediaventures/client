import { Component } from '@angular/core';

@Component({
  selector: 'home',
  providers: [],
  styleUrls: [ './home.component.css' ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor() {

  }

  ngOnInit() {
    console.log('hello `Home` component');
  }

}
