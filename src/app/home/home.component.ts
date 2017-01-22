import { Component } from '@angular/core';
import {CtaService, Promotion} from "../shared/cta.service";
import {PlayButtonComponent} from "../play-button/playButton.component";
import {ActivatedRoute} from "@angular/router";

declare var FB;
interface FBWindow extends Window {
  fbAsyncInit?: any;
}

@Component({
  selector: 'home',
  providers: [],
  styleUrls: [ 'home.component.scss' ],
  templateUrl: './home.component.html',

})
export class HomeComponent {
  public slug: string;
  public promotion: Promotion;
  public itunesBadge = 'http://msclvr.tomeralmog.com/assets/img/itunes.svg';
  public loading = true;

  private _FBInterval;
  private _iframeInterval;
  private _intervalCount = 0;
  private _maxIntervals = 10;
  constructor(
    private _ctaService: CtaService,
    private _activatedRoute: ActivatedRoute
  ) {
    (<any>window).homeComponent = this;
  }

  ngAfterViewInit() {
    this._activatedRoute.queryParams.subscribe((queryParams: any) => {
      let slug = queryParams.slug;
      let token = queryParams.token;
      if(typeof slug !== 'undefined' || typeof token !== 'undefined') {
        this._ctaService.getPromotion(slug, token).subscribe((response) => {
          this.loading = false;
          this.promotion = this._ctaService.promotion;
          if (this.promotion && this.promotion.callsToAction) {
            if (this.promotion.callsToAction.type === 'facebook_follow') {
              this._fbLikeIframeSrc();
            } else if (this.promotion.callsToAction.type === 'twitter_follow') {
              this._twBtnSrc();
            } else if (this.promotion.callsToAction.type === 'youtube_subscribe') {
              this._initYtSdk();
            }
          }

        },(err) => {
          console.log(err);
          this.loading = false;

        });
      } else {
        this.loading = false;
      }


    });


    // function onYtEvent(payload) {
    // if (payload.eventType == 'subscribe') {
    //   // Add code to handle subscribe event.
    // } else if (payload.eventType == 'unsubscribe') {
    //   // Add code to handle unsubscribe event.
    // }
    // if (window.console) { // for debugging only
    //   window.console.log('YT event: ', payload);
    // }
  }



  bgImage(): string{
    if(this.promotion && this.promotion.albumArtUrlLarge) {
      return 'url(' + this.promotion.albumArtUrlLarge + ')';
    } else {
      return 'url(http://msclvr.tomeralmog.com/assets/img/msclvr-bg.png)';
    }


  }


  socialChannel(): string {
    let type: string;
    if(this.promotion && typeof this.promotion.callsToAction !== 'undefined') {
      if (this.promotion.callsToAction.type === 'facebook_follow') {
        type = 'facebook';
      } else if (this.promotion.callsToAction.type === 'twitter_follow') {
        type = 'twitter';
      } else if (this.promotion.callsToAction.type === 'youtube_subscribe') {
        type = 'youtube';
      }
    }
    return type;
  }

  page_like_or_unlike_callback(url, html_element) {
    (<any>window).homeComponent._ctaService.postConversion();
  }

  private _fbLikeIframeSrc(){
    if(this._intervalCount > this._maxIntervals) {
      clearInterval(this._iframeInterval);
    }
    this._intervalCount++;

    let likeBtn = document.getElementById('fb-like-btn');
    if(likeBtn) {
      clearInterval(this._iframeInterval);

      likeBtn.setAttribute('data-href', this.promotion.callsToAction.page);
      this._initFbSdk();
    } else {
      this._iframeInterval = setInterval(()=> {
          this._fbLikeIframeSrc()
        }, 100
      );
    }
  }


  private _initFB(){
    if (typeof FB !== 'undefined' && typeof this.promotion !== 'undefined'){
      clearInterval(this._FBInterval);

      FB.init({
        appId      : '456829841160778',
        xfbml      : true,
        version    : 'v2.8'
      });

      FB.AppEvents.logPageView();
      FB.XFBML.parse();
      FB.Event.subscribe('edge.create', this.page_like_or_unlike_callback);
      FB.Event.subscribe('edge.remove', this.page_like_or_unlike_callback);

    } else {
      this._FBInterval = setInterval(()=> {
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
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId=456829841160778";
      fjs.parentNode.insertBefore(js, fjs);

      this._initFB();

  }

  private _twBtnSrc() {
    console.log('tw');
    let twBtn = document.getElementById('tw-follow-btn');
    if(twBtn) {
      clearInterval(this._iframeInterval);
      console.log('tw2');
      twBtn.setAttribute('href', 'https://twitter.com/' + this.promotion.callsToAction.page);
      this._initTwSdk();
    } else {
      this._iframeInterval = setInterval(()=> {
          this._twBtnSrc()
        }, 100
      );
    }
  }

  private _initTwSdk() {
      let d = document;
      let s = 'script';
      let id = 'twitter-jssdk';
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

  }

  private _initYtSdk() {
      (<any>window).onYtEvent = (payload) =>{
        console.log('YT event: ', payload);
        if (payload.eventType == 'subscribe') {
          // Add code to handle subscribe event
          (<any>window).homeComponent._ctaService.postConversion();
        } else if (payload.eventType == 'unsubscribe') {
          // Add code to handle unsubscribe event.
        }
        if (window.console) { // for debugging only
          window.console.log('YT event: ', payload);
        }
      }
      let d = document;
      let s = 'script';
      let id = 'yt-jssdk';
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js";
      fjs.parentNode.insertBefore(js, fjs);



  }


}
