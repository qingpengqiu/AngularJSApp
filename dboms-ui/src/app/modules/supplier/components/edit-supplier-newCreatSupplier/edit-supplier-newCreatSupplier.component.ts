import { Component, OnInit,ViewChild } from '@angular/core';
import { WindowService } from "app/core";
import { Observable } from 'rxjs/Observable';
import { dbomsPath } from "environments/environment";
import { Person } from 'app/shared/services/index';

import { SupplierService,SupplierData } from "../../services/supplier.service";
import { NgForm } from '@angular/forms';

declare var window;

@Component({
  selector: 'edit-supplier-ncs',
  templateUrl: 'edit-supplier-newCreatSupplier.component.html',
  styleUrls:['edit-supplier-newCreatSupplier.component.scss','../../scss/supplier.component.scss']
})

export class EditSupplierNewCreatSupplier implements OnInit {

  userInfo = new Person();// 登录人头像
  supplierData:SupplierData=new SupplierData(); //初始化基础数据

  personInfo:any;//用来保存申请人的基本信息
  companyAndCode:any;//用来保存公司代码和公司名称
  currencyAndCode:any="";//用来币种代码和币种名称
  currencyAndCodeList:any;//用来保存
  upFileApiLink:string;//用来保存上传附件的接口地址


  constructor(
    private supplierService:SupplierService,
    private windowService:WindowService
  ) { }

  @ViewChild('form') public form: NgForm;

  ngOnInit() { 
    this.getPerson();//获取登录人的基本信息
    this.getCurrency();//获取币种基础数据    
  }

  //获取人员基本信息
  getPerson() {
    let user = JSON.parse(localStorage.getItem("UserInfo"));
    if (user) {//获取登录人头像信息
      this.userInfo["userID"] = user["ITCode"];
      this.userInfo["userEN"] = user["ITCode"].toLocaleLowerCase();
      this.userInfo["userCN"] = user["UserName"];
    } else {
      // this.router.navigate(['/login']); // 未登录 跳转到登录页面
    }
    //请求数据接口，查询登录人的相关信息
    this.supplierService.getPersonInformation().then((data) => {
      this.personInfo = data;//赋值给绑定字段

      if (data.Result) {//如果存在基本信息，则将信息存入
        this.supplierData.BBMC = JSON.parse(data.Data).BBMC;
        this.supplierData.SYBMC = JSON.parse(data.Data).SYBMC;
      }
    });

    //请求接口，查询登陆人的联系方式
    this.supplierService.getPersonPhone().then((data)=>{
     if(data.Result){
       this.supplierData.phone=data.Data;
     }
    });

  }

  //调用接口获取公司代码和公司名称
  getCompany(e){
    this.supplierData.company=e[0];//保存公司名称
    this.supplierData.companycode=e[1];//保存公司代码
    this.companyAndCode=`${[e[0]]}  ${[e[1]]}`;//将公司名称和代码组合绑定到视图显示
    //console.log(this.supplierData.company,this.supplierData.companycode);
  }

  //调用接口获取国际贸易条件
  getInternationaltradeterms(e){
    console.log(e);
  }

  //调用接口获取币种
  getCurrency(){
    this.supplierService.getCurrency().then((data)=>{
      if(data.Result){
        this.currencyAndCodeList=JSON.parse(data.Data);    
        console.log(this.currencyAndCode);
      }else{
        this.windowService.alert({message:data.Message,type:"fail"});
      }
    });
  }

  //获取选择的币种
  getCurrencySelect(selectCurrency){
    this.supplierData.currency=selectCurrency.CurrencyName;
    this.supplierData.currencycode=selectCurrency.CurrencyCode;
    console.log(this.supplierData.currency,this.supplierData.currencycode);
  }

  //提交和暂存
  save(type){
    //暂存
    if(type==='0'){
      this.supplierData.wfstatus=type;//申请状态为暂存
      this.supplierService.supplierSave(this.supplierData).then((data)=>{
        
        if(data.success){

          if(data.data){
            this.supplierData.vendorid=data.data.Id;
            this.windowService.alert({message:"保存成功",type:"success"});
          }else{
            this.windowService.alert({message:"更新成功",type:"success"});            
          }

        }else{
          this.windowService.alert({message:data.message,type:"fail"});
        }

      });
    }else{
      //提交
    }
  }


  //上传附件成功的回调函数
  fileUploadSuccess(e){

  }

}