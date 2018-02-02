import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { InvoiceChangeService } from "../../../../services/invoice/invoice-change.service";
import { ActivatedRoute, Params,Router } from '@angular/router';
import { HttpServer } from 'app/shared/services/db.http.server';
import { DbWfviewComponent } from 'app/shared/index';
import { WindowService } from 'app/core';
import { environment_java } from '../../../../../../../environments/environment';
import { Person } from 'app/shared/services/index';
declare var window;
@Component({
    selector: 'db-change-approve',
    templateUrl: './change-ticket-approve.component.html',
    styleUrls: ['./change-ticket-approve.component.scss'],
    providers: [HttpServer]
})

export class ChangeTicketApproveComponent implements OnInit {

   applyId:string="";//审批单ID
   applyDate:any;//申请时间
   mobile:string="";//联系电话
   department:string="";//部门
   changeReason:string="";//换票原因
   changeList=new Array();


    @ViewChild('wfview')
    wfView: DbWfviewComponent;
    public change;//变更信息
    userInfo = new Person();//申请人
    isView: boolean = true;//是否查看页面 查看页面(true) 审批页面(false)   加签审批
    isADP: boolean = false;//是否加签审批页面
    constructor(private changeService: InvoiceChangeService, private route: ActivatedRoute,private windowService:WindowService,private router:Router) {
    }

    wfData = {
        wfHistoryData: null,//流程日志列表数据
        wfprogress: null//流程图数据
    };
    //意见
    opinions: string = "同意";
    //按钮组件校验
    public saveId6Flag = true;

       //拒绝的环节id
    public nodeId="node1";

    changeId:string="";//换票申请主键

    loading: boolean = true;
    //流程按钮连接地址，组件未开发完
    appParms = {
        apiUrl_AR: environment_java.server+"invoice/change/approve/reject",
        apiUrl_Sign: environment_java.server+"invoice/change/approve/addsign",
        apiUrl_Transfer:  environment_java.server+"invoice/change/approve/transfer",//转办
        parmsMap: { "id": this.changeId,"nodeId":this.nodeId},
        navigateUrl:environment_java.server+"invoice/change/list"
    };
    //加签提交连接地址,组件未开发完
    adpAppParms = {
        apiUrl:  environment_java.server+"invoice/change/approve/addsign",//加签人员审批同意
        taskid: ""
    };
   
    public saveBill(option) {
        this.opinions=option;
        this.agree();
    }
    //提交事件
     agree() {
         var data = { "id": this.changeId, "opinion": this.opinions };
        this.changeService.submitApprove(environment_java.server+"invoice/change/approve/agreement",data).then(res=>{
             this.windowService.alert({ message:  res.json().message, type: 'success' });
             this.isView=true;
              this.loading=false;
        }).catch(res=>{
             res=res.json();
             this.windowService.alert({ message: res.message, type: 'fail' });
             this.isView=true;
        });
    }
    close(){
        //window.close();
        this.router.navigate(["/invoice/change/list"]);
    }
    ngOnInit() {
       
        this.route.params.subscribe((params: Params) => {
            let x = params['id'];
            this.changeId=x;
            this.appParms.parmsMap={ "id": this.changeId,"nodeId":this.nodeId};
            this.changeService.loadChangeInfo(x).subscribe(res => {
                this.change = JSON.parse(res.item[0]);
                this.applyId=this.change.changeApplyId;
                this.applyDate=this.change.createDate;
                this.mobile=this.change.applyTelephone;
                this.department=this.change.applyDepartment;
                this.changeReason=this.change.changeReason;
                this.changeList=this.change.invoiceChangeList;
                this.userInfo.userEN=this.change.applyItCode;
                this.userInfo.userID=this.change.applyItCode.toLocaleLowerCase();
                this.userInfo.userCN=this.change.applyUserName;
                this.wfData.wfHistoryData = res.item[1];//流程日志信息
                this.wfData.wfprogress = res.item[2];//流程图信息

                if(this.change.flowStatus===1&&res.item[3]){
                    this.isView=false;
                }
                this.wfView.onInitData(this.wfData.wfprogress);
                this.loading=false;
            });

        });
    }
}