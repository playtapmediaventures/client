import {Injectable} from '@angular/core';
import {MlHttpService} from './mlHttp.service';
import {Observable} from 'rxjs/observable';

export interface Promotion {
  slug: string;
  artistName: string;
  collectionName: string;
  albumArtUrlSmall: string;
  albumArtUrlMedium: string;
  albumArtUrlLarge: string;
  trackName: string;
  iTunesLink: string;
  callsToAction?: {
    type: string;
    message: string;
    tag: string;
    link: string;
    page: string;
  };
}
;

@Injectable()
export class CtaService {
  public promotion: Promotion;

  constructor(private _http: MlHttpService) {
  }

  /***
   * call backend to get promotion info.
   *
   * @param slug
   * @returns {Observable<Object>} response from http call
   */
  getPromotion(slug): Observable<Object> {
    //let stream = this._http.get(`promotions/by-slug/${slug}`);
    let stream = this._http.get('https://api.myjson.com/bins/43jxp');

    stream.subscribe((response) => {
      //this.parsePromotion(response);
      this._parsePromotion(this.jsonResponse());
      console.log(response);
    });
    return stream;
  }

  /***
   * Parse and save promotion from http response
   *
   * @param response response from crisco
   * @private
   */
  private _parsePromotion(response: any) {
    this.promotion = {
      slug: response.slug,
      artistName: response.medium.artist_name,
      collectionName: response.medium.collection_name,
      albumArtUrlSmall: response.medium.album_art_url,
      albumArtUrlMedium: response.medium.album_art_url.replace('100x100bb.jpg', '225x225-75.jpg'),
      albumArtUrlLarge: response.medium.album_art_url.replace('100x100bb.jpg', '600x600-75.jpg'),
      trackName: response.medium.track_name,
      iTunesLink: response.medium.links.details[0].url,
    };
    if (response.calls_to_action.details.length > 0) {
      for (let cta of response.calls_to_action.details) {
        // only one channel is enabled.
        if (cta.enabled) {
          this.promotion.callsToAction = {
            type: cta.type,
            message: cta.message,
            tag: cta.tag,
            link: cta._links.self.href,
            page: 'https://www.facebook.com/zuck'
          }
        }
      }
    }

    console.log(this.promotion);
  }

  //temp
  private jsonResponse(): any {
    return {
      "_links": {"self": {"href": "/promotions/17"}},
      "id": 17,
      "slug": "SA6nJ0",
      "custom_slug": null,
      "promoter_id": 1,
      "archived": false,
      "created_at": "2016-11-02T09:07:58Z",
      "clicks": {
        "_links": {
          "self": {"href": "/promotions/17/clicks"},
          "stats": {"href": "/promotions/17/clicks/stats{?from_date,to_date}", "templated": true}
        }, "count": 0
      },
      "calls_to_action": {
        "_links": {"self": {"href": "/promotions/17/calls-to-action"}},
        "details": [{
          "_links": {"self": {"href": "/promotions/17/calls-to-action/11"}},
          "id": 11,
          "type": "facebook_follow",
          "message": "Thanks for supporting good music! Follow me on Facebook before heading to iTunes...",
          "enabled": false,
          "tag": "93G",
          "created_at": "2016-12-05T06:18:14Z"
        }, {
          "_links": {"self": {"href": "/promotions/17/calls-to-action/14"}},
          "id": 14,
          "type": "facebook_follow",
          "message": "My Message",
          "enabled": true,
          "tag": "dL0",
          "created_at": "2016-12-07T06:19:41Z"
        }]
      },
      "medium": {
        "_links": {"self": {"href": "/media/16"}},
        "id": 16,
        "type": "track",
        "artist_name": "Adele",
        "collection_name": "21",
        "collection_explicitness": "notExplicit",
        "album_art_url": "http://is5.mzstatic.com/image/thumb/Music/v4/cf/7e/47/cf7e47a8-bb18-9156-43d0-7591d0e0855e/source/100x100bb.jpg",
        "track_name": "He Won't Go",
        "track_explicitness": "notExplicit",
        "links": {
          "_links": {"self": {"href": "/media/16/links"}},
          "details": [{
            "_links": {"self": {"href": "/media/16/links/16"}},
            "id": 16,
            "country_code": "US",
            "url": "https://itunes.apple.com/us/album/he-wont-go/id420075073?i=420075147&uo=4&app=itunes",
            "match_quality": 1
          }]
        }
      }
    };


  }

}

