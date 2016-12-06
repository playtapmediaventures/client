// http://itunes.apple.com/us/lookup?id=823593456
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/observable';
import {Http, Jsonp} from "@angular/http";


@Injectable()
export class PlayButtonService {
  public itunesPreviewUrl: string;

  constructor(private _jsonp: Jsonp) {}

  getItunesPreview(itunesId): Observable<void> {
    //let stream = this._http.get(`promotions/by-slug/${slug}`);
    let stream = this._jsonp.get(`http://itunes.apple.com/us/lookup?id=${itunesId}?callback=JSONP_CALLBACK`).map(data => {
      // Do stuff.
      console.log(data);
    });

    stream.subscribe((response) => {
      this.parseItunesResponse(response);
    });
    return stream;
  }

  private parseItunesResponse(response){
    console.log(response);
  }

  // private _requestOptions(): RequestOptions {
  //   let headersHash = {};
  //   headersHash = {
  //     'accept': 'application/json',
  //     'content-type': 'application/json'
  //   };
  //   return new RequestOptions({
  //     headers: new Headers(headersHash)
  //   });
  // }
}

