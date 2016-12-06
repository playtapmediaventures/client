import {Injectable} from '@angular/core';
import {MlHttpService} from './mlHttp.service';
import {Observable} from 'rxjs/observable';

export interface Promotion{
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
  };
};

@Injectable()
export class CtaService {
  public promotion: Promotion;
  constructor(private _http: MlHttpService) {}

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
  private _parsePromotion(response: any){
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
    if (response.calls_to_action.details.length > 0){
      for (let cta of response.calls_to_action.details) {
        // only one channel is enabled.
        if (cta.enabled) {
          this.promotion.callsToAction = {
            type: cta.type,
            message: cta.message,
            tag: cta.tag,
            link: cta._links.self.href
          }
        }
      }
    }

    console.log(this.promotion);
  }

  //temp
  private jsonResponse(): any {
    return {
   "_links":{
      "self":{
         "href":"/promotions/22"
      }
   },
   "id":22,
   "slug":"C0USFJ",
   "custom_slug":"C0USFJsdsd",
   "promoter_id":1,
   "archived":false,
   "created_at":"2016-11-03T06:50:16Z",
   "clicks":{
      "_links":{
         "self":{
            "href":"/promotions/22/clicks"
         },
         "stats":{
            "href":"/promotions/22/clicks/stats{?from_date,to_date}",
            "templated":true
         }
      },
      "count":0
   },
   "calls_to_action":{
      "_links":{
         "self":{
            "href":"/promotions/22/calls-to-action"
         }
      },
      "details":[

      ]
   },
   "medium":{
      "_links":{
         "self":{
            "href":"/media/21"
         }
      },
      "id":21,
      "type":"track",
      "artist_name":"Sting",
      "collection_name":"Ten Summoner's Tales",
      "collection_explicitness":"notExplicit",
      "album_art_url":"http://is4.mzstatic.com/image/thumb/Music/v4/3b/11/33/3b1133ef-6f4b-22b8-7672-8acf9e661bbe/source/100x100bb.jpg",
      "track_name":"Shape of My Heart",
      "track_explicitness":"notExplicit",
      "links":{
         "_links":{
            "self":{
               "href":"/media/21/links"
            }
         },
         "details":[
            {
               "_links":{
                  "self":{
                     "href":"/media/21/links/21"
                  }
               },
               "id":21,
               "country_code":"US",
               "url":"https://itunes.apple.com/us/album/shape-of-my-heart/id388151?i=388143&uo=4&app=itunes",
               "match_quality":1
            }
         ]
      }
   }
};


  }

}

