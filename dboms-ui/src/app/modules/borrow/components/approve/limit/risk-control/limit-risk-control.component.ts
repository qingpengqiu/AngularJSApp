import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WindowService } from 'app/core';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { LimitApproveService } from './../../../../services/limit-approve.service';
import { BorrowAmount, BorrowAmountBusinessScope, BorrowAmountPo } from './../../../limit';
import { DbWfviewComponent } from 'app/shared/index';
import { FlowInfoParam } from './../../../common-entity';
import { environment_java } from "./../../../../../../../environments/environment";
import { Person } from 'app/shared/services/index';
@Component({
    templateUrl: './limit-risk-control.component.html',
    styleUrls: ['./limit-risk-control.component.scss'],
    providers: [LimitApproveService],
})
export class LimitApproveRiskControlComponent implements OnInit {
    pageType: string;
    applyId: string;
    mainData: BorrowAmount = new BorrowAmount();
    subData: BorrowAmountBusinessScope[];
    remark: string;
    @ViewChild('wfview')
    wfView: DbWfviewComponent;//展示流程图
    wfData = {
        wfHistoryData: null,//流程日志列表数据
        wfprogress: null//流程图数据
    };
    isView: boolean = true;//是否只读页面
    appParms = {};
    public nodeId = "node1";//拒绝环节的nodeId
    userInfo = new Person();//申请人
    notChange: boolean = false;//等到人员信息有了再带入头像
    btnDisabled: boolean = false;//审批拒绝按钮是否可点击，默认可点击
    //按钮组件校验
    public saveId6Flag = true;
    constructor(private route: ActivatedRoute,private router: Router, private limitApproveService: LimitApproveService, private location: Location, private windowService: WindowService) {

    }
    name = '额度申请审批';
    ngOnInit() {
        //获取是审批页面还是查看页面  
        this.route.params.subscribe(params => { this.applyId = params["id"]; });

        //查询申请单信息
        this.limitApproveService.queryApplyformDetail(this.applyId)
            .then(res => {

                this.mainData = res.mainData;
                //console.log(this.mainData);
                this.userInfo.userEN = this.mainData.applyItCode.toLocaleLowerCase();
                this.userInfo.userID = this.userInfo.userEN;
                this.userInfo.userCN = this.mainData.applyUserName;
                this.notChange = true;
                this.subData = res.subData;
                let instId: string = res.mainData.instId;
                //console.log(instId);
                this.limitApproveService.queryReadOnlyFlag(instId).then(data => {
                    if (data.success) {
                        //只有当处于流程中，并且canSubmit为1时不只读
                        if (this.mainData.flowStatus === 1) {
                            this.isView = data.item.canSubmit === '0';//被拒绝重新发起canSubmit也为1
                        }
                    }
                });
                //流程按钮连接地址
                let flowParam: FlowInfoParam = new FlowInfoParam();

                this.appParms = {
                    apiUrl_AR: environment_java.server + "borrow/borrow-amount/" + this.mainData.id + "/reject",//拒绝
                    apiUrl_Sign: environment_java.server + "borrow/borrow-amount/" + this.mainData.id + "/addSign",//加签
                    apiUrl_Transfer: environment_java.server + "borrow/borrow-amount/" + this.mainData.id + "/replaceAuth",//转办
                    navigateUrl: "/borrow/limit",
                    nodeId: this.nodeId,
                };
                //查询审批日志和流程图
                this.limitApproveService.queryLogHistoryAndProgress(this.mainData.instId)
                    .then(data => {
                        this.wfData = data;
                        this.wfView.onInitData(this.wfData.wfprogress);
                    })
            });

    }
    saveBill(opinion) {
        this.remark = opinion;
        this.btnDisabled = true;
        this.limitApproveService.agree(this.applyId, this.remark).then(data => {
            if (data.success) {
                this.windowService.alert({ message: "操作成功", type: "success" });
                this.router.navigateByUrl("/borrow/limit");
            } else {
                this.windowService.alert({ message: data.message, type: "fail" });
                this.router.navigateByUrl("/borrow/limit");
            }
        })
        
    }
    goback() {
        this.location.back();
    }
}
