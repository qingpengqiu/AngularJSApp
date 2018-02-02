import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { Pager,XcModalService, XcBaseModal, XcModalRef } from 'app/shared/index';
import { WindowService } from 'app/core';
export class PageNo { }
import { 
  Query,
  BorrowReturnApply,
  BorrowReturnListService
} from './../../../services/rtn-list.service';

@Component({
    templateUrl: './rtn-list.component.html',
    styleUrls: ['./rtn-list.component.scss'],
     providers: [BorrowReturnListService],
})
export class RtnListComponent implements OnInit{
     query: Query = new Query();//查询条件
    borrowReturnApplyList:BorrowReturnApply[]=[];//借用申请列表
    loading: boolean = true;//加载中效果
    currentPageSize: string;
    pagerData = new Pager();
    waitForApprovalNum:number;//待我审批条数
     applyFlag: string = "1";//1-我的申请 2-我的审批
     applyPage:string="apply1";//草稿，待我审批，审批过的，审批中，全部 0-草稿 默认为审批中
    @ViewChild("applydiv")
    applydiv;
      tipMessage: string = "";

    detailMessage: string = "";
       isShowMes: boolean = false;
   constructor(http: Http, private borrowReturnListService: BorrowReturnListService, private windowService: WindowService) {

   }

  
   ngOnInit(){
    //   this.query = new Query();
    //   console.log("i am here");
    //   // this.query.flowStatus = '0';
    //    // this.query.pageNo = 1
    //    // this.query.pageSize = 10;
    //     console.error("================eeeee==================");
    //     //this.initData(this.query);

     //this.borrowReturnListService.queryWaitForApprovalNum().then(res => { this.waitForApprovalNum = res });
    
       if (this.applyFlag === "1") {
            //我的申请
            this.query.flowStatus = this.applyPage.substring(5);
        } else {
            //我的审批
            this.query.flowStatus = this.applyPage.substring(8);
        }


     //this.initData(this.query, this.applyFlag);
  }
      applyOrApprove(displayPage: string) {
        this.applyFlag = displayPage;
         if (this.applyFlag === "1") {
            this.applyPage = "apply0";//默认显示草稿列表
        } else {
            this.applyPage = "approval0";//默认显示待我审批列表
        }
        this.search();
    }
  
    search(){
            this.query.pageNo =  this.pagerData.pageNo;
        this.query.pageSize = this.pagerData.pageSize;
        if (this.applyFlag === "1") {
            //我的申请
            this.query.flowStatus = this.applyPage.substring(5);
           
        } else {
            //我的审批
            this.query.flowStatus = this.applyPage.substring(8);
        }
         console.error("==============222222222222222=================");
        this.borrowReturnListService.getBorrowReturnList(this.query, this.applyFlag).then(data => {
      
         console.log("data=" +JSON.stringify(data));

        this.borrowReturnApplyList = data.list;
        this.waitForApprovalNum = data.approveCount;
        if(data.list){
 this.pagerData.set({
                    total: data.pager.total,
                    totalPages: data.pager.totalPages
                })
        }
        
            console.log("data=====ddd=" +this.borrowReturnApplyList.length);
       
                if (this.borrowReturnApplyList.length < 1) {
                   this.isShowMes = true;
                    this.detailMessage = "快来点击右上角“新建申请”按钮，开始新建申请吧~";
                    if (this.applyFlag == "1") {
                        if ( this.query.flowStatus== "1") {
                            this.tipMessage = "借用实物归还列表-我的申请-审批中为空";
                        } else if (this.query.flowStatus == "3") {
                            this.tipMessage = "借用实物归还列表-我的申请-已完成为空";
                            this.detailMessage = "";
                        } else if ( this.query.flowStatus == "0") {
                           this.tipMessage = "借用实物归还列表-我的申请-草稿为空";
                        } else {
                             this.tipMessage = "借用实物归还列表-我的申请-全部为空";
                            
                        }
                    } else {
                        if (this.query.flowStatus == "0") {
                            this.tipMessage = "借用实物归还列表-我的审批-待我审批";
                            this.detailMessage = "你把小伙伴们的审批都批完啦，棒棒哒~";
                        } else if (this.query.flowStatus == "1") {
                            this.tipMessage = "借用实物归还列表-我的审批-我已审批";
                            this.detailMessage = "你还没审批过小伙伴的申请呢~";
                        } else{
                            this.tipMessage = "借用实物归还列表-我的审批-全部";
                            this.detailMessage = "你还没审批过小伙伴的申请呢~";
                        }
                    }
                }else{
                     this.isShowMes = false;
                }
       
    });
     this.loading = false;
    }
    onChangePage = function (e) {
        if (this.currentPageSize != e.pageSize) {
            this.pagerData.pageNo = 1;
        }
        this.currentPageSize = e.pageSize

         
        this.search();
    }

   //删除申请单
    deleteApply(applyId: string) {
        this.windowService.confirm({ message: `确定删除？` }).subscribe(v => {
            if (v) {
                this.borrowReturnListService.deleteRtnApply(applyId).then(data => {
                    if (data.success) {
                          this.search();
                        this.windowService.alert({ message: "操作成功", type: "success" });
                    } else {
                        this.windowService.alert({ message: data.message, type: "fail" });
                    }
                });
            }
        })
    }

 

      /**
     * 变更某个子页签
     * @param whichTab 
     */
    changeapplytype(whichTab: string) {
        this.applyPage = whichTab;
        this.search();
    }
}


