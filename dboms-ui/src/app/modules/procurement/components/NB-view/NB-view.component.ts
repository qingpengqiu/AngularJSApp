import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpServer } from 'app/shared/services/db.http.server';
import { WindowService } from 'app/core';
import {
    PurchaseOrderObj
} from './../../services/NB-new.service';
import { ActivatedRoute } from '@angular/router';
import { DbWfviewComponent } from 'app/shared/index';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
declare var $:any;
import { ProcurementTemplateService } from './../../services/procurement-template.service';

@Component({
    templateUrl: 'NB-view.component.html',
    styleUrls: ['NB-view.component.scss']
})
export class NBViewComponent implements OnInit {
    @ViewChild('wfview')
    wfView: DbWfviewComponent;
    constructor(
        private dbHttp: HttpServer,
        private WindowService: WindowService,
        private ActivatedRoute: ActivatedRoute,
        private routerInfo: ActivatedRoute,
        private procurementTemplateService: ProcurementTemplateService
    ) { }
    // public urlFlag=false;
    ngOnInit() {
        // if(this.routerInfo.snapshot.url[0].path=="approval-nb"){
        //     this.urlFlag = true;
        // }else{
        //     this.urlFlag = false;
        // }
        this._initParam();
        this.onGetWfHistoryData();
        this._initViewParms();
        this.contractData = new PurchaseOrderObj();
        let localId;
        if (this.urlParamObj.applyid != undefined && this.urlParamObj.applyid != '') {
            localId = this.urlParamObj.applyid;
        } else {
            localId = this.ActivatedRoute.snapshot.params['id'];
        }
        // localId = "40488856-370A-480F-BE38-03795DE33513";
        this.getPurchaseOrder(localId);//整单数据
        this.getRequisition(localId);//获取审批流程
        this.urlParamObj.applyid = localId;
        this.getNodeId(localId);
    }
     ngDoCheck() {
        if(this.applyListLocal && this.applyListLocal.length>=10){//出现滚动条的宽度调整
            $(".w170").addClass("w176");
        }else{
            $(".w170").removeClass("w176");
        }
     }
    //附件
    public AccessorySee_one=[];//附件
    public meterialNum = 0;//物料数量
    public applyListLocal;//采购申请信息
    applyListLocalShow=false;//有采购申请
    procurementListShow=false;//采购清单是否显示标识
    public getApplyListLocal() {//采购申请信息
        let SelectedData = {
            "PageIndex": 1,
            "PageSize":999,
            "RrequisitionNumList": []
        }
        let localArr = [];
        if (this.contractData.PurchaseOrderDetails && this.contractData.PurchaseOrderDetails.length) {//编辑
            for (let n = 0, lens = this.contractData.PurchaseOrderDetails.length; n < lens; n++) {
                localArr.push(this.contractData.PurchaseOrderDetails[n].PurchaseRequisitionNum);
            }
            SelectedData.RrequisitionNumList = localArr;
        }
        let url = "PurchaseManage/SelectedRequisitionInfo";
        this.dbHttp.post(url,SelectedData).subscribe(data => {
            this.applyListLocal = data.Data.List;
            this.countContractTotal();
        })
    }
    public countContractTotal(){//计算采购申请信息里的localMoney(合同在清单中的未税总价 总计)
        if (this.applyListLocal && this.applyListLocal.length) {
            for (let i = 0, len = this.applyListLocal.length; i < len; i++) {
                this.applyListLocal[i].localMoney = 0;
                if(this.contractData.PurchaseOrderDetails && this.contractData.PurchaseOrderDetails.length){
                    for (let n = 0, lens = this.contractData.PurchaseOrderDetails.length; n < lens; n++) {
                        if (this.applyListLocal[i].requisitionnum == this.contractData.PurchaseOrderDetails[n].PurchaseRequisitionNum) {
                            let data = this.contractData.PurchaseOrderDetails[n];
                            this.applyListLocal[i].localMoney += Number(data.Amount);
                        }
                    }
                }
            }
        }
    }
    public IsCenter;//供应商10开头
    public TemplateName;//模板名称
    //获取整单数据
    public getPurchaseOrder(id) {//获取采购订单数据
        let url = "PurchaseManage/GetPruchaseOrder/" + id;
        this.dbHttp.get(url).subscribe(data => {
            if (data.Result) {
                this.contractData = data.Data;
                console.log("整条数据");
                console.log(this.contractData);
                // this.procurementList = this.contractData.PurchaseOrderDetails;
                this.contractData.AddTime = this.ChangeDateFormat(this.contractData.AddTime);
                // this.contractData.preselldate = this.ChangeDateFormat(this.contractData.preselldate);
                this.contractData.VendorNo=0+Number(this.contractData.VendorNo);
                this.contractData.VendorNo=JSON.stringify(this.contractData.VendorNo);
                if(this.contractData.VendorNo.substring(0,2)=="10"){
                    this.IsCenter = true;
                }
                if(this.contractData.ERPOrderNumber){
                    this.tracenoFlag=true;
                };
                for(let i=0,len=this.contractData.PurchaseOrderDetails.length;i<len;i++){//采购清单的物料来源显示 进行拼接
                    let item=this.contractData.PurchaseOrderDetails[i];
                    if(item["DBOMS_PurchaseRequisitionSaleContract_ID"]){
                        item["text"]=item["PurchaseRequisitionNum"] + "-" + item["MainContractCode"];
                    }else{
                        item["text"]=item["MaterialSource"];
                    }
                    this.meterialNum = this.meterialNum + this.contractData.PurchaseOrderDetails[i].Count;
                }
                this.AccessorySee_one = []
                for (let i = 0, len = this.contractData.PurchaseOrderAccessories.length; i < len; i++) {
                    if (this.contractData.PurchaseOrderAccessories[i].AccessoryType == 22) {
                        
                        this.AccessorySee_one.push(
                            new textData (
                                this.contractData.PurchaseOrderAccessories[i].AccessoryURL,
                                this.contractData.PurchaseOrderAccessories[i].AccessoryName                               
                            )    
                        )
                    }
                }
                if(this.contractData.PurchaseOrderDetails[0]["DBOMS_PurchaseRequisitionSaleContract_ID"]){//非BH情况
                    //获取采购申请信息
                    this.getApplyListLocal();
                    this.applyListLocalShow=true;
                }
                if(this.contractData.TemplateID){//获取模板名称
                    this.procurementTemplateService.getProcurementTplOne(this.contractData.TemplateID).then(data=>{
                        if(data.Result){
                            this.TemplateName=data.Data.Name;
                        }
                    })
                }
            } else {
                this.WindowService.alert({ message: '接口异常', type: 'fail' });
            }
        })
    }
    //查看用印制作合同
    checkSeal(url) {
        url = "http://10.0.1.26:88"+url;
        window.open(url);
    }
    // public procurementList;
    //获取当前节点
    // public nodeidLocal;//当前节点
    // public nodeidLast;//最后节点
    // public nodeFlag=false;
    public tracenoFlag =false;//是否有traceno
    public getNodeId(localId) {
        let nodeIDUrl = "PurchaseManage/GetCurrentWFNode_PurchaseOrder/" + localId;
        let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
        let options = new RequestOptions({ headers: headers });
        this.dbHttp.post(nodeIDUrl, {}, options)
            .toPromise()
            .then(res => {
                if (res.Data) {
                    let data = JSON.parse(res.Data);
                    // this.nodeidLocal = data.nodeid;
                    // if(this.nodeidLocal==this.nodeidLast&&(this.nodeidLast&&this.nodeidLocal)){
                    //     this.nodeFlag=true;
                    // }
                }
            })
    }
    //获取流程信息
    public getRequisition(e) {
        let url = "PurchaseManage/PurchaseOrderApproveHistory/" + e
        this.dbHttp.post(url).subscribe(data => {
            let localData = JSON.parse(data.Data);
            this.wfData = JSON.parse(data.Data);
            if (this.wfData.wfHistory != null && this.wfData.wfHistory.length > 0)
                this.wfData.wfHistory.reverse();
            this.wfView.onInitData(this.wfData.wfProgress);
            // for(let i=0,len=this.wfData.wfProgress.length;i<len;i++){
            //     if(this.wfData.wfProgress[i].IsShow==true){
            //         this.nodeidLast=this.wfData.wfProgress[i].NodeID
            //     }
            // }
            // if(this.nodeidLocal==this.nodeidLast&&(this.nodeidLast&&this.nodeidLocal)){
            //     this.nodeFlag=true;
            // }
        })
    }
    //流程最后写入erp
    public writeERP(){
        let nodeIDUrl = "PurchaseManage/Order2ERP/" + this.contractData.ID;
        let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
        let options = new RequestOptions({ headers: headers });
        this.dbHttp.post(nodeIDUrl, {}, options)
            .toPromise()
            .then(res => {
                if (!res.Result) {
                    alert(res.Message)
                    // this.WindowService.alert({ message: res.Message, type: 'fail' });
                }
                else{
                    this.contractData.ERPOrderNumber=res.Data;
                    this.tracenoFlag=true;
                    alert(res.Message)
                    // this.WindowService.alert({ message: res.Message, type: 'success' });
                }
            })
    }
    public contractData;//整单数据
    public BackPurchaseList;
    public viewChildFlag = false;
    public PurchaseRequisitionSaleContractListData;//销售消息获取

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
        apiUrl_AR: "PurchaseManage/ApproveOrder",
        apiUrl_Sign: "PurchaseManage/AddTask",
        apiUrl_Transfer: "PurchaseManage/AddTransferTask",
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
    onGetWfHistoryData() {
        if (this.urlParamObj.applyid != undefined && this.urlParamObj.applyid != '') {
            let url = "PurchaseManage/PurchaseOrderApproveHistory/" + this.urlParamObj.applyid;
            let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
            let options = new RequestOptions({ headers: headers });
            let nodeIDUrl = "PurchaseManage/GetCurrentWFNode_PurchaseOrder/" + this.urlParamObj.applyid;
            this.dbHttp.post(nodeIDUrl, {}, options)
            .toPromise()
            .then(res => {
                console.log(res)
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
                            console.log(this.wfData.wfProgress,progressOne);
                            if (this.wfData.wfHistory != null && this.wfData.wfHistory.length > 0)
                                this.wfData.wfHistory.reverse();
                            this.wfView.onInitData(this.wfData.wfProgress);
                        }
                    }, null, null
                );
            })
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
export class textData {//销售信息
    constructor(
      public AccessoryURL = '',//销售合同号
      public AccessoryName = ''//销售合同名称
    ) { }
  }