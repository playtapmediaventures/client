import {NgModule, ApplicationRef} from '@angular/core';
import {BrowserModule, SafeUrl, SafeStyle} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {RouterModule, PreloadAllModules} from '@angular/router';
import { __platform_browser_private__ } from '@angular/platform-browser';
import {removeNgStyles, createNewHosts, createInputTransfer} from '@angularclass/hmr';

/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from './environment';
import {ROUTES} from './app.routes';
// App is our top level component
import {AppComponent} from './app.component';
import {HomeComponent} from './home';

import {NoContentComponent} from './no-content';

import {MlHttpService} from './shared/mlHttp.service';
import {UrlService} from './shared/url.service';
import {CtaService} from "./shared/cta.service";
import {StyleSafe} from "./pipes/safe.pipe";
import {PlayButtonComponent} from "./play-button/playButton.component";
import {PlayButtonService} from "./play-button/playButton.service";

// Application wide providers
const APP_PROVIDERS = [
  MlHttpService,
  UrlService,
  CtaService,
  PlayButtonService,
  __platform_browser_private__.BROWSER_SANITIZATION_PROVIDERS
];


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    PlayButtonComponent,
    NoContentComponent,
    StyleSafe
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(ROUTES, {useHash: false, preloadingStrategy: PreloadAllModules})
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {
  }

}

