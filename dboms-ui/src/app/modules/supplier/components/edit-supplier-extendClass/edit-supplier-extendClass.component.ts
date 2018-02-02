import { Component, OnInit,ViewChild } from '@angular/core';
import { Pager,XcModalService, XcBaseModal, XcModalRef, Person } from 'app/shared/index';
import { NgForm } from "@angular/forms";
import { WindowService } from "app/core";
import { dbomsPath,environment } from "environments/environment";

import { SupplierService,Company,BusinessUnit} from "../../services/supplier.service";

@Component({
  selector: 'edit-supplier-ec',
  templateUrl: 'edit-supplier-extendClass.component.html',
  styleUrls:['edit-supplier-extendClass.component.scss','../../scss/supplier.component.scss']
})

export class EditSupplierExtendClassComponentd implements OnInit {

  modal: XcModalRef;
  company:Company=new Company();//初始化参数
  businessUnit:BusinessUnit=new BusinessUnit();

  //复选按钮所需字段
  fullCheckedPopup = false;
  fullCheckedIndeterminatePopup = false;
  checkedNumPopup = 0;

  checked:any;
  pagerData: any = new Pager();

  isShow:string;//用来标示是否显示相应的组件
  companyListApi:string="InitData/GetPageDataCompany";//用来保存请求公司代码数据列表
  companyList:any;//用来保存公司列表数据
  companyTitle:any;//用来保存选中的公司

  classnamecode:string;//用来保存供应商分类

  constructor(
    private windowService: WindowService,
    private xcModalService: XcModalService,
    private supplierService:SupplierService,
  ) { }

  @ViewChild("form") public form: NgForm

  ngOnInit() {
    //获取对话框对象,不能放constructor里面
    this.modal = this.xcModalService.getInstance(this);

    this.modal.onShow().subscribe(data => {//显示弹窗
      this.isShow=data.type;//获取触发显示的类型，是extend（扩展）还是class（分类）
    });

  }

  //检查是否全选
  CheckIndeterminatePopup(e) {
    this.fullCheckedIndeterminatePopup = e;
    //console.log(e);
  }
  //分页代码
  onChangePage(e: any) {
    //this.reqSearchData.Keyword = this.reqSearchData.Keyword || "";
    // this.query.PageNo = e.pageNo;
    // this.query.PageSize = e.pageSize;

    // this.initData(this.query);
  }
  //向数据库发送请求
  initData(businessUnit: BusinessUnit) {
    this.fullCheckedPopup = false;
    this.fullCheckedIndeterminatePopup = false;
    this.checkedNumPopup = 0;

    // this.commonlyMaterielService.searchCommonlyMateriel(this.reqSearchData).then(data => {

    //     //设置分页器
    //     this.pagerData.set(data.data.pager);
    //     //this.loading = false;      
    //     this.searchList = data.data.list;
    //     console.log(this.searchList);
    //     if (this.searchList == "") {//判断如果查询列表为空，则显示缺省页面
    //         this.isSearchResult = false;//显示缺省页面 
    //     } else {
    //         this.isSearchResult = true;//隐藏缺省页
    //     }

    // });

  }

  //关闭弹窗
  cancel(){
   this.modal.hide();
  }

  //获取选中的公司
  getCompany(e){
    console.log(this.companyTitle,e);
  }

  //获取选中的事业部
  getSelectItem(){

  }

}