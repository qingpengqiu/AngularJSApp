import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { UserInfo,InvoiceInfo,RestInfo,Query} from "../../components/apply/invoice/invoice-info";
import { environment_java } from "../../../../../environments/environment";

@Injectable()
export class InvoiceApproveService {
    private headers = new Headers({'Content-Type': 'application/json'});
    constructor(
        private http: Http
    ){}

    /**
     * 获取审批列表
     * @param query 
     */
    getApproveList(query: Query){
        let params : URLSearchParams =new URLSearchParams();
        params.set("invoiceStatus",query.invoiceStatus);
        params.set("param",query.keyWords);
        params.set("payee",query.payee);
        params.set("businessItcode",query.businessItcode);
        params.set("startDate",query.startDate);
        params.set("endDate",query.endDate);
        params.set("pageSize",query.pageSize+"");
        params.set("pageNo",query.pageNo+"");
        
        return this.http.get(environment_java.server+"invoice/invoice-pages",{search :params})
                   .toPromise()
                   .then(res => res.json());
    }
    
    /**
     * 审批申请单
     * @param ids 
     * @param invoiceStatus 
     */
    approveInvoice(ids:string,invoiceStatus:string){
        return this.http.put(environment_java.server+"invoice/invoice-approve/"+ids+"/"+invoiceStatus,{})
                   .toPromise()
                   .then(response=>response.json());
    }
    /**
     * 获取单个申请单信息
     * @param id 申请单id 
     */
    getInvoiceById(id: string){
        let params : URLSearchParams =new URLSearchParams();
        params.set("id",id);
        return this.http.get(environment_java.server+"invoice/invoice-retrieve",{search:params})
                   .toPromise()
                   .then(response => response.json());
    }
    
    /**
     * 修改一条申请单信息
     * @param invoice 
     */
    updateInvoice(invoice:InvoiceInfo){
       return this.http.put(environment_java.server+"invoice/invoice-update",invoice)
                .toPromise()
                .then(response =>response.json());
    }

    /**
     * 修改一条申请单信息
     * @param invoice 
     */
    reapplyInvoice(invoice:InvoiceInfo){
       return this.http.put(environment_java.server+"invoice/invoice-reapplyInvoice",invoice)
                .toPromise()
                .then(response =>response.json());
    }
    /**
     * 获取收款人列表
     * @param query 
     */
    getPayeeCountList(query){
        let params : URLSearchParams =new URLSearchParams();
        params.set("param",query.keyWords);
        params.set("invoiceStatus",query.invoiceStatus);
        params.set("businessItcode",query.businessItcode);
        params.set("payee",query.payee);
        params.set("startDate",query.startDate);
        params.set("endDate",query.endDate);
        return this.http.get(environment_java.server+'invoice/invoice-payeeCount',{search:params})
                        .toPromise()
                        .then(resp => resp.json());
    }

    /**
     * 获取商务接口人列表
     */
    getBusinessList(){
        return this.http.get(environment_java.server+'invoice/invoice-business')
                        .toPromise()
                        .then(resp => resp.json());
    } 
    /**
     * 获取收款人
     */
    getPayeeList(platform){
        let params : URLSearchParams =new URLSearchParams();
        params.set("platform",platform);
        return this.http.get(environment_java.server+'invoice/invoice-payee',{search:params})
                        .toPromise()
                        .then(resp => resp.json());
    } 
} 