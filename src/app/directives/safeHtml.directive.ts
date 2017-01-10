import { Directive, ElementRef, Input, OnChanges, Sanitizer, SecurityContext,
  SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// Sets the element's innerHTML to a sanitized version of [safeHtml]
@Directive({ selector: '[safeHtml]' })
export class HtmlDirective implements OnChanges {
  @Input() safeHtml: string;

  constructor(private elementRef: ElementRef, private sanitizer:DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): any {
    if ('safeHtml' in changes) {
      console.log('safeHTML', this.safeHtml);
      this.elementRef.nativeElement.innerHTML =
         this.safeHtml;
    }
  }
}