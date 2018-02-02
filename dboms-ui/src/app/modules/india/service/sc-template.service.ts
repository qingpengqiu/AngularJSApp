import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { HttpServer } from "../../../shared/services/db.http.server";
import { Observable } from "rxjs";
import { environment } from 'environments/environment';
declare var window: any;

/**  接口地址 */
const ConvertEContractUrl = "/E_Contract/ConvertEContract";
const SaveEContractUrl = "/E_Contract/SaveEContract";
const DeleteEContractUrl = "/E_Contract/DeleteEContract";
const SaveTemplateUrl = "/E_Contract/SaveECFavorite";
const GetMyTemplateUrl = "/E_Contract/GetFavoriteContents";
const GetContractCodeUrl = "/E_Contract/CreateECCode";
const GetDisputeDealtUrl = "/E_Contract/GetECDisputeDealtType";
export const getECPackageResultUrl = "E_Contract/ECPackageResult/";//获取下拉框数据 卖方和票据
export const getProvinceCityInfoUrl = "InitData/GetProvinceCityInfo";//获取下拉框数据 省 市 区县
export const getEContractUrl = "E_Contract/GetEContract/";//获取电子合同信息
export const getERPCompanyInfoUrl = "E_Contract/GetERPCompanyInfo/";//获取买方信息
export const getBuyerInfoUrl = "E_Contract/GetBuyerInfo/";//获取买方列表

@Injectable()
export class ScTemplateService {
    constructor(private http: HttpServer) { }
    //设置请求头
    headers = new Headers({ 'ticket': window.localStorage.getItem('ticket') });
    options = new RequestOptions({ headers: this.headers });

    /**
     * 下一步
     */
    convertEContract(body):Observable<any> {
        return this.http.post(ConvertEContractUrl, body, this.options);
    }

    /**
     * 暂存 预览
     */
    saveEContract(body):Observable<any> {
        return this.http.post(SaveEContractUrl, body, this.options);
    }

    /**
     * 上一步(删除)
     */
    DeleteEContract(sc_code):Observable<any> {
        return this.http.post(DeleteEContractUrl + "/" + sc_code, null, this.options);
    }
    
    /**
     * 保存模板
     */
    saveTemplate(body):Observable<any> {
        return this.http.post(SaveTemplateUrl, body, this.options);
    }

    /**
     * 获取我的私藏模板数据
     */
    getMyPrivateTemplate(id):Observable<any> {
        return this.http.post(GetMyTemplateUrl + "/" + id, null, this.options);
    }

    /**
     * 获取合同编码
     */
    getContractCode(sellerCompanyCode):Observable<any> {
        return this.http.post(GetContractCodeUrl + "/" + sellerCompanyCode, null, this.options);
    }

    /**
     * 获取争议解决方式
     */
    getDisputeDealtInfo(params):Observable<any> {
        return this.http.post(GetDisputeDealtUrl, params, this.options);
    }/**
     * 获取下拉框数据（卖方和票据信息）
     */
    getECPackageResult(bizScopeCode): Observable<any> {
        return this.http.post(getECPackageResultUrl + bizScopeCode,null, this.options);
    }
    /**
     * 获取下拉框数据（省 市 区县）
     */
    getProvinceCityInfo(): Observable<any> {
        return this.http.post(getProvinceCityInfoUrl, null, this.options);
    }
    /**
     * 获取电子合同信息
     */
    getEContractInfo(sc_code): Observable<any> {
        return this.http.get(getEContractUrl + sc_code, this.options);
    }
    /**
     * 获取买方信息
     */
    getBuyerInfoByErpCode(erpCode): Observable<any> {
        return this.http.post(getERPCompanyInfoUrl + erpCode, null, this.options);
    }
    /**
     * 获取买方信息
     */
    getBuyerInfoByName(buyerName): Observable<any> {
        return this.http.post(getBuyerInfoUrl + buyerName, null, this.options);
    }

    






}
