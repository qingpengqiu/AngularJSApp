import { Component, OnInit, DoCheck } from '@angular/core';
import { SubmitMessageService } from '../../services/submit-message.service'
import { HttpServer } from 'app/shared/services/db.http.server';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { WindowService } from 'app/core';
import { Location } from '@angular/common';
import { Pager } from 'app/shared/index';
import { Person } from 'app/shared/services/index';
import { dbomsPath } from "environments/environment";
import { ShareDataService } from './../../services/share-data.service';
declare var window: any;

import {
    ContractApply, PurchaseRequisitionSaleContractListData, UserSettingsData
} from './../../services/contractApply-submit.service';

@Component({
    templateUrl: 'contractApply-submit.component.html',
    styleUrls: ['contractApply-submit.component.scss', './../../scss/procurement.scss']
})
export class ContractApplySubmitComponent implements OnInit {
    saveData = new ContractApply();
    public companycode(e){//获取工厂代码
        this.saveData.companycode=e;
        this.getFlow(this.saveData.factory, this.saveData.vendorno,this.saveData.istoerp,this.saveData.companycode);
    }
    
    public FacVend(e) {//FacVend 获取工厂和供应商
        if (e.factory && e.vendorno) {
            //输入工厂及选择供应商时触发流程
            this.getFlow(e.factory, e.vendorno,this.saveData.istoerp,this.saveData.companycode);
        }
    }
    //获取销售信息
    public submitMassageFlag;
    AccessoryList_one = [];//支持文件
    AccessoryList_two = [];//采购合同用印文件
    AccessorySee_one = [];//查看支持文件
    AccessorySee_two = [];//查看采购合同用印文件
    submiting=false;//提交中
    public submitMassageRes(e) {
        this.submitMassageFlag = e;
    }//采购信息必须填项验证
    public PurchaseRequisitionSaleContractListSTR;
    public excludetaxmoneyFlag=false;//未税金额必填
    public sellList(e) {//返回销售信息变化
        this.excludetaxmoneyFlag = true;
        this.saveData.PurchaseRequisitionSaleContractList = e;
        this.PurchaseRequisitionSaleContractListSTR = JSON.stringify(e);
        let localData = [];
        let totalExcludetaxmoney = 0;//累计未税总额
        let totalTaxinclusivemoney = 0;//累计含税总额
        for (let i = 0, len = e.length; i < len; i++) {
            if (e[i].excludetaxmoney == '' || e[i].excludetaxmoney == 0 || e[i].excludetaxmoney == null) {
                this.excludetaxmoneyFlag = false;
            }
            localData.push(
                new PurchaseRequisitionSaleContractListData(
                    e[i].salecontractcode,
                    e[i].MainContractCode,
                    e[i].excludetaxmoney,
                    e[i].taxinclusivemoney,
                    e[i].foreigncurrencymoney,
                    // e[i].cumulativeconsumemoney,
                    e[i].addtime
                )
            )
            totalExcludetaxmoney += Number(e[i].excludetaxmoney);//未税
            totalTaxinclusivemoney += Number(e[i].taxinclusivemoney);//含税
        }
        if (!this.saveData.PurchaseRequisitionDetailsList || !this.saveData.PurchaseRequisitionDetailsList.length) {//没有清单
            this.saveData.excludetaxmoney = totalExcludetaxmoney;//未税总金额
            this.saveData.taxinclusivemoney = totalTaxinclusivemoney;//含税总金额
            this.saveData.sealmoney = totalTaxinclusivemoney;//用印金额
            console.log(this.saveData.excludetaxmoney);
            console.log(this.saveData.taxinclusivemoney);
        }
        this.getFlow(this.saveData.factory, this.saveData.vendorno,this.saveData.istoerp,this.saveData.companycode);
        this.saveData.PurchaseRequisitionSaleContractList = localData;
    }
    //获取采购信息
    public currencyArr;//传递货币信息
    public baseSaveData(e) {
        this.ExtendObject(e, this.saveData);
        let jsonData = {
            currency: e.currency,
            currencycode: e.currencycode
        }
        this.currencyArr = JSON.stringify(jsonData);
    }

    //获取是否rmb
    public IsRMB;
    public IsRMBData(e) {
        this.IsRMB = e;
    }
    //获取选中税率
    public GetTaxrateData;
    public TaxrateData(e) {
        this.GetTaxrateData = e;
    }
    procurementListShow = false;//采购清单显示标识
    public userInfo = new Person();//登录人头像
    valid = {//组件校验结果
        'purchaseFormValid':true
    }
    constructor(private location: Location,
        private dbHttp: HttpServer,
        private SubmitMessageService: SubmitMessageService,
        private shareDataService: ShareDataService,
        private WindowService: WindowService,
        private route: ActivatedRoute,
        private router: Router) { }

    purchaseData = {//传进采购清单信息
        procurementList: [],
        untaxAmount: 0,
        taxAmount: 0
    }
    supportDocumentUrl = "api/PurchaseManage/UploadAccessory/0";//支持文件上传路径
    contractPrintUrl = "api/PurchaseManage/UploadAccessory/1";//采购合同用印文件上传路径

    isOutsourcing = false;//是否外购
    erpIsDisable=false;//写入ERP按钮是否disables
    isCore(e) {//是否非核心变化 true-非核心;false-核心
        this.isOutsourcing = e;
        if(this.isOutsourcing && !this.saveData.istoerp){
            this.directlyChange(true);//是外购时，必须写入ERP
        }
        this.erpIsDisable=this.isOutsourcing;
    }
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
        this.saveData.purchaserequisitionid = this.route.snapshot.params['id'];//从路由中取出变量id的值
        if (this.saveData.purchaserequisitionid) {
            this.getProcurementData(this.saveData.purchaserequisitionid);//根据id获取整单数据
        } else {
            let headers = new Headers({ 'Content-Type': 'application/json', 'ticket': localStorage.getItem('ticket') });
            let options = new RequestOptions({ headers: headers });
            this.dbHttp.get("base/GetCurrentUserInfo", options).subscribe(data => {//获取登录人信息
                if (data.Result) {
                    let loginData = JSON.parse(data.Data);
                    this.saveData.phone = loginData.Phone;
                    this.saveData.itcode = loginData.ITCode;
                    this.saveData.username = loginData.UserName;
                    this.saveData.homeoffice = loginData.BBMC;//本部
                    this.saveData.bizdivision = loginData.SYBMC;//事业部
                    this.saveData.YWFWDM = loginData.YWFWDM;//业务范围代码
                    this.saveData.FlatCode = loginData.FlatCode;//平台代码
                    this.saveData.plateform = loginData.FlatName;//平台
                    this.avtivePlate = [{//显示平台
                        id: loginData.FlatCode,
                        text:loginData.FlatName
                    }];
                    this.getFlow(this.saveData.factory, this.saveData.vendorno,this.saveData.istoerp,this.saveData.companycode);
                }
            })
        }
        // this.getFlow();
        this.getNodeId();
    }

    public selectInfo = {//下拉框数据
        plateInfo: [] //平台
    }
    avtivePlate;//平台-当前选项
    getPlateform(e) {//平台选择
        this.saveData.FlatCode = e.id;//平台代码
        this.saveData.plateform = e.text;//平台
        this.getFlow(this.saveData.factory, this.saveData.vendorno,this.saveData.istoerp,this.saveData.companycode);
    }

    public personList = [];//传递原有人员
    public taskIDLocal;//审批流程id
    public RequisitionRecordUrl;
    public getProcurementData(id) {//获取整单数据
        let url = "PurchaseManage/GetPurchaseRequisitionById/" + id;
        this.dbHttp.get(url).subscribe(data => {
            if (data.Result) {
                let locaData = JSON.parse(data.Data);
                this.saveData = JSON.parse(data.Data);
                //获取税率
                this.GetTaxrateData = this.saveData.taxrate;
                //传递给销售信息
                this.PurchaseRequisitionSaleContractListData = JSON.stringify(this.saveData.PurchaseRequisitionSaleContractList);
                //驳回时获取当前审批信息
                if (locaData.wfid) {
                    let wfidLocal = locaData.wfid;
                    let wfidUrl = "PurchaseManage/GetCurrentTaskId/" + wfidLocal;
                    this.dbHttp.get(wfidUrl).subscribe(data => {
                        this.taskIDLocal = JSON.parse(data.Data)[0];
                    })
                }
                //编辑时获取币种信息
                let jsonData = {
                    currency: locaData.currency,
                    currencycode: locaData.currencycode
                }
                this.currencyArr = JSON.stringify(jsonData);
                //审批人
                let personLocal = JSON.parse(locaData.WFApproveUserJSON);
                this.personList = this.SubmitMessageService.getPersonList(personLocal);
                if (this.personList.length == 0) {
                    this.personList.push({ person: [] });
                }
                let requisitionnum = locaData.requisitionnum;
                this.RequisitionRecordUrl = "PurchaseManage/GetRequisitionRecord/"+requisitionnum
                this.dbHttp.get(this.RequisitionRecordUrl + "/" + 1 + "/" + 10).subscribe(data => {
                    this.RequisitionRecord = data.Data.List;
                    //重置pager
                    let localData = data.Data;
                    this.pagerData.set({
                        total: localData.TotalCount,
                        totalPages: localData.PageCount
                    })
                })
                this.purchaseData.procurementList = this.saveData.PurchaseRequisitionDetailsList;
                this.purchaseData.untaxAmount = this.saveData.excludetaxmoney;
                this.purchaseData.taxAmount = this.saveData.taxinclusivemoney;
                let existContractList=[];
                this.saveData.PurchaseRequisitionSaleContractList.forEach(item => {//拼接合同列表
                    existContractList.push({
                        'SC_Code': item.salecontractcode,
                        'MainContractCode': item.MainContractCode
                    })
                })
                window.localStorage.setItem("contractList",JSON.stringify(existContractList));
                let i; let len = this.saveData.AccessoryList.length;
                for (i = 0; i < len; i++) {//去除附件数组中的空值
                    if (!this.saveData.AccessoryList[i]) {
                        this.saveData.AccessoryList.splice(i, 1);
                        len--;
                        i--;
                    }
                }
                this.baseMassage = this.saveData;
                this.BackPurchaseList = this.saveData.PurchaseRequisitionDetailsList;
                this.saveData.AccessoryList.forEach(item => {//分离支持文件和用印文件
                    if (item.AccessoryType == "20") {
                        this.AccessorySee_one.push({
                            name: item.AccessoryName
                        })
                        this.AccessoryList_one.push(item);
                    }
                    if (item.AccessoryType == "21") {
                        this.AccessorySee_two.push({
                            name: item.AccessoryName
                        })
                        this.AccessoryList_two.push(item);
                    }

                })
                this.avtivePlate = [{//显示平台
                    id: this.saveData.FlatCode,
                    text:this.saveData.plateform
                }];
            }
            else {
                this.WindowService.alert({ message: '接口异常', type: 'fail' });
            }
        })
    }
    public RequisitionRecord = [];//修改记录
    public pagerData = new Pager();//分页
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
                    this.PageDataFlag = JSON.parse(data.Data);
                    this.pagerData.set({
                        total: this.PageDataFlag.TotalCount,
                        totalPages: this.PageDataFlag.PageCount
                    })
                });
        }
    }
    viewContractApply(id){//查看修改记录中-记录
        window.open(dbomsPath+'procurement/view-contractApply/'+id);
    }

    purchaseFormValidChange(e) {//采购清单校验发生变化
        this.valid.purchaseFormValid = e;
    }
    directlyChange(e) {//是否写入ERP变化
        if(String(e)=="true"){
            this.saveData.istoerp=Boolean(1);
        }else{
            this.saveData.istoerp=Boolean(0);
        }
        this.getFlow(this.saveData.factory, this.saveData.vendorno,this.saveData.istoerp,this.saveData.companycode);
    }
    onUploadBack(e, type) {//文件上传返回
        if (e.Result) {
            if (type == 1) {
                this.AccessoryList_one.push(e.Data);
            }
            if (type == 2) {
                this.AccessoryList_two.push(e.Data);
            }
        }
    }
    onDeleteItem(e, type) {//删除文件
        if (type == 1) {
            this.AccessoryList_one.splice(e, 1);
        }
        if (type == 2) {
            this.AccessoryList_two.splice(e, 1);
        }
    }
    onPurchaseDataChange(e) {//采购清单信息变化
        this.saveData.PurchaseRequisitionDetailsList = e.procurementList;
        this.saveData.excludetaxmoney = e.untaxAmount;
        this.saveData.taxinclusivemoney = e.taxAmount;
        // this.saveData.sealmoney = e.taxAmount;
        this.BackPurchaseList = this.saveData.PurchaseRequisitionDetailsList;
        if(e.taxAmount){
            this.saveData.sealmoney = e.taxAmount;
        }
        // this.PurchaseRequisitionSaleContractListData = JSON.stringify(this.saveData.PurchaseRequisitionSaleContractList);
    }
    getChange(e) {
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
    //返回采购信息给销售模块
    public BackPurchaseList;
    public PurchaseRequisitionSaleContractListData;
    //返回采购信息
    public baseMassage;
    confirmSubmit = false;//确认提交

    public saveContractApply(type) {//提交申请
        this.confirmSubmit = false;
        this.saveData.wfstatus = type;
        this.delPurchaseFormListBlank();//删除空的采购清单
        if (type == "草稿") {
            this.confirmSubmit = true;//直接提交
            return;
        }
        if (!this.saveData.phone) {
            this.WindowService.alert({ message: '联系方式不能为空', type: 'warn' });
            return;
        }
        if (!this.saveData.FlatCode || !this.saveData.plateform) {//平台验证(一般情况下都有值)
            this.WindowService.alert({ message: '平台不能为空', type: 'warn' });
            return;
        }
            if (!this.submitMassageFlag) {//采购信息
                this.massageValid();
                return;
            }
            if (!this.saveData.currency) {
                this.WindowService.alert({ message: '采购信息中币种不能为空', type: 'warn' });
                return;
            }
            let localvendorno = null;
            localvendorno = 0 + Number(this.saveData.vendorno);
            localvendorno = JSON.stringify(localvendorno);
            if (localvendorno.substring(0, 2) == "10") {
                if (!this.saveData.vendorbizscope) {
                    this.WindowService.alert({ message: '内部供应商000100开头时对方业务范围为必填', type: 'warn' });
                }
            }
            if (this.saveData.istoerp && !this.saveData.traceno) {//需求跟踪号
                this.WindowService.alert({ message: '写入ERP时，需求跟踪号不能为空', type: 'warn' });
                return;
            }
        if((this.isOutsourcing || this.saveData.istoerp) &&
            (!this.saveData.PurchaseRequisitionDetailsList || !this.saveData.PurchaseRequisitionDetailsList.length)){
                //外购或写入ERP时 清单必须有一条
                if(this.saveData.istoerp){
                    this.WindowService.alert({ message: '写入ERP时,采购清单至少应填写一条', type: 'warn' });
                    return;
                }
                this.WindowService.alert({ message: '外购时,采购清单至少应填写一条', type: 'warn' });
                return;
        }
        if (!this.valid.purchaseFormValid) {//采购清单校验未通过
            this.purchaseFormAccurateValid();
            return;
        }
        if (this.isOutsourcing && !this.AccessoryValid()) {//是外购时，用印文件必填
            return;
        }
        this.saveData.AccessoryList = this.AccessoryList_one.concat(this.AccessoryList_two);//拼接附件
        //维护采购清单的处理-start
        if (this.saveData.PurchaseRequisitionDetailsList && this.saveData.PurchaseRequisitionDetailsList.length) {//有填写采购清单(维护了采购清单)
            let noExist = this.contExistPurchase();
            if (JSON.stringify(noExist) != "[]") {//有不存在
                this.WindowService.confirm({ message: "合同号:" + noExist.toString() + "还没有采购产品。是否继续？" }).subscribe(v => {
                    if (v) {
                        for (let j = 0; j < noExist.length; j++) {
                            let ele = noExist[j];
                            let i = this.contExistSaleIndex(ele);
                            if (i != -1) {
                                this.saveData.PurchaseRequisitionSaleContractList.splice(i, 1);
                            }
                        }
                        this.confirmSubmit = true;//提交
                    } else {
                        return;//不提交
                    }
                })
            } else {
                this.confirmSubmit = true;//提交
            }
        } else {//没有维护采购清单
            let noExistPurchase = this.saleNoExistPurchase();
            if (JSON.stringify(noExistPurchase) != "[]") {
                this.WindowService.confirm({ message: "合同号:" + noExistPurchase.toString() + "未填写采购金额。是否继续？" }).subscribe(v => {
                    if (v) {
                        for (let j = 0; j < noExistPurchase.length; j++) {
                            let ele = noExistPurchase[j];
                            let i = this.contExistSaleIndex(ele);
                            if (i != -1) {
                                this.saveData.PurchaseRequisitionSaleContractList.splice(i, 1);
                            }
                        }
                        this.confirmSubmit = true;//提交
                    } else {
                        return;//不提交
                    }
                })
            } else {
                this.confirmSubmit = true;//提交
            }
        }
        //维护采购清单的处理-end
    }
    ngDoCheck() {
        if (this.confirmSubmit) {
            //  校验通过提交
            this.submiting=true;
            this.saveData.PurchaseRequisitionDetailsList.forEach(item => {
                if ('isExcel' in item) {
                    delete item["isExcel"];
                }
            });
            if (this.taskIDLocal) {
                this.saveData.wfstatus = "驳回";
            }
            let url = "PurchaseManage/SavePurchaseRequisition";
            this.saveData.VendorCountry = Number(this.saveData.VendorCountry);
            
            let body = this.saveData;
            console.log("提交的整条数据");
            console.log(this.saveData);
            console.log(JSON.stringify(this.saveData));

            let headers = new Headers({ 'Content-Type': 'application/json', 'ticket': localStorage.getItem('ticket') });
            let options = new RequestOptions({ headers: headers });
            this.dbHttp.post(url, body, options).subscribe(data => {
                this.submiting=false;
                if (data.Result) {
                    if (!this.saveData.purchaserequisitionid) {//新建
                        window.localStorage.removeItem('contractList');
                    }
                    if(this.saveData.wfstatus=="提交"){//提交
                        this.WindowService.alert({ message: "提交成功", type: 'success' });
                    }else{//暂存
                        this.WindowService.alert({ message: "保存成功", type: 'success' });
                    }
                    this.router.navigate(['procurement/procurement-apply/my-apply']);
                    //发起流程
                    if (this.taskIDLocal) {
                        let url = "PurchaseManage/ApproveRequisition";
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
                } else if(data.status=="401"){
                    this.WindowService.alert({ message: "您没有提交权限", type: 'fail' });                    
                }
                else {
                    this.WindowService.alert({ message: data.Message, type: 'fail' });
                }
            })
            this.confirmSubmit = false;
        }
    }

    contExistSaleIndex(name) {//输入合同名称，返回在销售信息列表中的Index
        let j; let len = this.saveData.PurchaseRequisitionSaleContractList.length;
        for (j = 0; j < len; j++) {
            let item = this.saveData.PurchaseRequisitionSaleContractList[j];
            if (item.MainContractCode == name) {
                return j;
            }
        }
        return -1;
    }
    contExistPurchase() {//检查合同列表是否都有分配产品,返回不存在的合同号数组
        let contractList;//合同列表
        let noExist = [];//不存在的合同号
        contractList = JSON.parse(window.localStorage.getItem("contractList"));
        let self = this;
        let forPurchase = function (sc) {
            let j; let len = self.saveData.PurchaseRequisitionDetailsList.length;
            for (j = 0; j < len; j++) {
                let ele = self.saveData.PurchaseRequisitionDetailsList[j];
                if (sc == ele.MaterialSource) {
                    return true;
                }
            }
            return false;
        }
        let j; let len = contractList.length;
        for (j = 0; j < len; j++) {
            let item = contractList[j];
            if (!forPurchase(item.SC_Code)) {//不存在
                noExist.push(item.MainContractCode);
            }
        }
        return noExist;
    }
    saleNoExistPurchase() {//返回没有未税总金额的销售信息列表的合同名称数组
        let noExistPurchase = [];
        let j; let len = this.saveData.PurchaseRequisitionSaleContractList.length;
        for (j = 0; j < len; j++) {
            let item = this.saveData.PurchaseRequisitionSaleContractList[j];
            if (!item.excludetaxmoney) {
                noExistPurchase.push(item.MainContractCode);
            }
        }
        return noExistPurchase;
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
        alertFun(this.saveData.company, "我方主体");
        alertFun(this.saveData.factory, "工厂");
        alertFun(this.saveData.vendor, "供应商");
        // alertFun(this.saveData.vendorbizscope, "对方业务范围");

        alertFun(this.saveData.taxrate, "税率");
        alertFun(this.saveData.currency, "币种");
        alertFun(this.saveData.preselldate, "预售日期");
        alertFun(this.saveData.excludetaxmoney, "未税总金额");
        alertFun(this.saveData.taxinclusivemoney, "含税总金额");
    }
    AccessoryValid() {//用印文件进行校验
        if (!this.AccessoryList_two || !this.AccessoryList_two.length) {
            this.WindowService.alert({ message: '当为外购时，采购合同用印文件不能为空', type: 'warn' });
            return false;
        }
        return true;
    }
    delPurchaseFormListBlank() {//去除采购清单空白项 & 填充需求跟踪号
        let i; let item;
        let len = this.saveData.PurchaseRequisitionDetailsList.length;
        for (i = 0; i < len; i++) {
            item = this.saveData.PurchaseRequisitionDetailsList[i];
            if (!item.MaterialNumber && !item.Count && !item.Price
                && !item.StorageLocation && !item.Batch && !item.MaterialSource) {
                this.saveData.PurchaseRequisitionDetailsList.splice(i, 1);
                len--;
                i--;
            } else {
                if (!item.traceno) {
                    item.traceno = this.saveData.traceno;
                }
            }
        }
    }
    purchaseFormAccurateValid() {//采购清单精确进行校验 
        let self = this;
        let alertFun = function (val, str) {
            if (!val  && str != '库存地') {
                self.WindowService.alert({ message: '采购清单中' + str + '不能为空', type: 'warn' });
                return;
            }
            if (str == '库存地' && val.length != 4) {
                self.WindowService.alert({ message: '请输入4位库存地', type: 'warn' });
                return;
            }
        }
        this.saveData.PurchaseRequisitionDetailsList.forEach((item, index) => {
            alertFun(item.MaterialNumber, '物料编号');
            alertFun(item.Count, '数量');
            alertFun(item.Price, '未税单价');
            alertFun(item.StorageLocation, '库存地');
            alertFun(item.MaterialSource, '销售合同号');
        })
    }
    closeWindow() {
        window.close();
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
    //流程启动
    public ApproverListData = [];
    public WorkFlowConfigInfo;
    public personArr = [];
    public getFlow(fac, ver,istoerp,com) {
        if (fac && ver) {
            let coreUrl = "PurchaseManage/GetVendorClass" + "/" + fac + "/" + ver;
            this.dbHttp.get(coreUrl).subscribe(data => {
                if (data.Result) {
                    let localData = data.Data;
                    let url = "PurchaseManage/GetWorkFlowConfigInfo_Purchase";//获得流程节点审批人信息
                    let body ={
                        "FlatCode":this.saveData.FlatCode,/*平台代码*/
                        "BizScopeCode":this.saveData.YWFWDM, /*登录人的所属业务范围代码*/
                        "WorkFlowCategory": "" /*流程类型*/
                    }
                    if (localData == "新产品") {
                        body.WorkFlowCategory="NEWPRODUCT_CONTRACT";
                    }
                    if (localData == "核心") {
                        body.WorkFlowCategory="CORE_CONTRACT";
                    }
                    if (localData == "非核心") {
                        body.WorkFlowCategory="NOCORE_CONTRACT";
                    }
                    let headers = new Headers({ 'Content-Type': 'application/json', 'ticket': localStorage.getItem('ticket') });
                    let options = new RequestOptions({ headers: headers });
                    this.dbHttp.post(url, body, options).subscribe(data => {
                        if (data.Result) {
                            let localData = JSON.parse(data.Data);//审批人员数据
                            this.WorkFlowConfigInfo = localData;
                            this.ApproverListData = localData[0].ApproverList;//一级预审人员
                            this.personList = this.SubmitMessageService.transformPreparePersonList(localData);//预审组件 展示结构
                            this.personArr = this.SubmitMessageService.transformApprovePersonList(localData, this.saveData.excludetaxmoney,com,istoerp);//除预审外 需要展示的审批人信息
                            this.saveData.WFApproveUserJSON = JSON.stringify(this.WorkFlowConfigInfo);//所有节点 需要存储
                        }
                    })
                }
            })
        }
    }
    //驳回时获取节点
    public nodeidLocal;
    public getNodeId() {
        let nodeIDUrl = "PurchaseManage/GetCurrentWFNode_PurchaseRequisition/" + this.saveData.purchaserequisitionid;
        let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
        let options = new RequestOptions({ headers: headers });
        this.dbHttp.post(nodeIDUrl, {}, options)
            .toPromise()
            .then(res => {
                if (res.Data) {
                    let data = JSON.parse(res.Data);
                    this.nodeidLocal = data.nodeid;
                }
            })
    }
}