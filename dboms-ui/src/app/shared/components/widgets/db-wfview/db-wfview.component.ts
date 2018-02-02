import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'db-wfview',
  templateUrl: './db-wfview.component.html',
  styleUrls: ['./db-wfview.component.scss']
})
export class DbWfviewComponent implements OnInit {

  /**
   * 流程进度数据
   */
  _wfProgressData: Array<any>;

  constructor() { }

  ngOnInit() {

  }
  onInitData(wfProgressData: Array<any>) {
    if (!!wfProgressData) {
      this._wfProgressData = this._onFilterData(wfProgressData);
    }
  }

  _onFilterData(wfProgressData: Array<any>) {
    let newArray: Array<any> = [];
    let temp: boolean = false;
    if (wfProgressData.length > 0) {
      wfProgressData.map(function (item) {
        if (item.IsShow) {
          newArray.push(item);
        } else {
          return;
        }
      });
    }
    if (newArray.length > 0) {
      let currentItem;
      newArray.map(function (item) {
        let index = newArray.indexOf(currentItem);
        if (!item.IsAlready && index ==-1) {
          item.isCurrent = true;
          currentItem = item;
        }
      });
    }
    return newArray;
  }


}
