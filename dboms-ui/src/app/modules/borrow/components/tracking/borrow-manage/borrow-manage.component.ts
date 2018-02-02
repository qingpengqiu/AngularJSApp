import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Http } from '@angular/http';
import { WindowService } from 'app/core';
import { Pager } from 'app/shared/index';

import { 
  Query,
  BorrowReturnApply
} from './../../../services/rtn-list.service';

import {
  SelectOption,
  DeliveryAddress} from '../../common/borrow-entitys';

import { BorrowManageService,BorrowApplyQueryPo } from './../../../services/borrow-manage.service';
import { BorrowApply,BorrowApplyPageParam } from './../../../services/borrow-list.service';
@Component({
    templateUrl: './borrow-manage.component.html',
    styleUrls: ['./borrow-manage.component.scss','../../../scss/borrow-private.component.scss'],
    providers: [BorrowManageService]
})


export class TrackingBorrowComponent implements OnInit {
 
    //平台下拉框
    platforms = new Array();

    query: BorrowApplyQueryPo;//查询条件
    borrowApplyList:BorrowApplyPageParam[]=[];//借用申请列表
    loading: boolean = true;//加载中效果
    pagerData = new Pager();
    borrowAttrOpts:SelectOption[]=[];//借用属性选项   

     //流程状态
     public flowStatuslist: Array<any> = [{ code: 0, name: '草稿' }, { code: 1, name: '审批中' }, { code: 3, name: '已完成' }];
   constructor(http: Http, private borrowManageService: BorrowManageService, private windowService: WindowService) {

   }

    ngOnInit() {
        this.query = new BorrowApplyQueryPo();
        this.queryBorrowAttrOption();
        this.search();


        
    }
    
    queryBorrowAttrOption(){
            this.borrowManageService.getBorrowPageAttrOption(1).then(data=>{
                this.borrowAttrOpts=data.list;
        });
    }
    search(){
        // let params = new URLSearchParams();
        // params.set("pageNo", ""+this.pagerData.pageNo);
         //params.set("pageSize", ""+this.pagerData.pageSize);
       // this.query.pageNo=this.pagerData.pageNo;
        //this.query.pageSize=this.pagerData.pageSize;
         this.query.pageNo=this.pagerData.pageNo+"";
        this.query.pageSize=this.pagerData.pageSize+"";
          this.loading = true;
        console.info("this.query=="+JSON.stringify(this.query));
        this.borrowManageService.getBorrowmanageList(this.query).then(res => {
            console.info("ppppppppppppppppppppppppppppppp");
            console.info("res.list==="+JSON.stringify(res.list));
            this.borrowApplyList = res.list;

            //  console.info("this.borrowApplyList=="+JSON.stringify(this.borrowApplyList));
             //设置分页器
            this.pagerData.set(res.pager);
            //this.loading = false;
        }
        );
        this.loading = false;

         this.getStorageList();
    }
    borrowApplyExcel(){
       this.borrowManageService.borrowExcelfile(this.query);
    }

      //重置
    clearSearch(){
        this.query= new BorrowApplyQueryPo();
    }
    //每页显示条数发生变化时
    onChangePage = function (e) {
        if (this.currentPageSize != e.pageSize) {
            this.pagerData.pageNo = 1;
        }
        this.currentPageSize = e.pageSize
        this.search();
    }
   
    onFileCallBack(e){

    }

      //获取可用平台列表
    getStorageList(){
        this.borrowManageService.getPlatforms().then(data => {
            this.platforms = data.list;
        })
    }
}