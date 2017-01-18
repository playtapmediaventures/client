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
  public showLike = false;
  public fbLikeButton;

  private _FBInterval;
  constructor(
    private _ctaService: CtaService,
    private _activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe((queryParams: any) => {
      let slug = queryParams.slug;
      let token = queryParams.token;
      if(typeof slug !== 'undefined' || typeof token !== 'undefined') {
        this._ctaService.getPromotion(slug, token).subscribe((response) => {
          //console.log(response);
          this.promotion = this._ctaService.promotion;
          console.log(this.promotion);
          //this.fbLikeButton = `<div class="fb-like" data-href="${this.promotion.callsToAction.page}" data-layout="button" data-action="like" data-size="large" data-show-faces="false" data-share="false"></div>`
          if (this.promotion && this.promotion.callsToAction) {
            if (this.promotion.callsToAction.type === 'facebook_follow') {
              //this._initFB();
            }
          }

        });
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
      } else if (this.promotion.callsToAction.type === 'youtube_follow') {
        type = 'youtube';
      }
    }
    return type;
  }

  page_like_or_unlike_callback(url, html_element) {
    console.log("page_like_or_unlike_callback");
    // console.log(url);
    // console.log(html_element);
  }

  fbLikeUrl(): string {
    let page = encodeURIComponent(this.promotion.callsToAction.page)
    //return `http://www.facebook.com/plugins/like.php?href=${this.promotion.callsToAction.page}&layout=standard&show_faces=false&width=100&action=like&colorscheme=light&height=80`
    return `https://www.facebook.com/v2.8/plugins/like.php?action=like&amp;app_id=456829841160778&amp;channel=http%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2FD6ZfFsLEB4F.js%3Fversion%3D42%23cb%3Dfb6c7e09f8a74%26relation%3Dparent.parent&amp;container_width=0&amp;href=${page}&amp;layout=button&amp;locale=en_US&amp;sdk=joey&amp;share=false&amp;show_faces=false&amp;size=large`
  }


  private _initFB(){
    if (typeof FB !== 'undefined' && typeof this.promotion !== 'undefined'){
      clearInterval(this._FBInterval);

      console.log('FB Ready');
      FB.init({
        appId      : '456829841160778',
        xfbml      : true,
        version    : 'v2.8'
      });
      FB.AppEvents.logPageView();
      FB.XFBML.parse();
      FB.Event.subscribe('edge.create', this.page_like_or_unlike_callback);
      FB.Event.subscribe('edge.remove', this.page_like_or_unlike_callback);
      //setTimeout(FB.XFBML.parse(),10);
    } else {
      console.log('FB Not ready');
      this._FBInterval = setInterval(()=> {
          this._initFB()
        }, 100
      );
    }
  }


}
