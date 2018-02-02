import { Component, OnInit } from '@angular/core';
import { Person } from "app/shared/index"

@Component({
  templateUrl: 'test-page.component.html'
})
export class TestPageComponent implements OnInit {
  private list = [{ "userID": "ff8080815711889a01576572cf252b61", "createDate": 1474875805000, "lastModifiedDate": 1479278496000, "org": "ff8080815711889a01576572cb5f2b2f", "createBy": null, "lastModifiedBy": null, "prefixId": "p-ff8080815711889a01576572cf252b61", "userEN": "dengyang", "personNo": null, "userCN": "邓杨", "enname": null, "pinyin": "deng yang", "pinyinPrefix": "d", "shortname": null, "position": null, "joindate": null, "sex": true, "hometown": null, "mobile": "13501036540", "telephone": "01082705557", "fax": null, "email": "dengyang@digitalchina.com", "signature": "你好，iquicker", "qualifications": null, "bankCard": null, "status": 1, "statusReason": null, "innerEmail": null, "innerEmailContact": null, "type": 0, "isTrialAccount": null, "department": null, "createTime": 1474875805000, "joinTime": 1474875805000 }];
  private list1 =[];
  constructor() {}
  ngOnInit() {
  }

  func(pageObj){
    // {pageSize:,pageNo:};
    console.log(pageObj);
    this.func1({pageSize:10,pageNo:54});
  }
  func1({pageSize:size,pageNo:no}){
    console.log(size,no);
  }

}
