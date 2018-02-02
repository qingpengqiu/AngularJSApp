import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { XcModalService, XcBaseModal, XcModalRef, Person } from 'app/shared/index';
import { NgForm } from "@angular/forms";
import { WindowService } from "app/core";
import { ReqData, MaterielTemplateService } from "../../services/materiel-template.service";

@Component({
    templateUrl: 'edit-materiel-applyTemplate.component.html',
    styleUrls:['edit-materiel-applyTemplate.component.scss','../../scss/materiel.component.scss']
})



export class EditMaterielApplyTemplateComponent implements OnInit {

    reqData: ReqData = new ReqData();
    constructor(
    private windowService: WindowService,
    private xcModalService: XcModalService,
    private materielTemplateService:MaterielTemplateService,
    private changRef: ChangeDetectorRef) { }

    TemplateID:string;//存储获取的物料模版id，TemplateID
    modal: XcModalRef;

    isSubmit:boolean=false;//是否点击提交按钮
    isShowMaterielApplyTemplate:boolean=true;//是否显示物料申请模版
    
    //基础数据ngModel绑定数据
    allTemplate: any=["",""];//物料模版id+名称
    allFactory: any=["",""];//工厂id+名称
    allSupplierCodeSAP: any=["",""];//供应商编号id+名称
    allMaterialType: any=["",""];//物料类型id+名称
    allSerialNumParameter: any=["",""];//序列号参数id+名称
    allMaterialGroup: any=["",""];//物料组id+名称
    allTaxType: any=["",""];//税收分类id+名称
    allBrand: any=["",""];//品牌id+名称
    allBaseUnitOfMeasure: any=["",""];//基本计量单位id+名称
    allProductLevel: any=["",""];//产品层次



    // //查看物料模版页面模拟数据
    // private seeTemplate={
    //   TemplateID:1,
    //   ApplyName:"纪永凤",
    //   ApplyEname:"jyf",
    //   ApplyTime:"2017-11-11",
    //   MaterielTemplateName:"物料模版名称",
    //   Factory:"工厂1",
    //   SupplierCodeSAP:"供应商SAP编号1",
    //   MaterialType:"物料类型1",
    //   SerialNumParameter:"序列号参数1",
    //   MaterialGroup:"物料组1",
    //   TaxTypeID:"税收分类1",
    //   Brand:"品牌1",
    //   BaseUnitOfMeasure:"基本计量单位1",
    //   ProductLevel:"产品层次"
      

    // }


@ViewChild('form') public form: NgForm;

    

    ngOnInit() { 

        //获取对话框对象,不能放constructor里面
        this.modal = this.xcModalService.getInstance(this);

        this.modal.onShow().subscribe(data => {//显示弹窗
            //console.log(data);
            
            if (data) {//如果有传递过来的值，则显示查看弹出框，data为查询相应ID的返回数据
                
                if (data.state) {
                    this.reqData = data.data;

                    this.allTemplate=this.reqData.TemplateID?[this.reqData.TemplateID,this.reqData.TemplateName]:["",""];             
                    this.allFactory=this.reqData.Factory?[this.reqData.Factory,this.reqData.FactoryName]:["",""];
                    this.allSerialNumParameter=this.reqData.SerialNumParameter?[this.reqData.SerialNumParameter,this.reqData.SerialNumParameterName]:["",""];
                    this.allMaterialType=this.reqData.MaterialType?[this.reqData.MaterialType,this.reqData.MaterialTypeName]:["",""];
                    this.allSupplierCodeSAP=this.reqData.SupplierCodeSAP?[this.reqData.SupplierCodeSAP,this.reqData.SupplierName]:["",""];
                    this.allMaterialGroup=this.reqData.MaterialGroup?[this.reqData.MaterialGroup,this.reqData.MaterialGroupName]:["",""];
                    this.allBrand=this.reqData.Brand?[this.reqData.Brand,this.reqData.BrandName]:["",""];
                    this.allBaseUnitOfMeasure=this.reqData.BaseUnitOfMeasure?[this.reqData.BaseUnitOfMeasure,this.reqData.BaseUnitOfMeasureName]:["",""];
                    this.allTaxType=this.reqData.TaxTypeID?[this.reqData.TaxTypeID,this.reqData.TaxTypeName]:["",""];
                    this.allProductLevel=this.reqData.ProductLevel?[this.reqData.ProductLevel,this.reqData.ProductLevelName]:["",""];

                } else {
                    this.reqData = data.data;

                    this.allTemplate=this.reqData.TemplateID?[this.reqData.TemplateID,this.reqData.TemplateName]:["",""];             
                    this.allFactory=this.reqData.Factory?[this.reqData.Factory,this.reqData.FactoryName]:["",""];
                    this.allSerialNumParameter=this.reqData.SerialNumParameter?[this.reqData.SerialNumParameter,this.reqData.SerialNumParameterName]:["",""];
                    this.allMaterialType=this.reqData.MaterialType?[this.reqData.MaterialType,this.reqData.MaterialTypeName]:["",""];
                    this.allSupplierCodeSAP=this.reqData.SupplierCodeSAP?[this.reqData.SupplierCodeSAP,this.reqData.SupplierName]:["",""];
                    this.allMaterialGroup=this.reqData.MaterialGroup?[this.reqData.MaterialGroup,this.reqData.MaterialGroupName]:["",""];
                    this.allBrand=this.reqData.Brand?[this.reqData.Brand,this.reqData.BrandName]:["",""];
                    this.allBaseUnitOfMeasure=this.reqData.BaseUnitOfMeasure?[this.reqData.BaseUnitOfMeasure,this.reqData.BaseUnitOfMeasureName]:["",""];
                    this.allTaxType=this.reqData.TaxTypeID?[this.reqData.TaxTypeID,this.reqData.TaxTypeName]:["",""];
                    this.allProductLevel=this.reqData.ProductLevel?[this.reqData.ProductLevel,this.reqData.ProductLevelName]:["",""];


                    this.isShowMaterielApplyTemplate = false;//新建物料申请模板隐藏
                    
                }
            }

        })

    }

    
    saveApplyTemplate() {//新建物料申请模版保存
     this.isSubmit=true;//确认点击状态

     this.reqData.Factory=this.allFactory?this.allFactory[0]:"";
     this.reqData.FactoryName=this.allFactory?this.allFactory[1]:"";
     this.reqData.SerialNumParameter=this.allSerialNumParameter?this.allSerialNumParameter[0]:"";
     this.reqData.SerialNumParameterName=this.allSerialNumParameter?this.allSerialNumParameter[1]:"";
     this.reqData.MaterialType=this.allMaterialType?this.allMaterialType[0]:"";
     this.reqData.MaterialTypeName=this.allMaterialType?this.allMaterialType[1]:"";
     this.reqData.SupplierCodeSAP=this.allSupplierCodeSAP?this.allSupplierCodeSAP[0]:"";
     this.reqData.SupplierName=this.allSupplierCodeSAP?this.allSupplierCodeSAP[1]:"";
     this.reqData.MaterialGroup=this.allMaterialGroup?this.allMaterialGroup[0]:"";
     this.reqData.MaterialGroupName=this.allMaterialGroup?this.allMaterialGroup[1]:"";
     this.reqData.Brand=this.allBrand?this.allBrand[0]:"";
     this.reqData.BrandName=this.allBrand?this.allBrand[1]:"";
     this.reqData.BaseUnitOfMeasure=this.allBaseUnitOfMeasure?this.allBaseUnitOfMeasure[0]:"";
     this.reqData.BaseUnitOfMeasureName=this.allBaseUnitOfMeasure?this.allBaseUnitOfMeasure[1]:"";
     this.reqData.ProductLevel=this.allProductLevel?this.allProductLevel[0]:"";
     this.reqData.ProductLevelName=this.allProductLevel?this.allProductLevel[1]:"";
 
     if(this.allTaxType){
 
       if(this.allTaxType instanceof Array){
         this.reqData.TaxTypeID=this.allTaxType[0];
         this.reqData.TaxTypeName=this.allTaxType[1];
       }else{
         this.reqData.TaxTypeID=this.allTaxType.id;
         this.reqData.TaxTypeName=this.allTaxType.title;
       }
 
     }else{
       this.reqData.TaxTypeID="";
       this.reqData.TaxTypeName="";
     }

     let isMustForm=this.reqData.Factory==""||this.reqData.SerialNumParameter==""||this.reqData.MaterialType==""||this.reqData.SupplierCodeSAP==""||this.reqData.MaterialGroup==""||this.reqData.Brand==""||this.reqData.BaseUnitOfMeasure==""||this.reqData.ProductLevel=="";
    
        if(this.form.invalid){            
        return;

        }else{
         
            this.materielTemplateService.saveTemplate(this.reqData).then(data => {
              console.log(data);   
              if(!data.success){//弹出错误提示

                this.windowService.alert({message:data.message,type:"fail"});
                return;
              }else{
    
                if(this.reqData.TemplateID==""){//判断TemplateID的值，提示是新建还是保存
                  this.windowService.alert({message:"物料申请模板保存成功",type:"success"});
                }else{
                    this.windowService.alert({message:"物料申请模板更新成功",type:"success"});
                }
                
                this.modal.hide(true);
                this.form.resetForm();//清空数据
                this.isSubmit=false;//重置提交按钮验证值
                
                this.allFactory=["",""];//工厂id+名称
                this.allSupplierCodeSAP=["",""];//供应商编号id+名称
                this.allMaterialType=["",""];//物料类型id+名称
                this.allSerialNumParameter=["",""];//序列号参数id+名称
                this.allMaterialGroup=["",""];//物料组id+名称
                this.allTaxType=["",""];//税收分类id+名称
                this.allBrand=["",""];//品牌id+名称
                this.allBaseUnitOfMeasure=["",""];//基本计量单位id+名称
                this.allProductLevel=["",""];//产品层次
                
               
              }
            });
            
            //console.log(this.reqData);
        }       

    }

    cancel() {//取消或者关闭新建物料申请模版页面
        this.isSubmit=false;//重置提交按钮验证值
        this.isShowMaterielApplyTemplate=true;
        this.modal.hide();

        //清空数据
        this.form.resetForm();
        this.reqData=new ReqData();

        //this.allTemplate=undefined;//物料模版id+名称
        this.allFactory=["",""];//工厂id+名称
        this.allSupplierCodeSAP=["",""];//供应商编号id+名称
        this.allMaterialType=["",""];//物料类型id+名称
        this.allSerialNumParameter=["",""];//序列号参数id+名称
        this.allMaterialGroup=["",""];//物料组id+名称
        this.allTaxType=["",""];//税收分类id+名称
        this.allBrand=["",""];//品牌id+名称
        this.allBaseUnitOfMeasure=["",""];//基本计量单位id+名称
        this.allProductLevel=["",""];//产品层次
         
        this.changRef.markForCheck();
        this.changRef.detectChanges();
        //console.log(this.allFactory);
        

    }

    closeSeeTemplate() {//关闭查看模版弹窗
        this.isShowMaterielApplyTemplate=true;
        this.modal.hide();
        //this.resetData();
        this.reqData=new ReqData();

        this.allFactory=["",""];//工厂id+名称
        this.allSupplierCodeSAP=["",""];//供应商编号id+名称
        this.allMaterialType=["",""];//物料类型id+名称
        this.allSerialNumParameter=["",""];//序列号参数id+名称
        this.allMaterialGroup=["",""];//物料组id+名称
        this.allTaxType=["",""];//税收分类id+名称
        this.allBrand=["",""];//品牌id+名称
        this.allBaseUnitOfMeasure=["",""];//基本计量单位id+名称
        this.allProductLevel=["",""];//产品层次
        

        
    }

    editClick() {//点击进入编辑页面
        this.isShowMaterielApplyTemplate=true;
       
    }



}