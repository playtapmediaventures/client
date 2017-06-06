import {Injectable} from '@angular/core';
import {Http, URLSearchParams, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import {keys} from '../util/util';

@Injectable()
export class MlHttpService {
  private _BASE_URL = '/api/cta/';

  constructor(private _http: Http) {
  }

  get(path: string, params?: Object,  noBase = false): Observable<Object> {
    let url = this._urlFor(path, params, noBase);

    return this._http.get(url, this._requestOptions().merge({body: ''}))
      .share()
      .map(response => response.json());
  }

  post(path: string, payload: Object,  noBase = false): Observable<Object> {
    let url: string;
    if(noBase) {
      url = path;
    } else {
      url = this._BASE_URL + path;
    }
    return this._http.post(url, JSON.stringify(payload), this._requestOptions())
      .share();
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

  private _urlFor(path: string, params?: Object, noBase = false): string {
    let url: string;
    if(noBase) {
      url = path;
    } else {
      url = this._BASE_URL + path;
    }
    if (params) {
      url += '?' + this._parameterize(params);
    }
    return url;
  }


  private _parameterize(params = {}): URLSearchParams {
    let searchParams = new URLSearchParams();

    for (let key of keys(params)) {
      searchParams.set(key, params[key]);
      // if (params[key] instanceof Array) {
      //   params[key].forEach((param) => searchParams.append(key + '[]', param));
      // } else {
      //   searchParams.set(key, params[key]);
      // }
    }

    return searchParams;
  }

  private static _serializePost(path: string, payload: Object): string {
    return `${path}:${JSON.stringify(payload)}`;
  }

}
