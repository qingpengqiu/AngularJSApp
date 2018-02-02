import { Component, OnInit } from '@angular/core';
import { Pager } from 'app/shared/index';
import { WindowService } from "app/core";
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from "@angular/router";
import { dbomsPath } from "environments/environment";

import { SupplierService, QueryMyApply, QueryMyApproval } from "../../services/supplier.service";

@Component({
  selector: 'supplier-mApproval',
  templateUrl: 'supplier-myApproval.component.html',
  styleUrls: ['supplier-myApproval.component.scss', '../../scss/supplier.component.scss']
})

export class SupplierMyApprovalComponent implements OnInit {

  pagerData = new Pager();
  queryMyApproval: QueryMyApproval = new QueryMyApproval();

  highSearchShow: boolean = false;//高级搜索
  searchList: any;//用来保存查询返回的结果列表 
  isHide: boolean = true;//是否显示缺省也

  constructor(
    private windowService: WindowService,
    private supplierService: SupplierService
  ) { }

  ngOnInit() { }


  //打开高级搜索
  openSearch() {
    this.highSearchShow = true;
  }

  //收起高级搜索
  closeSearch() {
    this.highSearchShow = false;
  }

  //新建物料数据修改
  addData() {
    window.open(dbomsPath + 'supplier/edit-supplier-ncs/' + 0);
  }
  //搜索
  search() {
    // this.approvalListData.PageNo=1;
    // this.initData( this.approvalListData);

  }
  //重置
  reset() {

    // let nowState = this.approvalListData.TaskStatus;//保存当前处的tab状态（全部，审核中，已完成，草稿）
    // this.approvalListData=new ApprovalListData();
    // this.approvalListData.TaskStatus = nowState;
    // this.approvalListData.PageSize = 10;
  }

  onChangePager(e: any) {
    this.queryMyApproval.PageNo = e.pageNo;
    this.queryMyApproval.PageSize = e.pageSize;

    this.initData(this.queryMyApproval);
  }

  initData(approvalListData) {//向数据库发送请求

    //this.approvalListData.ApplyITCode=this.materielData.ApplyITCode;//将Itcode赋值为到查询参数
    // this.materielDataModifyService.searchAppListData(this.approvalListData).then(data => {

    //   if (data.success) {
    //     //设置分页器
    //     this.pagerData.set(data.data.pager);
    //     //this.loading = false;      
    //     this.searchList = data.data.list;
    //     //console.log(this.searchList);
    //     if (this.searchList == "") {//判断如果查询列表为空，则显示缺省页面
    //       this.isHide = false;//显示缺省页面 
    //     } else {
    //       this.isHide = true;//不显示缺省页面 
    //     }
    //   }  
    // });
  }


  onTab(e) {//切换选项（全部，审批中，已完成，草稿）
    let liType = document.querySelectorAll(".m-state li");

    for (let i = 0; i < liType.length; i++) {
      liType[i].className = "";
    }
    e.target.className = "active";

    switch (e.target.getAttribute("data-state")) {
      case "myExamine":
        this.queryMyApproval.TaskStatus = "0";
        break;
      case "endExamine":
        this.queryMyApproval.TaskStatus = "1";
        break;
      case "sFinish":
        this.queryMyApproval.TaskStatus = "2";
        break;
      default:
        break;
    }

    //this.isHide = true;//显示搜索列表页 
    this.queryMyApproval.PageNo = 1;
    this.initData(this.queryMyApproval);


  }



}