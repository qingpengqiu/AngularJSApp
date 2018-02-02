import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Demo, DemoService } from '../services/demo.service';


@Component({
  template: `<div>
  <div *ngIf="demo">{{demo.id}} - {{demo.name}} </div>
  <br>
  <a class="btn btn-default" routerLink="../../list">back</a></div>`
})
export class DemoPageComponent implements OnInit{

  //服务注入
  constructor(
    private route: ActivatedRoute,
    private demoService: DemoService) { }
  demo:Demo;
  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.demoService.getDemo(id).then(demo => {
      this.demo = demo;
    });
  }

}
