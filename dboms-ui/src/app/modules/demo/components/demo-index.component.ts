import { Component, OnInit } from '@angular/core';

import { HeaderBadgeService } from 'app/core';

@Component({
  template: `
  <div>
    <ul>
    <li>
      <a class="btn btn-default" (click)="callServiceToChange()">点我有变化</a>
    </li>
    <li>
      <a routerLink="../widget/toasty">页面浮动提示</a>
    </li>
    </ul>
  </div>
  `
})
export class DemoIndexComponent implements OnInit {
  constructor(private headerBadgeService:HeaderBadgeService) {}
  ngOnInit() {}

  callServiceToChange(){
    let num = Math.trunc(Math.random()*10);
    this.headerBadgeService.changeBadge("bell",num);
    this.headerBadgeService.changeBadge("star",num);
  }
}
