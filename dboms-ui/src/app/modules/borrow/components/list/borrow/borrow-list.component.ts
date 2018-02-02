import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { Pager,XcModalService, XcBaseModal, XcModalRef } from 'app/shared/index';
import { WindowService } from 'app/core';
import { environment_java } from "environments/environment";
import { 
  Query,
  BorrowApply,
  BorrowListService,
  BorrowApplyPageParam
} from './../../../services/borrow-list.service';

export class PageNo { }
@Component({
    templateUrl: './borrow-list.component.html',
    styleUrls: ['./borrow-list.component.scss']
})
export class BorrowListComponent implements OnInit {

    query: Query;//查询条件
    query1:Query;//查询条件
    borrowApplyList:BorrowApplyPageParam[]=[];//借用申请列表
    borrowApplyList1:BorrowApplyPageParam[]=[];//借用申请列表
    loading: boolean = true;//加载中效果
    pagerData = new Pager();
    myWaitNum:Number=0;
    public myApplyShow = true;
	public myApplyEmpty=false;
	public myApproveShow = false;
	public myApproveEmpty = true;

  constructor(
        private router: Router,
        private http: Http,
        private borrowListService:BorrowListService,
        private xcModalService:XcModalService,
        private windowService:WindowService) {
   }
   
    name = '借用'
    ngOnInit(){

        this.query = new Query();
        this.query.flowStatus="1";
        this.query.pageSize=10;
        //initData(this.query);
        //---------
        this.query1 = new Query();
        this.query1.flowStatus="1";
        this.query1.pageSize=10;
        this.queryWaitMeNum();
        this.search1("1");
    }

    showApplyList(){
        this.myApplyShow = true;
	    //this.myApplyEmpty=false;
	    this.myApproveShow = false;
	    //this.myApproveEmpty = true;
        this.search1("0");
    }
     showApproveList(){
        this.myApplyShow = false;
	    //this.myApplyEmpty=false;
	    this.myApproveShow = true;
	    this.search2("0");
    }
    initData(query: Query){
        query.pageSize=10;
        this.borrowListService.getBorrowListList(query).then(data => {
        console.info("heng 等等等等等等等等等等等等等等等等等等getBorrowListList");
        console.info("data.list====="+data.list);
        this.borrowApplyList = data.list;
        console.info(this.borrowApplyList);
        //设置分页器
        this.pagerData.set(data.pager);
        this.loading = false;
        })
    }
    initData1(query: Query){
         query.pageSize=10;
         query.pageNo =  this.pagerData.pageNo;
        this.borrowListService.getBorrowApproval(query,'8a81e6c45cd4f5fe015cd4f7f42b2086').then(data => {
        this.borrowApplyList1 = data.list;
        //设置分页器
        this.pagerData.set(data.pager);
        this.loading = false;
        })
    }
    onChangePager(e: any){
        //this.query.flowStatus = this.query.flowStatus || "";
        //this.query.flowStatus = '3';
        this.query.pageNo = e.pageNo;
        this.query.pageSize = e.pageSize;
         this.loading = true;
        this.initData(this.query);
    }
     onChangePager2(e: any){
       
        this.query1.pageNo = e.pageNo;
        this.query1.pageSize = e.pageSize;
        this.loading = true;
        this.initData1(this.query1);
    }
    //搜索1
    search1(flowStatus){
        this.query.flowStatus = flowStatus;
        this.loading = true;
        this.initData(this.query);
    }
    //搜索1
    search2(flowStatus){
        this.query1.flowStatus = flowStatus;
        this.loading = true;
        this.initData1(this.query1);
    }
    openBorrowPage(applyId:string){
      // 
      if(this.myApproveShow){
            this.router.navigate(["/borrow/approve/borrow-rc",{applyId:applyId,applypage:this.query1.flowStatus}]);  
      }
      if(this.myApplyShow){
          if(this.query.flowStatus!='0'){
            this.router.navigate(["/borrow/approve/borrow-rc",{applyId:applyId,applypage:-1}]);
         } 
         else{
             this.router.navigate(["/borrow/apply/borrow/"+applyId]);
         }
      }
    }
    queryWaitMeNum(){
        this.http.get(environment_java.server+"borrow/borrow-apply/wait-me")
            .toPromise().then(response => response.json()).then(data => {
                this.myWaitNum=data.item;
                console.info(this.myWaitNum);
        });
    }
}
