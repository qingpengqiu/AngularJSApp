import { Component, OnInit} from '@angular/core';

import { Demo, DemoService } from '../services/demo.service';

@Component({
  template: `<ul>
      <li *ngFor='let demo of demos | async'>
        <a routerLink="{{'../item/' + demo.id}}">{{demo.id}} - {{demo.name}}</a>
      </li>
    </ul>`
})
export class DemoListComponent implements OnInit {

  demos: Promise<Demo[]>;

  //服务注入
  constructor(private demoService: DemoService) { }

  ngOnInit() {
    this.demos = this.demoService.getDemoes();
  }
}
