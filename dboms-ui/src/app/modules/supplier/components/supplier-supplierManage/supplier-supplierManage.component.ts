import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { WindowService } from "app/core";
import { Pager, XcModalService, XcBaseModal, XcModalRef } from 'app/shared/index';
import { dbomsPath } from "environments/environment";

import { SupplierService, SupplierList } from "../../services/supplier.service";
import { EditSupplierExtendClassComponentd } from "../edit-supplier-extendClass/edit-supplier-extendClass.component";

@Component({
  selector: 'supplier-sm',
  templateUrl: 'supplier-supplierManage.component.html',
  styleUrls: ['supplier-supplierManage.component.scss', '../../scss/supplier.component.scss']
})

export class SupplierManageComponent implements OnInit {

  pagerData: any = new Pager();
  modal: XcModalRef;
  supplierList:SupplierList=new SupplierList();//初始化查询供应商

  //复选按钮所需字段
  fullChecked = false;
  fullCheckedIndeterminate = false;
  checkedNum = 0;

  loading: boolean = false;//是否显示loading效果

  isSearchResult: boolean = true;//是否显示搜索结果
  notSelect: boolean = true;//用来判断顶部的三个功能按钮是否可以点击
  //unEdit:boolean=true;//用来判断“我的关注”是否可以编辑

  searchList: any;//保存列表内容

  tempRequestData: any = [];//用来存储列表中选择的数据

  constructor(
    private windowService: WindowService,
    private xcModalService: XcModalService,
    private supplierService:SupplierService
  ) { }

  @ViewChild("form") public form: NgForm

  ngOnInit() {
    //在初始化的时候 创建模型
    this.modal = this.xcModalService.createModal(EditSupplierExtendClassComponentd);
    //模型关闭的时候 如果有改动，请求刷新
    this.modal.onHide().subscribe((data?: any) => {
        if (data) {
            this.initData(this.supplierList);
        }
    })

  }

  //新建物料数据修改
  addData() {
    window.open(dbomsPath + 'supplier/edit-supplier-ncs/' + 0);
  }

  //检查是否全选
  CheckIndeterminate(e) {
    this.fullCheckedIndeterminate = e;
    //console.log(e);
  }
  //分页代码
  onChangePage(e: any) {
    
    this.supplierList.PageNo = e.pageNo;
    this.supplierList.PageSize = e.pageSize;

    this.initData(this.supplierList);
  }
  //向数据库发送请求
  initData(supplierList: SupplierList) {
    this.fullChecked = false;
    this.fullCheckedIndeterminate = false;
    this.checkedNum = 0;

    this.supplierService.searchSupplierLIst(this.supplierList).then(data => {

        //设置分页器
        this.pagerData.set(data.data.pager);
        //this.loading = false;      
        this.searchList = data.data.list;
        this.searchList.forEach(element => {
          element.unEdit=true;//增加unEdit属性
          if(!element.MyContent){//如果我的关注不存在值，则将内容置为“请填写我的关注”
            element.MyContent="请填写我的关注";   
                    
          }
        });
        console.log(this.searchList);
        if (this.searchList == "") {//判断如果查询列表为空，则显示缺省页面
            this.isSearchResult = false;//显示缺省页面 
        } else {
            this.isSearchResult = true;//隐藏缺省页
        }

    });

  }

  //搜索
  searchData() {
    this.initData(this.supplierList);
   }

  //当按回车时，搜索数据
  enterSearch(e){
   if(e.keyCode == 13){
     this.searchData();
   }
  }

  //列表项是否选择
  getSelectList(isSelect, Id) {
    console.log(isSelect, Id);
    //如果列表被选中并且数组中不存在所选项的ID，将“ID”push进数组
    if (isSelect && this.tempRequestData.indexOf(Id)===-1) {
      this.tempRequestData.push(Id);
    }
    //如果没有选中并且数组中存在所选项的ID，将ID从数组中删除
    if (!isSelect && this.tempRequestData.indexOf(Id)>-1) {
      this.tempRequestData.splice(this.tempRequestData.indexOf(Id),1);
    }

    this.topButtonControl();////判断数组中是否为空，以决定顶部的三个功能按钮是否可以点击
  }

  //判断数组中是否为空，以决定顶部的三个功能按钮是否可以点击
  topButtonControl() {
    if (this.tempRequestData.length > 0) {
      this.notSelect = false;
    }else{
      this.notSelect = true;
    }
  }

  //当双击鼠标时，“我的关注”字段切换为编辑状态
  EditMyAtt(i){
    this.searchList[i].unEdit=false;
  }

  //当鼠标失去焦点时，提交数据，锁定文本框
  setMyAtt(i){
    this.searchList[i].unEdit=true;
    if(!this.searchList[i].MyAtt){
      this.searchList[i].MyAtt="请填写我的关注";
    }
    
  }

  //扩展供应商,分类供应商
  extendClassSupplier(type){
    let parameter={type:type,parames:this.tempRequestData}
    this.modal.show(parameter);//显示弹出框
  }



}