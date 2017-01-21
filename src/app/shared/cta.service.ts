import {Injectable} from '@angular/core';
import {MlHttpService} from './mlHttp.service';
import {Observable} from 'rxjs/observable';
import 'rxjs/add/operator/toPromise';

export interface Promotion {
  slug: string;
  artistName: string;
  collectionName: string;
  albumArtUrlSmall: string;
  albumArtUrlMedium: string;
  albumArtUrlLarge: string;
  trackName: string;
  iTunesLink: string;
  social_media_accounts: any;
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
  public promotion: Promotion;
  private _slug: string;
  private _token: string;

  constructor(private _http: MlHttpService) {
  }

  /***
   * call backend to get promotion info.
   *
   * @param slug
   * @returns {Observable<Object>} response from http call
   */
  getPromotion(slug: string, token: string): Observable<Object> {
    if (typeof slug === 'undefined' || typeof token === 'undefined') {
      return;
    }
    this._slug = slug;
    this._token = token;

    //let stream = this._http.get(`http://beta.msclvr.co/api/cta/${slug}/info?token=${token}`).share();
    let stream = this._http.get('https://api.myjson.com/bins/s01a7').share();

    stream.subscribe((response) => {
      this._parsePromotion(response);
    },(err) => {
    });
    return stream;
  }

  postConversion(){
    this._http.post(
      `http://msclvr-crisco-staging.herokuapp.com/promotions/${this._slug}/cta-info/conversion`,
      {token: this._token}
    ).subscribe( () => {
      console.log('registered like success');
    }, () => {
      console.log('registered like failed');
    });
  }

  /***
   * Parse and save promotion from http response
   *
   * @param response response from crisco
   * @private
   */
  private _parsePromotion(response: any) {
    let mediumArt = response.medium.album_art_url ? response.medium.album_art_url.replace('100x100bb.jpg', '225x225-75.jpg') : null
    let largeArt = response.medium.album_art_url ? response.medium.album_art_url.replace('100x100bb.jpg', '600x600-75.jpg') : null
    this.promotion = {
      slug: response.slug,
      artistName: response.medium.artist_name,
      collectionName: response.medium.collection_name,
      albumArtUrlSmall: response.medium.album_art_url,
      albumArtUrlMedium: mediumArt,
      albumArtUrlLarge: largeArt,
      trackName: response.medium.track_name,
      iTunesLink: response.medium.url,
      social_media_accounts: response.user.social_media_accounts,
    };
    if (response.call_to_action) {
      let cta = response.call_to_action;
      // only one channel is enabled.
      let socialPage = '';
      if(response.user && response.user.social_media_accounts){
        for (let account of response.user.social_media_accounts) {

          if (cta.type === "facebook_follow" && account.network === 'facebook') {
            socialPage = account.handle;
          }

          if (cta.type === 'twitter_like' && account.network === 'twitter') {
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
//   "id": 352,
//   "slug": "pfddDD",
//   "custom_slug": "tomer1",
//   "user": {
//     "email": "ariel.x.perez+staging@gmail.com",
//     "social_media_accounts": [
//       {
//         "network": "facebook",
//         "handle": "https://www.facebook.com/ariel.x.perez/"
//       },
//       {
//         "network": "twitter",
//         "handle": "arielxperez"
//       }
//     ]
//   },
//   "archived": false,
//   "call_to_action": {
//     "tag": "MDZ",
//     "type": "facebook_follow",
//     "message": "Thanks for supporting good music! Follow me on Facebook before heading to iTunes bla bla tomer1",
//     "created_at": "2017-01-14T18:56:58Z"
//   },
//   "medium": {
//     "type": "track",
//     "artist_name": "Tracy Chapman",
//     "collection_name": null,
//     "collection_explicitness": "notExplicit",
//     "album_art_url": null,
//     "track_name": null,
//     "track_explicitness": "notExplicit",
//     "url": "https://itunes.apple.com/us/album/fast-car/id79565550?i=79565507&uo=4"
//   }
// }

}

