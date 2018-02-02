import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { HttpServer } from "../../../shared/services/db.http.server";
import { Observable } from "rxjs";
import {
    SaleOrderInfo,
    AdvancesInfo,
    InvoiceInfo,
    AccoriesInfo,
    MaterialInfo,
 } from "./order-create.service";

/**
 * 接口地址
 */
export const downloadIp="http://10.0.1.26:88";
const contractRevokeUrl = "SaleOrder/GetApprHistoryAndProgress/";
export const contractAppUrl = "SaleOrder/ApproveSaleOrder";//同意、驳回审批接口地址
export const contractAddTaskUrl = "SaleOrder/AddApprovalTask";//加签审批接口地址
export const contractTransferUrl = "SaleOrder/HandOverApproval";//转办审批接口地址
export const contractSignUrl = "SaleOrder/ApproveAdditional";//审批加签
const getAppDataUrl = "SaleOrder/RevokeSaleOrderApproval/";
const isAutoDelyUrl = "SaleOrder/CheckOrderAutoDelivery/";//自动交货类型
const wrERPUrl = "SaleOrder/BusiApproveInsertERP";//自动交货类型

@Injectable()
export class OrderViewService {
    constructor(private http: HttpServer) { }
    //设置请求头
    headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    options = new RequestOptions({ headers: this.headers });
    /**
     * 获取销售合同审批历史及流程全景数据
     */
    contractRevoke(sc_code): Observable<any> {
        this.headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
        this.options = new RequestOptions({ headers: this.headers });
        return this.http.post(contractRevokeUrl + sc_code,{},this.options);
        // return this.http.post('S_Contract/GetApprHistoryAndProgress/733bb74c99364dd498833c6541056643');
    }

    /**
     * 撤销合同审批
     */
    getAppData(sc_code): Observable<any> {
        this.headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
        this.options = new RequestOptions({ headers: this.headers });
        return this.http.post(getAppDataUrl + sc_code,{},this.options);
    }
    //商务审批写入ERP时，先要检查销售单是否是自动交货类型。
    isAutoDelivery(sc_code): Observable<any>{
        this.headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
        this.options = new RequestOptions({ headers: this.headers });
        return this.http.post(isAutoDelyUrl+sc_code,{},this.options)
    }


    wrERPAuto(param): Observable<any>{
        this.headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
        this.options = new RequestOptions({ headers: this.headers });
        return this.http.post(wrERPUrl,param,this.options);
    }
}

export class OrderViewForm {
    SalesOrderData: SaleOrderInfo = new SaleOrderInfo();
    UnSalesAmount:any='';
    IsBackContract:any='';
    ListPrePayment:AdvancesInfo[] = [];//预收款
    AccessoryList:AccoriesInfo[] = [];//附件
    ReceiptData:InvoiceInfo[] = [];
    DeliveryData:DeliveryMaterialInfo[] = [];
}
//送达方与物料信息
export class DeliveryMaterialInfo{
    Deliverinfo: Deliverinfo = new Deliverinfo();
    MaterialList: MaterialInfo[] = [];
}
//送达方信息
export class Deliverinfo {
    SDFID: any = "";//送达方ID
    SDFName: any = "";//送达方名称
    SDFAddress  : any = "";//送达方地址
    SDFCode: any = "";
    AreaID: any = "";
    SDFCity: any = "";
    SDFDistrict: any = "";
    ERPOrderCode:any = "";
    IsDelegate:any = "";
}
