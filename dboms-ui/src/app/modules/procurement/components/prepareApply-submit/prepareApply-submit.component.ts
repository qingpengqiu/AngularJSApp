// 预下单采购申请页面-主页面
import { Component, OnInit, DoCheck } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
declare var window: any;
declare var $: any;

import { Pager } from 'app/shared/index';
import { WindowService } from 'app/core';
import { Person } from 'app/shared/services/index';
import { dbomsPath } from "environments/environment";
import { HttpServer } from 'app/shared/services/db.http.server';
import { SubmitMessageService } from '../../services/submit-message.service'
import { ShareDataService } from './../../services/share-data.service';
import {
    PrepareApply
} from './../../services/prepareApply-submit.service';

@Component({
    templateUrl: 'prepareApply-submit.component.html',
    styleUrls: ['prepareApply-submit.component.scss', './../../scss/procurement.scss']
})
export class PrepareApplySubmitComponent implements OnInit {
// part1-基础信息-start
    userInfo = new Person();//登录人头像
    selectInfo = {//平台下拉框数据
        plateInfo: []
    }
    avtivePlate;//平台-当前选项
// part1-基础信息-end
// part2-采购信息-start
// part2-采购信息-end
// part3-采购清单-start
    procurementListShow = true;//采购清单显示标识
    erpIsDisable=false;//写入ERP按钮是否disable
    purchaseData = {//传进采购清单信息
        procurementList: [],
        untaxAmount: 0,//未税总金额
        taxAmount: 0,//含税总金额
        foreignAmount:0//外币总金额
    }
    listNumberAmount=0;//编辑时 计算总数量
// part3-采购清单-end
// part4-销售信息-start
    sellMessageStructureComplete=false;//编辑状态时 是否完成 已有销售信息 拼接进 localStorage(prepareContractList)
// part4-销售信息-end
// part5-支持文件&用印文件-start
    supportDocumentUrl = "api/PurchaseManage/UploadAccessory/0";//支持文件 上传路径
    contractPrintUrl = "api/PurchaseManage/UploadAccessory/1";//采购合同用印文件 上传路径
    AccessoryList_one = [];//支持文件
    AccessoryList_two = [];//采购合同用印文件
    AccessorySee_one = [];//查看支持文件
    AccessorySee_two = [];//查看采购合同用印文件
// part5-支持文件&用印文件-end
// part6-修改记录-start
    getModifyUrl;//查询修改记录 接口
    modifyRecord = [];//修改记录
    modifyPagerData = new Pager();//修改记录 分页
// part6-修改记录-end
// part7-审批人信息-start
// part7-审批人信息-end
// part8-整体-start
    saveData = new PrepareApply();
    isOutsourcing = false;//是否外购
    IsRMB=true;//是否 人民币 标识
    wholeValid={//整个页面的校验数据
        "prepareApplyMessageValid":true,//采购信息
        "prepareApplyListValid":true//采购清单
    }
    confirmSubmit = false;//确认提交 标识
    submiting=false;//提交中
// part8-整体-end
// part9-其他-start
// part9-其他-end    

    constructor(private location: Location,
        private dbHttp: HttpServer,
        private SubmitMessageService: SubmitMessageService,
        private shareDataService: ShareDataService,
        private WindowService: WindowService,
        private route: ActivatedRoute,
        private router: Router) { }

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
            this.getProcurementData(this.saveData.purchaserequisitionid);
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
                }
            })
        }
    }
    ngDoCheck() {
        if (this.confirmSubmit) {//校验通过提交
            this.SubmitPrepareApply();
        }
    }
// part1-基础信息-start
    getPlateform(e) {//平台选择
        this.saveData.FlatCode = e.id;//平台代码
        this.saveData.plateform = e.text;//平台
    }
// part1-基础信息-end

// part2-采购信息-start
    onPreApplyMessageChange(e) {//当 采购信息数据 变化
        $.extend(this.saveData,e);//保存到整体
    }
    onPrepareApplyMessageValidChange(e) {//当 采购信息表单校验 变化
        this.wholeValid.prepareApplyMessageValid=e;
    }
    onFacVendChange(e) {//当 工厂代码和供应商代码 变化
        // if (e.factory && e.vendorno) {//输入工厂及选择供应商时触发流程
        //     this.getFlow(e.factory, e.vendorno,this.saveData.istoerp,this.saveData.companycode);
        // }
    }
    onIsRMBChange(e) {//当 是否人民币 变化
        this.IsRMB = e;
    }
    onTaxrateChange(e) {//当 税率 变化 //? 销售信息需要
        // this.GetTaxrateData = e;
    }
    onCompanyCodeChange(e){//当 公司代码(我方主体) 变化
        // this.getFlow(this.saveData.factory, this.saveData.vendorno,this.saveData.istoerp,this.saveData.companycode);
    }
    onSupplierTypeChange(e) {//当 供应商类型 变化
        if(e=="非核心"){
            this.isOutsourcing =true;
        }else{
            this.isOutsourcing =false;
        }
        if(this.isOutsourcing && !this.saveData.istoerp){
            this.directlyChange(true);//是外购时，必须写入ERP
        }
        this.erpIsDisable=this.isOutsourcing;
    }
    massageValid() {//验证采购信息
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
        alertFun(this.saveData.taxrate, "税率");
        alertFun(this.saveData.currency, "币种");
        alertFun(this.saveData.preselldate, "预售日期");
    }
// part2-采购信息-end

// part3-采购清单-start
    onPurchaseDataChange(e) {//采购清单信息变化
        this.saveData.PurchaseRequisitionDetailsList = e.procurementList;
        this.saveData.excludetaxmoney = e.untaxAmount;
        this.saveData.taxinclusivemoney = e.taxAmount;
        this.saveData.foreigncurrencymoney = e.foreignAmount;
        if(e.taxAmount){
            this.saveData.sealmoney = e.taxAmount;
        }
    }
    directlyChange(e) {//是否写入ERP变化
        if(String(e)=="true"){
            this.saveData.istoerp=Boolean(1);
        }else{
            this.saveData.istoerp=Boolean(0);
        }
        // this.getFlow(this.saveData.factory, this.saveData.vendorno,this.saveData.istoerp,this.saveData.companycode);
    }
    onPurchaseFormValidChange(e) {//采购清单校验发生变化
        this.wholeValid.prepareApplyListValid=e;
    }
    delPurchaseFormListBlank() {//删除采购清单空白项 & 填充需求跟踪号
        let i; let item;
        let len = this.saveData.PurchaseRequisitionDetailsList.length;
        for (i = 0; i < len; i++) {
            item = this.saveData.PurchaseRequisitionDetailsList[i];
            if (!item.MaterialNumber && !item.Count && !item.Price
                && !item.StorageLocation && !item.Batch && !item.MaterialSource) {
                this.saveData.PurchaseRequisitionDetailsList.splice(i, 1);
                len--;
                i--;
            } else if(!item.traceno){
                item.traceno = this.saveData.traceno;
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
// part3-采购清单-end

// part4-销售信息-start
    onSellListChange(e){//当 销售信息 变化
        this.saveData.PurchaseRequisitionSaleContractList=e;
        if (!this.saveData.PurchaseRequisitionDetailsList || !this.saveData.PurchaseRequisitionDetailsList.length) {//没有清单
            let totalExcludetaxmoney = 0;//累计未税总额
            let totalTaxinclusivemoney = 0;//累计含税总额
            let totalForeigncurrencymoney = 0;//累计外币总额
            for (let i = 0, len = e.length; i < len; i++) {
                totalExcludetaxmoney += Number(e[i].excludetaxmoney);//未税
                totalTaxinclusivemoney += Number(e[i].taxinclusivemoney);//含税
                if(!this.IsRMB){//外币情况
                    totalForeigncurrencymoney += Number(e[i].foreigncurrencymoney);//外币
                }
            }
            this.saveData.excludetaxmoney = totalExcludetaxmoney;//未税总金额
            this.saveData.taxinclusivemoney = totalTaxinclusivemoney;//含税总金额
            this.saveData.sealmoney = totalTaxinclusivemoney;//用印金额
            if(!this.IsRMB){
                this.saveData.foreigncurrencymoney = totalForeigncurrencymoney;//外币总金额
            }
        }
    }
// part4-销售信息-end

// part5-支持文件&用印文件-start
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
    AccessoryValid() {//用印文件 进行校验
        if (!this.AccessoryList_two || !this.AccessoryList_two.length) {
            this.WindowService.alert({ message: '当为外购时，采购合同用印文件不能为空', type: 'warn' });
            return false;
        }
        return true;
    }
// part5-支持文件&用印文件-end

// part6-修改记录-start
    onChangeModifyPage = function (e) {//修改记录 分页
        let headers = new Headers({ 'ticket': localStorage.getItem('ticket') });
        let options = new RequestOptions({ headers: headers });
        if (this.getModifyUrl) {
            this.dbHttp.get(this.getModifyUrl + "/" + e.pageNo + "/" + e.pageSize, options)
                .subscribe((data) => {
                    if (data.Result) {
                        this.modifyRecord = data.Data.List;
                        this.modifyPagerData.set({
                            total: data.Data.TotalCount,
                            totalPages: data.Data.PageCount
                        })
                    }
                });
        }
    }
    viewApplyDetail(id){//查看修改记录中-记录
        window.open(dbomsPath+'procurement/deal-prepareApply/'+id);
    }
// part6-修改记录-end

// part7-审批人信息-start
// part7-审批人信息-end

// part8-整体-start
    getProcurementData(id) {//获取采购整体数据
        let url = "PurchaseManage/GetPurchaseRequisitionById/" + id;
        this.dbHttp.get(url).subscribe(data => {
            if (data.Result) {
                this.saveData = JSON.parse(data.Data);
                console.log("编辑的整单数据");
                console.log(this.saveData);
                // #1-基础信息
                this.avtivePlate = [{//显示平台
                    id: this.saveData.FlatCode,
                    text:this.saveData.plateform
                }];
                // #2-采购信息
                // #3-采购清单
                this.purchaseData.procurementList = this.saveData.PurchaseRequisitionDetailsList;
                this.purchaseData.untaxAmount = this.saveData.excludetaxmoney;
                this.purchaseData.taxAmount = this.saveData.taxinclusivemoney;
                this.purchaseData.foreignAmount = this.saveData.foreigncurrencymoney;
                if (this.saveData.PurchaseRequisitionDetailsList && this.saveData.PurchaseRequisitionDetailsList.length) {//有list计算 总数量
                    this.saveData.PurchaseRequisitionDetailsList.forEach(item => {
                        if (item.Count) {
                            this.listNumberAmount += (item.Count - 0);//物料数量合计
                        }
                    })
                }
                // #4-销售信息
                let existContractList=[];
                this.saveData.PurchaseRequisitionSaleContractList.forEach(item => {//拼接合同列表
                    existContractList.push({
                        'SC_Code': item.salecontractcode,
                        'MainContractCode': item.MainContractCode,
                        'excludetaxmoney':item.excludetaxmoney,//保存编辑下的金额 给销售信息显示
                        'taxinclusivemoney':item.taxinclusivemoney,
                        'foreigncurrencymoney':item.foreigncurrencymoney
                    })
                })
                window.localStorage.setItem("prepareContractList",JSON.stringify(existContractList));
                this.sellMessageStructureComplete=true;//拼接完成 标识
                // #5-支持文件&用印文件
                let i; let len = this.saveData.AccessoryList.length;
                for (i = 0; i < len; i++) {//去除附件数组中的空值
                    if (!this.saveData.AccessoryList[i]) {
                        this.saveData.AccessoryList.splice(i, 1);
                        len--;
                        i--;
                    }
                }
                this.saveData.AccessoryList.forEach(item => {//分离 支持文件和用印文件
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
                // #6-修改记录
                this.getModifyUrl = "PurchaseManage/GetRequisitionRecord/"+this.saveData.requisitionnum;
                this.dbHttp.get(this.getModifyUrl + "/" + 1 + "/" + 10).subscribe(data => {//获取记录
                    if (data.Result) {
                        this.modifyRecord = data.Data.List;
                        this.modifyPagerData.set({
                            total: data.Data.TotalCount,
                            totalPages: data.Data.PageCount
                        })
                    }
                })
                // #7-审批人信息
                // #8-整体
                // #9-其他 
            }else {
                this.WindowService.alert({ message: '接口异常', type: 'fail' });
            }
        })
    }
    VerificatePrepareApply(type) {//验证采购申请
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
        if (!this.wholeValid.prepareApplyMessageValid) {//采购信息
            this.massageValid();
            return;
        }
        if (!this.saveData.currency) {
            this.WindowService.alert({ message: '采购信息中币种不能为空', type: 'warn' });
            return;
        }
        let localvendorno = "";
        localvendorno = JSON.stringify(Number(this.saveData.vendorno));
        if (localvendorno.substring(0, 2) == "10" && !this.saveData.vendorbizscope) {
            this.WindowService.alert({ message: '内部供应商000100开头时对方业务范围为必填', type: 'warn' });
            return;
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
        if (!this.wholeValid.prepareApplyListValid) {//采购清单校验未通过
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
    SubmitPrepareApply(){//验证通过后 提交采购申请
        this.submiting=true;
        this.saveData.PurchaseRequisitionDetailsList.forEach(item => {
            if ('isExcel' in item) {
                delete item["isExcel"];
            }
        });
        this.saveData.VendorCountry = Number(this.saveData.VendorCountry);
        console.log("提交的整条数据");
        console.log(this.saveData);
        console.log(JSON.stringify(this.saveData));

        let headers = new Headers({ 'Content-Type': 'application/json', 'ticket': localStorage.getItem('ticket') });
        let options = new RequestOptions({ headers: headers });
        this.dbHttp.post("PurchaseManage/SavePurchaseRequisition", this.saveData, options).subscribe(data => {
            this.submiting=false;
            if (data.Result) {
                if (!this.saveData.purchaserequisitionid) {//新建
                    window.localStorage.removeItem('prepareContractList');
                }
                if(this.saveData.wfstatus=="提交"){//提交
                    this.WindowService.alert({ message: "提交成功", type: 'success' });
                }else{//暂存
                    this.WindowService.alert({ message: "保存成功", type: 'success' });
                }
                this.router.navigate(['procurement/procurement-apply/my-apply']);
            } else if(data.status=="401"){
                this.WindowService.alert({ message: "您没有提交权限", type: 'fail' });                    
            }else {
                this.WindowService.alert({ message: data.Message, type: 'fail' });
            }
        })
        this.confirmSubmit = false;
    }
// part8-整体-end

// part9-其他-start
    contExistPurchase() {//检查合同列表是否都有分配产品,返回不存在的合同号数组
        let contractList;//合同列表
        let noExist = [];//不存在的合同号
        contractList = JSON.parse(window.localStorage.getItem("prepareContractList"));
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
    closeWindow() {//关闭窗口
        window.close();
    }
// part9-其他-end
}