import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../../../environments/environment';

//基础参数，新建供应商所含字段
export class SupplierData{
  vendorid:string;//主键自增(0为新增,>0为编辑)
  wfstatus:string;//0-草稿,1-主数据岗,2-已完成,7-已驳回
  vendor:string;//供应商名称
  vendorno:string;//供应商编号
  phone:string;//电话
  BBMC:string;//本部
  SYBMC:string;//事业部
  vendorcountry:number=null;//供应商类别(0-国内,1-国外)
  registeredaddress:string;//注册地址
  company:string;//公司名称
  companycode:string;//公司代码
  valueaddedtaxno:string;//增值税号或统一社会信用代码
  classnamecode:string;//供应商分类(1-核心,2-非核心,3-新产品)
  bankcountry:string;//银行国别
  bankcountrycode:string;//银行国别代码
  bankname:string;//银行名
  bankaccount:string;//银行账户
  accountgroup:string;//账户组
  paymentterms:string="";//付款条款名称
  paymenttermscode:string;//付款条款代码
  reconciliationaccount:string;//统驭科目
  internationaltradeterms:string="";//国际贸易条件
  internationaltradelocation:string="";//国际贸易地点
  currency:string="";//币种名称
  currencycode:string;//币种代码
  AccessoryList:AccessoryList[]=[];//附件上传数组  
}
//附件上传数组
export class AccessoryList{
  AccName:string;//附件名称
  AccURL:string;//附件地址
  AccType:string;//附件类型
}

//查询我的申请接口参数
export class QueryMyApply{
  keyWord:string;//查询关键词
  ApplicationState:string;//申请状态
  PageNo: number;//页码
  PageSize: number;//每页显示多少
}

//查询我的审批接口参数
export class QueryMyApproval{
  keyWord:string;//查询关键词
  ApplicationState:string;//申请状态
  PageNo: number;//页码
  PageSize: number;//每页显示多少
  TaskStatus:string;//审批状态
}

//获取公司代码列表
export class Company {
  querycontent: string;//查询参数
  PageNo: number;//页码
  PageSize: number = 10;//每页显示多少
}

//获取事业部
export class BusinessUnit{
  PageNo: number;//页码
  PageSize: number=10;//每页显示多少 
}

//查询供应商列表
export class SupplierList{
  SearchTxt:string;//供应商名称
  ApproveSection:string;//审批状态 0-草稿, 1-申请中,2-已完成,3-全部
  PageNo:string;//当前页码
  PageSize:string;//页大小
}



@Injectable()
export class SupplierService {

  constructor(private http: Http) { }

  //获取公司代码列表
  getCompany(company:any){
    return this.http.post(environment.server+"InitData/GetPageDataCompany", company).toPromise().then(response => response.json());   
  }

  //获取申请人的基本信息
  getPersonInformation(){
    return this.http.get(environment.server + "base/GetCurrentUserInfo").toPromise().then(response=>response.json());
  }

  //获取申请人的联系方式
  getPersonPhone(){
    return this.http.get(environment.server+"InitData/GetCurrentUserPhone").toPromise().then(response => response.json());     
  }

  //提交和暂存
  supplierSave(supplierData:any){
   return this.http.post(environment.server+"vendor/add",supplierData).toPromise().then(response=>response.json());
  }

  //获取币种接口
  getCurrency(){
    return this.http.post(environment.server+"base/basedata/GetCurrency","").toPromise().then(Response=>Response.json());
  }

  //查询供应商列表
  searchSupplierLIst(searchData:any){
    return this.http.post(environment.server+"vendor/list",searchData).toPromise().then(Response=>Response.json());
    
  }

}