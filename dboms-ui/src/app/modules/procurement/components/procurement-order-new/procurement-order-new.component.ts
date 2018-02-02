import { Component, OnInit } from '@angular/core';
import { Pager} from 'app/shared/index';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { WindowService } from 'app/core';
import 'rxjs/add/observable/merge';

import { 
    Query,Rank,
    ProcumentOrderNewService
 } from './../../services/procumentOrder-new.service';

@Component({
    templateUrl: 'procurement-order-new.component.html',
    styleUrls:['procurement-order-new.component.scss','./../../scss/procurement.scss']
})
export class ProcurementOrderNewComponent implements OnInit {
  fullChecked = false;//全选状态
  fullCheckedIndeterminate = false;//半选状态
  checkedNum = 0;//已选项数
  query: Query;//查询条件
  rank: Rank;//排序条件
  pagerData = new Pager();
  searchBoxShow = false;//搜索框显示标识

  applyList = [];//采购申请列表
  selectedList=[];//已选列表

  isSearch: boolean = false;//是否为搜索
  loading: boolean = true;//加载中效果

  constructor(private procumentOrderNewService:ProcumentOrderNewService,
    private windowService:WindowService,
    private router: Router,) {
  }

  ngOnInit(){
    this.query = new Query();
    this.rank = new Rank();
  }
clearSearch(){//重置搜索
  this.query = new Query();
}
  //检查是否全选
  CheckIndeterminate(v) {
    this.fullCheckedIndeterminate = v;
  }

  onChangePager(e: any){
    this.query.PageIndex = e.pageNo;
    this.query.PageSize = e.pageSize;
    this.initData(this.query);
  }
  initData(query: Query){
    this.fullChecked = false;
    this.fullCheckedIndeterminate = false;
    this.procumentOrderNewService.getApplyList(query).then(data => {
      console.log(data);
      this.applyList = data.List;
      if(this.applyList && this.applyList.length){
        // console.log(this.applyList);
        let len=this.applyList.length;
        let index;let item;let selOne;
        let hasSelec=Boolean(this.selectedList && this.selectedList.length);//是否已有选择列表
        for(let i=0;i<len;i++){
          item=this.applyList[i];
          index=this.selectedIndexOf(item["id"]);
          if(index!=-1){//检查每个的checked
            item["checked"]=true;
          }
          if(hasSelec){//重置disabled
            selOne=this.selectedList[0];
            if(item.purchasetype!=selOne.purchasetype || item.vendor!=selOne.vendor || item.own!=selOne.own
              || item.factory!=selOne.factory || item.taxrate!=selOne.taxrate || item.currency!=selOne.currency
              || item.delivery!=selOne.delivery || item.receiver!=selOne.receiver || item.vendorbizscope!=selOne.vendorbizscope
              || item.available<=0){//不可选择
              // 相同的采购申请类型、供应商、我方主体、工厂、税率、币种、交货条件、收货人、对方业务范围且可采购金额大于0
              item.disabled=true;
            }
          }
        }
        // 设置分页器
        this.pagerData.pageNo=data.CurrentPage;
        this.pagerData.total=data.TotalCount;
        this.pagerData.totalPages=data.PageCount;
        this.loading = false;
    }else{
      this.loading=false;
    }
    })
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
    this.initData(this.query);
  }

  //搜索
  search(){
      this.applyList=[];
      this.pagerData = new Pager();
      this.isSearch = true;
      this.loading = true;
      this.initData(this.query);
  }
  selectedIndexOf(id){//根据id寻找在已选列表里的index
    let len=this.selectedList.length;
    for(let i=0;i<len;i++){
      if(this.selectedList[i].id==id){
        return i;
      }
    }
    return -1;
  }
  childClick(e,index){//每行click时
    if(e){
        this.selectedList.push(this.applyList[index]);
    }else{
        this.selectedList.splice(this.selectedIndexOf(this.applyList[index]["id"]),1);
    }
    if(e && this.selectedList && this.selectedList.length==1){//选中第一个时，重置disabled
      let len=this.applyList.length;
      let item;
      let selOne=this.selectedList[0];
      for(let i=0;i<len;i++){
        item=this.applyList[i];
        if(item.purchasetype!=selOne.purchasetype || item.vendor!=selOne.vendor || item.own!=selOne.own
          || item.factory!=selOne.factory || item.taxrate!=selOne.taxrate || item.currency!=selOne.currency
          || item.delivery!=selOne.delivery || item.receiver!=selOne.receiver || item.vendorbizscope!=selOne.vendorbizscope
          || item.available<=0){//不可选择
            item.disabled=true;
        }
      }
    }
    if(!e && this.selectedList && this.selectedList.length==0){//取消最后一个选择时，重置disabled
      let len=this.applyList.length;
      for(let i=0;i<len;i++){
        this.applyList[i].disabled=false;
      }
    }
  } 
  parentClick(e){//全选按钮点击
    let len=this.applyList.length;
    if(e){
      for(let i=0;i<len;i++){
        if(!this.applyList[i]["disabled"] && this.selectedIndexOf(this.applyList[i]["id"])==-1){
          this.selectedList.push(this.applyList[i]);
        }
      }
    }else{
       let index;
       for(let i=0;i<len;i++){
        index=this.selectedIndexOf(this.applyList[i]["id"]);
        if(index!=-1){
          this.selectedList.splice(index,1);
        }
        this.applyList[i].disabled=false;//取消选择时，重置disabled
      }
    }
  }
  nextStep(){//下一步点击
    if(this.selectedList.length==0){
      this.windowService.alert({message:"未选择采购申请",type:"warn"});
    }else{
      for(let i=0,len=this.selectedList.length;i<len;i++){
        this.selectedList[i]["text"] = this.selectedList[i]["requisitionnum"] + "-" + this.selectedList[i]["MainContractCode"];//拼接选项
      }
      window.localStorage.setItem("applyList",JSON.stringify(this.selectedList));
      window.localStorage.setItem("createNBType","hasApply");
      this.router.navigate(['/procurement/new-NB']);
    }
  }
  routerToNB(){//直接创建NB
    window.localStorage.setItem("createNBType","directNB");
    this.router.navigate(['/procurement/new-NB']);
  }
}