import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import { CtaService, Promotion } from "../shared/cta.service";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscriber } from "rxjs";

declare var FB;
interface FBWindow extends Window {
  fbAsyncInit?: any;
}

@Component({
  selector: 'home',
  providers: [],
  //encapsulation: ViewEncapsulation.None,
  styleUrls: ['home.component.scss'],
  templateUrl: './home.component.html',

})

//src="//beta.msclvr.co/a/cta?preview=%7B%22slug%22%3A%22dHGJyg%22%2C%22artistName%22%3A%22Idan%20Raichel%22%2C%22collectionName%22%3A%22Idan%20Raichel%20-%20Piano%20-%20Songs%22%2C%22albumArtUrlSmall%22%3A%22http%3A%2F%2Fis1.mzstatic.com%2Fimage%2Fthumb%2FMusic128%2Fv4%2F0a%2F27%2F15%2F0a271558-ce7e-75f6-b5e7-c7ca2834dc1f%2Fsource%2F100x100bb.jpg%22%2C%22albumArtUrlMedium%22%3A%22http%3A%2F%2Fis1.mzstatic.com%2Fimage%2Fthumb%2FMusic128%2Fv4%2F0a%2F27%2F15%2F0a271558-ce7e-75f6-b5e7-c7ca2834dc1f%2Fsource%2F100x100bb.jpg%22%2C%22albumArtUrlLarge%22%3A%22http%3A%2F%2Fis1.mzstatic.com%2Fimage%2Fthumb%2FMusic128%2Fv4%2F0a%2F27%2F15%2F0a271558-ce7e-75f6-b5e7-c7ca2834dc1f%2Fsource%2F100x100bb.jpg%22%2C%22trackName%22%3A%22Ba'Yeshimon%22%2C%22iTunesLink%22%3A%22%22%2C%22callsToAction%22%3A%7B%22message%22%3A%22sdsd%22%2C%22type%22%3A%22facebook_follow%22%2C%22tag%22%3A%22%22%2C%22page%22%3A%22https%3A%2F%2Fwww.facebook.com%2Ftomer.almog.7%22%7D%7D

export class HomeComponent {
  private static SOCIAL_CHANNEL_ACTION_TO_TYPE = {
    facebook_follow: 'facebook',
    twitter_follow: 'twitter',
    youtube_subscribe: 'youtube'
  }

  public promotion: Promotion;
  public itunesBadge = '/ctai/img/itunes.svg';
  public loading = true;
  public ytClicked = false;
  public fbClicked = false;
  public pauseTimer = false;

  private _FBInterval;
  private _iframeInterval = null;
  private _intervalCount = 0;
  private _maxIntervals = 10;
  private _slug;
  private _token;
  private _promotionPromise;

  constructor(private _ctaService: CtaService,
              private _activatedRoute: ActivatedRoute,
              private _ngZone: NgZone) {
    (<any>window).angularComponentRef = {component: this, zone: _ngZone};
    (<any>window).homeComponent = this;

    this._activatedRoute.queryParams.subscribe((queryParams: any) => {
      let preview = queryParams.preview;
      if (preview) {
        this._ctaService.previewMode = true;
        const resolvePromise = (promise) => {
          return promise.then(() => {
            return this.promotion = JSON.parse(preview);
          });
        };
        this._promotionPromise = Promise.resolve();
        resolvePromise(this._promotionPromise);

      } else {
        this._slug = queryParams.slug;
        this._token = queryParams.token;

        this._promotionPromise = this._ctaService.getPromotion(this._slug, this._token)
          .then(() => {
            this.promotion = this._ctaService.promotion;
          });
      }


    });
  }

  ngOnInit() {
    if (this._ctaService.previewMode) {
      this.loading = false;
    }
    this._promotionPromise
      .then(() => {
        this.loading = false;
        if (!this.promotion.callsToAction) {
          const ctaService = this._ctaService;

          // No Call to Action, so just redirect
          if (!ctaService.previewMode) {
            ctaService.postRedirect();
            window.location.href = this.promotion.iTunesLink;
          }
        }
      })
      .catch((e) => {
        this.loading = false;
      });
  }

  ngAfterViewInit() {
    this._promotionPromise.then(() => {
      this.loading = false;

      if (this.promotion.callsToAction) {
        this._initCTA();
      }
    })
      .catch((e) => {
        this.loading = false;
      });
  }

  updatePromotion() {
    (<any>window).angularComponentRef.zone.run(() => {
      this.promotion = (<any>window).promotion;
      this._initCTA();
      this._ctaService.restartTimer();
    });
  }

  // private _isPromotionInjected() {
  //   return !!(<any>window).promotion;
  // }

  ngOnDestroy() {
    (<any>window).angularComponent = null;
  }

  toggleTimer(playing: boolean) {
    this.pauseTimer = playing;
  }

  bgImage(): string {
    const img = (this.promotion && this.promotion.albumArtUrlLarge) ?
      this.promotion.albumArtUrlLarge :
      '/ctai/img/msclvr-bg.png';

    return `url(${img})`;
  }

  socialChannel(): string {
    let type: string;
    clearInterval(this._iframeInterval);
    clearInterval(this._FBInterval);
    if (this.promotion && !!this.promotion.callsToAction) {
      type = HomeComponent.SOCIAL_CHANNEL_ACTION_TO_TYPE[this.promotion.callsToAction.type];
    }
    return type;
  }

  private _pageLikeOrUnlikeCallback(url, htmlElement) {
    this._ctaService.postConversion();
  }

  private _fbLikeIframeSrc() {
    if (this._intervalCount > this._maxIntervals) {
      return;
    }
    this._intervalCount++;

    let likeBtn = document.getElementById('fb-like-btn');
    if (likeBtn) {
      likeBtn.setAttribute('data-href', this.promotion.callsToAction.page);
      this._intervalCount = 0;
      setTimeout(() => {
        this._initFbSdk();
      }, 2000);
    } else {
      setTimeout(() => {
          this._fbLikeIframeSrc()
        }, 200
      );
    }
  }

  trackYt() {
    this._ctaService.postConversion();
    this.ytClicked = true;
  }

  trackFb() {
    this._ctaService.postConversion();
    this.fbClicked = true;
  }

  private _initCTA() {
    console.log('initCTA');
    this._intervalCount = 0;
    if (this.promotion) {
      if (this.promotion.callsToAction) {
        if (this.promotion.callsToAction.type === 'facebook_follow') {
          this._fbLikeIframeSrc();
        } else if (this.promotion.callsToAction.type === 'twitter_follow') {
          this._twBtnSrc();
        } else if (this.promotion.callsToAction.type === 'youtube_subscribe') {
          this._initYtSdk();
        }
      }
    }
  }

  private _initFB() {
    if (this._intervalCount > this._maxIntervals) {
      return;
    }
    this._intervalCount++;

    if (typeof FB !== 'undefined' && typeof this.promotion !== 'undefined') {

      FB.init({
        appId: '456829841160778',
        xfbml: true,
        version: 'v2.8'
      });

      FB.AppEvents.logPageView();
      FB.XFBML.parse();
      FB.Event.subscribe('edge.create', this._pageLikeOrUnlikeCallback);
      FB.Event.subscribe('edge.remove', this._pageLikeOrUnlikeCallback);

    } else {
      setTimeout(() => {
          this._initFB()
        }, 100
      );
    }
  }

  private _initFbSdk() {
    let d = document;
    let s = 'script';
    let id = 'facebook-jssdk';
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=456829841160778";
    fjs.parentNode.insertBefore(js, fjs);

    this._initFB();

  }

  private _twBtnSrc() {
    if (this._intervalCount > this._maxIntervals) {
      return;
    }
    this._intervalCount++;
    let twBtn = document.getElementById('tw-follow-btn');
    if (twBtn) {
      twBtn.setAttribute('href', `https://twitter.com/${this.promotion.callsToAction.page}`);
      this._initTwSdk();
    } else {
      setTimeout(() => {
        this._twBtnSrc();
      }, 200);
    }
  }

  private _initTwSdk() {
    let d = document;
    let s = 'script';
    let id = 'twitter-jssdk';
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

  }

  private _initYtSdk() {
    (<any>window).onYtEvent = (payload) => {
      if (payload.eventType == 'subscribe') {
        // Add code to handle subscribe event
        (<any>window).homeComponent._ctaService.postConversion();
      } else if (payload.eventType == 'unsubscribe') {
        // Add code to handle unsubscribe event.
      }

    }
    let d = document;
    let s = 'script';
    let id = 'yt-jssdk';
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://apis.google.com/js/platform.js";
    fjs.parentNode.insertBefore(js, fjs);
  }
}
