import { Component, OnInit,OnDestroy } from '@angular/core';
import { Pager } from 'app/shared/index';
import { WindowService } from 'app/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { dbomsPath } from "environments/environment";
declare var $: any;

import { ApplyMyapplyQuery,ApplyMyapplyRank,
  ProcurementListDataService } from '../../services/procurement-listData.service';
import { ProcumentOrderNewService } from './../../services/procumentOrder-new.service';

@Component({
  templateUrl: 'procurement-apply-myapply.component.html',
  styleUrls:['procurement-apply-myapply.component.scss','./../../scss/procurement.scss']
})
export class ProcurementApplyMyApplyComponent implements OnInit {
  pagerData = new Pager();
  query: ApplyMyapplyQuery = new ApplyMyapplyQuery();
  rank: ApplyMyapplyRank=new ApplyMyapplyRank();//排序条件
  highSearchShow: boolean = false;//高级搜索
  loading: boolean = true;//加载中效果

  searchList:any;//用于存储搜索结果列表

  constructor(
    private procumentOrderNewService:ProcumentOrderNewService,
    private procurementListDataService: ProcurementListDataService,
    private windowService:WindowService,
    private router: Router) { }
  ngOnInit() {
    let self = this;
    window.addEventListener('focus',function(){
        self.initData(self.query);
    });
  }
  ngOnDestroy(){
    let self =this;
    window.removeEventListener('focus',function(){
        self.initData(self.query);
    });
  }
  onTab(type){//切换选项（全部，审批中，已完成，草稿
    this.query.WfStatus = type;//切换申请类型
    this.query.PageIndex=1;//重置分页
    this.rank['addtime'] = "desc";//重置排序
    for(let key in this.rank){
        if(key=='addtime'){
          continue;
        } 
        this.rank[key]="none";
    }
    this.query.SortName='addtime';
    this.query.SortType='desc';
    this.loading = true;
    this.initData(this.query);
  }

  search(){//点击搜索按钮的搜索
    this.searchList=[];
    this.pagerData = new Pager();
     this.loading = true;
     this.initData(this.query);
  } 

  reset() {//重置搜索数据
    let state=this.query.WfStatus;
    this.query = new ApplyMyapplyQuery();
    this.query.WfStatus=state;
    $(".iradio_square-blue").removeClass('checked');
  }
  addClass(){//radio bug-手动添加class
    if(this.query.IsModify){
      $(".iradio_square-blue:first").addClass("checked");
    }
  }

  onChangePager(e: any) {//分页代码
        this.query.PageIndex = e.pageNo;
        this.query.PageSize = e.pageSize;
        this.loading = true;
        this.initData(this.query);
    }

    initData(query: ApplyMyapplyQuery) {//向数据库发送请求
        this.procurementListDataService.searchApplyMyapplyData(this.query).then(data => {
            console.log(data);
            let list = data.Data.List;
            for(let i=0,len=list.length;i<len;i++){//处理CurrentApprovalNode
              let item=list[i];
              if(item["CurrentApprovalNode"]=="[]" || !item["CurrentApprovalNode"]){//无值
                item["CurrentApprovalNode"]=[{
                  approver:"",
                  nodename:""
                }];
              }else{
                item["CurrentApprovalNode"]=JSON.parse(item["CurrentApprovalNode"]);
              }
            }
            this.searchList=list;
            //设置分页器
            this.pagerData.pageNo=data.Data.CurrentPage;//当前页
            this.pagerData.total=data.Data.TotalCount;//总条数
            this.pagerData.totalPages=data.Data.PageCount;//总页数
            this.loading = false;
        });
    }
    rankSet(col){//排序
      switch(this.rank[col]){
        case "none":
          this.rank[col] = "asc";
          break;
        case "asc":
          this.rank[col] = "desc";
          break;
        case "desc":
          this.rank[col] = "asc";
          break;
      }
      for(let key in this.rank){
        if(key==col){
          continue;
        } 
        this.rank[key]="none";
      }
      this.query.SortName=col;
      this.query.SortType=this.rank[col];
      this.loading = true;
      this.initData(this.query);
  }
  deleteDraft(id){//删除草稿
    let callback = data => {
      if(data.Result){
        this.loading = true;
        this.initData(this.query);
        this.windowService.alert({message:"删除成功",type:"success"});
      }else{
        this.windowService.alert({message:"删除失败",type:"fail"})
      }
    }
    this.procurementListDataService.deleteApplyMyapplyData(id).then(callback);
  } 
  routerJump(type,id,PurchaseType){//点击列表跳转的判断
    if(PurchaseType.indexOf("合同")!=-1){//合同采购申请
      if(type=='驳回'||type=='草稿'){
        window.open(dbomsPath+'procurement/submit-contractApply/' + id);
      }else{
        window.open(dbomsPath+'procurement/view-contractApply/'+ id);
      }
      return;
    }
    if(PurchaseType.indexOf("预下")!=-1){//预下采购申请
      if(type=='驳回'||type=='草稿'){
        window.open(dbomsPath+'procurement/submit-prepareApply/' + id);
      }else{
        window.open(dbomsPath+'procurement/deal-prepareApply/'+ id);
      }
      return;
    }
    if(PurchaseType.indexOf("备货")!=-1){//备货采购申请
      if(type=='驳回'||type=='草稿'){
        window.open(dbomsPath+'procurement/submit-stockApply/' + id);
      }else{
        window.open(dbomsPath+'procurement/deal-stockApply/'+ id);
      }
    }
  }
  toUpdateApply(id,PurchaseType){//已完成列表-修改
    if(PurchaseType.indexOf("合同")!=-1){//合同采购申请
      window.open(dbomsPath+'procurement/submit-contractApply/'+id);
      return;
    }
    if(PurchaseType.indexOf("预下")!=-1){//预下采购申请
      window.open(dbomsPath+'procurement/submit-prepareApply/'+id);
      return;
    }
    if(PurchaseType.indexOf("备货")!=-1){//备货采购申请
      window.open(dbomsPath+'procurement/submit-stockApply/'+id);
    }
  }
  toPurchaseOrder(id,PurchaseType){//根据id获取申请结构存localStorage，并跳转
    if(PurchaseType.indexOf("合同")!=-1){//合同采购申请
      let query={
        "PageIndex": 1,
        "PageSize": 1000,   
        "purchaserequisitionid":id
      }
      this.procumentOrderNewService.getApplyList(query).then(data => {
        let applyList= data.List;
        if(applyList && applyList.length){
          for(let i=0,len=applyList.length;i<len;i++){
            let item=applyList[i];
            item["text"] = item["requisitionnum"] + "-" + item["MainContractCode"];//拼接选项
          }
        }
        window.localStorage.setItem("applyList",JSON.stringify(applyList));
        window.localStorage.setItem("createNBType","hasApply");
        window.open(dbomsPath+'/procurement/new-NB');
      })
      return;
    }
    if(PurchaseType.indexOf("预下")!=-1){//预下采购申请
      
      return;
    }
    if(PurchaseType.indexOf("备货")!=-1){//备货采购申请
      
    }
  }
}