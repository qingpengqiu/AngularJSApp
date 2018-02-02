import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'iq-newcreat',
  templateUrl: 'iq-newcreat.component.html',
  styleUrls: ['./iq-newcreat.component.scss'],
})
export class IqNewCreatComponent implements OnInit {
  list = [];
  public  changepage;
  constructor() {
  }
  @Input() dataCreat;
  public transformarrow(num) {
        this.changepage=num;
    };
  ngOnInit() {}
}

// 引用
// <iq-newcreat [dataCreat]=dataCreat></iq-newcreat>
//配置
// public dataCreat={
//         title:'我的申请',
//         list:[{
//             label:'新建冲红申请',
//             url:'/bill/creat',
//         },{
//             label:'新建退换货申请',
//             url:'/bill/return-new',
//         }],
//     };
