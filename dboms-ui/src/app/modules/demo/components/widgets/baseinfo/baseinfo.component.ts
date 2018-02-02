import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'iq-baseinfo',
  templateUrl: './baseinfo.component.html',
  styleUrls: ['./baseinfo.component.scss']
})
export class BaseinfoComponent implements OnInit {

  private baseInfo: BaseInfo = new BaseInfo(
    '赵金凤/zhaojf','2017-02-17','137***2314','2017-02-17',
    ['北京神州数码', '上海神州数码'],
    ['CB 华硕笔记本', 'RL 惠普激光打印机'],
    ['增值税专用发票', '增值税普通发票'],
    ['北京', '上海', '广州', '西安', '深圳', '总部'],
    ['发票票面信息更改','价格更改','发票类型更改','折让','系统冲红(不涉及外部发票)','其他情况冲红']
  );
  private isView: boolean = true;//是否查看页面
  private isCheck: boolean = false;//冲红类型 小类是否多选
  private reviseTypeChildren:Array<string> = [];
  constructor() { }

  ngOnInit() {
    
  }

  selected(value:any):void{
    if(value.text === "发票票面信息更改"){
      this.reviseTypeChildren = ['经工商局认定的客户名称变更','税号','账号\开户行\地址\电话','物料描述（物料号不变）','物料号'];
      this.isCheck = true;
    }else{
      this.reviseTypeChildren = ['合同约定', '商务手误'];
      this.isCheck = false;
    }
  }

}

export class BaseInfo{
  constructor(
    public applyItcode: string,
    public applyDate: string,
    public tel: string,
    public constCenter: string,
    public companys: Array<string>,
    public businesses: Array<string>,
    public invoicetypes: Array<string>,
    public platforms: Array<string>,
    public revisetypes:Array<string>
    ){}
}
export class ReviseTypes{
  constructor(
    public revisetypecode:string,
    public revisetype: string,
    public children: Array<string>
  ){}
}
