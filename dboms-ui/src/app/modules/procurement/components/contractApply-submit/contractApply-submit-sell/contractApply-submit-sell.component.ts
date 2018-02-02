import { Component, OnInit, Input, Output, ElementRef, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { SubmitMessageService } from '../../../services/submit-message.service';
import { HttpServer } from 'app/shared/services/db.http.server';
import { WindowService } from 'app/core';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
    selector: "contractApply-submit-sell",
    templateUrl: 'contractApply-submit-sell.component.html',
    styleUrls: ['contractApply-submit-sell.component.scss', './../../../scss/procurement.scss']
})
export class ContractApplySubmitSellComponent implements OnInit {
    @Input() IsRMB;
    @Input() 
    set GetTaxrateData(data){//税率-0.06
        this.GetTaxrateDataLocal=data;
        this.sellSaveData.taxinclusivemoney = (this.sellSaveData.excludetaxmoney * (1 + data)).toFixed(2);//计算含税
        this.changeTAB(this.sellListArr);//额度判断
        for (let n = 0, len = this.sellListArr.length; n < len; n++) {//更新当前显示到总数据
            if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {
                this.sellListArr[n].excludetaxmoney=this.sellSaveData.excludetaxmoney;
                this.sellListArr[n].taxinclusivemoney=this.sellSaveData.taxinclusivemoney;
                this.sellListArr[n].foreigncurrencymoney=this.sellSaveData.foreigncurrencymoney;
            }
        }
        this.sellList.emit(this.sellListArr);
    };
    @Input()
    set currencyArr(data) {//币种-{"currency":"港元","currencycode":"HKD"}
        if (data) {
            this.currencyData = JSON.parse(data);
            if (JSON.stringify(this.currencyData) != JSON.stringify(this.currencyDataOld)) {//发生变化
                this.currencyDataOld = this.currencyData;
                if (JSON.stringify(this.BackPurchaseList) != "[]" && this.BackPurchaseList != undefined) {//更改币种时若采购清单不为空，获取对应金额
                    // 人民币 有清单-start
                    if (this.currencyData.currency == "人民币") {
                        if (this.GetTaxrateDataLocal == undefined) {
                            // this.WindowService.alert({ message: '请选择税率', type: 'fail' });
                        } else {//税率有值
                            for (let n = 0, len = this.sellListArr.length; n < len; n++) {//置0
                                this.sellListArr[n].excludetaxmoney = 0;
                                this.sellListArr[n].taxinclusivemoney = 0;
                                this.sellListArr[n].foreigncurrencymoney = 0;
                            }
                            let i = 0, len = this.BackPurchaseList.length;
                            for (; i < len; i++) {
                                for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                                    if (this.BackPurchaseList[i].MaterialSource == this.sellListArr[n].salecontractcode) {
                                        this.sellListArr[n].excludetaxmoney = this.sellListArr[n].excludetaxmoney + Number(this.BackPurchaseList[i].Amount);//未税累计
                                        this.sellListArr[n].taxinclusivemoney = (this.sellListArr[n].excludetaxmoney * (1 + this.GetTaxrateDataLocal)).toFixed(2);//含税累计
                                    }
                                }
                            }
                            for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                                if (this.sellListArr[n].excludetaxmoney > 0) {//未税>0 不可输入
                                    this.sellListArr[n].isexBlank = false;
                                }
                                if (this.sellListArr[n].excludetaxmoney == 0) {//未税=0 可输入(清单中没有采购商品)
                                    this.sellListArr[n].isexBlank = true;
                                }
                                if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {//当前项
                                    if (this.sellListArr[n].excludetaxmoney > 0) {
                                        this.sellSaveData.isexBlank = false;
                                    } else {
                                        this.sellSaveData.isexBlank = true;
                                    }
                                }
                            }
                            this.sellList.emit(this.sellListArr);
                        }
                        for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                            if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {//赋给显示
                                this.sellSaveData.excludetaxmoney = this.sellListArr[n].excludetaxmoney;
                                this.sellSaveData.taxinclusivemoney = this.sellListArr[n].taxinclusivemoney;
                            }
                        }
                    } //人民币 有清单-end
                    // 其他币种 有清单-start
                    else {
                        for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                            this.sellListArr[n].foreigncurrencymoney = 0;
                            this.sellListArr[n].excludetaxmoney = 0;
                            this.sellListArr[n].taxinclusivemoney = 0;
                        }
                        let i = 0, len = this.BackPurchaseList.length;
                        let url = "material/rateconvert";
                        for (; i < len; i++) {
                            for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                                if (this.BackPurchaseList[i].MaterialSource == this.sellListArr[n].salecontractcode) {
                                    //外币金额
                                    this.sellListArr[n].foreigncurrencymoney = this.sellListArr[n].foreigncurrencymoney + Number(this.BackPurchaseList[i].Amount);
                                    //this.sellSaveData.foreigncurrencymoney = this.sellListArr[n].foreigncurrencymoney;
                                    //外币金额显示
                                    this.sellSaveData.foreigncurrencymoney = Number.isInteger(this.sellListArr[n].foreigncurrencymoney)?this.sellListArr[n].foreigncurrencymoney:Number(this.sellListArr[n].foreigncurrencymoney).toFixed(2);
                                    let myDate = new Date();
                                    let myDateStr = myDate.getFullYear() + "/" + myDate.getMonth() + '/' + myDate.getDay();
                                    let body = {
                                        "foreignAmount": this.sellSaveData.foreigncurrencymoney,
                                        "foreignCurrency": "0",
                                        "localCurrency": "1",
                                        "dateTime": myDateStr
                                    }
                                    if (this.currencyData.currency == '美元') {
                                        body.foreignCurrency = '0'
                                    }
                                    if (this.currencyData.currency == '港元') {
                                        body.foreignCurrency = '2'
                                    }
                                    if (this.currencyData.currency == '欧元') {
                                        body.foreignCurrency = '4'
                                    }
                                    this.dbHttp.post(url, body).subscribe(data => {
                                        this.sellListArr[n].excludetaxmoney = data.data.localAmount;
                                        this.sellListArr[n].taxinclusivemoney = data.data.localAmount;
                                        for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                                            if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {//显示
                                                //this.sellSaveData.foreigncurrencymoney = this.sellListArr[n].foreigncurrencymoney;
                                                this.sellSaveData.foreigncurrencymoney = Number.isInteger(this.sellListArr[n].foreigncurrencymoney)?this.sellListArr[n].foreigncurrencymoney:Number(this.sellListArr[n].foreigncurrencymoney).toFixed(2);
                                                this.sellSaveData.excludetaxmoney = this.sellListArr[n].excludetaxmoney;
                                                this.sellSaveData.taxinclusivemoney = this.sellListArr[n].taxinclusivemoney;
                                            }
                                        }
                                        this.sellList.emit(this.sellListArr);
                                    })
                                }
                            }
                        }
    
                        for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                            if (this.sellListArr[n].foreigncurrencymoney > 0) {
                                this.sellListArr[n].isforBlank = false;
                            }
                            if (this.sellListArr[n].foreigncurrencymoney == 0) {
                                this.sellListArr[n].isforBlank = true;
                            }
                            if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {
                                if (this.sellListArr[n].foreigncurrencymoney > 0) {
                                    this.sellSaveData.isforBlank = false;
                                } else {
                                    this.sellSaveData.isforBlank = true;
                                }
                            }
                        }
                    }
                    // 其他币种 有清单-end
                }
                else{//无采购清单
                    if(this.sellSaveData.excludetaxmoney&&this.sellSaveData.foreigncurrencymoney){//bug?
                        for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                            this.sellListArr[n].foreigncurrencymoney = 0;
                            this.sellListArr[n].excludetaxmoney = 0;
                            this.sellListArr[n].taxinclusivemoney = 0;
                        }
                        let url = "material/rateconvert";//取最新汇率计算
                        // this.sellListArr[n].foreigncurrencymoney = this.sellListArr[n].foreigncurrencymoney + Number(this.BackPurchaseList[i].Amount);
                        //this.sellSaveData.foreigncurrencymoney = this.sellListArr[n].foreigncurrencymoney;
                        // this.sellSaveData.foreigncurrencymoney = Number.isInteger(this.sellListArr[n].foreigncurrencymoney)?this.sellListArr[n].foreigncurrencymoney:this.sellListArr[n].foreigncurrencymoney.toFixed(2);
                        let myDate = new Date();
                        let myDateStr = myDate.getFullYear() + "/" + myDate.getMonth() + '/' + myDate.getDay();
                        let body = {
                            "foreignAmount": this.sellSaveData.foreigncurrencymoney,
                            "foreignCurrency": "0",
                            "localCurrency": "1",
                            "dateTime": myDateStr
                        }
                        if (this.currencyData.currency == '美元') {
                            body.foreignCurrency = '0'
                        }
                        if (this.currencyData.currency == '港元') {
                            body.foreignCurrency = '2'
                        }
                        if (this.currencyData.currency == '欧元') {
                            body.foreignCurrency = '4'
                        }
                        this.dbHttp.post(url, body).subscribe(data => {//外币时，税率时0，直接返回计算后值，此时含税未税相同
                            this.sellSaveData.excludetaxmoney = data.data.localAmount;
                            this.sellSaveData.taxinclusivemoney = data.data.localAmount;
                            for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                                if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {
                                    this.sellListArr[n].foreigncurrencymoney=this.sellSaveData.foreigncurrencymoney;
                                    // this.sellSaveData.foreigncurrencymoney = Number.isInteger(this.sellListArr[n].foreigncurrencymoney)?this.sellListArr[n].foreigncurrencymoney:this.sellListArr[n].foreigncurrencymoney.toFixed(2);
                                    this.sellListArr[n].excludetaxmoney=this.sellSaveData.excludetaxmoney;
                                    this.sellListArr[n].taxinclusivemoney=this.sellSaveData.taxinclusivemoney;
                                }
                            }
                            this.sellList.emit(this.sellListArr);
                        })
                    };
                }
            }
        }
    };
    @Input() BackPurchaseList;//采购清单数据
    @Input()
    set PurchaseRequisitionSaleContractListData(data) {//编辑状态，已有销售信息数据
        if (data && JSON.stringify(data) != "[]") {
            data = JSON.parse(data);
            this.sellListArrLocal = data;
            this.contractList = [];
            for (let i = 0, len = data.length; i < len; i++) {//拼接合同信息
                this.contractList.push(
                    new contractListData(
                        data[i].MainContractCode,
                        data[i].salecontractcode
                    )
                )
            }
            this.getcontractList(this.contractList);
            this.onChange(this.contractList[0]);
            this.sellSaveData.foreigncurrencymoney = 0;
            this.sellSaveData.excludetaxmoney = 0;
            this.sellSaveData.taxinclusivemoney = 0;
            for (let n = 0, len = this.sellListArrLocal.length; n < len; n++) {
                if (this.sellListArrLocal[n].salecontractcode == this.sellSaveData.salecontractcode) {//赋值显示
                    if (this.sellListArrLocal[n].excludetaxmoney > 0) {//未税>0
                        this.sellSaveData.foreigncurrencymoney = this.sellListArrLocal[n].foreigncurrencymoney;
                        this.sellSaveData.excludetaxmoney = this.sellListArrLocal[n].excludetaxmoney;
                        this.sellSaveData.taxinclusivemoney = this.sellListArrLocal[n].taxinclusivemoney;
                    }
                }
            }
            for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {
                    this.sellListArr[n].excludetaxmoney=this.sellSaveData.excludetaxmoney;
                    this.sellListArr[n].taxinclusivemoney=this.sellSaveData.taxinclusivemoney;
                    this.sellListArr[n].foreigncurrencymoney=this.sellSaveData.foreigncurrencymoney;
                }
            }
            this.changeTAB(this.sellListArr);
            this.sellList.emit(this.sellListArr);
        }
    }
    @Input() sellView;//是否只是显示标识
    @Output() sellList = new EventEmitter();//返回销售信息变化
    constructor(private dbHttp: HttpServer, private WindowService: WindowService, private SubmitMessageService: SubmitMessageService, private ActivatedRoute: ActivatedRoute) { }

    @ViewChild('hideDisi')
    hideDisiDiv: ElementRef;//产品明细展开收缩按钮

    ngOnInit() {
        this.IDFlag = this.ActivatedRoute.snapshot.params['id'];
        //获取选择合同号
        this.contractList = [];
        this.contractList = JSON.parse(localStorage.getItem('contractList'));
        if (this.contractList != null) {
            this.getcontractList(this.contractList);
            this.onChange(this.contractList[0]);
        }
    }

    ngDoCheck() {
        //传递采购清单变化时
        if (this.oldsell != JSON.stringify(this.BackPurchaseList)) {
            if (this.BackPurchaseList && this.currencyData && this.BackPurchaseList.length>0) {//有清单 有币种               
                this.oldsell = JSON.stringify(this.BackPurchaseList);
                // 人民币-start
                if (this.currencyData.currency == "人民币") {//同上
                    if (this.GetTaxrateDataLocal == undefined) {
                        // this.WindowService.alert({ message: '请选择税率', type: 'fail' });
                    } else {
                        for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                            this.sellListArr[n].excludetaxmoney = 0;
                            this.sellListArr[n].taxinclusivemoney = 0;
                        }
                        let i = 0, len = this.BackPurchaseList.length;
                        for (; i < len; i++) {
                            for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                                if (this.BackPurchaseList[i].MaterialSource == this.sellListArr[n].salecontractcode) {
                                    this.sellListArr[n].excludetaxmoney = this.sellListArr[n].excludetaxmoney + Number(this.BackPurchaseList[i].Amount);
                                    this.sellListArr[n].taxinclusivemoney = (this.sellListArr[n].excludetaxmoney * (1 + this.GetTaxrateDataLocal)).toFixed(2);
                                }
                            }
                        }
                        for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                            if (this.sellListArr[n].excludetaxmoney > 0) {
                                this.sellListArr[n].isexBlank = false;
                            }
                            if (this.sellListArr[n].excludetaxmoney == 0) {
                                this.sellListArr[n].isexBlank = true;
                            }
                            if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {
                                if (this.sellListArr[n].excludetaxmoney > 0) {
                                    this.sellSaveData.isexBlank = false;
                                } else {
                                    this.sellSaveData.isexBlank = true;
                                }
                            }
                        }
                        this.sellList.emit(this.sellListArr);
                    }
                    for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                        if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {
                            this.sellSaveData.excludetaxmoney = this.sellListArr[n].excludetaxmoney.toFixed(2);
                            this.sellSaveData.taxinclusivemoney = this.sellListArr[n].taxinclusivemoney;
                        }
                    }
                    //判断含税金额是否超过销售总额
                    this.changeTAB(this.sellListArr);
                } // 人民币-end
                // 其他币种-start
                else {
                    for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                        this.sellListArr[n].foreigncurrencymoney = 0;
                        this.sellListArr[n].excludetaxmoney = 0;
                        this.sellListArr[n].taxinclusivemoney = 0;

                    }
                    if (this.BackPurchaseList.length > 0) {
                        let i = 0, len = this.BackPurchaseList.length;
                        let url = "material/rateconvert";
                        for (; i < len; i++) {
                            for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                                if (this.BackPurchaseList[i].MaterialSource == this.sellListArr[n].salecontractcode) {
                                    //this.sellListArr[n].foreigncurrencymoney = this.sellListArr[n].foreigncurrencymoney + Number(this.BackPurchaseList[i].Amount);
                                    this.sellSaveData.foreigncurrencymoney = this.sellListArr[n].foreigncurrencymoney;
                                    let myDate = new Date();
                                    let myDateStr = myDate.getFullYear() + "/" + myDate.getMonth() + '/' + myDate.getDay();
                                    let body = {
                                        "foreignAmount": this.sellSaveData.foreigncurrencymoney,
                                        "foreignCurrency": "0",
                                        "localCurrency": "1",
                                        "dateTime": myDateStr
                                    }
                                    if (this.currencyData.currency == '美元') {
                                        body.foreignCurrency = '0'
                                    }
                                    if (this.currencyData.currency == '港元') {
                                        body.foreignCurrency = '2'
                                    }
                                    if (this.currencyData.currency == '欧元') {
                                        body.foreignCurrency = '4'
                                    }
                                    this.dbHttp.post(url, body).subscribe(data => {
                                        this.sellListArr[n].excludetaxmoney = data.data.localAmount;
                                        this.sellListArr[n].taxinclusivemoney = data.data.localAmount;
                                        for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                                            if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {
                                                this.sellSaveData.foreigncurrencymoney = this.sellListArr[n].foreigncurrencymoney;
                                                this.sellSaveData.foreigncurrencymoney = Number.isInteger(this.sellListArr[n].foreigncurrencymoney)?this.sellListArr[n].foreigncurrencymoney:Number(this.sellListArr[n].foreigncurrencymoney).toFixed(2); 
                                                this.sellSaveData.excludetaxmoney = this.sellListArr[n].excludetaxmoney;
                                                this.sellSaveData.taxinclusivemoney = this.sellListArr[n].taxinclusivemoney;
                                            }
                                        }
                                        this.sellList.emit(this.sellListArr);
                                    })
                                }
                            }
                        }
                    } 
                    // else {
                    //     for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                    //         if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {
                    //             this.sellSaveData.foreigncurrencymoney = 0;
                    //             this.sellSaveData.excludetaxmoney = 0;
                    //             this.sellSaveData.taxinclusivemoney = 0;
                    //         }
                    //     }
                    //     this.sellList.emit(this.sellListArr);
                    // }
                    for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                        if (this.sellListArr[n].foreigncurrencymoney > 0) {
                            this.sellListArr[n].isforBlank = false;
                        }
                        if (this.sellListArr[n].foreigncurrencymoney == 0) {
                            this.sellListArr[n].isforBlank = true;
                        }
                        if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {
                            if (this.sellListArr[n].foreigncurrencymoney > 0) {
                                this.sellSaveData.isforBlank = false;
                            } else {
                                this.sellSaveData.isforBlank = true;
                            }
                        }
                    }
                    //判断含税金额是否超过销售总额
                    this.changeTAB(this.sellListArr);
                }
                // 其他币种-end
            }
            else {//无清单 是开放输入框
                for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                    this.sellListArr[n].isforBlank = true;
                    this.sellSaveData.isforBlank = true;
                    this.sellListArr[n].isexBlank = true;
                    this.sellSaveData.isexBlank = true;
                }
            }
        }
      
        if (this.sellData.ProductDetails && this.sellData.ProductDetails.length >= 10) {//产品明细 出现滚动条的宽度调整
            $(".scroll-w").addClass("w141");
        } else {
            $(".scroll-w").removeClass("w141");
        }
    }
    public GetTaxrateDataLocal;//税率
    public isRmbOld;
    public currencyData;//币种
    public currencyDataOld;//币种-旧值
    excessPromptStrShow=false;//合同超额文字提示是否显示 标识
    
    public gettaxinclusivemoney(e) {//计算含税总金额
        if (this.GetTaxrateDataLocal == undefined) {
            this.WindowService.alert({ message: '请选择税率', type: 'fail' });
        } else {
            //加.00
            let localExcludetaxmoney = null;
            localExcludetaxmoney = Number(this.sellSaveData.excludetaxmoney).toFixed(2);
            this.sellSaveData.excludetaxmoney=localExcludetaxmoney;//显示加.00
            this.sellSaveData.taxinclusivemoney = (e * (1 + this.GetTaxrateDataLocal)).toFixed(2);//计算含税
            for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {//存进数组
                    this.sellListArr[n].excludetaxmoney = this.sellSaveData.excludetaxmoney;
                    this.sellListArr[n].taxinclusivemoney = this.sellSaveData.taxinclusivemoney;
                }
            }
            this.changeTAB(this.sellListArr);
            this.sellList.emit(this.sellListArr);
        }
    }
    
    public getOtherMoney(e) {//外币时计算其他金额
        if (!this.currencyData) {
            this.WindowService.alert({ message: '请选择币种', type: 'warn' });
        } else {
            let myDate = new Date();
            let myDateStr = myDate.getFullYear() + "/" + myDate.getMonth() + '/' + myDate.getDay();
            let body = {
                "foreignAmount": e,
                "foreignCurrency": "0",
                "localCurrency": "1",
                "dateTime": myDateStr
            }
            if (this.currencyData.currency == '美元') {
                body.foreignCurrency = '0'
            }
            if (this.currencyData.currency == '港元') {
                body.foreignCurrency = '2'
            }
            if (this.currencyData.currency == '欧元') {
                body.foreignCurrency = '4'
            }
            let url = "material/rateconvert";
            this.dbHttp.post(url, body).subscribe(data => {
                this.sellSaveData.excludetaxmoney = data.data.localAmount;
                this.sellSaveData.taxinclusivemoney = data.data.localAmount;
                for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                    if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {
                        this.sellListArr[n].excludetaxmoney = this.sellSaveData.excludetaxmoney;
                        this.sellListArr[n].taxinclusivemoney = this.sellSaveData.taxinclusivemoney;
                        this.sellListArr[n].foreigncurrencymoney = this.sellSaveData.foreigncurrencymoney;
                    }
                }

                this.sellList.emit(this.sellListArr)
            })
        }
    }
    
    public oldsell = '';//采购清单-旧值
    public sellListArrLocal;//编辑状态下-已有的销售信息数组
    public IDFlag;
    public hideDisdata = false;//显示/隐藏产品明细标识
    public hideDis(e) {//产品明细-显示/隐藏
        this.hideDisdata = !this.hideDisdata;
        if (this.hideDisiDiv.nativeElement.className == "iqon-fold mid-h") {
            this.hideDisiDiv.nativeElement.className = this.hideDisiDiv.nativeElement.className + " " + "trans180";
            return;
        }
        if (this.hideDisiDiv.nativeElement.className == "iqon-fold mid-h trans360") {
            this.hideDisiDiv.nativeElement.className = "iqon-fold mid-h trans180";
            return;
        }
        if (this.hideDisiDiv.nativeElement.className == "iqon-fold mid-h trans180") {
            this.hideDisiDiv.nativeElement.className = "iqon-fold mid-h trans360";
            return;
        }
    }
    checkSeal(url) {//查看用印制作合同
        if (url.indexOf("UploadFiles") == -1) {
            window.open(url);
        }
        else if (url.indexOf("UploadFiles") != -1) {
            url = "http://10.0.1.26:88" + url;
            window.open(url);
        }
    }
    //组件程序
    public tabList = [];//tab组件传入list
    public contentList = [];//无用?
    public contractList;//本地localstorage存储-合同数组
    active = 0;//tab默认显示哪个

    public getcontractList(contractList) {//合同列表变更后
        this.tabList = [];
        this.contentList = [];
        this.sellListArr = [];
        for (let i = 0, len = contractList.length; i < len; i++) {
            this.tabList.push(new tabListData(//重组tabList
                contractList[i].MainContractCode, false, contractList[i].SC_Code
            ))
            this.contentList.push(contractList[i].MainContractCode);//重组contentList
        }
        if (this.sellListArr.length == 0) {
            for (let i = 0, len = contractList.length; i < len; i++) {
                let localData;
                let url = "PurchaseManage/GetContractDetail/" + contractList[i].SC_Code;
                this.sellListArr.push(//重组sellListArr
                    new sellSaveData(
                        // '','',
                        contractList[i].SC_Code,
                        contractList[i].MainContractCode,
                        0, 0, 0, '', true, true
                    )
                )
                this.dbHttp.get(url).subscribe(data => {//获取合同信息
                    localData = JSON.parse(data.Data);
                    if (localData) {
                        if (localData.PurchaseTaxMoney == null) {
                            localData.PurchaseTaxMoney = 0;
                        }
                        // console.log(this.sellData.Bids, this.sellListArr, localData);
                        // if (this.sellListArr[i].salecontractcode == localData.ProductDetails[0].SC_Code) {
                        //     this.sellListArr[i].cumulativeconsumemoney = localData.PurchaseTaxMoney;
                        // }
                        // for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                        //     if (this.sellListArr[n].salecontractcode == localData.ProductDetails[0].SC_Code) {
                        //         this.sellListArr[n].cumulativeconsumemoney = localData.PurchaseTaxMoney;
                        //     }
                        // }
                    }
                })
            }
            if (this.sellListArrLocal) {//若是编辑下-取已有销售信息的金额
                for (let i = 0, len = this.sellListArrLocal.length; i < len; i++) {
                    if (this.sellListArr[i].salecontractcode == this.sellListArrLocal[i].salecontractcode) {
                        this.sellListArr[i].excludetaxmoney = this.sellListArrLocal[i].excludetaxmoney;
                        this.sellListArr[i].taxinclusivemoney = this.sellListArrLocal[i].taxinclusivemoney;
                    }
                }
            }
        }
    }
    onChange(x) {//tab切换
        if (typeof (x) != 'string') {
            if (x) {
                if (x.SC_Code) {//传入contractList[]切换
                    this.active = x.SC_Code;
                    this.sellSaveData.MainContractCode = x.MainContractCode;
                    this.sellSaveData.salecontractcode = x.SC_Code;
                }
                else {//点击切换
                    this.active = x.id;//存切换id
                    this.sellSaveData.MainContractCode = x.text;//存切换当前合同的信息
                    this.sellSaveData.salecontractcode = x.id;
                    this.excessPromptStrShow=x.invalid;
                }
                for (let n = 0, len = this.sellListArr.length; n < len; n++) {
                    if (this.sellListArr[n].salecontractcode == this.sellSaveData.salecontractcode) {
                        // this.sellSaveData.foreigncurrencymoney = this.sellListArr[n].foreigncurrencymoney;
                        this.sellSaveData.foreigncurrencymoney = Number.isInteger(this.sellListArr[n].foreigncurrencymoney)?this.sellListArr[n].foreigncurrencymoney:Number(this.sellListArr[n].foreigncurrencymoney).toFixed(2);

                        this.sellSaveData.excludetaxmoney = this.sellListArr[n].excludetaxmoney;
                        this.sellSaveData.taxinclusivemoney = this.sellListArr[n].taxinclusivemoney;
                        this.sellSaveData.isexBlank = this.sellListArr[n].isexBlank;
                        this.sellSaveData.isforBlank = this.sellListArr[n].isforBlank;
                        if (this.sellSaveData.excludetaxmoney == 0) {//未税金额为0
                            this.sellSaveData.isexBlank = true;//可填写
                        }
                    }
                }
                let url = "PurchaseManage/GetContractDetail/" + this.active;
                this.dbHttp.get(url).subscribe(data => {//获取合同信息
                    if (!data.Result) {
                        this.WindowService.alert({ message: data.Message, type: 'fail' });
                        return false;
                    } else {
                        this.sellData = JSON.parse(data.Data);
                    }
                })
                this.changeTAB(this.sellListArr);
            }
        }
    }

    public changeTAB(sellListArr){//销售信息中额度是否超出(invalid)判断
        for (let i = 0, len = this.tabList.length; i < len; i++) {
            for (let n = 0, len = sellListArr.length; n < len; n++) {
               if(this.tabList[i].id==sellListArr[n].salecontractcode){
                let url = "PurchaseManage/GetContractDetail/" + sellListArr[n].salecontractcode;
                this.dbHttp.get(url).subscribe(data => {
                    if (!data.Result) {
                        this.WindowService.alert({ message: data.Message, type: 'fail' });
                        return false;
                    } else {
                        let localdata = JSON.parse(data.Data);
                        if(sellListArr[n].taxinclusivemoney>localdata.ContractMoney){//判断额度
                            this.tabList[i].invalid = true;
                        }else{
                            this.tabList[i].invalid = false;
                        }
                        if(this.tabList[i].id==this.active){//显示的当前合同 是否超值
                            this.excessPromptStrShow=this.tabList[i].invalid;
                        }
                    }
                })
               }
            }
        }
    }
    deleteTab(e) {//删除一个tab(合同)
        // if (this.contractList.length == 1) {
        // this.WindowService.alert({ message: "至少保留一个合同", type: 'fail' });
        // this.contractList = [];
        // this.contentList = [];
        // this.sellListArr = [];
        // }
        this.contractList.splice(e, 1);
        this.contentList.splice(e, 1);
        this.sellListArr.splice(e, 1);
        window.localStorage.setItem("contractList", JSON.stringify(this.contractList));
        this.onChange(this.contractList[0]);//删除后默认切换显示第一个
        this.sellList.emit(this.sellListArr);
    }

    //新增合同
    public newContractApplyShow = false;
    public newContractShow(e) {//添加合同窗口关闭后
        this.newContractApplyShow = e;
        this.contractList = [];
        this.contractList = JSON.parse(localStorage.getItem('contractList'));
        if (this.contractList != null) {
            this.getcontractList(this.contractList);
            this.onChange(this.contractList[0]);//显示第一个
        }
        // window.location.reload();
    }
    addTab(e) {//添加一个合同
        this.newContractApplyShow = true;
        // this.tabList[e].text = "合同" + (e + 1);
        // this.contentList[e] = "内容" + (e + 1);
    }
    public sellData = {//当前销售信息内容-展示
        ProjectName: null,
        "BuyerName": "",
        ContractMoney: 0,
        "PurchaseTaxMoney": 0,
        Bids: [//附件信息
            {
                "AccessoryID": "",
                "AccessoryName": "",
                "AccessoryURL": null,
                "AccessoryType": "",
                "CreatedTime": null,
                "CreatedByITcode": null,
                "CreatedByName": null,
                "InfoStatus": null
            }
        ],
        "ProductDetails": [//产品明细
            {
                "SC_Code": "",
                "ProductName": "",
                "Model": "",
                "Qty": 0,
                "Price": 0,
                "TotalPrice": 0,
                "Remark": ""
            }
        ]
    };
    public sellListArr = [];//销售信息数组-存储
    public sellSaveData = new sellSaveDataClass();//当前销售信息内容-存储
}
export class tabListData {//tab数组单位
    constructor(
        public text,
        public invalid,
        public id
    ) { }
}
export class sellSaveDataClass {//销售信息-数组单位
    // public id = null;
    // public purchaserequisitionid = null;
    public salecontractcode = "";
    public MainContractCode = '';
    public excludetaxmoney = null;
    public taxinclusivemoney = null;
    public foreigncurrencymoney:number = 0;
    // public cumulativeconsumemoney: number = 0;
    public addtime = "";
    public isforBlank = true;//采购外币金额-是否填写框标识
    public isexBlank = true;//采购未税总金额-是否填写框标识
}
export class sellSaveData {
    constructor(
        // public id = null,
        // public purchaserequisitionid = null,
        public salecontractcode = "",
        public MainContractCode = '',
        public excludetaxmoney = 0,
        public taxinclusivemoney = 0,
        public foreigncurrencymoney: number = 0,
        // public cumulativeconsumemoney: number = 0,
        public addtime = "",
        public isforBlank = true,
        public isexBlank = true,
    ) { }
}
export class contractListData {
    constructor(
        public MainContractCode = null,
        public SC_Code = null,
    ) { }
}