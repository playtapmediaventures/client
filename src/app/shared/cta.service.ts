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
  getPromotion(slug: string, token: string): Observable<Object>{
    if(typeof slug === 'undefined' || typeof token === 'undefined'){
      return;
    }
    let stream = this._http.get(`http://msclvr-crisco-staging.herokuapp.com/promotions/${slug}/cta-info.json?token=${token}`).share();

    stream.subscribe((response) => {
      this._parsePromotion(response);
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
          "_links": {"self": {"href": "/promotions/17/calls-to-action/14"}},
          "id": 14,
          "type": "facebook_follow",
          "message": "My Message",
          "enabled": false,
          "tag": "dL0",
          "created_at": "2016-12-07T06:19:41Z"
        },{
            "_links":{
               "self":{
                  "href":"/promotions/27039/calls-to-action/120"
               }
            },
            "id":120,
            "type":"twitter_follow",
            "message":"Thanks for supporting good music! Follow me on Twitter before heading to iTunes...",
            "enabled":true,
            "tag":"NRg",
            "created_at":"2016-12-05T01:01:43Z"
         },{
            "_links":{
               "self":{
                  "href":"/promotions/27039/calls-to-action/120"
               }
            },
            "id":120,
            "type":"youtube_follow",
            "message":"youtube msg",
            "enabled":false,
            "tag":"NRg",
            "created_at":"2016-12-05T01:01:43Z"
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

  //
  // {
  //  "id":352,
  //  "slug":"pfddDD",
  //  "custom_slug":"tomer1",
  //  "user":{
  //     "email":"ariel.x.perez+staging@gmail.com",
  //     "social_media_accounts":[
  //        {
  //           "network":"twitter",
  //           "handle":""
  //        },
  //        {
  //           "network":"facebook",
  //           "handle":""
  //        }
  //     ]
  //  },
  //  "archived":false,
  //  "call_to_action":{
  //     "tag":"MDZ",
  //     "type":"facebook_follow",
  //     "message":"Thanks for supporting good music! Follow me on Facebook before heading to iTunes bla bla tomer1",
  //     "created_at":"2017-01-14T18:56:58Z"
  //  },
  //  "medium":{
  //     "type":"track",
  //     "artist_name":"Tracy Chapman",
  //     "collection_name":null,
  //     "collection_explicitness":"notExplicit",
  //     "album_art_url":null,
  //     "track_name":null,
  //     "track_explicitness":"notExplicit",
  //     "url":"https://itunes.apple.com/us/album/fast-car/id79565550?i=79565507\u0026uo=4"
  //  }
//}

}

