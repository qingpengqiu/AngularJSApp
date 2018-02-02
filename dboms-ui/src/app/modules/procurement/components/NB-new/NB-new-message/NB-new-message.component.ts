import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SubmitMessageService } from '../../../services/submit-message.service';
import { HttpServer } from 'app/shared/services/db.http.server';
import { WindowService } from 'app/core';
import { NgForm, NgModel } from "@angular/forms";
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { ProcurementTemplateService } from './../../../services/procurement-template.service';

// import {FORM_DIRECTIVES} from '@angular/forms';
@Component({
    selector: "NB-new-message",
    templateUrl: 'NB-new-message.component.html',
    styleUrls: ['NB-new-message.component.scss']
})
export class NBNewmessageComponent implements OnInit {
    @Input()
    set saveData(data) {
        if (data) {
            this.ExtendObject(data, this.baseSaveInfo);
            this.avtiveCur = [{
                id: this.baseSaveInfo.CurrencyCode,
                text: this.baseSaveInfo.Currency
            }];
            this.activeTax = [{
                id: this.baseSaveInfo.RateCode,
                text: this.baseSaveInfo.RateName
            }];
            this.baseSaveInfo.CompanyName = data.CompanyName;
            this.baseSaveInfo.CompanyCode = data.CompanyCode;
            this.baseSaveInfo.FactoryCode = data.FactoryCode;
            if(this.baseSaveInfo.VendorNo&&this.baseSaveInfo.FactoryCode){
                let coreUrl = "PurchaseManage/GetVendorClass"+"/"+this.baseSaveInfo.FactoryCode+"/"+this.baseSaveInfo.VendorNo;
                this.dbHttp.get(coreUrl).subscribe(data => {
                    if (data.Result) {
                        let localData = data.Data;
                        if(localData=="非核心"){
                            this.IsMid=true;
                        }else{
                            this.IsMid=false;
                        }
                        this.isCore.emit(this.IsMid);
                    }
                })
            }
            if(this.baseSaveInfo.TemplateID){//获取模板名称
                this.procurementTemplateService.getProcurementTplOne(this.baseSaveInfo.TemplateID).then(data=>{
                    if(data.Result){
                        this.TemplateName=data.Data.Name;
                    }
                })
            }
            // this.baseSaveInfo.preselldate = this.SubmitMessageService.ChangeDateFormat(this.baseSaveInfo.preselldate);
            this.baseSaveData.emit(this.baseSaveInfo);
        }
    };
    @Output() IsRMBData = new EventEmitter();
    @Output() TaxrateData = new EventEmitter();
    @Output() baseSaveData = new EventEmitter();
    @Output() isCore = new EventEmitter();
    @Output() submitMassageRes = new EventEmitter();
    @Output() companycode = new EventEmitter();
    constructor(private WindowService: WindowService,
         private dbHttp: HttpServer,
        private SubmitMessageService: SubmitMessageService,
        private procurementTemplateService: ProcurementTemplateService) {

    }
    @ViewChild(NgForm)
    messageForm;//表单
    beforemessageFormId;//表单的前一步校验结果
    ngOnInit() {
        let NBType = window.localStorage.getItem("createNBType");
        if (NBType == "hasApply") {
            this.applyListLocalShow = true;
            //获取选中采购订单
            let applyListData = JSON.parse(window.localStorage.getItem("applyList"));
            console.log(applyListData);
            if (applyListData != undefined && applyListData != '') {
                this.baseSaveInfo.BusinessRange = applyListData[0].vendorbizscope,//对方业务范围
                this.baseSaveInfo.CompanyName = applyListData[0].company;
                this.baseSaveInfo.CompanyCode = applyListData[0].companycode;
                this.baseSaveInfo.RateValue = applyListData[0].taxrate
                this.baseSaveInfo.RateCode = applyListData[0].taxratecode;
                this.baseSaveInfo.RateName = applyListData[0].taxratename;
                this.baseSaveInfo.Currency = applyListData[0].currency;
                this.baseSaveInfo.CurrencyCode = applyListData[0].currencycode;
                this.baseSaveInfo.FactoryCode = applyListData[0].factory
                this.baseSaveInfo.Vendor = applyListData[0].vendor;
                this.baseSaveInfo.VendorNo = applyListData[0].vendorno;
                this.baseSaveInfo.VendorCountry = applyListData[0].VendorCountry;
                this.baseSaveInfo.TrackingNumber = applyListData[0].traceno;
                if(this.baseSaveInfo.VendorNo&&this.baseSaveInfo.FactoryCode){
                    let coreUrl = "PurchaseManage/GetVendorClass"+"/"+this.baseSaveInfo.FactoryCode+"/"+this.baseSaveInfo.VendorNo;
                    this.dbHttp.get(coreUrl).subscribe(data => {
                        if (data.Result) {
                            let localData = data.Data;
                            if(localData=="非核心"){
                                this.IsMid=true;
                            }else{
                                this.IsMid=false;
                            }
                            this.isCore.emit(this.IsMid);
                        }
                    })
                }
                let localVendorNo;
                localVendorNo=0+Number(this.baseSaveInfo.VendorNo);
                localVendorNo=JSON.stringify(localVendorNo);
                if(localVendorNo.substring(0,2)=="10"){
                    this.IsCenter = true;
                }else{
                    this.IsCenter = false;
                }
                this.companycode.emit(this.baseSaveInfo.CompanyCode);//返回公司代码-流程
            }
            this.avtiveCur = [{
                id: this.baseSaveInfo.CurrencyCode,
                text: this.baseSaveInfo.Currency
            }];
            this.activeTax = [
                {
                    id: this.baseSaveInfo.RateCode,
                    text: this.baseSaveInfo.RateName
                }
            ]
            this.baseSaveData.emit(this.baseSaveInfo);
        }
        this.getBaseInfo();
        let headers = new Headers({ 'Content-Type': 'application/json', 'ticket': localStorage.getItem('ticket') });
        let options = new RequestOptions({ headers: headers });
        this.dbHttp.get("base/GetCurrentUserInfo", options).subscribe(data => {//获取登录人信息
            if (data.Result) {
                this.bizdivision = JSON.parse(data.Data).SYBMC;
            }
        })
    }
    applyListLocalShow=false;//是否有采购申请
    //模板
    public bizdivision;
    public showIndex = "13"
    public TemplateName;
    public getTemplate(e) {
        console.log(e);
        let localDate = e;
        this.TemplateName = e[1];
        this.activeTax = [{
            id: localDate[6],
            text: localDate[7]
        }];
        this.avtiveCur = [{
            id: localDate[10],
            text: localDate[9]
        }];
        if (localDate[10] == "RMB") {
            this.IsRMB = true;
        } else {
            this.IsRMB = false;
        }
        this.IsRMBData.emit(this.IsRMB);
        this.baseSaveInfo.TemplateID = e[0];
        this.baseSaveInfo.CompanyCode = localDate[2];
        this.baseSaveInfo.CompanyName = localDate[3];
        this.baseSaveInfo.VendorNo = localDate[5];
        this.baseSaveInfo.Vendor = localDate[4];
        this.baseSaveInfo.RateValue = localDate[8];
        this.baseSaveInfo.RateCode = localDate[6];
        this.baseSaveInfo.RateName = localDate[7];
        this.baseSaveInfo.Currency = localDate[9];
        this.baseSaveInfo.CurrencyCode = localDate[10];
        this.baseSaveInfo.FactoryCode = localDate[11];
        this.baseSaveInfo.VendorCountry = localDate[16];
        if(this.baseSaveInfo.VendorNo&&this.baseSaveInfo.FactoryCode){
            let coreUrl = "PurchaseManage/GetVendorClass"+"/"+this.baseSaveInfo.FactoryCode+"/"+this.baseSaveInfo.VendorNo;
            this.dbHttp.get(coreUrl).subscribe(data => {
                if (data.Result) {
                    let localData = data.Data;
                    if(localData=="非核心"){
                        this.IsMid=true;
                    }else{
                        this.IsMid=false;
                    }
                    this.isCore.emit(this.IsMid);
                }
            })
        }
        let localVendorNo;
        localVendorNo=0+Number(this.baseSaveInfo.VendorNo);
        localVendorNo=JSON.stringify(localVendorNo);
        if(localVendorNo.substring(0,2)=="10"){
            this.IsCenter = true;
        }else{
            this.IsCenter = false;
        }
        if (localVendorNo.substring(0, 2) != "40") {
            this.selectInfo.taxrate = [{ "id": "J1", "text": "J1--17% 进项税，中国", "other": 0.17 }, { "id": "JB", "text": "JB--6% 服务进项税，中国", "other": 0.06 }, { "id": "JC", "text": "JC--3% 服务进项税，中国", "other": 0.03 }]
        } else {
            this.selectInfo.taxrate = [{ "id": "J0", "text": "J0--0% 进项税，中国 ", "other": 0 }, { "id": "J1", "text": "J1--17% 进项税，中国", "other": 0.17 }, { "id": "JB", "text": "JB--6% 服务进项税，中国", "other": 0.06 }, { "id": "JC", "text": "JC--3% 服务进项税，中国", "other": 0.03 }]
        }
        this.baseSaveData.emit(this.baseSaveInfo);
    }
    //表单验证
    ngDoCheck() {
        if (this.messageForm.valid != this.beforemessageFormId) {//表单校验变化返回
            this.beforemessageFormId = this.messageForm.valid;
            this.submitMassageRes.emit(this.messageForm.valid);
        }
    }
    //获取基础数据
    getBaseInfo() {
        let Currencyurl = "InitData/GetCurrencyInfo";
        let Taxrateurl = "InitData/GetTaxrateInfo";
        this.dbHttp.post(Currencyurl).subscribe(data => {
            if (data.Result) {
                let locaData = JSON.parse(data.Data);
                this.selectInfo.currency = this.SubmitMessageService.onTransSelectInfosOther(locaData, "currencycode", "currencyname")
            }
            else {
                this.WindowService.alert({ message: '接口异常', type: 'fail' });
            }
        })
        this.dbHttp.post(Taxrateurl).subscribe(data => {
            if (data.Result) {
                let locaData = JSON.parse(data.Data);
                this.selectInfo.taxrate = this.SubmitMessageService.onTransSelectInfos(locaData, "taxcode", "taxratename", "taxrate")
                console.log(this.selectInfo.taxrate);
            }
            else {
                this.WindowService.alert({ message: '接口异常', type: 'fail' });
            }
        })
    }
    //验证对方业务范围
    public checkVendorbizscope(e){
        if(e.length>4){
            this.WindowService.alert({ message: '请输入四位字符', type: 'warn' });
        }
        if(e.substring(2,4)!="01"){
            this.WindowService.alert({ message: '请检查业务范围，按‘XX01’格式填写', type: 'warn' });
        }
        this.baseSaveData.emit(this.baseSaveInfo)
    }
    //下拉框选择
    public IsRMB = false;//是否人民币
    public getCurrency(e) {
        if (e.text == "RMB") {
            this.IsRMB = true;
        } else {
            this.IsRMB = false;
        }
        this.baseSaveInfo.Currency = e.text;
        this.baseSaveInfo.CurrencyCode = e.id;
        this.IsRMBData.emit(this.IsRMB);
        this.baseSaveData.emit(this.baseSaveInfo);
    }
    //我方主体选中
    public CompanyChange(e) {
        this.baseSaveInfo.CompanyCode = e[1];
        this.baseSaveData.emit(this.baseSaveInfo);
        this.companycode.emit(this.baseSaveInfo.CompanyCode);
    }
    // 税率选中
    public getTaxrate(e) {
        if (e.id == "J0") {
            this.WindowService.alert({ message: '税率不允许选0', type: 'fail' });
        }
        for (let i = 0, len = this.selectInfo.taxrate.length; i < len; i++) {
            if (e.id == this.selectInfo.taxrate[i].id) {
                this.TaxrateData.emit(this.selectInfo.taxrate[i].other);
                this.baseSaveInfo.RateValue = this.selectInfo.taxrate[i].other;
            }
        }
        this.baseSaveInfo.RateName = e.text;
        this.baseSaveInfo.RateCode = e.id
        this.baseSaveData.emit(this.baseSaveInfo);
    }

    //供应商选中
    public IsMid = false;
    public IsCenter = false;//10开头
    public TaxrateFlag = false;//税率是否disabled
    public VendorChange(e) {//供应商选中
        let data = [
            {
                id: e[3],
                text: e[2]
            }
        ]
        this.avtiveCur = data;
        this.baseSaveInfo.Currency = e[2];
        this.baseSaveInfo.VendorNo = e[1];
        this.baseSaveInfo.Vendor = e[0];
        this.baseSaveInfo.CurrencyCode = e[3];
        this.baseSaveInfo.paymentterms = e[4];
        this.baseSaveInfo.paymenttermscode = e[5];
        this.baseSaveInfo.VendorCountry = e[6];
        this.IsRMB = true;
        if (this.baseSaveInfo.VendorCountry == "1") {
            this.activeTax = [{
                id: "J0",
                text: "J0--0% 进项税，中国 "
            }];
            this.baseSaveInfo.RateValue = 0;
            this.baseSaveInfo.RateCode = "J0";
            this.baseSaveInfo.RateName = "J0--0% 进项税，中国 ";
            this.TaxrateFlag = true;
        } else {
            this.TaxrateFlag = false;
        }
        if(this.baseSaveInfo.VendorNo&&this.baseSaveInfo.FactoryCode){
            let coreUrl = "PurchaseManage/GetVendorClass"+"/"+this.baseSaveInfo.FactoryCode+"/"+this.baseSaveInfo.VendorNo;
            this.dbHttp.get(coreUrl).subscribe(data => {
                if (data.Result) {
                    let localData = data.Data;
                    if(localData=="非核心"){
                        this.IsMid=true;
                    }else{
                        this.IsMid=false;
                    }
                    this.isCore.emit(this.IsMid);
                }
            })
        }
        let localVendorNo;
        localVendorNo=0+Number(this.baseSaveInfo.VendorNo);
        localVendorNo=JSON.stringify(localVendorNo);
        if(localVendorNo.substring(0,2)=="10"){
            this.IsCenter = true;
        }else{
            this.IsCenter = false;
        }

        if (localVendorNo.substring(0, 2) != "40") {
            this.selectInfo.taxrate = [{ "id": "J1", "text": "J1--17% 进项税，中国", "other": 0.17 }, { "id": "JB", "text": "JB--6% 服务进项税，中国", "other": 0.06 }, { "id": "JC", "text": "JC--3% 服务进项税，中国", "other": 0.03 }]
            if(this.baseSaveInfo.RateValue==0){//如果是J0 则置空
                this.activeTax = [{
                    id: "",
                    text: ""
                }];
                this.baseSaveInfo.RateValue = null;
                this.baseSaveInfo.RateCode = "";
                this.baseSaveInfo.RateName = "";
            }
        } else {
            this.selectInfo.taxrate = [{ "id": "J0", "text": "J0--0% 进项税，中国 ", "other": 0 }, { "id": "J1", "text": "J1--17% 进项税，中国", "other": 0.17 }, { "id": "JB", "text": "JB--6% 服务进项税，中国", "other": 0.06 }, { "id": "JC", "text": "JC--3% 服务进项税，中国", "other": 0.03 }]
            this.baseSaveInfo.RateValue = 0;
            this.baseSaveInfo.RateCode = "J0";
            this.baseSaveInfo.RateName = "J0--0% 进项税，中国 ";
        }

        this.IsRMBData.emit(this.IsRMB);
        this.baseSaveData.emit(this.baseSaveInfo);
    }
    public avtiveCur;
    public activeTax;
    //时间
    public messageDate;
    public getMessageDate(e) {
        this.baseSaveData.emit(this.baseSaveInfo);
    }
    //下拉框数据
    public selectInfo = {
        company: [],
        vendor: [],
        taxrate: [],
        currency: []
    }
    //基础信息
    public baseSaveInfo = {
        TemplateID :null,//模板id
        CompanyName: "",//公司名称
        CompanyCode: "",//公司代码
        FactoryCode: "",//工厂编号
        Vendor: "",//供应商名称
        VendorNo: null,//供应商代码
        BusinessRange: "",//对方业务范围
        RateCode: "",//税率在ERP中的标识
        RateName: "",//税率显示名称 
        RateValue: null,//税率值，两位小数
        Currency: "",//币种
        CurrencyCode: "",//币种编码
        TrackingNumber: "",//需求跟踪号
        paymentterms: '',
        paymenttermscode: '',
        VendorCountry: ''
    };
    //发送父组件
    public sendData() {
        this.baseSaveData.emit(this.baseSaveInfo)
    }
    public sendtraceno(e) {
        let reg = /^[A-Za-z0-9]+$/;
        if (!reg.test(e)) {
            this.WindowService.alert({ message: '只允许输入数字和26位英文字符', type: 'success' });
        }
        if (e.length > 10) {
            this.WindowService.alert({ message: '位数不能超过10位', type: 'success' });
        }
        this.baseSaveInfo.TrackingNumber = this.baseSaveInfo.TrackingNumber.toUpperCase();
        this.baseSaveData.emit(this.baseSaveInfo)
    }
    public sendDataFour(e) {
        // this.SubmitMessageService.checkFour(e);
        this.baseSaveInfo.FactoryCode = this.baseSaveInfo.FactoryCode.toUpperCase();
        let endOne = e.substring(0, 2);
        let endTwo = this.baseSaveInfo.CompanyCode.substring(2, 4);
        if (endOne != endTwo) {
            this.WindowService.alert({ message: '工厂代码前两位不等于我方主体的后两位，请检查', type: 'fail' });
        }
        if(this.baseSaveInfo.VendorNo&&this.baseSaveInfo.FactoryCode){
            let coreUrl = "PurchaseManage/GetVendorClass"+"/"+this.baseSaveInfo.FactoryCode+"/"+this.baseSaveInfo.VendorNo;
            this.dbHttp.get(coreUrl).subscribe(data => {
                if (data.Result) {
                    let localData = data.Data;
                    if(localData=="非核心"){
                        this.IsMid=true;
                    }else{
                        this.IsMid=false;
                    }
                    this.isCore.emit(this.IsMid);
                }
            })
        }
        this.baseSaveData.emit(this.baseSaveInfo);
    }
    //对象数据转换方法
    public ExtendObject(a, b) {
        for (let i in a) {
            for (let n in b) {
                if (i == n) {
                    b[n] = a[i]
                }
                // else {
                //     b[i] = a[i]
                // }
            }
        }
    }
}