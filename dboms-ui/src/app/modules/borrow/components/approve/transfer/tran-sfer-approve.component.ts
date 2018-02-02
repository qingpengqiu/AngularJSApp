import { Component, OnInit, ViewChild,ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WindowService } from 'app/core';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { NgForm, NgModel } from "@angular/forms";
import { TurnSaleApproveService } from './../../../services/turn-sale-approve.service';
import { BorrowTurnSales } from './../../turn-sale';
import { UnClearItem, UnclearMaterialItem } from './../../common/borrow-entitys';
import { DbWfviewComponent } from 'app/shared/index';
import { environment_java } from "./../../../../../../environments/environment";
import { FlowInfoParam } from './../../common-entity';
import { Person } from 'app/shared/services/index';
import { FlowParam,TransferService,BorrowTransferApply,TransferMaterialBase,TransferMaterialItem,AdditionalProp,BorrowTransferPo,PersionInfo} from './../../../services/transfer.service';
@Component({
    templateUrl: './tran-sfer-approve.component.html',
    styleUrls: ['./tran-sfer-approve.component.scss'],
    providers: [TransferService],
})
export class TransferApproveComponent implements OnInit {
    flowparam:FlowParam=new FlowParam();
    pageType: string;
    applyId: string;
    unclearMaterialItemList: UnclearMaterialItem[] = [];
    apply: BorrowTransferPo = new BorrowTransferPo();
    remark: string;//审批意见
    pageFlag:string;
    userInfo = new Person();//申请人
    @ViewChild('wfview')
    wfView: DbWfviewComponent;//展示流程图
    wfData = {
        wfHistoryData: null,//流程日志列表数据
        wfprogress: null//流程图数据
    };
    itemid: string;//表单id
    isView: boolean = true;//是否只读页面
    appParms = {};
    public nodeId = "node1";//拒绝环节的nodeId
    public currNodeId:string;//当前节点
     //按钮组件校验
    public saveId6Flag = true;
     @ViewChildren(NgModel)
    inputList;//表单控件
    @ViewChildren('forminput')
    inputListDom;//表单控件DOM元素
    @ViewChild(NgForm)
    myApplyForm;//表单
    itemKeys:string[]=[];
    waitForApprovalNum:number=0;
    baseUserIsShow:boolean=false;
    public person = [] ;//申请人员信息
    persion= new Person();//接收人
    notChange:boolean=false;//判断人员是否加载完毕
    public saleRole:boolean =true;//非销售员角色

    constructor(private route: ActivatedRoute, private transferService: TransferService, private location: Location, private windowService: WindowService) {

    }
    ngOnInit() {
        //判断是否是销售员角色
          this.transferService.getUserRole().then(data=>{
            let roleCodes = data.item;
               // console.log("roleCodes=" +roleCodes);
                if(roleCodes.indexOf("0000000001")>=0||roleCodes.indexOf("0000000002")>=0){
                 this.saleRole = false;
                 }
            });
        //查询页面详细信息
        this.route.params.subscribe(params => { this.pageFlag = params["flag"] });
        this.route.params.subscribe(params => {this.applyId = params["itemid"] });
        this.transferService.queryApplyDetail(this.applyId).then(data => {
            if (data.success) {
                Object.assign(this.apply, data.item);
                this.isView=data.currAppFlag;
                //console.error("vvvvvvvvvvvvvvvvvvvvvvvvvvv"+this.isView);
                //console.error(this.apply.brwTrsfApply.flowCurrNodeName+"GGHHGGHHGGHHHGGG");
                //console.error(this.apply.brwTrsfApply.flowCurrNodeId+"GGHHGGHHGGHHHGGG");
                //console.error(Reflect.ownKeys(this.apply.trsfMtrMap));
                 for(let key of Reflect.ownKeys(this.apply.trsfMtrMap)){
                     this.itemKeys.push(key.toString());
                 }
                // this.persion.userName=this.apply.brwTrsfApply.nPersonName;
                // this.persion.userItCode=this.apply.brwTrsfApply.nPersonItCode;
                // this.baseUserIsShow=true;
                  this.persion.userEN = this.apply.brwTrsfApply.nPersonItCode;
                this.persion.userID = this.apply.brwTrsfApply.nPersonItCode.toLocaleLowerCase();
                this.persion.userCN = this.apply.brwTrsfApply.nPersonName;


                this.userInfo.userEN = this.apply.brwTrsfApply.oPersonItCode;
                this.userInfo.userID = this.apply.brwTrsfApply.oPersonItCode.toLocaleLowerCase();
                this.userInfo.userCN = this.apply.brwTrsfApply.oPersonName;
                this.notChange = true;
                let instId: string = this.apply.brwTrsfApply.instId;
                this.currNodeId = this.apply.brwTrsfApply.flowCurrNodeId;
               // console.error(data);
                // this.transferService.queryReadOnlyFlag(instId).then(data => {
                //     if (data.success) {
                //         if(data.item.canSubmit){
                //             this.isView = data.item.canSubmit==='0';
                //         }else{
                //             this.isView = this.apply.brwTrsfApply.flowStatus === 3;
                //         }
                //     }
                // });
                //  this.isView=data.currAppFlag;//是否当前审批人
                //         if(this.isView&&this.apply.brwTrsfApply.flowStatus==1){
                //          this.isView=true;   
                //         }else{
                //           this.isView=false;     
                //         }

                //流程按钮连接地址
                let flowParam: FlowInfoParam = new FlowInfoParam();

                this.appParms = {
                    apiUrl_AR: environment_java.server + "borrow/borrow-transfer/" + this.apply.brwTrsfApply.brwTransId + "/reject",//拒绝
                    apiUrl_Sign: environment_java.server + "borrow/borrow-transfer/"+this.apply.brwTrsfApply.brwTransId + "/addSign",//加签
                    apiUrl_Transfer: environment_java.server + "borrow/borrow-transfer/"+this.apply.brwTrsfApply.brwTransId + "/replaceAuth",//转办
                    navigateUrl: "borrow/transferlist",
                    nodeId: this.nodeId,
                };
                //查询审批日志和流程图
                this.transferService.queryLogHistoryAndProgress(this.apply.brwTrsfApply.instId)
                    .then(data => {
                        
                        if(data){
                        this.wfData = data;
                        this.wfView.onInitData(this.wfData.wfprogress);
                        }
                       
                    })             
            } else {
                this.windowService.alert({ message: data.message, type: "fail" });
            }
        });  
    }
    authenticateForm() {
        let flag = false;
        if (!this.myApplyForm.valid) {//表单验证未通过
            for (let i = 0; i < this.inputList.length && !flag; i++) {//遍历表单控件
                if (this.inputList._results[i].invalid) {//验证未通过
                    let ele = this.inputListDom._results[i];//存储该表单控件元素
                    if (ele && ele.nativeElement) {
                        ele.nativeElement.focus();//使该表单控件获取焦点
                    }
                    flag = true;
                }
            }
        } 
     }
     saveBill(opinion) {
         //this.remark = opinion;
        //  if(this.authenticateForm()){
        //     return;
        //  }
        this.flowparam.nodeId=this.apply.brwTrsfApply.flowCurrNodeId;
        this.flowparam.remark=this.remark;
        this.transferService.agree(this.apply.brwTrsfApply.id, this.flowparam).then(data => {
             if (data.success) {
                 this.windowService.alert({ message: "操作成功", type: "success" });
             } else {
                 this.windowService.alert({ message: data.message, type: "fail" });
             }
         })
     }
     writeToErp(reservationNo){
         this.transferService.writeToErp(this.apply.brwTrsfApply.id,this.apply,reservationNo).then(data=>{
            if (data.success) {
                console.error("lalalalalalalalallalalala-------"+data);
                 console.info(data);
                 this.apply.trsfMtrMap[reservationNo].mItemInfo.nreservationNo=data.applyInfo.trsfMtrMap[reservationNo].mItemInfo.nreservationNo;
                  this.windowService.alert({ message: "操作成功", type: "success" });
            } else {
                  this.windowService.alert({ message: data.message, type: "fail" });
            }
         });
     }
    reject() {
        let nodeId = "node1";
        //console.log(this.turnSaleId);
        this.transferService.reject(this.applyId, this.remark, nodeId).then(data => {
            if (data.success) {
                this.windowService.alert({ message: "操作成功", type: "success" });
            } else {
                this.windowService.alert({ message: data.message, type: "fail" });
            }
        });
    }

    goback() {
        this.location.back();
    }
}