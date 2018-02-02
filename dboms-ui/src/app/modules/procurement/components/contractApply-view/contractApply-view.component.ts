import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpServer } from 'app/shared/services/db.http.server';
import { WindowService } from 'app/core';
import { ContractApply, PurchaseRequisitionDetailsList, AccessoryList, PurchaseRequisitionSaleContractList } from './../../services/contractApply-submit.service';
import { ActivatedRoute } from '@angular/router';
import { DbWfviewComponent } from 'app/shared/index';
import { Pager } from 'app/shared/index';
import { dbomsPath } from "environments/environment";
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
declare var $: any;
import { ProcurementTemplateService } from './../../services/procurement-template.service';

@Component({
    templateUrl: 'contractApply-view.component.html',
    styleUrls: ['contractApply-view.component.scss']
})
export class ContractApplyViewComponent implements OnInit {
    @ViewChild('wfview')
    wfView: DbWfviewComponent;
    constructor(
        private dbHttp: HttpServer,
        private WindowService: WindowService,
        private ActivatedRoute: ActivatedRoute,
        private routerInfo: ActivatedRoute,
        private procurementTemplateService: ProcurementTemplateService
    ) { }
    // public urlFlag=false;//判断是否查看页
    ngOnInit() {
        // if(this.routerInfo.snapshot.url[0].path=="approval-contractapply"){
        //     this.urlFlag = true;
        // }else{
        //     this.urlFlag = false;
        // }
        this._initParam();
        this.onGetWfHistoryData();
        this._initViewParms();
        this.contractData = new ContractApply();
        let localId;
        if (this.urlParamObj.applyid != undefined && this.urlParamObj.applyid != '') {
            localId = this.urlParamObj.applyid;
        }
        this.getProcurementData(localId);//整单数据
        this.getRequisition(localId);//获取审批流程
        this.urlParamObj.applyid = localId;
        // this.getNodeId(localId);
    }
    public ISRMB = false;
    public sellView = true;
    procurementListShow=false;//采购清单是否显示标识
    //获取流程信息
    public getRequisition(e) {
        let url = "PurchaseManage/RequisitionApproveHistory/" + e
        this.dbHttp.post(url).subscribe(data => {
            let localData = JSON.parse(data.Data);
            this.wfData = JSON.parse(data.Data);

            if (this.wfData.wfHistory != null && this.wfData.wfHistory.length > 0)
                this.wfData.wfHistory.reverse();
            this.wfView.onInitData(this.wfData.wfProgress);
            // for (let i = 0, len = this.wfData.wfProgress.length; i < len; i++) {
            //     if (this.wfData.wfProgress[i].IsShow == true) {
            //         this.nodeidLast = this.wfData.wfProgress[i].NodeID
            //     }
            // }
            // if (this.nodeidLocal == this.nodeidLast && (this.nodeidLast && this.nodeidLocal)) {
            //     this.nodeFlag = true;
            // }
        })
    }
    //附件
    public AccessorySee_one;//附件
    public AccessorySee_Two;//附件
    public meterialNum = 0;//物料数量
    //获取整单数据
    public currencyArr;//传递币种
    public contractData;//整体数据
    public blueFlag = false;//修改记录标识
    public pagerData = new Pager();//分页
    public RequisitionRecord = [];//修改记录
    public IsCenter;//供应商编号10
    public TemplateName;//模板名称
    public getProcurementData(id) {
        let url = "PurchaseManage/GetPurchaseRequisitionById/" + id;
        this.dbHttp.get(url).subscribe(data => {
            if (data.Result) {
                this.contractData = JSON.parse(data.Data);
                this.contractData.vendorno = 0 + Number(this.contractData.vendorno);
                this.contractData.vendorno = JSON.stringify(this.contractData.vendorno);
                if (this.contractData.vendorno.substring(0, 2) == "10") {
                    this.IsCenter = true;
                }
                //修改记录时突出字体
                let requisitionnum = this.contractData.requisitionnum;
                let RequisitionRecordUrl = "PurchaseManage/GetRequisitionRecord/" + requisitionnum
                this.dbHttp.get(RequisitionRecordUrl + "/" + 1 + "/" + 10).subscribe(data => {
                    if (JSON.stringify(data.Data.List) != "[]") {
                        this.blueFlag = true;
                        this.RequisitionRecord = data.Data.List;
                        //重置pager
                        let PageDataFlag = data.Data;
                        this.pagerData.set({
                            total: PageDataFlag.TotalCount,
                            totalPages: PageDataFlag.PageCount
                        })
                    };
                })
                if (this.contractData.orderno) {
                    this.tracenoFlag = true;
                }
                //传入sell
                let jsoncurrency = {
                    currency: this.contractData.currency,
                    currencycode: this.contractData.currencycode
                }
                this.currencyArr = JSON.stringify(jsoncurrency);
                this.PurchaseRequisitionSaleContractListData = JSON.stringify(this.contractData.PurchaseRequisitionSaleContractList);

                this.contractData.addtime = this.ChangeDateFormat(this.contractData.addtime);
                this.contractData.preselldate = this.ChangeDateFormat(this.contractData.preselldate);
                for (let i = 0, len = this.contractData.PurchaseRequisitionDetailsList.length; i < len; i++) {
                    this.viewChildTopData["untaxAmount"] = Number(this.viewChildTopData["untaxAmount"] + Number(this.contractData.PurchaseRequisitionDetailsList[i].Amount))
                    for (let n = 0, len = this.contractData.PurchaseRequisitionSaleContractList.length; n < len; n++) {
                        if (this.contractData.PurchaseRequisitionSaleContractList[n].salecontractcode == this.contractData.PurchaseRequisitionDetailsList[i].MaterialSource) {
                            this.contractData.PurchaseRequisitionDetailsList[i].MainContractCode = this.contractData.PurchaseRequisitionSaleContractList[n].MainContractCode;
                        }
                    }
                    // for(let i=0,len=this.contractData.PurchaseRequisitionSaleContractList.length;i<len;i++){//采购清单的物料来源显示 进行拼接
                    //     let item=this.contractData.PurchaseRequisitionSaleContractList[i];
                    //     if(item["DBOMS_PurchaseRequisitionSaleContract_ID"]){
                    //         item["text"]=item["PurchaseRequisitionNum"] + "-" + item["MainContractCode"];
                    //     }else{
                    //         item["text"]=item["MaterialSource"];
                    //     }
                    // }
                    this.meterialNum = this.meterialNum + this.contractData.PurchaseRequisitionDetailsList[i].Count;
                }

                this.AccessorySee_one = []
                for (let i = 0, len = this.contractData.AccessoryList.length; i < len; i++) {
                    if (this.contractData.AccessoryList[i].AccessoryType == 20) {
                        this.AccessorySee_one.push(
                            new textData(
                                this.contractData.AccessoryList[i].AccessoryURL,
                                this.contractData.AccessoryList[i].AccessoryName
                            )
                        )
                    }
                }
                this.AccessorySee_Two = []
                for (let i = 0, len = this.contractData.AccessoryList.length; i < len; i++) {
                    if (this.contractData.AccessoryList[i].AccessoryType == 21) {
                        this.AccessorySee_Two.push(
                            new textData(
                                this.contractData.AccessoryList[i].AccessoryURL,
                                this.contractData.AccessoryList[i].AccessoryName
                            )
                        )
                    }
                }
                if (this.contractData.currencycode == "RMB") {
                    this.ISRMB = true;
                }
                this.viewChildTopData.vendor = this.contractData.vendor;
                this.viewChildTopData.factory = this.contractData.factory;
                this.viewChildTopData.procurementList = this.contractData.PurchaseRequisitionDetailsList;
                this.BackPurchaseList = this.contractData.PurchaseRequisitionDetailsList;
                if (this.contractData.TemplateID) {//获取模板名称
                    this.procurementTemplateService.getProcurementTplOne(this.contractData.TemplateID).then(data => {
                        if (data.Result) {
                            this.TemplateName = data.Data.Name;
                        }
                    })
                }
            }
            else {
                this.WindowService.alert({ message: '接口异常', type: 'fail' });
            }
        })
    }
    public onChangePage = function (e, num) {//修改记录分页
        let pagNum = e.pageNo;
        let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
        let options = new RequestOptions({ headers: headers });
        if (this.RequisitionRecordUrl) {
            this.dbHttp.get(this.RequisitionRecordUrl + "/" + pagNum + "/" + 10, options)
                .map(res => res)
                .subscribe(
                (data) => {
                    if (!data.Result) {
                        this.WindowService.alert({ message: data.json().Message, type: 'fail' });
                        return false;
                    }
                    this.RequisitionRecord = data.Data.List;
                    //重置pager
                    this.PageDataFlag = data.Data;
                    this.pagerData.set({
                        total: this.PageDataFlag.TotalCount,
                        totalPages: this.PageDataFlag.PageCount
                    })
                });
        }
    }
    viewContractApply(id) {//查看修改记录中-记录
        window.open(dbomsPath + 'procurement/view-contractApply/' + id);
    }
    //查看用印制作合同
    checkSeal(url) {
        url = "http://10.0.1.26:88" + url;
        window.open(url);
    }
    public BackPurchaseList;
    public viewChildFlag = false;
    public viewChildTopData = new viewChildTopData();
    public PurchaseRequisitionSaleContractListData;//销售消息获取
    matchContract(salecontractcode) {//采购清单的合同号显示 进行匹配
        for (let k = 0, len = this.contractData.PurchaseRequisitionSaleContractList.length; k < len; k++) {
            let item = this.contractData.PurchaseRequisitionSaleContractList[k];
            if (item["salecontractcode"] == salecontractcode) {
                return item["MainContractCode"];
            }
        }
        return salecontractcode;
    }
    showOrder() {//预览采购清单
        this.viewChildFlag = true;
    }
    //接受判断条件
    hideMes(e) {
        this.viewChildFlag = e;
    }
    //日期转换方法
    ChangeDateFormat(val) {
        if (val != null) {
            let date = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
            //月份为0-11，所以+1，月份小于10时补个0
            let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            let currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            return date.getFullYear() + "-" + month + "-" + currentDate;
        }
        return "";
    }

    /** approve begin */
    public hasSaved = false;
    public saveBillID6() {
        this.hasSaved = true;
    }
    //获取当前节点
    // public nodeidLocal;//当前节点
    // public nodeidLast;//最后节点
    // public nodeFlag = false;//当前页面是否是最后节点标识
    public tracenoFlag = false;//是否有采购编号
    // public getNodeId(localId) {
    //     let nodeIDUrl = "PurchaseManage/GetCurrentWFNode_PurchaseRequisition/" + localId;
    //     let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
    //     let options = new RequestOptions({ headers: headers });
    //     this.dbHttp.post(nodeIDUrl, {}, options)
    //         .toPromise()
    //         .then(res => {
    //             if (res.Data) {
    //                 let data = JSON.parse(res.Data);
    //                 this.nodeidLocal = data.nodeid;
    //                 if (this.nodeidLocal == this.nodeidLast && (this.nodeidLast && this.nodeidLocal)) {
    //                     this.nodeFlag = true;
    //                 }
    //             }
    //         })
    // }
    //流程最后写入erp
    public writeERP() {
        let nodeIDUrl = "PurchaseManage/Requisition2ERP/" + this.contractData.purchaserequisitionid;
        let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
        let options = new RequestOptions({ headers: headers });
        this.dbHttp.post(nodeIDUrl, {}, options)
            .toPromise()
            .then(res => {
                if (!res.Result) {
                    alert(res.Message)
                    // this.WindowService.alert({ message: res.Message, type: 'fail' });
                }
                else {
                    this.contractData.orderno = res.Data;
                    this.tracenoFlag = true;
                    alert(res.Message)
                }
            })
    }
    //添加节点
    public nodeDataList = {
        "taskid": "",
        "approveresult": "Approval",
        "nodeid": "",//流程节点Id
        "opinions": "同意",
    };
    urlParamObj = {
        applyid: "",
        nodeid: "",
        taskid: "",
        adp: ""
    };
    wfData = {
        wfHistory: null,
        wfProgress: null
    };
    appParms = {
        apiUrl_AR: "PurchaseManage/ApproveRequisition",//审批接口
        apiUrl_Sign: "PurchaseManage/AddTask",//加签接口
        apiUrl_Transfer: "PurchaseManage/AddTransferTask",//转办接口
        taskid: "",
        nodeid: "",
        navigateUrl: ""
    };
    adpAppParms = {
        apiUrl: "PurchaseManage/ApproveAddTask",
        taskid: ""
    };
    isView: boolean = true;//是否查看页面 查看页面(true) 审批页面(false)
    isADP: boolean = false;//是否加签审批页面
    isBusiness: boolean = false;//是否商务审批
    isFinance: boolean = false;//是否财务发票审批
    onGetWfHistoryData() {//获取流程和审批历史
        if (this.urlParamObj.applyid != undefined && this.urlParamObj.applyid != '') {
            let url = "PurchaseManage/RequisitionApproveHistory/" + this.urlParamObj.applyid;
            let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
            let options = new RequestOptions({ headers: headers });
            let nodeIDUrl = "PurchaseManage/GetCurrentWFNode_PurchaseRequisition/" + this.urlParamObj.applyid;
            console.log(nodeIDUrl)
            this.dbHttp.post(nodeIDUrl, {}, options)
                .toPromise()
                .then(res => {
                    if (res.Data) {
                        let data = JSON.parse(res.Data);
                        this.nodeDataList.taskid = data.taskid;
                        this.nodeDataList.nodeid = data.nodeid;
                    }
                    this.dbHttp.post(url, [], options).subscribe(
                        data => {
                            if (data.Result) {
                                this.wfData = JSON.parse(data.Data);
                                let progressOne = {
                                    "NodeID": "1",
                                    "NodeName": "申请人",
                                    "IsShow": true,
                                    "IsAlready": true,
                                    "AuditDate": "",
                                    "TaskOpinions": "同意",
                                    "ApproveUsers": {

                                    }
                                }
                                if (this.nodeDataList.nodeid == "2") {
                                    progressOne = {
                                        "NodeID": "1",
                                        "NodeName": "申请人",
                                        "IsShow": true,
                                        "IsAlready": false,
                                        "AuditDate": "",
                                        "TaskOpinions": "拒绝",
                                        "ApproveUsers": {

                                        }
                                    }
                                }
                                this.wfData.wfProgress.splice(0, 0, progressOne);
                                if (this.wfData.wfHistory != null && this.wfData.wfHistory.length > 0)
                                    this.wfData.wfHistory.reverse();
                                this.wfView.onInitData(this.wfData.wfProgress);
                            }
                        }, null, null
                    );
                })
        }
    }
    ngDoCheck() {
        if (this.contractData.PurchaseRequisitionDetailsList && this.contractData.PurchaseRequisitionDetailsList.length >= 10) {//出现滚动条的宽度调整
            $(".w140").addClass("w146");
        } else {
            $(".w140").removeClass("w146");
        }
    }
    _initParam() {
        this.urlParamObj.nodeid = this.routerInfo.snapshot.queryParams['nodeid'];
        this.urlParamObj.taskid = this.routerInfo.snapshot.queryParams['taskid'];
        this.urlParamObj.applyid = this.routerInfo.snapshot.queryParams['applyid'];
        this.urlParamObj.adp = this.routerInfo.snapshot.queryParams['ADP'];
        let recordid = this.ActivatedRoute.snapshot.params['id'];
        if (recordid == undefined || recordid == "") {
            recordid = this.routerInfo.snapshot.queryParams['recordid'];
        }
        if (this.urlParamObj.applyid == undefined || this.urlParamObj.applyid == "") {
            this.urlParamObj.applyid = recordid;
        }
        this.appParms.taskid = this.urlParamObj.taskid;
        this.appParms.nodeid = this.urlParamObj.nodeid;
        this.adpAppParms.taskid = this.urlParamObj.taskid;
    }
    _initViewParms() {
        if (this.urlParamObj.taskid != undefined && this.urlParamObj.taskid != "") {
            this.isView = false;
        }
        if (this.urlParamObj.adp != undefined && this.urlParamObj.adp != "") {
            this.isADP = true;
        }
        if (this.urlParamObj.nodeid == "9") {//财务发票
            this.isFinance = true;
        }
    }
    /** approve eng */
}
export class viewChildTopData {//采购清单-物料信息
    public procurementList: null;
    public untaxAmount: number = 0;
    public factory: '';
    public vendor: ''
}
export class textData {//销售信息
    constructor(
        public AccessoryURL = '',//销售合同号
        public AccessoryName = ''//销售合同名称
    ) { }
}