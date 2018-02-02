import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SubmitMessageService } from '../../../services/submit-message.service';
import { HttpServer } from 'app/shared/services/db.http.server';
import { WindowService } from 'app/core';
import { NgForm, NgModel } from "@angular/forms";
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { ProcurementTemplateService } from './../../../services/procurement-template.service';
// import {FORM_DIRECTIVES} from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: "contractApply-submit-message",
    templateUrl: 'contractApply-submit-message.component.html',
    styleUrls: ['contractApply-submit-message.component.scss','./../../../scss/procurement.scss']
})
export class ContractApplySubmitMessageComponent implements OnInit {
    @Input()
    set saveData(data) {
        if (data) {
            this.ExtendObject(data, this.baseSaveInfo);
            this.avtiveCur = [{
                id: this.baseSaveInfo.currencycode,
                text: this.baseSaveInfo.currency
            }];
            if (this.baseSaveInfo.currency == "人民币") {
                this.IsRMB = true;
                this.IsRMBData.emit(this.IsRMB);
            } else {
                this.IsRMB = false;
                this.IsRMBData.emit(this.IsRMB);
            }
            this.activeTax = [{
                id: this.baseSaveInfo.taxratecode,
                text: this.baseSaveInfo.taxratename
            }];
            if (this.baseSaveInfo.vendorno && this.baseSaveInfo.factory) {//判断核心
                let coreUrl = "PurchaseManage/GetVendorClass" + "/" + this.baseSaveInfo.factory + "/" + this.baseSaveInfo.vendorno;
                this.dbHttp.get(coreUrl).subscribe(data => {
                    if (data.Result) {
                        let localData = data.Data;
                        if (localData == "非核心") {
                            this.IsMid = true;
                        } else {
                            this.IsMid = false;
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
            this.baseSaveInfo.preselldate = this.SubmitMessageService.ChangeDateFormat(this.baseSaveInfo.preselldate);
        }
    };
    @Input()
    set PurchaseRequisitionSaleContractListSTR(data) {//销售信息
        if (data) {
            let dataJson = JSON.parse(data);
            console.log(dataJson)
            this.baseSaveInfo.excludetaxmoney = 0;
            this.baseSaveInfo.taxinclusivemoney = 0;
            this.baseSaveInfo.foreigncurrencymoney = 0;
            for (let i = 0, len = dataJson.length; i < len; i++) {//重新计算总额
                this.baseSaveInfo.foreigncurrencymoney = this.baseSaveInfo.foreigncurrencymoney + Number(dataJson[i].foreigncurrencymoney);
                this.baseSaveInfo.excludetaxmoney = this.baseSaveInfo.excludetaxmoney + Number(dataJson[i].excludetaxmoney);
                this.baseSaveInfo.taxinclusivemoney = this.baseSaveInfo.taxinclusivemoney + Number(dataJson[i].taxinclusivemoney);
            }
            this.baseSaveData.emit(this.baseSaveInfo);
        }
    };
    @Output() IsRMBData = new EventEmitter();
    @Output() TaxrateData = new EventEmitter();
    @Output() baseSaveData = new EventEmitter();
    @Output() isCore = new EventEmitter();
    @Output() submitMassageRes = new EventEmitter();//表单验证信息
    @Output() FacVend = new EventEmitter();//工厂代码和供应商代码
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
        this.getBaseInfo();
        let headers = new Headers({ 'Content-Type': 'application/json', 'ticket': localStorage.getItem('ticket') });
        let options = new RequestOptions({ headers: headers });
        this.dbHttp.get("base/GetCurrentUserInfo", options).subscribe(data => {//获取登录人信息
            if (data.Result) {
                this.bizdivision = JSON.parse(data.Data).SYBMC;
            }
        })
    }
    public FacVendData = {//工厂代码和供应商代码
        factory: '',
        vendorno: ''
    };
    ngDoCheck() {
        if (this.messageForm.valid != this.beforemessageFormId) {//表单校验变化返回
            this.beforemessageFormId = this.messageForm.valid;
            this.submitMassageRes.emit(this.messageForm.valid);
        }
    }

    presellStartDate=moment(new Date()).format("YYYY-MM-DD");//预计销售时间的 开始时间
    public bizdivision;//搜索模板的查询条件--事业部
    public showIndex = "13"//页面显示第一列、第三列
    public TemplateName;//模板名称-供显示
    public getTemplate(e) {//获取模板返回
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
        this.baseSaveInfo.companycode = localDate[2];
        this.baseSaveInfo.company = localDate[3];
        this.baseSaveInfo.vendorno = localDate[5];
        this.baseSaveInfo.vendor = localDate[4];
        this.baseSaveInfo.taxrate = localDate[8];
        this.baseSaveInfo.taxratecode = localDate[6];
        this.baseSaveInfo.taxratename = localDate[7];
        this.baseSaveInfo.currency = localDate[9];
        this.baseSaveInfo.currencycode = localDate[10];
        this.baseSaveInfo.factory = localDate[11];
        this.baseSaveInfo.VendorCountry = localDate[16];
        if (this.baseSaveInfo.vendorno && this.baseSaveInfo.factory) {//判断核心
            let coreUrl = "PurchaseManage/GetVendorClass" + "/" + this.baseSaveInfo.factory + "/" + this.baseSaveInfo.vendorno;
            this.dbHttp.get(coreUrl).subscribe(data => {
                if (data.Result) {
                    let localData = data.Data;
                    if (localData == "非核心") {
                        this.IsMid = true;
                    } else {
                        this.IsMid = false;
                    }
                    this.isCore.emit(this.IsMid);
                }
            })
        }
        //更改流程
        this.FacVendData.factory = this.baseSaveInfo.factory;
        this.FacVendData.vendorno = this.baseSaveInfo.vendorno;
        this.FacVend.emit(this.FacVendData);

        let localvendorno = null;
        localvendorno = 0 + Number(this.baseSaveInfo.vendorno);
        localvendorno = JSON.stringify(localvendorno);
        if (localvendorno.substring(0, 2) == "10") {
            this.IsCenter = true;
        } else {
            this.IsCenter = false;
        }
        if (localvendorno.substring(0, 2) != "40") {
            this.selectInfo.taxrate = [{ "id": "J1", "text": "J1--17% 进项税，中国", "other": 0.17 }, { "id": "JB", "text": "JB--6% 服务进项税，中国", "other": 0.06 }, { "id": "JC", "text": "JC--3% 服务进项税，中国", "other": 0.03 }]
        } else {
            this.selectInfo.taxrate = [{ "id": "J0", "text": "J0--0% 进项税，中国 ", "other": 0 }, { "id": "J1", "text": "J1--17% 进项税，中国", "other": 0.17 }, { "id": "JB", "text": "JB--6% 服务进项税，中国", "other": 0.06 }, { "id": "JC", "text": "JC--3% 服务进项税，中国", "other": 0.03 }]
        }
        this.TaxrateData.emit(this.baseSaveInfo.taxrate);
        this.baseSaveData.emit(this.baseSaveInfo);
    }
    
    getBaseInfo() {//获取基础数据-币种和税率
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
            }
            else {
                this.WindowService.alert({ message: '接口异常', type: 'fail' });
            }
        })
    }
    public IsRMB = false;//是否人民币
    public IsMid = false;//是否非核心 true-非核心;false-核心
    public IsCenter = false;//是否10开头--“对方业务范围”是否显示标识
    public TaxrateFlag = false;//税率是否disabled
    public getCurrency(e) {//币种选择
        if (e.id == "RMB") {
            this.IsRMB = true;
        } else {
            this.IsRMB = false;
        }
        this.baseSaveInfo.currency = e.text;
        this.baseSaveInfo.currencycode = e.id;
        this.IsRMBData.emit(this.IsRMB);
        this.baseSaveData.emit(this.baseSaveInfo);
    }
    public CompanyChange(e) {//我方主体选中
        this.baseSaveInfo.companycode = e[1];
        this.baseSaveData.emit(this.baseSaveInfo);
        this.companycode.emit(this.baseSaveInfo.companycode);
    }
    public getTaxrate(e) {// 税率选中
        for (let i = 0, len = this.selectInfo.taxrate.length; i < len; i++) {
            if (e.id == this.selectInfo.taxrate[i].id) {
                this.TaxrateData.emit(this.selectInfo.taxrate[i].other);
                this.baseSaveInfo.taxrate = this.selectInfo.taxrate[i].other;
            }
        }
        this.baseSaveInfo.taxratename = e.text;
        this.baseSaveInfo.taxratecode = e.id
        this.baseSaveData.emit(this.baseSaveInfo);
    }

    public VendorChange(e) {//供应商选中
        let data = [
            {
                id: e[3],
                text: e[2]
            }
        ]
        this.avtiveCur = data;
        this.baseSaveInfo.currency = e[2];
        this.baseSaveInfo.vendorno = e[1];
        this.baseSaveInfo.vendor = e[0];
        this.baseSaveInfo.currencycode = e[3];
        this.baseSaveInfo.paymentterms = e[4];
        this.baseSaveInfo.paymenttermscode = e[5];
        this.baseSaveInfo.VendorCountry = e[6];
        if (this.baseSaveInfo.VendorCountry == "1") {
            this.activeTax = [{
                id: "J0",
                text: "J0--0% 进项税，中国 "
            }];
            this.baseSaveInfo.taxrate = 0;
            this.baseSaveInfo.taxratecode = "J0";
            this.baseSaveInfo.taxratename = "J0--0% 进项税，中国 ";
            this.TaxrateFlag = true;
        } else {
            this.TaxrateFlag = false;
        }
        //更改流程
        this.FacVendData.factory = this.baseSaveInfo.factory;
        this.FacVendData.vendorno = this.baseSaveInfo.vendorno;
        this.FacVend.emit(this.FacVendData);

        let localvendorno = null;
        localvendorno = 0 + Number(this.baseSaveInfo.vendorno);
        localvendorno = JSON.stringify(localvendorno);
        if (localvendorno.substring(0, 2) == "10") {
            this.IsCenter = true;
        } else {
            this.IsCenter = false;
        }
        if (localvendorno.substring(0, 2) != "40") {
            this.selectInfo.taxrate = [{ "id": "J1", "text": "J1--17% 进项税，中国", "other": 0.17 }, { "id": "JB", "text": "JB--6% 服务进项税，中国", "other": 0.06 }, { "id": "JC", "text": "JC--3% 服务进项税，中国", "other": 0.03 }]
            if(this.baseSaveInfo.taxrate==0){//如果是J0 则置空
                this.activeTax = [{
                    id: "",
                    text: ""
                }];
                this.baseSaveInfo.taxrate = null;
                this.baseSaveInfo.taxratecode = "";
                this.baseSaveInfo.taxratename = "";
            }
        } else {
            this.selectInfo.taxrate = [{ "id": "J0", "text": "J0--0% 进项税，中国 ", "other": 0 }, { "id": "J1", "text": "J1--17% 进项税，中国", "other": 0.17 }, { "id": "JB", "text": "JB--6% 服务进项税，中国", "other": 0.06 }, { "id": "JC", "text": "JC--3% 服务进项税，中国", "other": 0.03 }]
            this.baseSaveInfo.taxrate = 0;
            this.baseSaveInfo.taxratecode = "J0";
            this.baseSaveInfo.taxratename = "J0--0% 进项税，中国 ";
        }
        if (this.baseSaveInfo.vendorno && this.baseSaveInfo.factory) {//判断核心
            let coreUrl = "PurchaseManage/GetVendorClass" + "/" + this.baseSaveInfo.factory + "/" + this.baseSaveInfo.vendorno;
            this.dbHttp.get(coreUrl).subscribe(data => {
                if (data.Result) {
                    let localData = data.Data;
                    if (localData == "非核心") {
                        this.IsMid = true;
                    } else {
                        this.IsMid = false;
                    }
                    this.isCore.emit(this.IsMid);
                }
            })
        }
        this.IsRMB = true;
        this.IsRMBData.emit(this.IsRMB);
        this.TaxrateData.emit(this.baseSaveInfo.taxrate);
        this.baseSaveData.emit(this.baseSaveInfo);
    }
    public avtiveCur;//币种-当前选项
    public activeTax;//税率-当前选项
    //时间
    public messageDate;
    public getMessageDate(e) {//预计销售时间选择
        this.baseSaveData.emit(this.baseSaveInfo);
    }
    
    public selectInfo = {//下拉框数据
        company: [],
        vendor: [],
        taxrate: [],
        currency: []
    }
    
    public baseSaveInfo = {//基础信息
        TemplateID :null,//模板id
        companycode: '',
        company: '',
        factory: '',
        vendorno: null,
        vendor: '',
        vendorbizscope: "",
        taxrate: 0,
        taxratecode: "",
        taxratename: "",
        currency: '',
        currencycode: '',
        preselldate: null,
        foreigncurrencymoney: 0,
        excludetaxmoney: 0,
        taxinclusivemoney: 0,
        receiver: "",
        traceno: '',
        paymentterms: '',
        paymenttermscode: '',
        VendorCountry: '',
        internationaltradelocation: '',
        internationaltradeterms: ''
    };
  
    public sendtraceno(e) {//输入需求跟踪号后
        let reg = /^[A-Za-z0-9]+$/;
        if (!reg.test(e)) {
            this.WindowService.alert({ message: '只允许输入数字和26位英文字符', type: 'success' });
        }
        if (e.length > 10) {
            this.WindowService.alert({ message: '位数不能超过10位', type: 'success' });
        }
        this.baseSaveInfo.traceno = this.baseSaveInfo.traceno.toUpperCase();
        this.baseSaveData.emit(this.baseSaveInfo)
    }
    public sendData() {//返回数据
        this.baseSaveData.emit(this.baseSaveInfo)
    }
    
    public checkVendorbizscope(e) {//验证对方业务范围
        if (e.length > 4) {
            this.WindowService.alert({ message: '请输入四位字符', type: 'warn' });
        }
        if (e.substring(2, 4) != "01") {
            this.WindowService.alert({ message: '请检查业务范围，按‘XX01’格式填写', type: 'warn' });
        }
        this.baseSaveData.emit(this.baseSaveInfo)
    }
    public sendDataFour(e) {//工厂四位校验
        this.baseSaveInfo.factory = this.baseSaveInfo.factory.toUpperCase();
        let endOne = e.substring(0, 2);
        let endTwo = this.baseSaveInfo.companycode.substring(2, 4);
        if (endOne != endTwo) {
            this.WindowService.alert({ message: '工厂代码前两位不等于我方主体的后两位，请检查', type: 'fail' });
        }
        if (this.baseSaveInfo.vendorno && this.baseSaveInfo.factory) {//判断核心
            let coreUrl = "PurchaseManage/GetVendorClass" + "/" + this.baseSaveInfo.factory + "/" + this.baseSaveInfo.vendorno;
            this.dbHttp.get(coreUrl).subscribe(data => {
                if (data.Result) {
                    let localData = data.Data;
                    if (localData == "非核心") {
                        this.IsMid = true;
                    } else {
                        this.IsMid = false;
                    }
                    this.isCore.emit(this.IsMid);
                }
            })
        }
        this.baseSaveData.emit(this.baseSaveInfo)
        //更改流程
        this.FacVendData.factory = this.baseSaveInfo.factory;
        this.FacVendData.vendorno = this.baseSaveInfo.vendorno;
        this.FacVend.emit(this.FacVendData);
    }
    
    public ExtendObject(a, b) {//对象数据转换方法
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