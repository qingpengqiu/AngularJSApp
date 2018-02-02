import { Component, OnInit , ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { Query, BorrowApply,BorrowListService,Materiel,Transport,BorrowApplytransportPoL,BorrowApplyFormData,BorrowAttachment} from './../../../../services/borrow-list.service';
import {SelectOption,ApplyUser,PersonnelInfo,DeliveryAddress} from '../../../common/borrow-entitys';

import {BorrowUnclearListComponent} from '../../../common/borrow-unclear-list.component';
import { Pager,XcModalService, XcBaseModal, XcModalRef} from 'app/shared/index';
import { WindowService } from 'app/core';
import { DbWfviewComponent } from 'app/shared/index';
import { LimitApplyService } from './../../../../services/limit-apply.service';
import { Person } from 'app/shared/services/index';
import { environment_java } from "environments/environment";
declare var window;
@Component({
    templateUrl: './borrow-risk-control.component.html',
    styleUrls: ['./borrow-risk-control.component.scss'],
    providers: [LimitApplyService]
})
// export class ExceedInfo{
//     currentAmount:number;
//     exceedAmount:number;
// }
export class BorrowApproveRiskControlComponent implements OnInit {
    public applyId:string='';
    borrowApplyFormData:BorrowApplyFormData=new BorrowApplyFormData();
    borrowAttachmentList:BorrowAttachment[]=[];
    pageType: string;
    remark: string;
    applyPage:string;
    exceedType:number;
    myCurrentAmount:number=0;
    myExceedAmount:number=0;
    isView: boolean = true;//是否只读页面
    // exceedinfoobj:ExceedInfo;
    @ViewChild('wfview')
    wfView: DbWfviewComponent;//展示流程图
    wfData = {
        wfHistoryData: null,//流程日志列表数据
        wfprogress: null//流程图数据
    };
    isWritedToERP:number=1;
    isClick = false;//是否提交
   public createUserInfo:Person = new Person();//申请人
    public hideTransportInfo:boolean=false;
    constructor(private http: Http, private route: ActivatedRoute, private location: Location, private borrowListService:BorrowListService,
        private xcModalService:XcModalService,
        private windowService:WindowService, private limitApplyService: LimitApplyService) {
    }
    name = '借用申请';
    ngOnInit() {
        this.route.params.subscribe(params => { this.applyId = params["applyId"];this.applyPage=params["applypage"]; });
        console.error("applyId==="+this.applyId);
        this.borrowListService.queryBorrowApplyById(this.applyId).then(data=>{
                        console.error(data);
                        this.borrowApplyFormData=data.item as BorrowApplyFormData;

                        this.isView=!data.currAppFlag;

                        this.borrowApplyDateToString();

                        this.borrowListService.queryUserInfoById(this.borrowApplyFormData.borrowApply.creator).then(data => {
                             console.error("createUserInfo ==="+JSON.stringify(data));
                                this.createUserInfo.userEN = data.item.itcode;
                                this.createUserInfo.userID = data.item.itcode.toLocaleLowerCase();
                                this.createUserInfo.userCN = data.item.name;
                        });


                        this.borrowAttachmentList=this.borrowApplyFormData.borrowApply.attachmentList;
                        console.error("ddddsssssss==========="+JSON.stringify(this.borrowApplyFormData.borrowApply.attachmentList));
                        this.limitApplyService.queryLogHistoryAndProgress(this.borrowApplyFormData.borrowApply.instId)
                        .then(data => {
                            this.wfData = data;
                            this.wfView.onInitData(this.wfData.wfprogress);
                        });
                        this.getExceedAmount(this.applyId);
                    //     this.borrowListService.queryReadOnlyFlag(this.borrowApplyFormData.borrowApply.instId).then(data => {
                    //     if (data.success) {
                    //         console.error("validate access");
                    //         console.error(data);
                    //         if(data.item.canSubmit){
                    //             this.isView = data.item.canSubmit==='0';
                    //         }else{
                    //             this.isView = this.borrowApplyFormData.borrowApply.flowStatus === 3;
                    //         }
                    //     }
                    // });
                    if(this.borrowApplyFormData.borrowApply.flowCurrNodeName!="器材岗审批"){
                        this.isWritedToERP=2;
                    }
                    if(this.borrowApplyFormData.borrowApply.flowCurrNodeName=="器材岗审批"&&(this.borrowApplyFormData.transportPoList[0].transport.reservationNo!=null||typeof(this.borrowApplyFormData.transportPoList[0].transport.reservationNo)=='undefined')){
                        this.isWritedToERP=2;
                    }
                    if(this.borrowApplyFormData.borrowApply.deliveryType=='CUSTSELF'||this.borrowApplyFormData.borrowApply.deliveryType=='SALEMAN'){
                        this.hideTransportInfo=true;
                        return ;
                    }else{
                        this.hideTransportInfo=false;
                    }
                    
                }); 
    }
    borrowApplyDateToString(){
        this.borrowApplyFormData.borrowApply.borrowDate=this.dateToString(this.borrowApplyFormData.borrowApply.borrowDate);
        this.borrowApplyFormData.borrowApply.lastModifiedDate=this.dateToString(this.borrowApplyFormData.borrowApply.lastModifiedDate);
        this.borrowApplyFormData.borrowApply.createDate=this.dateToString(this.borrowApplyFormData.borrowApply.createDate);
        this.borrowApplyFormData.borrowApply.giveBackDay=this.dateToString(this.borrowApplyFormData.borrowApply.giveBackDay);
        this.borrowApplyFormData.borrowApply.applyDate=this.dateToString(this.borrowApplyFormData.borrowApply.applyDate);
         for (let i of this.borrowApplyFormData.transportPoList) {
               i.transport.arrivalDate=this.dateToString(i.transport.arrivalDate);
               i.transport.createDate=this.dateToString(i.transport.createDate);
               i.transport.lastModifiedDate=this.dateToString(i.transport.lastModifiedDate);
                for (let j of i.materielList) {
                    j.createDate=this.dateToString(j.createDate);
                    j.lastModifiedDate=this.dateToString(j.lastModifiedDate);
                }
            }
        
    }
    dateToString(obj:any):any{
        if(obj!=null&&obj!="null"&&(obj+"").length==13){
            obj=this.getDate1(obj);
        }
        return obj;
    }
    getDate1(date) {
    let dataObj = new Date(date);
    let year = dataObj.getFullYear();
    let month = (dataObj.getMonth() + 1).toString();
    let day = dataObj.getDate().toString();
    if (month.length == 1) {
      month = "0" + month
    }
    if (Number(day) < 10) {
      day = "0" + day;
    }
    let temp = year + "-" + month + "-" + day;
    return temp;
  }
   agree() {
        if(this.borrowApplyFormData.borrowApply.flowCurrNodeName=="器材岗审批"){
            this.postBorrowApplySubmit(this.borrowApplyFormData);
        }else{
            this.doAgree();
        }
    }
    doAgree(){
         this.limitApplyService.agree(this.applyId, this.remark).then(data => {
            if (data.success) {
                this.windowService.alert({ message: "操作成功", type: "success" });
            } else {
                this.windowService.alert({ message: data.message, type: "fail" });
            }
        })
    }
    reject() {
        this.limitApplyService.reject(this.applyId, this.remark, null).then(data => {
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
    getExceedAmount(applyId:string){
        this.http.get(environment_java.server+"borrow/borrow-apply/"+applyId+"/exceed-amount")
            .toPromise().then(response => response.json()).then(data => {
                // this.exceedinfoobj=data.item;
                 if(typeof(data.item)=="undefined"){
                     this.exceedType=0;
                 }else{
                     if(data.item.exceedAmount<1){
                         this.exceedType=0;
                     }else if(data.item.exceedAmount>1&&data.item.exceedAmount<1.2){
                        this.exceedType=1;
                        this.myCurrentAmount=data.item.currentAmount;
                        this.myExceedAmount=data.item.exceedAmount;
                     }else if(data.item.exceedAmount>1&&data.item.exceedAmount<1.2){  
                        this.exceedType=2;
                         this.myCurrentAmount=data.item.currentAmount;
                        this.myExceedAmount=data.item.exceedAmount;
                     }
                 }
                //  this.exceedType=2;
                //  this.myCurrentAmount=9999999;
                //  this.myExceedAmount=1.3;
        });
    }
    postBorrowApplySubmit(borrowApplyFormData:BorrowApplyFormData){
    console.info(borrowApplyFormData);
      return this.http.put(environment_java.server+"borrow/borrow-apply/submit/"+borrowApplyFormData.borrowApply.applyId, borrowApplyFormData)
                .map(res => res.json())
                .subscribe(res => {
                    if(res.success){
                        this.doAgree();
                    }
                    else{
                         this.windowService.alert({ message: res.message, type: "fail" });
                    }
                })
   }
   borrowStoreHouseChange(e:any,attr:string){
        let i:number=0;
        for(let transportInfo of this.borrowApplyFormData.transportPoList){
            if(i>0){
                transportInfo.transport[attr+'']=e.target.value;
            }
            i++;
        }
   }
   materielOnWayStoreChange(e:any){
        let i:number=0;
        let j:number=0;
        for(let transportInfo of this.borrowApplyFormData.transportPoList){
             for(let materiel of transportInfo.materielList){
                 if(!(i==0&&j==0)){
                     materiel.onwayStore=e.target.value;
                 }
                 j++;
             }
            i++;
        }
   }
   writeERP(){
       ///borrow/borrow-apply/write-to-erp/{applyId}
      if(this.validateFormData()){
          this.isClick=true;
        return this.http.put(environment_java.server+"borrow/borrow-apply/write-to-erp/"+this.borrowApplyFormData.borrowApply.applyId, this.borrowApplyFormData)
                    .map(res => res.json())
                    .subscribe(res => {
                        if(res.success){
                            this.isWritedToERP=2;
                            this.windowService.alert({ message: "写入ERP成功", type: "success" });
                        }
                        else{
                            this.isClick=false;
                            this.windowService.alert({ message: res.message, type: "fail" });
                        }
                    })
     }
     this.isWritedToERP=2;
   }
   public validateFormData(){
        for(let transport of this.borrowApplyFormData.transportPoList){
            
            if(typeof(transport.transport.borrowStoreHouse)=='undefined'||transport.transport.borrowStoreHouse==''){
                this.windowService.alert({ message:"借用库不能为空", type: "fail" });
                return false;
            }
            for(let materiel of transport.materielList){
                if(typeof(materiel.onwayStore)=='undefined'||materiel.onwayStore==''){
                    this.windowService.alert({ message:"借用在途库不能为空", type: "fail" });
                    return false;
                }
            }
        }
        return true;
    }

   loadFile(filepath:string) {
      window.open(this.borrowListService.filesDownload(filepath));
  }
}
