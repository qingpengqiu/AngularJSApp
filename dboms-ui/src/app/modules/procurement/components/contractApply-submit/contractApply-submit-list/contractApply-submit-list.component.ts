import { Component, OnInit, Input, EventEmitter, Output, ElementRef,OnChanges,ViewChild, AfterViewInit, DoCheck,SimpleChanges,ChangeDetectorRef} from '@angular/core';
import { WindowService } from 'app/core';
import { NgForm, NgModel } from "@angular/forms";
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpServer } from 'app/shared/services/db.http.server';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
declare var $:any;
import { Pager, XcModalService, XcBaseModal, XcModalRef } from 'app/shared/index';
import { PurchaseRequisitionDetailsList } from './../../../services/contractApply-submit.service';
import { dbomsPath } from "environments/environment";
import { ApplyListModalComponent } from './../../applyListModal/applylist-modal.component';

@Component({
    selector: "contractApply-submit-list",
    templateUrl: 'contractApply-submit-list.component.html',
    styleUrls: ['contractApply-submit-list.component.scss', './../../../scss/procurement.scss']
})
export class ContractApplySubmitListComponent implements OnInit,OnChanges {
    @Input() rate = 1.8;//税率
    @Input() factory;//工厂
    @Input() vendor;//供应商
    // _directlyToERP=false;//是否直接写入ERP标识
    // @Input() directlyToERP(value){
    //     this._directlyToERP=value;
    // }
    // erpIsDisable=false;//写入ERP按钮是否disables
    // @Input() set isOutsourcing(value){//是否是外购
    //     this._directlyToERP=value;//是外购时，必须写入ERP
    //     this.erpIsDisable=value;
    //     this.onDirectlyChange.emit(this._directlyToERP);
    // }
    @Input() purchaseRequisitioIid:'';//采购申请id
    contractListLength=0;//合同列表的长度
    public _purchaseData = {
        procurementList: [],
        untaxAmount: 0,//未税总金额
        taxAmount: 0//含税总金额
    };
    @Input() set purchaseData(value) {
        this._purchaseData = value;
    }
    @Output() onPurchaseDataChange = new EventEmitter<any>();
    // @Output() onDirectlyChange = new EventEmitter<any>();
    @Output() purchaseFormValidChange = new EventEmitter<any>();//采购清单是否校验通过

    @ViewChild(NgForm)
    purchaseListForm;//表单
    beforePurchaseFormValid;//表单的前一步校验结果
    checkedNum = 0;//已选项数
    constructor(private http: Http,
        private windowService: WindowService,
        private xcModalService: XcModalService,
        private dbHttp: HttpServer,
        private changeDetectorRef:ChangeDetectorRef) { }
    applyListModal: XcModalRef;//采购清单展示模态框
    contractList;//合同列表
    isForeignCurrency = true;//是否是外币
    numAmount: number = 0;//物料数量合计
    fullChecked = false;//全选状态
    fullCheckedIndeterminate = false;//半选状态
    CheckIndeterminate(v) {//检查是否全选
        this.fullCheckedIndeterminate = v;
    }
    // directlyChange(e) {
    //     this.onDirectlyChange.emit(e);
    // }
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
        if (JSON.stringify(this.contractList) != window.localStorage.getItem("contractList")) {//合同列表变化
            this.contractList = JSON.parse(window.localStorage.getItem("contractList"));
            if(this.contractList && this.contractList.length){
                this.contractListLength=this.contractList.length;
            }
            this.changeDetectorRef.detectChanges();//需要强制刷新
            for(let i=0,len=this._purchaseData.procurementList.length;i<len;i++){//重新检查设置已选
                let pro=this._purchaseData.procurementList[i];
                let list=this.OnlySCCodeContract(pro["MaterialSource"]);
                if(!list){
                    pro["MaterialSource"]=list;//为空
                }else{
                    pro["MaterialSource"]=list["em"]["SC_Code"];//val
                    $("#materialSource"+i)[0].selectedIndex = list["index"]+1; //index
                    $("#materialSource"+i)[0].text=list["em"]["MainContractCode"]; //text
                }
            }
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
        this._purchaseData.procurementList.push(new PurchaseRequisitionDetailsList());
        if(this.contractListLength==1){//若合同列表只有一项,直接选入
            let len=this._purchaseData.procurementList.length;
            this._purchaseData.procurementList[len-1].MaterialSource=this.contractList[0].SC_Code;
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
    downloadTpl(){//下载采购清单模板
       // window.open("../../../../../../assets/downloadtpl/合同采购申请-采购清单.xlsx");
        window.open(dbomsPath+'assets/downloadtpl/合同采购申请-采购清单.xlsx' );
    }
    materialTraceno(index,no){//需求跟踪号的校验
        if(no==""){//为空不校验
            return;
        }
        let validName="traceno"+index;
        if(this.purchaseListForm.controls[validName].invalid){//格式校验未通过
            this.windowService.alert({ message: '只允许输入数字和26位英文字符', type: 'success' });
            return;
        }
        this._purchaseData.procurementList[index]["traceno"] = this._purchaseData.procurementList[index]["traceno"].toUpperCase();//转大写
        let url = "PurchaseManage/CheckTraceNo";
        let body ={
            "TraceNo":this._purchaseData.procurementList[index]["traceno"],  
            "IsUpdate":false,     //true 修改 ；  false 新增  ；默认false
            "PurchaseRequisitionId":this.purchaseRequisitioIid //采购申请主键(如果修改采购申请下的采购清单)
        };
        if(body.PurchaseRequisitionId){body.IsUpdate=true;}
        this.dbHttp.post(url, body).subscribe(data => {
            if (!data.Result) {
                this.windowService.alert({ message:"该需求跟踪号已经存下，请重新输入", type: 'fail' });
                this._purchaseData.procurementList[index]["traceno"]="";
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
    fileUploadApi = "api/PurchaseManage/UploadPurchaseOrderDetails";//批量上传路径
    uploadPurchase(e) {//批量上传
        if (e.Result) {
            this.matchContractPrompt=false;
            let result = e.Data;
            if(result && result.length && this.fullChecked){//如果全选，变成半选
                this.fullChecked=false;
                this.fullCheckedIndeterminate = true;
            }
            result.forEach(item => {//分别匹配
                item["MaterialSource"]=this.matchContract(item["MaterialSource"]);
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
    showOrder() {//预览采购清单
        console.log(this._purchaseData);
        let modalData = {
            procurementList: this._purchaseData.procurementList,
            untaxAmount: this._purchaseData.untaxAmount,
            factory: this.factory,
            vendor: this.vendor
        }
        this.applyListModal.show(modalData);
    }
    materialSourceChange() {
        this.onPurchaseDataChange.emit(this._purchaseData);
    }
    
    deleteList(){//批量删除采购清单列表
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
        this.contractList = JSON.parse(window.localStorage.getItem("contractList"));//获取合同
        if(this.contractList && this.contractList.length){
            this.contractListLength=this.contractList.length;
        }

        this.applyListModal = this.xcModalService.createModal(ApplyListModalComponent);
        if (this._purchaseData.procurementList && this._purchaseData.procurementList.length != 0) {//有list计算总数量
            this._purchaseData.procurementList.forEach(item => {
                if (item.Count) {
                    this.numAmount = this.numAmount + (item.Count - 0);//物料数量合计
                }
            })
        }
    }
    matchContractPrompt=false;//excel匹配合同的是否提示标识
    matchContract(name){//根据名称匹配合同
        let len=this.contractList.length;
        let i;let item;
        for(i=0;i<len;i++){
            item=this.contractList[i];
            if(item.MainContractCode==name){
                return item.SC_Code;
            }
        }
        if(!this.matchContractPrompt){
            this.windowService.alert({ message: '导入列表中销售合同有未在所选合同中，请进行选择', type: 'warn' });
            this.matchContractPrompt=true;
        }
        if(this.contractListLength==1){//若合同列表只有一项,直接选入
            return this.contractList[0].SC_Code;
        }else{
            return '';
        }
    }
    matchMaterial(id) {//匹配物料
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get("api/PurchaseManage/GetMaterialInfo/"+id, options)
            .toPromise()
            .then(response => response.json())
    }
    OnlySCCodeContract(scCode){//根据合同唯一标识 匹配合同
        let list={
            em:"",
            index:""
        }
        let len=this.contractList.length;
        let i;let item;
        for(i=0;i<len;i++){
            item=this.contractList[i];
            if(item.SC_Code==scCode){
                list.em=item;
                list.index=i;
                return list;
            }
        }
        return "";//已选的已经不在合同列表中 则置空
    }
}