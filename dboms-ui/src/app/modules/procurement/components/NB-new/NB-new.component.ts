import { Component, OnInit } from '@angular/core';
import { HttpServer } from 'app/shared/services/db.http.server';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { WindowService } from 'app/core';
import { Person } from 'app/shared/services/index';

import { SubmitMessageService } from '../../services/submit-message.service'
import {
    PurchaseOrderObj
} from './../../services/NB-new.service';
import {
    UserSettingsData
} from './../../services/contractApply-submit.service';
import { ShareDataService } from './../../services/share-data.service';
@Component({
    templateUrl: 'NB-new.component.html',
    styleUrls: ['NB-new.component.scss', './../../scss/procurement.scss']
})
export class NBNewComponent implements OnInit {
    //获取工厂代码
    public companycode(e) {
        this.saveData.CompanyCode = e;
        console.log(e);
        this.getFlow(this.saveData.CompanyCode);
    }
    saveData = new PurchaseOrderObj();
    isCore(e) {//是否非核心
        this.isMid = e;
    }
    isMid;//接收是否核心供应商
    procurementListShow = false;//采购清单显示标识
    public userInfo = new Person();//登录人头像
    purchaseFormValid =true;//采购清单校验结果
    purchaseData = {//传进采购清单信息
        procurementList: [],
        untaxAmount: 0,
        taxAmount: 0
    }
    AccessorySee = [];//查看附件文件
    accessoryUrl = "api/PurchaseManage/UploadAccessory/2";//附件上传路径
    submiting=false;//提交中
    public submitMassageFlag;
    public submitMassageRes(e) {
        this.submitMassageFlag = e;
    }
    //获取采购信息
    public baseSaveData(e) {
        this.ExtendObject(e, this.saveData);
    }
    availableAmountIdent;//编辑时，存合同的可采购金额
    NBType;//NB单类型
    //获取选中税率
    public GetTaxrateData;
    constructor(
        private dbHttp: HttpServer,
        private WindowService: WindowService,
        private routerInfo: ActivatedRoute,
        private router: Router,
        private SubmitMessageService: SubmitMessageService,
        private shareDataService: ShareDataService
    ) { }
    ngOnInit() {
        let user = JSON.parse(localStorage.getItem("UserInfo"));
        if (user) {//获取登录人头像信息
            this.userInfo["userID"] = user["ITCode"];
            this.userInfo["userEN"] = user["ITCode"].toLocaleLowerCase();
            this.userInfo["userCN"] = user["UserName"];
        } else {
            // this.router.navigate(['/login']); // 未登录 跳转到登录页面
        }
        this.shareDataService.getPlatformSelectInfo().then(data => {//获取平台下拉数据
            this.selectInfo.plateInfo=data;
        });
        this.saveData.ID = this.routerInfo.snapshot.params['id'];//从路由中取出变量id的值
        if (this.saveData.ID) {
            this.getPurchaseOrder(this.saveData.ID);//根据id获取整单数据
        } else {
            let headers = new Headers({ 'Content-Type': 'application/json', 'ticket': localStorage.getItem('ticket') });
            let options = new RequestOptions({ headers: headers });
            this.dbHttp.get("base/GetCurrentUserInfo", options).subscribe(data => {//获取登录人信息
                if (data.Result) {
                    let loginData = JSON.parse(data.Data);
                    this.saveData.Telephone = loginData.Phone;
                    this.saveData.ApplicantItCode = loginData.ITCode;
                    this.saveData.ApplicantName = loginData.UserName;
                    this.saveData.Department = loginData.DeptName;//部门
                    this.saveData.CostCenter = loginData.CostCenterName;//成本中心
                    this.saveData.BBMC = loginData.BBMC;//本部名称
                    this.saveData.SYBMC = loginData.SYBMC;//事业部名称
                    this.saveData.YWFWDM = loginData.YWFWDM;//业务范围代码
                    this.saveData.FlatCode = loginData.FlatCode;//平台代码
                    this.saveData.Platform = loginData.FlatName;//平台
                    this.avtivePlate = [{//显示平台
                        id: loginData.FlatCode,
                        text:loginData.FlatName
                    }];
                    this.getFlow(this.saveData.CompanyCode);
                }
            })
            this.NBType = window.localStorage.getItem("createNBType");
            if (this.NBType == "hasApply") {//获取采购申请信息
                this.getApplyListLocal();
                this.applyListLocalShow = true;
            }
        }
        this.getFlow(this.saveData.CompanyCode);
    }

    public selectInfo = {//下拉框数据
        plateInfo: [] //平台
    }
    avtivePlate;//平台-当前选项
    getPlateform(e) {//平台选择
        this.saveData.FlatCode = e.id;//平台代码
        this.saveData.Platform = e.text;//平台
        this.getFlow(this.saveData.CompanyCode);
    }

    public applyListLocal;//采购申请信息
    applyListLocalShow = false;//有采购申请
    localApplyList = [];//新建，本地已选采购申请
    public getApplyListLocal() {//采购申请信息
        let SelectedData = {
            "PageIndex": 1,
            "PageSize": 999,
            "RrequisitionNumList": []
        }
        let localArr = [];
        if (this.saveData.ID && this.saveData.PurchaseOrderDetails && this.saveData.PurchaseOrderDetails.length) {//编辑
            for (let n = 0, lens = this.saveData.PurchaseOrderDetails.length; n < lens; n++) {
                localArr.push(this.saveData.PurchaseOrderDetails[n].PurchaseRequisitionNum);
            }
            SelectedData.RrequisitionNumList = localArr;
        } else {//新建
            this.localApplyList = JSON.parse(localStorage.getItem("applyList"));
            if (this.localApplyList && this.localApplyList.length) {
                for (let i = 0, len = this.localApplyList.length; i < len; i++) {
                    localArr.push(this.localApplyList[i].requisitionnum);
                }
            }
            SelectedData.RrequisitionNumList = localArr;
        }
        let url = "PurchaseManage/SelectedRequisitionInfo";
        this.dbHttp.post(url, SelectedData).subscribe(data => {
            this.applyListLocal = data.Data.List;
            this.countContractTotal();
        })
    }
    public countContractTotal() {//计算采购申请信息里的localMoney(合同在清单中的未税总价 总计)
        if (this.applyListLocal && this.applyListLocal.length) {
            for (let i = 0, len = this.applyListLocal.length; i < len; i++) {
                this.applyListLocal[i].localMoney = 0;
                if (this.saveData.PurchaseOrderDetails && this.saveData.PurchaseOrderDetails.length) {
                    for (let n = 0, lens = this.saveData.PurchaseOrderDetails.length; n < lens; n++) {
                        if (this.applyListLocal[i].requisitionnum == this.saveData.PurchaseOrderDetails[n].PurchaseRequisitionNum) {
                            let data = this.saveData.PurchaseOrderDetails[n];
                            this.applyListLocal[i].localMoney += Number(data.Amount);
                        }
                    }
                }
            }
        }
    }
    public taskIDLocal;//审批流程id
    public getPurchaseOrder(id) {//获取采购订单数据
        let url = "PurchaseManage/GetPruchaseOrder/" + id;
        this.dbHttp.get(url).subscribe(data => {
            if (data.Result) {
                this.saveData = data.Data;
                console.log("整单数据");
                console.log(this.saveData);
                //审批人
                let personLocal = JSON.parse(this.saveData.WFApproveUserJSON);
                this.personList = this.SubmitMessageService.getPersonList(personLocal);
                if (this.personList.length == 0) {
                    this.personList.push({ person: [] });
                }
                this.purchaseData.procurementList = this.saveData.PurchaseOrderDetails;//采购清单信息
                this.purchaseData.untaxAmount = this.saveData.PruchaseAmount;//未税总金额
                this.purchaseData.taxAmount = this.saveData.PruchaseAmountTax;//含税总金额
                let i; let len = this.saveData.PurchaseOrderAccessories.length;
                for (i = 0; i < len; i++) {
                    if (!this.saveData.PurchaseOrderAccessories[i]) {//去除附件数组中的空值
                        this.saveData.PurchaseOrderAccessories.splice(i, 1);
                        len--;
                        i--;
                    } else {//组织显示附件数组
                        this.AccessorySee.push({
                            name: this.saveData.PurchaseOrderAccessories[i].AccessoryName
                        })
                    }
                }
                if (this.saveData.PurchaseOrderDetails[0]["DBOMS_PurchaseRequisitionSaleContract_ID"]) {//非BH情况
                    //获取采购申请信息
                    this.getApplyListLocal();
                    this.applyListLocalShow = true;
                    //获取合同可采购金额额度
                    let arr = [];
                    for (let i = 0, len = this.saveData.PurchaseOrderDetails.length; i < len; i++) {
                        arr.push(this.saveData.PurchaseOrderDetails[i]["DBOMS_PurchaseRequisitionSaleContract_ID"]);
                    }
                    this.dbHttp.post("PurchaseManage/GetAvaliable", arr).subscribe(data => {
                        if (data.Result) {
                            this.availableAmountIdent = data.Data;
                        }
                    })
                }
                //驳回时获取当前审批信息
                if (data.Data.ApproveID) {
                    let wfidLocal = data.Data.ApproveID;
                    console.log(wfidLocal);
                    let wfidUrl = "PurchaseManage/GetCurrentTaskId/" + wfidLocal;
                    this.dbHttp.get(wfidUrl).subscribe(data => {
                        this.taskIDLocal = JSON.parse(data.Data)[0];
                        console.log(this.taskIDLocal);
                    })
                }
                this.avtivePlate = [{//显示平台
                    id: this.saveData.FlatCode,
                    text:this.saveData.Platform
                }];
            } else {
                this.WindowService.alert({ message: '接口异常', type: 'fail' });
            }
        })
    }
    saveNBOrder(type) {//提交NB
        this.saveData.ApproveState = type;
        this.delPurchaseFormListBlank();//删除空的采购清单
        if (type == "提交") {
            if (!this.saveData.Telephone) {
                this.WindowService.alert({ message: '联系方式不能为空', type: 'warn' });
                return;
            }
            if (!this.saveData.FlatCode || !this.saveData.Platform) {//平台验证(一般情况下都有值)
                this.WindowService.alert({ message: '平台不能为空', type: 'warn' });
                return;
            }
            if (!this.submitMassageFlag) {//采购信息
                this.massageValid();
                return;
            }
            if (this.saveData.VendorNo.substring(0, 2) == "10") {
                if (!this.saveData.BusinessRange) {
                    this.WindowService.alert({ message: '内部供应商000100开头时对方业务范围为必填', type: 'warn' });
                    return;
                }
            }
            if (this.isMid) {//非核心不允许提交
                this.WindowService.alert({ message: '非核心供应商不允许提交', type: 'warn' });
                return;
            }
            // alertFun(this.saveData.BusinessRange, "对方业务范围");

            // if (!this.saveData.traceno) {//需求跟踪号
            //     if (!this.saveData.istoerp) {
            //         this.WindowService.alert({ message: '写入ERP时，需求跟踪号不能为空', type: 'warn' });
            //     }
            // }
            if (!this.saveData.PurchaseOrderDetails || !this.saveData.PurchaseOrderDetails.length) {//清单必须有一条
                this.WindowService.alert({ message: '采购清单至少应填写一条', type: 'warn' });
                return;
            }
            if (!this.purchaseFormValid) {//采购清单校验未通过
                this.purchaseFormAccurateValid();
                return;
            }
            if (this.saveData.PurchaseOrderDetails[0]["DBOMS_PurchaseRequisitionSaleContract_ID"]) {//非BH情况，校验合同可采购金额
                if (!this.checkAvailableAmount()) {
                    this.WindowService.alert({ message: '采购订单金额不在合同可采购订单金额范围内', type: 'warn' });
                    return;
                }
            }
        }
        //  校验通过提交
        this.submiting=true;
        this.saveData.PurchaseOrderDetails.forEach(item => {
            if ('isExcel' in item) {
                delete item["isExcel"];
            }
            if ('isImport' in item) {
                delete item["isImport"];
            }
        });
        let url = "PurchaseManage/SavePurchaseOrder";
        
        if (this.taskIDLocal) {
            this.saveData.ApproveState = "驳回";
        }
        let body = this.saveData;
        let headers = new Headers({ 'Content-Type': 'application/json', 'ticket': localStorage.getItem('ticket') });
        let options = new RequestOptions({ headers: headers });
        console.log("提交的整条数据");
        console.log(this.saveData);
        console.log(JSON.stringify(this.saveData));
        this.dbHttp.post(url, body, options).subscribe(data => {
            this.submiting=false;
            if (data.Result) {
                if (!this.saveData.ID) {//新建
                    window.localStorage.removeItem('applyList');
                    window.localStorage.removeItem('createNBType');
                }
                //发起流程
                if (this.taskIDLocal) {
                    let url = "PurchaseManage/ApproveOrder";
                    let headers = new Headers({ 'Content-Type': 'application/json', 'ticket': localStorage.getItem('ticket') });
                    let options = new RequestOptions({ headers: headers });
                    let body = {
                        "taskid": this.taskIDLocal,//任务id
                        "opinions": "同意",//审批意见
                        "approveresult": "Approve"//批准：Approve，拒绝：Reject
                    }
                    this.dbHttp.post(url, body, options).subscribe(data => {
                        console.log(data.Data);
                    })
                }
                if (this.saveData.ApproveState == "提交") {//提交
                    this.WindowService.alert({ message: "提交成功", type: 'success' });
                } else {//暂存
                    this.WindowService.alert({ message: "保存成功", type: 'success' });
                }
                this.router.navigate(['procurement/procurement-order/my-apply']);
            } else {
                this.WindowService.alert({ message: data.Message, type: 'fail' });
            }
        })
    }
    checkAvailableAmount() {//校验合同可采购金额
        if (this.saveData.ID) {//编辑
            for (let key in this.availableAmountIdent) {
                let total = 0;
                for (let k = 0, lens = this.saveData.PurchaseOrderDetails.length; k < lens; k++) {
                    let detaiItem = this.saveData.PurchaseOrderDetails[k];
                    if (detaiItem["DBOMS_PurchaseRequisitionSaleContract_ID"] == key) {//选中
                        total += detaiItem["Amount"];
                    }
                }
                if(this.availableAmountIdent[key] *  0.05<500){//上下5%
                    if (total < this.availableAmountIdent[key]
                        || (total > this.availableAmountIdent[key] * 0.95 && total < this.availableAmountIdent[key] * 1.05)) {
                        continue;
                    }
                }else{//上下500
                    if (total < this.availableAmountIdent[key]
                        || Math.abs(total - this.availableAmountIdent[key]) < 500) {
                        continue;
                    }
                }
                return false;
            }
        } else {//新建
            for (let i = 0, len = this.localApplyList.length; i < len; i++) {
                let total = 0;
                for (let k = 0, lens = this.saveData.PurchaseOrderDetails.length; k < lens; k++) {
                    let detaiItem = this.saveData.PurchaseOrderDetails[k];
                    if (detaiItem["DBOMS_PurchaseRequisitionSaleContract_ID"] == this.localApplyList[i]["id"]) {//选中
                        total += detaiItem["Amount"];
                    }
                }
                if(this.localApplyList[i]["available"] *  0.05<500){//上下5%
                    if (total < this.localApplyList[i]["available"]
                        || (total > this.localApplyList[i]["available"] * 0.95 && total < this.localApplyList[i]["available"] * 1.05)) {
                        continue;
                    }
                }else{//上下500
                    if (total < this.localApplyList[i]["available"]
                        || Math.abs(total - this.localApplyList[i]["available"]) < 500) {
                        continue;
                    }
                }
                return false;
            }
        }
        return true;
    }
    public massageValid() {//验证采购信息
        let self = this;
        let alertFun = function (val, str) {
            if (!val && str != '税率') {
                self.WindowService.alert({ message: '采购信息中' + str + '不能为空', type: 'warn' });
                return;
            }
            if (str == '税率' && val == null ) {
                self.WindowService.alert({ message: '采购信息中税率不能为空', type: 'warn' });
                return;
            }
        }
        alertFun(this.saveData.CompanyName, "我方主体");
        alertFun(this.saveData.FactoryCode, "工厂");
        alertFun(this.saveData.Vendor, "供应商");
        alertFun(this.saveData.RateValue, "税率");
        alertFun(this.saveData.Currency, "币种");
        alertFun(this.saveData.TrackingNumber, "需求跟踪号");
    }
    onPurchaseDataChange(e) {//采购清单信息变化
        this.saveData.PurchaseOrderDetails = e.procurementList;
        this.saveData.PruchaseAmount = e.untaxAmount;
        this.saveData.PruchaseAmountTax = e.taxAmount;
        this.countContractTotal();
    }
    purchaseFormValidChange(e) {//采购清单校验发生变化
        this.purchaseFormValid = e;
    }
    onUploadBack(e) {//文件上传返回
        if (e.Result) {
            this.saveData.PurchaseOrderAccessories.push(e.Data);
        }
    }
    onDeleteItem(e) {//删除文件
        this.saveData.PurchaseOrderAccessories.splice(e, 1);
    }
    delPurchaseFormListBlank() {//去除采购清单空白项 & 填充需求跟踪号 & 填充批次
        let i; let item;
        let len = this.saveData.PurchaseOrderDetails.length;
        for (i = 0; i < len; i++) {
            item = this.saveData.PurchaseOrderDetails[i];
            if (!item.MaterialNumber && !item.Count && !item.Price
                && (!item.MaterialSource || !item.DBOMS_PurchaseRequisitionSaleContract_ID)) {
                this.saveData.PurchaseOrderDetails.splice(i, 1);
                len--;
                i--;
            } else {
                if (!item.TrackingNumber) {
                    item.TrackingNumber = this.saveData.TrackingNumber;
                }
                if (!item.Batch) {
                    item.Batch = "批次";
                }
            }
        }
    }
    purchaseFormAccurateValid() {//采购清单精确进行校验
        let self = this;
        let alertFun = function (val, str) {
            if (!val && str != '库存地') {
                self.WindowService.alert({ message: '采购清单中' + str + '不能为空', type: 'warn' });
                return;
            }
            if (str == '库存地' && val.length != 4) {
                self.WindowService.alert({ message: '请输入4位库存地', type: 'warn' });
                return;
            }
        }
        this.saveData.PurchaseOrderDetails.forEach((item, index) => {
            alertFun(item.MaterialNumber, '物料编号');
            alertFun(item.Count, '数量');
            alertFun(item.Price, '未税单价');
            alertFun(item.StorageLocation, '库存地');
            alertFun(item.MaterialSource, '物料来源');
        })
    }
    public personList = [];//传递原有人员
    getChange(e) {//获取人员
        console.log(e);
        this.WorkFlowConfigInfo[0].UserSettings = [];
        for (let i = 0, len = e.length; i < len; i++) {
            this.WorkFlowConfigInfo[i].UserSettings = [];
            if (e[i].person != '') {
                this.WorkFlowConfigInfo[i].UserSettings.push(new UserSettingsData(
                    e[i].person[0].itcode,
                    e[i].person[0].name
                ))
            }
            this.WorkFlowConfigInfo[i].UserSettings = JSON.stringify(this.WorkFlowConfigInfo[i].UserSettings);
            this.WorkFlowConfigInfo[i].IsOpened = 1;
        }
        this.saveData.WFApproveUserJSON = JSON.stringify(this.WorkFlowConfigInfo);
    }
    //流程启动
    public ApproverListData = [];
    public WorkFlowConfigInfo;
    public personArr = [];//审批人员信息
    public getFlow(com) {
        let url = "PurchaseManage/GetWorkFlowConfigInfo_Purchase";//获得流程节点审批人信息
        let body ={
            "FlatCode":this.saveData.FlatCode,/*平台代码*/
            "BizScopeCode":this.saveData.YWFWDM, /*登录人的所属业务范围代码*/
            "WorkFlowCategory": "NBORDER" /*流程类型*/
        }
        let headers = new Headers({ 'Content-Type': 'application/json', 'ticket': localStorage.getItem('ticket') });
        let options = new RequestOptions({ headers: headers });
        this.dbHttp.post(url, body, options).subscribe(data => {
            if (data.Result) {
                let localData = JSON.parse(data.Data);
                this.WorkFlowConfigInfo = localData;
                this.ApproverListData = localData[0].ApproverList;
                this.personList = this.SubmitMessageService.transformPreparePersonList(localData);
                this.personArr = this.SubmitMessageService.transformApprovePersonList(localData, '', com, '');
                this.saveData.WFApproveUserJSON = JSON.stringify(this.WorkFlowConfigInfo);
            }
        })
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
    closeWindow() {
        window.close();
    }
}