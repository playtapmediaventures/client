import {Injectable} from '@angular/core';
import {Http, URLSearchParams, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import {exists, keys} from '../util/util';

@Injectable()
export class MlHttp {
  private static _BASE_URL = 'http://localhost:3001/v3/';

  constructor(private _http: Http) {
  }

  get(path: string, params?: Object): Observable<Object> {
    let url = MlHttp._urlFor(path, params);

    return this._http.get(url, this._requestOptions().merge({body: ''}))
      .share()
      .map(response => response.json());
  }

  private _requestOptions(): RequestOptions {
    let headersHash = {};
    headersHash = {
      'accept': 'application/json',
      'content-type': 'application/json'
    };
    return new RequestOptions({
      headers: new Headers(headersHash)
    });
  }

  private static _urlFor(path: string, params?: Object): string {
    let url = this._BASE_URL + path;
    if (params) {
      url += '?' + this._parameterize(params);
    }
    return url;
  }


  private static _parameterize(params = {}): URLSearchParams {
    let searchParams = new URLSearchParams();

    for (let key of keys(params)) {

      if (params[key] instanceof Array) {
        params[key].forEach((param) => searchParams.append(key + '[]', param));
      } else {
        searchParams.set(key, params[key]);
      }
    }

    return searchParams;
  }

}

