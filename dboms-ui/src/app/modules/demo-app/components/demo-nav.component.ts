import { Component, OnInit} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector:'demo-nav',
  template: `
  <div>
  <ul><li><a routerLink="./list">列表</a></li>
  <li><a routerLink="./config">配置</a></li>
  </ul></div>
  `,
  styles:[':host{display:block}']
})
export class DemoNavComponent implements OnInit {
  //服务注入 当前路由服务
  constructor(private route: ActivatedRoute) { }

  ngOnInit(){
    // console.log(this.route.snapshot);
  }
}
