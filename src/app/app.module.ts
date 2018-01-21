import {NgModule, ApplicationRef} from '@angular/core';
import {BrowserModule, SafeUrl, SafeStyle} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {RouterModule, PreloadAllModules} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import {ROUTES} from './app.routes';
// App is our top level component
import {AppComponent} from './app.component';
import {HomeComponent} from './home';
import {CountdownComponent} from './home';


import {NoContentComponent} from './no-content';

import {MlHttpService} from './shared/mlHttp.service';
import {CtaService} from "./shared/cta.service";
import {StyleSafe} from "./pipes/safe.pipe";
import {SafeSrcPipe} from "./pipes/safeSrc.pipe";
import {HtmlDirective} from "./directives/safeHtml.directive";
import {PlayerComponent} from "./player/player.component";

// Application wide providers
const APP_PROVIDERS = [
  MlHttpService,
  CtaService,
];


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    CountdownComponent,
    PlayerComponent,
    NoContentComponent,
    StyleSafe,
    SafeSrcPipe,
    HtmlDirective
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(ROUTES, {useHash: false, preloadingStrategy: PreloadAllModules})
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {
  }

}

