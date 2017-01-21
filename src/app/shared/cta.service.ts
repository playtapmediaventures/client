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
    //let stream = this._http.get('https://api.myjson.com/bins/s01a7').share(); // fb
    let stream = this._http.get('https://api.myjson.com/bins/16g2qf').share(); // tw


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

          if (cta.type === 'twitter_follow' && account.network === 'twitter') {
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

