import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
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
@Component({
    templateUrl: './turn-sale-approve.component.html',
    styleUrls: ['./turn-sale-approve.component.scss'],
    providers: [TurnSaleApproveService],
})
export class TurnSaleApproveComponent implements OnInit {
    pageType: string;
    applyId: string;
    unclearMaterialItemList: UnclearMaterialItem[] = [];
    apply: BorrowTurnSales = new BorrowTurnSales();
    remark: string;//审批意见
    @ViewChild('wfview')
    wfView: DbWfviewComponent;//展示流程图
    wfData = {
        wfHistoryData: null,//流程日志列表数据
        wfprogress: null//流程图数据
    };
    turnSaleId: string;//表单id
    isView: boolean = true;//是否只读页面
    appParms = {};
    public nodeId = "node1";//拒绝环节的nodeId
    public currNodeId: string;//当前节点
    userInfo = new Person();//申请人
   notChange:boolean=false;
    //按钮组件校验
    public saveId6Flag = true;
    @ViewChildren(NgModel)
    inputList;//表单控件
    @ViewChildren('forminput')
    inputListDom;//表单控件DOM元素
    @ViewChild(NgForm)
    myApplyForm;//表单
    salerFlag:boolean = false;
    constructor(private route: ActivatedRoute, private http:Http,private router:Router,private service: TurnSaleApproveService, private location: Location, private windowService: WindowService) {

    }
    ngOnInit() {
        //查询页面详细信息
        this.route.params.subscribe(params => this.turnSaleId = params["id"]);
        this.service.queryTurnSaleApplyDetail(this.turnSaleId).then(data => {
            if (data.success) {
                Object.assign(this.apply, data.item.borrowTurnSales);
                this.userInfo.userEN = this.apply.applyItCode;
                this.userInfo.userID = this.apply.applyItCode.toLocaleLowerCase();
                this.userInfo.userCN = this.apply.applyUserName;
                this.notChange = true;
                Object.assign(this.unclearMaterialItemList, data.item.turnSalesMaterialItemList);
                let instId: string = data.item.borrowTurnSales.instId;
                this.currNodeId = data.item.borrowTurnSales.flowCurrNodeId;
                //查询登录人信息
                 //获取登录人信息
       
                //查询登录人角色
                this.http.get(environment_java.server + "common/getUserRoles", null).toPromise()
                    .then(res => {
                        let roleCodes = res.json().item;
                        if (roleCodes.indexOf("0000000001") >= 0 || roleCodes.indexOf("0000000002") >= 0) {
                            this.salerFlag = true;
                        }
                    })
         
                //查询只读还是审批
                this.service.queryReadOnlyFlag(instId).then(data => {
                    if (data.success) {
                        if (data.item.canSubmit) {
                           //只有当处于流程中，并且canSubmit为1时不只读
                            if(this.apply.flowStatus === 1){
                                 this.isView =  data.item.canSubmit === '0' ;//被拒绝重新发起canSubmit也为1
                            }
                           
                        } 
                    }
                });

                //流程按钮连接地址
                let flowParam: FlowInfoParam = new FlowInfoParam();

                this.appParms = {
                    apiUrl_AR: environment_java.server + "borrow/turn-sales/" + this.apply.turnSalesId + "/reject",//拒绝
                    apiUrl_Sign: environment_java.server + "borrow/turn-sales/" + this.apply.turnSalesId + "/signature",//加签
                    apiUrl_Transfer: environment_java.server + "borrow/turn-sales/" + this.apply.turnSalesId + "/replacement-processor",//转办
                    navigateUrl: "/borrow/turnsalelist",
                    nodeId: this.nodeId,
                };
                //查询审批日志和流程图
                this.service.queryLogHistoryAndProgress(data.item.borrowTurnSales.instId)
                    .then(data => {
                        this.wfData = data;
                        this.wfView.onInitData(this.wfData.wfprogress);
                    })
            } else {
                this.windowService.alert({ message: data.message, type: "fail" });
            }
        })
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
        this.remark = opinion;
        if (this.authenticateForm()) {
            return;
        }
        let param: FlowInfoParam = new FlowInfoParam();
        param.remark = this.remark;
        if (this.currNodeId === "node3") {
            param.voucherNo1 = this.apply.voucherNo1;
            param.voucherNo2 = this.apply.voucherNo2;
        }
        this.service.agree(this.turnSaleId, param).then(data => {
            if (data.success) {
                this.windowService.alert({ message: "操作成功", type: "success" });
                this.router.navigateByUrl("/borrow/turnsalelist");
            } else {
                this.windowService.alert({ message: data.message, type: "fail" });
                this.router.navigateByUrl("/borrow/turnsalelist");
            }
        })
    }
    reject() {
        let nodeId = "node1";
        //console.log(this.turnSaleId);
        this.service.reject(this.turnSaleId, this.remark, nodeId).then(data => {
            if (data.success) {
                this.windowService.alert({ message: "操作成功", type: "success" });
                this.router.navigateByUrl("/borrow/turnsalelist");
            } else {
                this.windowService.alert({ message: data.message, type: "fail" });
                this.router.navigateByUrl("/borrow/turnsalelist");
            }
        });
    }
    goback() {
        this.location.back();
    }
}