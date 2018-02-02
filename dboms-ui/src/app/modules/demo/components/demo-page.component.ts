import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Demo, DemoService } from '../services/demo.service';


@Component({
  template: `<div *ngIf="demo">{{demo.id}} - {{demo.name}} <br><a routerLink="../list">back</a></div>`
})
export class DemoPageComponent implements OnInit{

  //服务注入
  constructor(
    private route: ActivatedRoute,
    private demoService: DemoService) { }
  demo:Demo;
  ngOnInit() {
    let id = parseInt(this.route.snapshot.params['id'], 10);
    this.demoService.getDemo(id).then(demo => {
      this.demo = demo;
    });
  }

}
