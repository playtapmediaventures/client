import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Injectable()
export class UrlService {
  public params = [];
  public queryParams = [];

  constructor(private _activatedRoute: ActivatedRoute) {
    this._activatedRoute.params.subscribe(
      (params: any) => {
        this.params = params;
        console.log(this.params);
      }
    );

    this._activatedRoute.queryParams.subscribe(
      (queryParams: any) => {
        this.queryParams = queryParams;
        console.log(this.queryParams);
      }
    );
  }

  public slug(): string {
    return 'SA6nJ0.json';
    //return 'hw5PyF.json';
  }


}

