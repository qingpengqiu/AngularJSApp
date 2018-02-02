import { Component, OnInit, Input, Output, forwardRef, ViewChild, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Subject } from 'rxjs/Subject';
import { Pager, XcBaseModal, XcModalService, XcModalRef } from 'app/shared/index';

import { Query, SelectSearchService } from '../../services/select-search.service';

@Component({
  templateUrl: 'select-search-dialog.component.html',
  styleUrls: ['./select-search-dialog.component.scss']
})
export class SelectSearchDialogComponent implements XcBaseModal, OnInit {
  query: Query = new Query(1,1);
  modal: XcModalRef;
  pagerData = new Pager();
  loading: boolean = false;
  optionList: any[] = [];
  columns: string[] = [];
  rows: any[] = [];

  constructor(
    private xcModalService: XcModalService,
    private selectSearchService: SelectSearchService) {}

  searchStream = new Subject<string>();

  ngOnInit() {
    this.modal = this.xcModalService.getInstance(this);
    this.modal.onShow().subscribe((query) => {
      this.query = query;
      this.loading = true;
      this.initData();
    });
  }

  initData(){
    this.selectSearchService.getOptionList(this.query).then(result => {
      if(result.success){
        this.loading = false;
        this.pagerData.set(result.data.pager);
        this.columns = result.data.columns;
        this.rows = result.data.rows;
      }
    })
  }

  onChangePager(e: any){
    this.query.queryStr = this.query.queryStr || "";
    this.query.pageNo = e.pageNo;
    this.query.pageSize = e.pageSize;

    this.initData();
  }

  hide(data?:any){
    this.modal.hide(data);

    //重置搜索条件
    this.query.queryStr="";
    console.log(this.query);
    
  }

  search(){
    this.query.pageNo=1;
    this.initData();
  }

  choose(item){
    this.hide(item);
  }

}
