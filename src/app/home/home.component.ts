import { Component } from '@angular/core';
import {UrlService} from "../shared/url.service";
import {CtaService, Promotion} from "../shared/cta.service";
import {StyleSafe} from "../pipes/safe.pipe";

@Component({
  selector: 'home',
  providers: [],
  styleUrls: [ 'home.component.scss' ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public slug: string;
  public promotion: Promotion;
  public itunesBadge = 'assets/img/itunes.svg';
  constructor(
    private _ctaService: CtaService,
    private _urlService: UrlService,
  ) {

  }

  ngOnInit() {
    let slug = this._urlService.slug();
    this._ctaService.getPromotion(slug).subscribe((response) => {
      console.log(response);
      this.promotion = this._ctaService.promotion;
      console.log(this.promotion);

    });
    //promotions/by-slug/<SLUG>
    // this._mlHttpService.get('https://api.myjson.com/bins/3cljt').subscribe( (response) => {
    //   console.log(response);
    // });
  }

}
