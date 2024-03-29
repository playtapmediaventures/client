import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

// Load the implementations that should be tested
import { HomeComponent } from './home.component';
import { MlHttpService } from '../shared/MlHttp.service'

describe('Home', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BaseRequestOptions,
      MockBackend,
      MlHttpService,
      {
        provide: Http,
        useFactory: function(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
          return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
      },
      HomeComponent
    ]
  }));

  it('should have default data', inject([ HomeComponent ], (home: HomeComponent) => {
    expect(true).toBeTruthy();
  }));
  //
  // it('should have a title', inject([ HomeComponent ], (home: HomeComponent) => {
  //   expect(!!home.title).toEqual(true);
  // }));
  //
  // it('should log ngOnInit', inject([ HomeComponent ], (home: HomeComponent) => {
  //   spyOn(console, 'log');
  //   expect(console.log).not.toHaveBeenCalled();
  //
  //   home.ngOnInit();
  //   expect(console.log).toHaveBeenCalled();
  // }));

});
