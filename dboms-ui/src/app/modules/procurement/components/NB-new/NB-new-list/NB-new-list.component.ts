import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, AfterViewInit, DoCheck,OnChanges,SimpleChanges } from '@angular/core';
import { WindowService } from 'app/core';
import { NgForm, NgModel } from "@angular/forms";
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpServer } from 'app/shared/services/db.http.server';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import { dbomsPath } from "environments/environment";
declare var $:any;

import { PurchaseOrderDetails } from './../../../services/NB-new.service';

@Component({
    selector: "NB-new-list",
    templateUrl: 'NB-new-list.component.html',
    styleUrls: ['NB-new-list.component.scss', './../../../scss/procurement.scss']
})
export class NBNewListComponent implements OnInit,OnChanges {
    @Input() rate = 1.8;//税率
    @Input() purchaseOrderID: '';//采购订单id
    public _purchaseData = {
        procurementList: [],
        untaxAmount: 0,//未税总金额
        taxAmount: 0//含税总金额
    };
    beforeProcurementList;//上一个采购清单列表
    fileUploadApiNoBH="api/PurchaseManage/UploadPurchaseOrderDetails/0";//有采购申请-批量上传路径
    fileUploadApiIsBH="api/PurchaseManage/UploadPurchaseOrderDetails";//直接创建NB-批量上传路径

    firstCreateContractList = true;//编辑时，首次拼接下拉列表
    @Input() set purchaseData(value) {
        this._purchaseData = value;
    }
    contractListLength = 0;//合同列表的长度
    @Output() onPurchaseDataChange = new EventEmitter<any>();
    @Output() purchaseFormValidChange = new EventEmitter<any>();//采购清单是否校验通过

    @ViewChild(NgForm)
    purchaseListForm;//表单
    beforePurchaseFormValid;//表单的前一步校验结果
    isBH :boolean;//是否 BH或PL类型
    checkedNum = 0;//已选项数
    constructor(private http: Http,
        private windowService: WindowService,
        private dbHttp: HttpServer) { }
    contractList = [];//合同列表
    isForeignCurrency = true;//是否是外币
    numAmount: number = 0;//物料数量合计
    fullChecked = false;//全选状态
    fullCheckedIndeterminate = false;//半选状态
    CheckIndeterminate(v) {//检查是否全选
        this.fullCheckedIndeterminate = v;
    }
    calculateTotal(index) {//改变数量和单价时
        let item = this._purchaseData.procurementList[index];
        this.calculateTotalTax();
        if (item.Count && item.Price) {
            let num = item.Count * item.Price;
            item.Amount = Number(num.toFixed(2));//未税总价
        }else{
            item.Amount = 0;
        }
        this.onPurchaseDataChange.emit(this._purchaseData);
    }
    ngOnChanges(changes: SimpleChanges){  
        if(changes["rate"]){
            if(changes["rate"].currentValue!=changes["rate"].previousValue){//税率变化
                if (typeof(changes["rate"].currentValue) == "undefined" || changes["rate"].currentValue == null) {//变化为无值
                    this._purchaseData.taxAmount=0;
                } else {
                    this.calculateTotalTax();
                }
                this.onPurchaseDataChange.emit(this._purchaseData);
            }
        }
    }
    alreadyPushContract(id){//编辑时，拼接contractList，检查是否push过
        if(!id){
            return true;//空值不push
        }
        if(this.contractList && this.contractList.length){
            for(let i=0,len=this.contractList.length;i<len;i++){
                if(this.contractList[i]["id"]==id){
                    return true;
                }
            }
        }
        return false;
    }
    ngDoCheck() {
        if (this.purchaseListForm.valid != this.beforePurchaseFormValid) {//表单校验变化返回
            this.beforePurchaseFormValid = this.purchaseListForm.valid;
            this.purchaseFormValidChange.emit(this.purchaseListForm.valid);
        }
        if(this._purchaseData.procurementList && this._purchaseData.procurementList.length>=10){//出现滚动条的宽度调整
            $(".w40").addClass("w46");
            $(".addApp-ch-before tbody").addClass("auto");
        }else{
            $(".w40").removeClass("w46");
            $(".addApp-ch-before tbody").removeClass("auto");
        }
        if (JSON.stringify(this._purchaseData.procurementList) != JSON.stringify(this.beforeProcurementList) 
            && this._purchaseData.procurementList && this._purchaseData.procurementList.length) {//编辑状态下，当传入采购清单变化
            this.beforeProcurementList = JSON.parse(JSON.stringify(this._purchaseData.procurementList));
            if(this.purchaseOrderID && typeof(this.isBH)=="undefined"){
                if(this._purchaseData.procurementList[0]["DBOMS_PurchaseRequisitionSaleContract_ID"]){
                    this.isBH=false;
                }else{
                    this.isBH=true;
                }
            }
            if(!this.isBH && this.purchaseOrderID && this.firstCreateContractList){//非BH或PL
                let list = this._purchaseData.procurementList;
                // if (list && list.length) {//第一次打开
                // if (list && list.length && !(window.localStorage.getItem("ecitContractList"))) {//第一次打开
                    for (let i = 0, len = list.length; i < len; i++) {//从已有清单中 拼接选项
                        this._purchaseData.procurementList[i]["isImport"]=false;//编辑时已有的清单可修改
                        if(!this.alreadyPushContract(list[i]["DBOMS_PurchaseRequisitionSaleContract_ID"])){//没有push过
                            this.contractList.push({
                                salecontractcode: list[i]["MaterialSource"],
                                requisitionnum: list[i]["PurchaseRequisitionNum"],
                                MainContractCode: list[i]["MainContractCode"],
                                id: list[i]["DBOMS_PurchaseRequisitionSaleContract_ID"],
                                text: list[i]["PurchaseRequisitionNum"] + "-" + list[i]["MainContractCode"]
                            });
                        }
                    }
                    if (this.contractList && this.contractList.length) {
                        this.contractListLength = this.contractList.length;
                    }
                    // window.localStorage.setItem("ecitContractList",JSON.stringify(this.contractList));
                    this.firstCreateContractList = false;
                // }
                // if(window.localStorage.getItem("ecitContractList")){//第二..次打开
                //     this.contractList=JSON.parse(window.localStorage.getItem("ecitContractList"));
                //     this.firstCreateContractList = false;
                // }
            }
            this.calculateTotalTax();
        }
    }
    tempList=[];//暂存刚开始获取的已选采购申请列表
    matchSelectId(id,source){//匹配导入清单中-物料来源的选择
        for(let k=0,len=this.tempList.length;k<len;k++){
            let ele=this.tempList[k];
            if(id==ele["purchaserequisitionid"] && source==ele["salecontractcode"]){
                return ele;
            }
        }
    }
    initList(){//新建时请求已有采购申请的清单,非BH或PL
            let list = JSON.parse(window.localStorage.getItem("applyList"));
            // let openAgain=Boolean(this._purchaseData.procurementList && this._purchaseData.procurementList.length);//是否是第二次打开
            this.tempList=list;
            // if (list && list.length && !openAgain) {
            if (list && list.length) {
                let requestArr=[];//已经请求过的采购申请
                for (let i = 0, len = list.length; i < len; i++) {
                    let id=list[i]["purchaserequisitionid"];
                    if(requestArr.indexOf(id)==-1){//未请求过
                        requestArr.push(id);
                        this.dbHttp.get("PurchaseManage/GetPurchaseRequisitionById/" + id).subscribe(data => {//获取已选采购申请的采购清单
                            if (data.Result) {
                                let da = JSON.parse(data.Data);
                                let details=da["PurchaseRequisitionDetailsList"];
                                for(let j=0,lens=details.length;j<lens;j++){
                                    let ele=this.matchSelectId(details[j]["purchaserequisitionid"],details[j]["MaterialSource"]);
                                    if(ele){
                                        let newItem=new PurchaseOrderDetails();
                                        newItem["MaterialNumber"]=details[j]["MaterialNumber"];
                                        newItem["MaterialDescription"]=details[j]["MaterialDescription"];
                                        newItem["Count"]=details[j]["Count"];
                                        newItem["Price"]=details[j]["Price"];
                                        newItem["Amount"]=details[j]["Amount"];
                                        newItem["StorageLocation"]=details[j]["StorageLocation"];
                                        newItem["Batch"]=details[j]["Batch"];
                                        newItem["TrackingNumber"]=details[j]["traceno"];
                                        newItem["DBOMS_PurchaseRequisitionSaleContract_ID"]=ele["id"];
                                        newItem["MaterialSource"]=ele["salecontractcode"];
                                        newItem["PurchaseRequisitionNum"]=ele["requisitionnum"];
                                        newItem["MainContractCode"]=ele["MainContractCode"];
                                        newItem["isImport"]=true;//导入的清单不让修改
                                        this._purchaseData.procurementList.push(newItem);
                                        this.calculateTotalTax();//可优化
                                        this.onPurchaseDataChange.emit(this._purchaseData);
                                    }
                                }
                            }
                        })
                    }
                }
            }
            this.contractList = list;
            if (this.contractList && this.contractList.length) {
                this.contractListLength = this.contractList.length;
            }
    }
    calculateTotalTax() {//计算总价
        this.numAmount = 0;
        this._purchaseData.untaxAmount = 0;
        this._purchaseData.taxAmount = 0;
        this._purchaseData.procurementList.forEach(item => {
            if (item.Count) {
                this.numAmount = Number(this.numAmount + Number(item.Count));//物料数量合计
            }
            if (item.Count && item.Price) {
                this._purchaseData.untaxAmount = Number((this._purchaseData.untaxAmount + item.Count * item.Price).toFixed(2));//未税总金额
            }
        })
        if (typeof(this.rate) == "undefined" || this.rate == null) {
            this.windowService.alert({ message: "税率未选择", type: "warn" });
        } else {
            this._purchaseData.taxAmount = Number((this._purchaseData.untaxAmount * (1 + Number(this.rate))).toFixed(2));//含税总金额
        }
    }
    delProcurementItem(index) {//删除一项采购清单
        let reCount=true;
        if(!this._purchaseData.procurementList[index]["Count"] 
            && !this._purchaseData.procurementList[index]["Price"]){//如果删除的行没有数量和单价 不需要重新计算
                reCount=false;
        }
        if(this._purchaseData.procurementList[index].checked){
            this.checkedNum--;//选项减一
            if(!this.checkedNum){//减最后一项
                this.fullChecked = false;
                this.fullCheckedIndeterminate = false;
            }
        }
        this._purchaseData.procurementList.splice(index, 1);
        if(reCount){
            this.calculateTotalTax();
        }
        this.onPurchaseDataChange.emit(this._purchaseData);
    }
    addProcurementItem() {//增加一项采购清单
        this._purchaseData.procurementList.push(new PurchaseOrderDetails());
        if (this.contractListLength == 1) {//若合同列表只有一项,直接选入
            if(!this.isBH){//有采购申请情况
                let len = this._purchaseData.procurementList.length;
                this._purchaseData.procurementList[len - 1]["DBOMS_PurchaseRequisitionSaleContract_ID"] = this.contractList[0]["id"];
                this._purchaseData.procurementList[len - 1]["MaterialSource"] = this.contractList[0]["salecontractcode"];
                this._purchaseData.procurementList[len - 1]["PurchaseRequisitionNum"] = this.contractList[0]["requisitionnum"];
                this._purchaseData.procurementList[len - 1]["MainContractCode"] = this.contractList[0]["MainContractCode"];
            }
        }
        if(this.fullChecked){//如果全选，变成半选
            this.fullChecked=false;
            this.fullCheckedIndeterminate = true;
        }
        this.onPurchaseDataChange.emit(this._purchaseData);
    }
    // resetProcurementList() {//重置采购清单
    //     this._purchaseData.procurementList = [];
    //     this.numAmount=0;
    //     this._purchaseData.untaxAmount=0;
    //     this._purchaseData.taxAmount=0;
    //     this.fullChecked = false;
    //     this.fullCheckedIndeterminate = false;
    //     this.checkedNum = 0;
    //     this.onPurchaseDataChange.emit(this._purchaseData);
    // }
    downloadTpl() {//下载采购清单模板
        window.open(dbomsPath+'assets/downloadtpl/NB新建-采购清单.xlsx' );
    }
    materialTraceno(index, no) {//需求跟踪号的校验
        if(no==""){//为空不校验
            return;
        }
        let validName="traceno"+index;
        if(this.purchaseListForm.controls[validName].invalid){//格式校验未通过
            this.windowService.alert({ message: '只允许输入数字和26位英文字符', type: 'success' });
            return;
        }
        this._purchaseData.procurementList[index]["TrackingNumber"] = this._purchaseData.procurementList[index]["TrackingNumber"].toUpperCase();//转大写
        let url = "PurchaseManage/CheckTraceNo";
        let body = {
            "TraceNo": this._purchaseData.procurementList[index]["TrackingNumber"],
            "IsUpdate": false,     //true 修改 ；  false 新增  ；默认false
            "PurchaseOrder_ID": this.purchaseOrderID //采购申请主键(如果修改采购申请下的采购清单)
        };
        if (body.PurchaseOrder_ID) { body.IsUpdate = true; }
        this.dbHttp.post(url, body).subscribe(data => {
            if (!data.Result) {
                this.windowService.alert({ message: "该需求跟踪号已经存下，请重新输入", type: 'fail' });
                this._purchaseData.procurementList[index]["TrackingNumber"] = "";
            }
        })
    }
    getMaterialData(index, id) {//根据物料号读取信息
        if (id=="" || this._purchaseData.procurementList[index]["isExcel"]) {//如果是excel中读取，不更新物料描述
            return;
        } else {
            this.matchMaterial(id).then(response => {
                if (response.Data["MAKTX_ZH"]) {//获取描述
                    this._purchaseData.procurementList[index].MaterialDescription = response.Data["MAKTX_ZH"];
                } else {
                    this._purchaseData.procurementList[index].MaterialDescription = "";
                    this.windowService.alert({ message: "该物料不存在", type: "warn" });
                }
                this.onPurchaseDataChange.emit(this._purchaseData);
            })
        }
    }
    uploadPurchase(e) {//批量上传
        if (e.Result) {
            this.matchContractPrompt=false;
            let result = e.Data;
            if(result && result.length && this.fullChecked){//如果全选，变成半选
                this.fullChecked=false;
                this.fullCheckedIndeterminate = true;
            }
            result.forEach(item => {//分别匹配
                item["isImport"] = false;
                if(this.isBH){
                    item["MaterialSource"]=this.isBHMatchContract(item["MaterialSource"]);
                }else{
                    let con=this.matchContract(item);//匹配
                    if(con){
                        item["DBOMS_PurchaseRequisitionSaleContract_ID"] = con["id"];
                        item["MaterialSource"] = con["salecontractcode"];
                        item["PurchaseRequisitionNum"] = con["requisitionnum"];
                        item["MainContractCode"] = con["MainContractCode"];
                    }else{
                        item["DBOMS_PurchaseRequisitionSaleContract_ID"] = "";
                    }
                }
                delete item.AddTime;delete item.ID;
                delete item.PurchaseOrder_ID;delete item.SortNum;
            });
            let newArr=this._purchaseData.procurementList.concat(result);
            this._purchaseData.procurementList=newArr;//把excel中列表显示页面
            this.calculateTotalTax();
            this.onPurchaseDataChange.emit(this._purchaseData);
        } else {
            this.windowService.alert({ message: e.Message, type: "warn" });
        }
    }
    materialSourceChange(i) {
        if (!this.isBH && this._purchaseData.procurementList[i].DBOMS_PurchaseRequisitionSaleContract_ID) {
            for(let k=0,len=this.contractList.length;k<len;k++){
                let selItm = this.contractList[k];
                if(this._purchaseData.procurementList[i].DBOMS_PurchaseRequisitionSaleContract_ID==selItm["id"]){
                    this._purchaseData.procurementList[i].MaterialSource = selItm["salecontractcode"];
                    this._purchaseData.procurementList[i].PurchaseRequisitionNum = selItm["requisitionnum"];
                    this._purchaseData.procurementList[i].MainContractCode = selItm["MainContractCode"];
                }
            }
        }
        this.onPurchaseDataChange.emit(this._purchaseData);
    }

    deleteList() {//批量删除采购清单列表
        if(!this.checkedNum){
            this.windowService.alert({ message: "还未选择项", type: "warn" });
            return;
        }
        if(this.fullChecked){//全选删除
            this._purchaseData.procurementList=[];
            this.numAmount = 0;
            this._purchaseData.untaxAmount = 0;
            this._purchaseData.taxAmount = 0;
            this.fullChecked=false;
            this.fullCheckedIndeterminate = false;
            return;
        }
        this.fullCheckedIndeterminate = false;
        let i; let item;
        let len = this._purchaseData.procurementList.length;
        for (i = 0; i < len; i++) {
            item=this._purchaseData.procurementList[i];
            if (item.checked === true) {
                    this._purchaseData.procurementList.splice(i, 1);
                    len--;
                    i--;
            }   
        }
        this.calculateTotalTax();
        this.onPurchaseDataChange.emit(this._purchaseData);
    }
    ngOnInit() {
        if (this._purchaseData.procurementList && this._purchaseData.procurementList.length) {//有list计算总数量
            this._purchaseData.procurementList.forEach(item => {
                if (item.Count) {
                    this.numAmount = this.numAmount + (item.Count - 0);//物料数量合计
                }
            })
        }
        if(!this.purchaseOrderID){//新建
            if(window.localStorage.getItem("createNBType")=="hasApply"){//有采购申请
                // debugger
                this.isBH=false;
                this.initList();
            }
            if(window.localStorage.getItem("createNBType")=="directNB"){//BN或PL
                this.isBH=true;
            }
        }
    }
    matchContractPrompt = false;//excel匹配合同的是否提示标识
    matchContract(ele) {//申请单号和合同号，返回item
        let len = this.contractList.length;
        let i; let item;
        for (i = 0; i < len; i++) {
            item = this.contractList[i];
            if (ele["PurchaseRequisitionNum"]==item.requisitionnum &&
                ele["MainContractCode"]==item.MainContractCode) {
                return item;
            }
        }
        if (!this.matchContractPrompt) {
            this.windowService.alert({ message: '导入列表中销售合同有未在所选合同中，请进行选择', type: 'warn' });
            this.matchContractPrompt = true;
        }
        if (this.contractListLength == 1) {//若合同列表只有一项,直接选入
            return this.contractList[0];
        } else {
            return '';
        }
    }
    isBHMatchContract(sou){//当isBH时，根据物料来源匹配
        if(sou!="BH" && sou!="PL"){
            this.windowService.alert({ message: '导入列表物料来源不是BH或PL，请进行选择', type: 'warn' });
            this.matchContractPrompt=true;
            return '';
        }
        return sou;
    }
    matchMaterial(id) {//匹配物料
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get("api/PurchaseManage/GetMaterialInfo/"+id, options)
            .toPromise()
            .then(response => response.json())
    }
}