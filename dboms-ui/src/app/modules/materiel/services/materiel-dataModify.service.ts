import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Http, URLSearchParams, RequestOptions,Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// export class Query {
//   pageNo: string;
//   pageSize: string;
// }

@Injectable()

export class Query {
  MaterialERPCode: string;//物料ERP编号
  ApplyName: string;//申请人姓名
  Factory: string;//工厂
  BeginDate:string="";//开始时间
  EndDate:string="";//结束时间
  MarketingOrganizationName:string;//销售组织
  ApplicationState:string="1";//审核状态
  PageSize:number;
  PageNo:number=1;
}

export class MaterielData {
  ID:string;//主键ID
  MaterialDescription: string;//物料描述-中文
  MaterialDescriptionCN_Old:string;//物料中文描述（原始）
  MaterialDescriptionEN: string;//物料描述-英文
  MaterialDescriptionEN_Old:string;//物料英文描述（原始）
  SupplyMaterialNumber: string;//供应商物料编号
  SupplyMaterialNumber_Old:string;//供应商物料编号（原始）
  MaterialERPCode:string;//物料ERP编号
  Factory:string;//工厂
  Factory_Old:string;//工厂（原始）
  FactoryName:string;//工厂名称
  FactoryName_Old:string;//工厂名称（原始）
  Brand:string;//品牌
  BrandName:string;//品牌名称
  BrandName_Old:string;//品牌名称（原始）
  ProductLevel:string;//产品层次
  ProductLevelName:string;//产品层次名称
  ProductLevelName_Old:string;//产品层次名称（原始）
  TaxClassifications:string;//税码
  TaxClassificationsName:string;//税码名称
  TaxClassificationsName_Old:string;//税码名称（原始）
  SerialNumParameter:string;//序列号参数
  SerialNumParameterName:string;//序列号参数名称
  SerialNumParameterName_Old:string;//序列号参数名称（原始）
  AvailabilityChecking:string;//可用性检查
  AvailabilityCheckingName:string;//可用性检查名称
  AvailabilityCheckingName_Old:string;//可用性检查名称(原始)
  SalesUnit:string;//销售单位
  SalesUnitName:string;//销售单位名称
  SalesUnitName_Old:string;//销售单位名称(原始)
  IsBatchManage:any;//批次管理标识
  IsBatchManageName:any;//批次名称
  BatchCode:string;//批次码
  BatchCode_Old:string;//批次码（原始）
  MovingAveragePrice:string;//移动平均价
  MovingAveragePrice_Old:string;//移动平均价（原始）
  IsSpecifications:any;//规格型号标识
  Specifications:string;//规格型号
  Specifications_Old:string;//规格型号(原始)
  ApplyITCode:string;//申请人ITCode
  ApplyName:any;//申请人名称
  ApplicationState:string;//审核状态:0-草稿,1-提交申请,2-已完成,3-驳回
  ApplicationStateName:string;//审核状态
  applicantInformation:any;//用来保存申请的所有信息
  history:any;//用来保存审批历史记录
  InstanceId:string;//流程实例ID
  TempNodeName:string;//审批环节
  TaxClassifications_Old:string;
  SerialNumParameter_Old:string;

}

export class DelDataModify{//删除
 
  ID:string;//主键ID

}

export class DetailData{//详情

  ID:string;//主键ID


}

export class SearchOriginalData{
  MaterialERPCode:string;
  //Factory:string;
  Factory_Old:string;
}

export class ApprovalListData{//审批流程数据列表
  //ApplyITCode	:string;//审批人Itcode
  PageSize:number;
  PageNo:number=1;
  TaskStatus:string="0";//查询筛选（0:未处理,1:已处理,2:全部）
  MaterialERPCode:string;//物料ERP编号
  Factory:string;//工厂
  ApplyName:string;//申请人
  MarketingOrganizationName:string;//销售组织名称
  BeginDate:string="";//开始时间
  EndDate:string="";//结束时间

}


export class ExamineState{//进入审批流程（同意or驳回）
  ID:string;//主键ID
  TaskId:string;//任务ID
  ApproveITCode:string;//审批人ITCode
  TaskOpinion:string;//审批意见
  ApproveResult:string;//审批结果
}




@Injectable()
export class MaterielDataModifyService {

  constructor(private http: Http){}

  //搜索
  searchDataModify(searchData: any){
    let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(environment.server + "/materialmodify/list", searchData,options)
                    .toPromise()
                    .then(response => response.json())
  }

  //删除
  deleteDataModify(delData: any){
    let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(environment.server + "/materialmodify/del", delData,options)
                    .toPromise()
                    .then(response => response.json())
  }

  //详情
  detailData(detailData: any){
    let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(environment.server + "/materialmodify/detail", detailData,options)
                    .toPromise()
                    .then(response => response.json())
  }

  //搜索原始数据
  searchOriginalData(sod: any) {
    let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(environment.server + "/materialmodify/originalmaterial/detail", sod,options)
      .toPromise()
      .then(response => response.json())
  }

  tempSaveData(saveData:any){//暂存
    let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(environment.server + "/materialmodify/repository", saveData,options)
    .toPromise()
    .then(response => response.json())
  }

  //审批数据列表
  searchAppListData(appData:any){
    let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(environment.server + "/materialmodify/approveinfo", appData,options)
    .toPromise()
    .then(response => response.json())
  }

  //进入审批流程（同意or驳回）
  examineFlow(exData:any){
    let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(environment.server + "/materialmodify/approve", exData,options)
    .toPromise()
    .then(response => response.json())
  }

}
