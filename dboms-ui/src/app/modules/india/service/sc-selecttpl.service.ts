import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { HttpServer } from "../../../shared/services/db.http.server";
import { Observable } from "rxjs";
import { environment } from '../../../../environments/environment';
declare var window: any;

/**
 * 接口地址
 */
const api_ectemplate = "/E_Contract/GetECTemplate";
const api_getecf = "/E_Contract/GetECFavorites";
const api_delecf = "/E_Contract/DeleteECFavorite";
const api_getecfid = "/E_Contract/GetFavoriteContents";


export class EctplParams {
  public BizScope:	string = ""; //登录人业务范围
  public Domain:	string = "国内销售合同"; //领域
  public Category:	string = "硬件合同"; //合同类型
}
export class Ectpl{
  public TemplateID:	string; //—模板ID *
  public TemplateName:	string; //--模板名称
  public Category:	string ; //--类型
  public ApplyTo:	string; //—应用于 *
  public Domain:	string ; // --领域
}

export class OwntplParams {
  public Name:	string; //--我的私藏名称，若查询全部：Name = null
  public Owner:	string; //--私藏所有者ItCode
}
export class Owntpl {
  public Name:	string ; //--我的私藏名称
  public Owner:	string ; //--私藏所有者ItCode
  public Contents:	string ; //--我的私藏内容（JSON格式）
  public TemplateID:	string ; //--模板ID
  public ContractType:	string ; //--合同类型（硬件? 软件? 服务?）
}

@Injectable()
export class ScSelectService {
    constructor(private http: HttpServer) { }

    //页面加载时，分页组件会多调用一次获取数据，防止重复调用数据
    _flag = false;
    //设置请求头
    headers = new Headers({ 'ticket': window.localStorage.getItem('ticket') });
    options = new RequestOptions({ headers: this.headers });
    /**
     * 获取合同模板选择
     */
    get_ectemplate(params: any):Observable<any> {
        return this.http.post(api_ectemplate, params, this.options);
    }

    /**
    * 获取我的私藏
    */
    get_getEcfavorites(params: any):Observable<any> {
        return this.http.post(api_getecf, params, this.options);
    }

    /**
    * 删除我的私藏
    */
    del_delEcfavorites(params: any):Observable<any> {
        return this.http.post(api_delecf, params, this.options);
    }

    /**
    * 根据id查询我的私藏模板
    */
    get_getEcfavoritesId(params: any):Observable<any> {
        return this.http.post(api_getecfid+"/"+params, null, this.options);
    }

}
