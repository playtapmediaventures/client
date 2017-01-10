import { Component } from '@angular/core';
import {UrlService} from "../shared/url.service";
import {CtaService, Promotion} from "../shared/cta.service";
import {PlayButtonComponent} from "../play-button/playButton.component";

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
  public itunesBadge = 'assets/img/itunes.svg';
  public showLike = false;
  public fbLikeButton;

  private _FBInterval;
  constructor(
    private _ctaService: CtaService,
    private _urlService: UrlService,
  ) {

  }

  ngOnInit() {
    let slug = this._urlService.slug();
    this._ctaService.getPromotion(slug).subscribe((response) => {
      //console.log(response);
      this.promotion = this._ctaService.promotion;
      console.log(this.promotion);
      //this.fbLikeButton = `<div class="fb-like" data-href="${this.promotion.callsToAction.page}" data-layout="button" data-action="like" data-size="large" data-show-faces="false" data-share="false"></div>`

        this._initFB();


    });

    //promotions/by-slug/<SLUG>
    // this._mlHttpService.get('https://api.myjson.com/bins/3cljt').subscribe( (response) => {
    //   console.log(response);
    // });
  }




  socialChannel(): string {
    let type: string;
    if(this.promotion) {
      if (this.promotion.callsToAction.type === 'facebook_follow') {
        type = 'facebook';
      } else if (this.promotion.callsToAction.type === 'twitter_follow') {
        type = 'twitter';
      }
    }
    return type;
  }

  page_like_or_unlike_callback(url, html_element) {
    console.log("page_like_or_unlike_callback");
    // console.log(url);
    // console.log(html_element);
  }


  private _initFB(){
    if (typeof FB !== 'undefined'){
      console.log(this._FBInterval);
      clearInterval(this._FBInterval);

      console.log('FB Ready');
      FB.init({
        appId      : '456829841160778',
        xfbml      : true,
        version    : 'v2.8'
      });
      //this.showLike = true;
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
