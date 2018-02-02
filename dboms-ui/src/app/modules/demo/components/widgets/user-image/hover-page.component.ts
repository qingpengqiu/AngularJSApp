import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: "hover-page",
  //template: '<h1 (click)="output.next(type)">Alert {{type}}</h1>'
  template: '<p style="background-color: #f5f7fa;margin-left: 40px;padding: 6px;display: inline-block;max-width: 300px;">{{type}}</p>'
})
export class HoverPageComponent {
  @Input() type: string;
  @Output() output = new EventEmitter();
}
