import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Http, URLSearchParams, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class Query {
  ApplyName: string = "";
  BeginDate: any;
  EndDate: any;
  ExtendType: string = "";
  MaterialCode: string = "";
  PageNo: number = 1;
  PageSize:number = 10;
}
export class MaterielInfo {
  SerialNumber: string;
  ApplyDate: string;
  ApplyName: string;
  ExtendType: string;
}

export class ExtendMaterl {
  SerialNumber: string;//序列号
  MaterialCode: string;//物料编号
  ExtendType: string;//扩展方式
  ReferFactory: string;//参考工厂
  ExtendFactory: string;//扩展工厂
  ExtendBatch: string;//扩展批次
  ExtendLocation: string;//扩展库存地
  isSucceed: boolean = false;//是否提交成功
  errorMsg: string;//失败原因
  editAble: boolean = true;//是否能修改

  constructor(data){
    this.MaterialCode = data.MaterialCode || "";
    this.SerialNumber = data.SN || "";
    this.ReferFactory = data.ReferFactory || "";
  }
}

@Injectable()
export class MaterielExtendMaterielService {

  constructor(private http: Http){}

  //获取扩展物料列表
  getMaterielList(query: any){
    let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(environment.server + "material/extension/list", query,options)
                    .toPromise()
                    .then(response => response.json())
  }

  //获取序列号及参考工厂
  getSerialNumber(code: string){
    let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(environment.server + "material/extension/sn/" + code,options)
                    .toPromise()
                    .then(response => response.json())
  }

  //保存扩展
  saveExtend(extendList: ExtendMaterl[]){
    let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(environment.server + "material/extension/repository", extendList,options)
                    .toPromise()
                    .then(response => response.json())
  }

  //删除扩展物料
  deleteMateriel(snList: string[]){
    let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(environment.server + "material/extension/del", snList,options)
                    .toPromise()
                    .then(response => response.json())
  }

  //获取物料详情
  getMaterielDetail(sn: string){
    let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(environment.server + "material/extension/detail", {SN: sn},options)
                    .toPromise()
                    .then(response => response.json())
  }

  //导入api
  importMaterielApi(){
    let userInfo=JSON.parse(localStorage.getItem('UserInfo'));
    
    let applyITCode = userInfo.ITCode;
    let applyName = userInfo.UserName;

    return environment.server + "material/extension/import"+`?applyITCode=${applyITCode}&&applyName=${applyName}`;

   // return environment.server + "material/extension/import";
  }
}
