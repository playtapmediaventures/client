import {Injectable} from '@angular/core';
import {MlHttpService} from './mlHttp.service';
import {Observable} from 'rxjs/observable';
import 'rxjs/add/operator/toPromise';
import {Subject} from "rxjs";

export interface Promotion {
  slug: string;
  artistName: string;
  collectionName: string;
  albumArtUrlSmall: string;
  albumArtUrlMedium: string;
  albumArtUrlLarge: string;
  previewSongUrl: string;
  trackName: string;
  iTunesLink: string;
  socialMediaAccounts: any;
  callsToAction?: {
    type: string;
    message: string;
    tag: string;
    page: string;
  };
}
;

@Injectable()
export class CtaService {
  private static NETWORK_AND_TYPE_MAPPING = {
    facebook: {
      facebook_follow: true
    },
    twitter: {
      twitter_follow: true
    },
    youtube: {
      youtube_subscribe: true
    }
  }

  public promotion: Promotion;
  public previewMode = false;
  public timerRestart$: Observable<boolean>;
  private _timerRestart$: Subject<boolean> = new Subject<boolean>();
  private _slug: string;
  private _token: string;
  private referrer = '';

  static hasMatchingNetworkAndType(network: string, type: string): boolean {
    const networkConfig = CtaService.NETWORK_AND_TYPE_MAPPING[network];
    return !!(networkConfig && networkConfig[type]);
  }

  constructor(private _http: MlHttpService) {
    if(document.referrer && document.referrer !== ''){
      this.referrer = `&referrer=${encodeURIComponent(document.referrer)}`;
      this.timerRestart$ = this._timerRestart$.asObservable();
    }
  }

  /***
   * call backend to get promotion info.
   *
   * @param slug
   * @param token
   * @returns {Promise<void>} response from http call
   */
  getPromotion(slug: string, token: string): Promise<void> {
    if (typeof slug === 'undefined' || typeof token === 'undefined') {
      return Promise.reject('Slug and token are required arguments.');
    }
    this._slug = slug;
    this._token = token;

    const promotionPromise = this._http.get(`${slug}/info?token=${token}${this.referrer}`).toPromise();
    // const promotionPromise = this._http.get('https://api.myjson.com/bins/uqu0z').toPromise(); // fb - empire
    //let promotionPromise = this._http.get('https://api.myjson.com/bins/13tog3').toPromise(); // fb
    //let promotionPromise = this._http.get('https://api.myjson.com/bins/17dw9j').toPromise(); // tw
    //let promotionPromise = this._http.get('https://api.myjson.com/bins/120ztj').toPromise(); // yt


    return promotionPromise
      .then((response) => {
        this._parsePromotion(response);
      })
      .catch((err) => {
        console.log(`Error while calling ${slug}/info?token=${token}${this.referrer}`);
        console.log(err);

        return Promise.reject('There was a problem loading this promotion.');
      });
  }

  postConversion(){
    this._http.post(`${this._slug}/info/conversion?token=${this._token}${this.referrer}`,
      {}
    ).subscribe( () => {
      console.log('registered like success');
    }, () => {
      console.log('registered like failed');
    });
  }


  postRedirect(){
    this._http.post(`${this._slug}/info/redirection?token=${this._token}${this.referrer}`,
      {}
    ).subscribe(() => {
      console.log('redirect posted');
    }, () => {
      console.log('redirect post failed');
    });
  }

  restartTimer(){
    this._timerRestart$.next(true);
  }

  /***
   * Parse and save promotion from http response
   *
   * @param response response from crisco
   * @private
   */
  private _parsePromotion(response: any) {
    const medium = response.medium;
    const smallArtURL = medium.album_art_url;
    const mediumArtURL = smallArtURL ? smallArtURL.replace('100x100bb.jpg', '225x225-75.jpg') : null;
    const largeArtURL = smallArtURL ? smallArtURL.replace('100x100bb.jpg', '600x600-75.jpg') : null;

    this.promotion = {
      slug: response.slug,
      artistName: medium.artist_name,
      collectionName: medium.collection_name,
      albumArtUrlSmall: smallArtURL,
      albumArtUrlMedium: mediumArtURL,
      albumArtUrlLarge: largeArtURL,
      trackName: medium.track_name,
      iTunesLink: medium.url,
      socialMediaAccounts: [],
      //previewSongUrl: 'http://a859.phobos.apple.com/us/r30/Music6/v4/68/34/f1/6834f1f8-8fdb-4247-492a-c0caea580082/mzaf_3920281300599106672.plus.aac.p.m4a' // response.medium.preview_url
      previewSongUrl: medium.preview_url
    };

    if (response.call_to_action) {
      const cta = response.call_to_action;
      // only one channel is enabled.
      let socialPage = '';
      if (response.user && response.user.social_media_accounts){
        for (let account of response.user.social_media_accounts) {
          this.promotion.socialMediaAccounts.push(account);

          if (CtaService.hasMatchingNetworkAndType(account.network, cta.type)) {
            socialPage = account.handle;
          }
        }
      }

      this.promotion.callsToAction = {
        type: cta.type,
        message: cta.message,
        tag: cta.tag,
        page: socialPage
      }
    }
  }

// {
//   "id": 308,
//   "slug": "FrzoQe",
//   "custom_slug": "tomer2",
//   "user": {
//     "email": "ariel.x.perez+staging@gmail.com",
//     "social_media_accounts": [
//       {
//         "network": "twitter",
//         "handle": "arielxperez"
//       },
//       {
//         "network": "facebook",
//         "handle": "https://www.facebook.com/Playtap-Media-Ventures-170433536496494/?pnref=lhc"
//       }
//     ]
//   },
//   "archived": false,
//   "call_to_action": {
//     "tag": "xQV",
//     "type": "twitter_follow",
//     "message": "Thanks for supporting good music! Follow me on Twitter before heading to iTunes...",
//     "created_at": "2017-01-21T15:52:15Z"
//   },
//   "medium": {
//     "type": "track",
//     "artist_name": "\"Weird Al\" Yankovic",
//     "collection_name": "The Essential Weird Al Yankovic",
//     "collection_explicitness": "notExplicit",
//     "album_art_url": "http://is1.mzstatic.com/image/thumb/Music3/v4/ca/56/1d/ca561d87-018c-068d-50a3-2e970d6539f7/source/100x100bb.jpg",
//     "track_name": "Amish Paradise (Parody of \"Gangsta's Paradise\" By Coolio)",
//     "track_explicitness": "notExplicit",
//     "url": "https://itunes.apple.com/us/album/amish-paradise-parody-gangstas/id336037796?i=336038288&uo=4"
//   }
// }

}
