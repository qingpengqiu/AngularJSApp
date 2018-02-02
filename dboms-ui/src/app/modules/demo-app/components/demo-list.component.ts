import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Demo, DemoService } from '../services/demo.service';

import { URLSearchParams } from 'app/core/';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  templateUrl: "./demo-list.component.html"
})
export class DemoListComponent implements OnInit {

  query: Demo;
  //初始化对象
  pDemos: Observable<Demo[]>;

  list: Demo[];
  //服务注入
  constructor(private demoService: DemoService,
    private router: Router, private route: ActivatedRoute) {
  }

  private _searchTermSubject = new Subject<Demo>();

  //初始化的钩子
  ngOnInit() {
    //debugger;
    this.query = new Demo();
    let _query = this.route.snapshot.queryParams;
    for (let key in _query) {
      this.query[key] = _query[key]
    }

    // this.pDemos = this.initData(this.query);//直接发请求初始化数据

    this.pDemos = this._searchTermSubject
      .debounceTime(300)//延迟300秒，防止重复执行
      // .distinctUntilChanged()
      .switchMap((term: any) => {
        return this.initData(term)
      });

      // 直接请求无法立即执行，延后操作即可
      // this._searchTermSubject.next(this.query);
      setTimeout(() => this._searchTermSubject.next(this.query));
      this.list = [];
  }

  delOne(demo) {
    this.demoService.deleteDemo(demo.id).then(() => {
      this._searchTermSubject.next(this.query);
    })
  }
  search() {

      this._searchTermSubject.next(this.query);
      this.router.navigate(["./"], { queryParams: this.query, relativeTo: this.route });

  }
  // search(){
  //   this.initData(this.query);
  //   this.router.navigate(["./"],{queryParams:this.query,relativeTo: this.route });
  //   // this.location.go(this.location.path(),_query.toString());
  // }
  initData(query) {
    //debugger
    let searchParams = new URLSearchParams();
    for (let key in query) {
      if (query[key]) {
        searchParams.set(key, query[key]);
      }
    }
    return this.demoService.getDemoes(searchParams);
  }
}
