// 预下单采购申请页面-采购信息
import { Component, OnInit,Input, Output, EventEmitter,DoCheck,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { NgForm, NgModel } from "@angular/forms";

import { WindowService } from 'app/core';
import * as moment from 'moment';
import { HttpServer } from 'app/shared/services/db.http.server';
import { PrepareApplyMessage } from './../../../services/prepareApply-submit.service';
import { SubmitMessageService } from '../../../services/submit-message.service';
import { ShareDataService } from './../../../services/share-data.service';
import { ProcurementTemplateService } from './../../../services/procurement-template.service';

@Component({
    selector: "prepareApply-submit-message",
    templateUrl: 'prepareApply-submit-message.component.html',
    styleUrls: ['prepareApply-submit-message.component.scss','./../../../scss/procurement.scss']
})
export class PrepareApplySubmitMessageComponent implements OnInit {
    TemplateName;//模板名称-供显示
    templateShowIndex = "13";//模板选择框 显示第一列、第三列
    bizdivision;//搜索模板的查询条件--事业部
    presellStartDate=moment(new Date()).format("YYYY-MM-DD");//预计销售时间的 开始时间
    activeTaxrate;//税率-当前选项
    avtiveCurrency;//币种-当前选项
    isRMB = false;//是否人民币
    supplierType="";//供应商类型
    taxrateDisabled = false;//税率是否disabled
    factoryPlaceStr="";//工厂的输入提示
    preApplyMessage=new PrepareApplyMessage();//采购信息 整体数据
    facVendData = {//工厂代码和供应商代码
        factory: '',
        vendorno: ''
    };
    isTenStart = false;//供应商代码 是否10开头 “对方业务范围”是否显示标识
    selectInfo = {//下拉框数据
        company: [],
        vendor: [],
        taxrate: [],
        currency: []
    }
    @ViewChild(NgForm)
    prepareApplyMessage;//表单
    beforePrepareApplyMessageValid;//表单的前一步校验结果

    @Input() set prepareApplyData(data) {//编辑状态下 读入预下单申请 的整体数据
        if (data["purchaserequisitionid"]) {
            for(let key in this.preApplyMessage){//数据拷贝
                this.preApplyMessage[key]=data[key];
            }
            this.avtiveCurrency = [{
                id: this.preApplyMessage.currencycode,
                text: this.preApplyMessage.currency
            }];
            if (this.preApplyMessage.currency == "人民币") {
                this.isRMB = true;
            } else {
                this.isRMB = false;
            }
            this.onIsRMBChange.emit(this.isRMB);
            this.activeTaxrate = [{
                id: this.preApplyMessage.taxratecode,
                text: this.preApplyMessage.taxratename
            }];
            this.judgeSupplier(this.preApplyMessage.vendorno,this.preApplyMessage.factory,null,"");
            if(this.preApplyMessage.TemplateID){//获取模板名称
                this.procurementTemplateService.getProcurementTplOne(this.preApplyMessage.TemplateID).then(data=>{
                    if(data.Result){
                        this.TemplateName=data.Data.Name;
                    }
                })
            }
            if(this.preApplyMessage.preselldate){
                this.preApplyMessage.preselldate = moment(this.preApplyMessage.preselldate).format("YYYY-MM-DD");
            }
        }
    };
    @Input() set excludeTaxMoney(data) {//未税总金额
        this.preApplyMessage.excludetaxmoney=data;
    }
    @Input() set taxInclusiveMoney(data) {//含税总金额
        this.preApplyMessage.taxinclusivemoney=data;
    }
    @Input() set foreignCurrencyMoney(data) {//外币总金额
        this.preApplyMessage.foreigncurrencymoney=data;
    }
    @Output() onPrepareApplyMessageValidChange = new EventEmitter<any>();//当 采购信息表单校验 变化
    @Output() onIsRMBChange = new EventEmitter();//当 是否人民币 变化
    @Output() onSupplierTypeChange = new EventEmitter();//当 供应商类型 变化
    @Output() onFacVendChange = new EventEmitter();//当 工厂代码和供应商代码 变化
    @Output() onTaxrateChange = new EventEmitter();//当 税率 变化
    @Output() onPreApplyMessageChange = new EventEmitter();//当 采购信息整体数据 变化
    @Output() onCompanyCodeChange = new EventEmitter();//当 公司代码(我方主体) 变化

    constructor(
        private windowService: WindowService,
        private dbHttp: HttpServer,
        private submitMessageService: SubmitMessageService,
        private shareDataService: ShareDataService,
        private procurementTemplateService: ProcurementTemplateService,
    ) { }
    ngDoCheck() {
        if (this.prepareApplyMessage.valid != this.beforePrepareApplyMessageValid) {//表单校验变化返回
            this.beforePrepareApplyMessageValid = this.prepareApplyMessage.valid;
            this.onPrepareApplyMessageValidChange.emit(this.prepareApplyMessage.valid);
        }
    }
    ngOnInit() {
        this.shareDataService.getCurrencySelectInfo().then(data => {//币种列表数据
            this.selectInfo.currency=data;
        })
        this.shareDataService.getTaxrateSelectInfo().then(data => {//税率列表数据
           this.selectInfo.taxrate=data;
        })
        this.shareDataService.getCurrentUserInfo().then(data => {//获取登录人信息
            this.bizdivision=data.SYBMC;
        })
    }

    public getTemplate(e) {//获取模板返回
        console.log("模板数据");
        console.log(e);
        let self=this;
        let judgeCallback=function(){//判断核心后的操作
            let templateDate = e;
            self.TemplateName = e[1];
            self.activeTaxrate = [{
                id: templateDate[6],
                text: templateDate[7]
            }];
            self.avtiveCurrency = [{
                id: templateDate[10],
                text: templateDate[9]
            }];
            if (templateDate[10] == "RMB") {//是否人民币
                self.isRMB = true;
            } else {
                self.isRMB = false;
            }
            self.onIsRMBChange.emit(self.isRMB);
            self.preApplyMessage.TemplateID = e[0];
            self.preApplyMessage.companycode = templateDate[2];
            self.preApplyMessage.company = templateDate[3];
            self.preApplyMessage.vendorno = templateDate[5];
            self.preApplyMessage.vendor = templateDate[4];
            self.preApplyMessage.taxrate = templateDate[8];
            self.preApplyMessage.taxratecode = templateDate[6];
            self.preApplyMessage.taxratename = templateDate[7];
            self.preApplyMessage.currency = templateDate[9];
            self.preApplyMessage.currencycode = templateDate[10];
            self.preApplyMessage.factory = templateDate[11];
            self.preApplyMessage.VendorCountry = templateDate[16];
            self.processChange();
            self.judgeIsTenStart();
            self.homeAbroadRateSet(false);
            self.onTaxrateChange.emit(self.preApplyMessage.taxrate);
            self.onPreApplyMessageChange.emit(self.preApplyMessage);
        }
        this.judgeSupplier(e[5],e[11],judgeCallback,"selectTpl");
    }
    CompanyChange(e) {//我方主体选中
        this.preApplyMessage.companycode = e[1];
        this.factoryPlaceStr="请输入"+this.preApplyMessage.companycode.substring(2, 4)+"xx";//工厂输入提示 修改
        this.onPreApplyMessageChange.emit(this.preApplyMessage);
        this.onCompanyCodeChange.emit(this.preApplyMessage.companycode);
    }
    factoryCheck(e) {//工厂格式校验
        if(e==""){
            return;
        }
        this.preApplyMessage.factory = this.preApplyMessage.factory.toUpperCase();
        let endOne = e.substring(0, 2);
        let endTwo = this.preApplyMessage.companycode.substring(2, 4);
        if (endOne != endTwo) {
            this.windowService.alert({ message: '工厂代码前两位不等于我方主体的后两位，请检查', type: 'fail' });
            this.preApplyMessage.factory="";
            return;
        }
        let self=this;
        let judgeCallback=function(){
            self.onPreApplyMessageChange.emit(self.preApplyMessage);
            self.processChange();
        }
        this.judgeSupplier(this.preApplyMessage.vendorno,this.preApplyMessage.factory,judgeCallback,"selectFactory");
    }
    VendorChange(e) {//供应商选中
        let self=this;
        let judgeCallback=function(){
            let data = [
                {
                    id: e[3],
                    text: e[2]
                }
            ]
            self.avtiveCurrency = data;
            self.preApplyMessage.currency = e[2];
            self.preApplyMessage.vendorno = e[1];
            self.preApplyMessage.vendor = e[0];
            self.preApplyMessage.currencycode = e[3];
            self.preApplyMessage.paymentterms = e[4];
            self.preApplyMessage.paymenttermscode = e[5];
            self.preApplyMessage.VendorCountry = e[6];
            self.homeAbroadRateSet(true);
            self.processChange();
            self.judgeIsTenStart();
            self.isRMB = true;
            self.onIsRMBChange.emit(self.isRMB);
            self.onTaxrateChange.emit(self.preApplyMessage.taxrate);
            self.onPreApplyMessageChange.emit(self.preApplyMessage);
        }
        this.judgeSupplier(e[1],this.preApplyMessage.factory,judgeCallback,"selectVendor");
    }
    checkVendorbizscope(e) {//验证对方业务范围
        if (e.substring(2, 4) != "01") {
            this.windowService.alert({ message: '请检查业务范围，按‘XX01’格式填写', type: 'warn' });
        }
        this.onPreApplyMessageChange.emit(this.preApplyMessage);
    }
    getTaxrate(e) {// 税率选中
        for (let i = 0, len = this.selectInfo.taxrate.length; i < len; i++) {
            if (e.id == this.selectInfo.taxrate[i].id) {
                this.onTaxrateChange.emit(this.selectInfo.taxrate[i].other);
                this.preApplyMessage.taxrate = this.selectInfo.taxrate[i].other;
            }
        }
        this.preApplyMessage.taxratename = e.text;
        this.preApplyMessage.taxratecode = e.id
        this.onPreApplyMessageChange.emit(this.preApplyMessage);
    }
    getCurrency(e) {//币种选择
        if (e.id == "RMB") {
            this.isRMB = true;
        } else {
            this.isRMB = false;
        }
        this.preApplyMessage.currency = e.text;
        this.preApplyMessage.currencycode = e.id;
        this.onIsRMBChange.emit(this.isRMB);
        this.onPreApplyMessageChange.emit(this.preApplyMessage);
    }
    sendtraceno(e) {//输入需求跟踪号后
        if(e==""){//为空不校验
            return;
        }
        let name="tracenoF";
        if(this.prepareApplyMessage.controls[name].invalid){//格式校验未通过
            this.windowService.alert({ message: '只允许输入数字和26位英文字符', type: 'success' });
            this.preApplyMessage.traceno="";
            return;
        }
        this.preApplyMessage.traceno = this.preApplyMessage.traceno.toUpperCase();//转大写
        this.onPreApplyMessageChange.emit(this.preApplyMessage);
    }
    sendData() {//返回数据
        this.onPreApplyMessageChange.emit(this.preApplyMessage);
    }
    processChange(){//更改流程
        this.facVendData.factory = this.preApplyMessage.factory;
        this.facVendData.vendorno = this.preApplyMessage.vendorno;
        this.onFacVendChange.emit(this.facVendData);
    }
    judgeSupplier(venStr,facStr,callback,scene){//判断供应商类型
        if (venStr && facStr) {
            let coreUrl = "PurchaseManage/GetVendorClass" + "/" + facStr + "/" + venStr;
            this.dbHttp.get(coreUrl).subscribe(data => {
                if (data.Result) {
                    this.supplierType = data.Data;
                    this.onSupplierTypeChange.emit(this.supplierType);
                    if(this.supplierType=="非核心"){//非核心
                        this.windowService.alert({ message:"预下单不允许选择非核心类型的供应商", type: 'success' });
                        switch(scene){//不同情况下 置空
                            case "selectTpl":
                                let excludetaxmoney=this.preApplyMessage.excludetaxmoney;//未税总金额
                                let taxinclusivemoney=this.preApplyMessage.taxinclusivemoney;//含税总金额
                                let foreigncurrencymoney=this.preApplyMessage.foreigncurrencymoney;//外币总金额
                                this.preApplyMessage=new PrepareApplyMessage();
                                this.preApplyMessage.excludetaxmoney=excludetaxmoney;
                                this.preApplyMessage.taxinclusivemoney=taxinclusivemoney;
                                this.preApplyMessage.foreigncurrencymoney=foreigncurrencymoney;
                                this.activeTaxrate = [{
                                    id: "",text: ""
                                }];
                                this.avtiveCurrency = [{
                                    id: "",text: ""
                                }];
                                this.factoryPlaceStr="";
                                break;
                            case "selectFactory":    
                                this.preApplyMessage.factory="";
                                break;
                            case "selectVendor":    
                                    //?
                                break;
                        }
                        return;
                    }else if(typeof callback === "function"){
                        callback();//若不为 "非核心" 执行后续获取值等操作
                    }
                }
            })
        }else if(typeof callback === "function"){
            callback();//此时没判断是否核心 执行后续获取值等操作
        }
    }
    homeAbroadRateSet(direct){//供应商国外改变时 税率的选项变化
        // direct-表示是直接选择供应商
        if (this.preApplyMessage.VendorCountry == 1) {//国外
            this.activeTaxrate = [{
                id: "J0",
                text: "J0--0% 进项税，中国 "
            }];
            this.preApplyMessage.taxrate = 0;
            this.preApplyMessage.taxratecode = "J0";
            this.preApplyMessage.taxratename = "J0--0% 进项税，中国 ";
            this.taxrateDisabled = true;
        } else {//0-国内
            this.selectInfo.taxrate = [{ "id": "J1", "text": "J1--17% 进项税，中国", "other": 0.17 }, { "id": "JB", "text": "JB--6% 服务进项税，中国", "other": 0.06 }, { "id": "JC", "text": "JC--3% 服务进项税，中国", "other": 0.03 }];
            if(this.preApplyMessage.taxrate==0 && direct){//如果是J0 则置空
                this.activeTaxrate = [{
                    id: "",text: ""
                }];
                this.preApplyMessage.taxrate = null;
                this.preApplyMessage.taxratecode = "";
                this.preApplyMessage.taxratename = "";
            }
            this.taxrateDisabled = false;
        }
    }
    judgeIsTenStart(){//供应商代码 是否10开头 判断
        let localvendorno = "";
        localvendorno = JSON.stringify(Number(this.preApplyMessage.vendorno));
        if (localvendorno.substring(0, 2) == "10") {
            this.isTenStart = true;
        } else {
            this.isTenStart = false;
        }
    }
}