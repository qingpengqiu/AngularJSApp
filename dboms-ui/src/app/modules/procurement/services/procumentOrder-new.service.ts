import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
declare var $: any;

export class Query { 
  public SortName: string;  //排序字段 默认addtime
  public SortType: string;     //升降序   默认desc （o或"desc" 降序  1或"asc" 升序）
  public TrackingNumber: string; //需求跟踪号
  public Vendor: string;         //供应商
  public ProjectName: string;    //项目名称
  public CustomerName: string;   //客户名称
  public PageIndex: string;         //默认1
  public PageSize: string;       //默认10
}
export class Rank {//可排序对象:none-表示不排序;desc-表示降序;asc-表示升序
  requisitionnum="none";  //申请单号
  ProjectName="none"; //项目名称
  vendor="none"; //供应商
  factory="none"; //工厂
  BuyerName="none"; //客户名称
  MainContractCode="none"; //合同号
  excludetaxmoney="none"; //合同采购申请金额
  available="none"; //合同可采购订单金额
}

@Injectable()
export class ProcumentOrderNewService {

  constructor(private http: Http) { }

  //获取采购申请列表
  getApplyList(query) {
    console.log(query);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(query);
    return this.http.post("api/PurchaseManage/MyRequisitionSaleContract",body, options)
      .toPromise()
      .then(response =>response.json().Data)
  }
}