import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { HttpServer } from "../../../shared/services/db.http.server";
declare var window: any;

/**
 * 接口地址
 */
const getBaseDataListUrl = "InitData/BaseDataList";//下拉框数据源
const getUserInfoUrl = "InitData/GetUserInfo";//获取登陆人信息
const getUserPhoneUrl = "InitData/GetCurrentUserPhone";//获取登陆人信息
const getApplyDataUrl = "InvoiceRevise/GetApplyById/";//获取页面申请数据
const saveApplyUrl = "InvoiceRevise/SaveApply";//保存或提交数据
const delDescendantInfoUrl = "InvoiceRevise/DelDescendantInfo/";//删除财务及冲退明细信息
const getInvoiceByOrderNoUrl = "InvoiceRevise/GetInvoiceByOrderNo/";//查询财务系统发票号票面信息——根据订单号
const getInvoiceByExternalNoUrl = "InvoiceRevise/GetInvoiceByExternalNo/";//查询财务系统发票号票面信息——根据外部发票号
const getMaterialUrl = "InvoiceRevise/GetMaterial";//查询冲退物料明细信息、送达方信息接口——根据订单号
const getAccountAndPayDateUrl = "InvoiceRevise/GetAccountAndPayDate";//根据系统发票号获取首付基准日和清账号
const delInvoiceInfoByInvoiceIdUrl = "InvoiceRevise/DeleteInvoice/";//根据财务信息id删除发票信息
const getCustomerNameUrl = "InvoiceRevise/GetCustomerName/";//根据客户编号查询客户名称
const getMaterialDescUrl = "InvoiceRevise/GetMaterialDesc/";//根据物料号查询物料描述
const deleteMaterialUrl = "InvoiceRevise/DeleteMaterial/";//删除一条冲退物料明细
const deleAccessoryUrl = "InvoiceRevise/DeleAccessory/";//删除单个附件
const getApproveHistoryUrl = "InvoiceRevise/GetApproveHistory/";//获取审批历史数据接口和流程进度条信息
const approveChongHongUrl = "InvoiceRevise/ApproveChongHong";//冲红流程审批接口
@Injectable()
export class RedApplyService {
    constructor(private http: HttpServer) { }

    //设置请求头
    headers = new Headers({ 'ticket': window.localStorage.getItem('ticket') });
    options = new RequestOptions({ headers: this.headers });
    fileSerAddress = "http://10.0.1.26:88";//附件存储服务器
    uploadAccesslUrl = "api/InvoiceRevise/UploadIRAccessories";//上传附件地址
    /**
     * 下拉框数据源
     */
    getBaseDataList(): Observable<any> {
        return this.http.post(getBaseDataListUrl, null, this.options);
    }
    /**
     * 获取登陆人信息（没有电话）
     */
    getUserInfo(): Observable<any> {
        return this.http.post(getUserInfoUrl, null, this.options);
    }
    /**
     * 获取登陆人电话
     */
    getUserPhone(): Observable<any> {
        return this.http.get(getUserPhoneUrl, this.options);
    }
    /**
     * 获取页面申请数据
     */
    getApplyDataById(applyid): Observable<any> {
        return this.http.post(getApplyDataUrl + applyid, null, this.options);
    }
    /**
     * 提交申请信息（保存、提交）
     */
    saveApply(applydata): Observable<any> {
        return this.http.post(saveApplyUrl, applydata, this.options);
    }
    /**
     * 冲红流程审批接口
     */
    approveChongHong(body): Observable<any> {
        return this.http.post(approveChongHongUrl, body, this.options);
    }
    /**
     * 删除财务及冲退明细信息
     */
    delDescendantInfo(applyid): Observable<any> {
        return this.http.post(delDescendantInfoUrl + applyid, null, this.options);
    }
    /**
     * 查询财务系统发票号票面信息  根据外部发票号
     */
    getInvoiceByExternalNo(externalno): Observable<any> {
        return this.http.post(getInvoiceByExternalNoUrl + externalno, null, this.options);
    }
    /**
     * 查询财务系统发票号票面信息  根据订单号
     */
    getInvoiceByOrderNo(orderno): Observable<any> {
        return this.http.post(getInvoiceByOrderNoUrl + orderno, null, this.options);
    }
    /**
     * 查询冲退物料明细信息、送达方信息接口——根据订单号
     */
    getMaterial(param): Observable<any> {
        return this.http.post(getMaterialUrl, param, this.options);
    }
    /**
     * 根据系统发票号获取首付基准日和清账号
     */
    getAccountAndPayDate(param): Observable<any> {
        return this.http.post(getAccountAndPayDateUrl, param, this.options);
    }
    /**
     * 根据财务信息id删除发票信息
     */
    delInvoiceInfoByInvoiceId(invoiceid): Observable<any> {
        return this.http.post(delInvoiceInfoByInvoiceIdUrl + invoiceid, null, this.options);
    }
    /**
     * 根据客户编号查询客户名称
     */
    getCustomerName(customercode): Observable<any> {
        return this.http.post(getCustomerNameUrl + customercode, null, this.options);
    }
    /**
     * 根据物料号查询物料描述
     */
    getMaterialDesc(materialcode): Observable<any> {
        return this.http.post(getMaterialDescUrl + materialcode, null, this.options);
    }
    /**
     * 删除一条冲退物料明细
     */
    deleteMaterial(materialid): Observable<any> {
        return this.http.post(deleteMaterialUrl + materialid, null, this.options);
    }
    /**
     * 删除单个附件
     */
    deleAccessory(accessoryid): Observable<any> {
        return this.http.post(deleAccessoryUrl + accessoryid, null, this.options);
    }
    /**
     * 获取审批历史数据和流程进度条信息
     */
    getApproveHistory(applyid): Observable<any> {
        return this.http.post(getApproveHistoryUrl + applyid, null, this.options);
    }
}

/**
 * 
 */