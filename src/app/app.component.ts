/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    'app.component.scss'
  ],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>

    <footer>
      Footer
    </footer>
  `
})
export class AppComponent {

  constructor() {}


}
