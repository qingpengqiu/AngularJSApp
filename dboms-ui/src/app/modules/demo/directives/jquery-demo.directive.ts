import { Directive ,ElementRef } from '@angular/core';
declare var $;

@Directive({ selector: '[icheck1]' })
export class IcheckDirective {

  constructor(private el: ElementRef) {
    debugger
      $(this.el.nativeElement).iCheck();
  }
}
