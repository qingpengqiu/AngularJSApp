import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { WindowService } from "app/core";
import { NgForm } from "@angular/forms";
import { Headers, Http, RequestOptions } from "@angular/http";
import { Pager, XcModalService, XcBaseModal, XcModalRef } from 'app/shared/index';
import { DbWfviewComponent } from 'app/shared/index';
import { Person } from 'app/shared/services/index';
import { dbomsPath, environment } from "environments/environment";

import { EditNewMaterielChangeSalesListComponent } from "../edit-newMaterielChange-salesList/edit-newMaterielChange-salesList.component";
import { MaterielChangeService, MaterielChangeData, DetailExport, DetailImport, SalseList, ApproveData,BackSaleApproval } from "../../services/materiel-materielChange.service";

declare var window;
const RegEnglish: RegExp = /^[a-zA-Z0-9]*$/;//验证英文的正则,**获取文本域高度时使用

@Component({
  selector: 'edit-amc',
  templateUrl: 'edit-materiel-approvalMaterielChange.component.html',
  styleUrls: ['edit-materiel-approvalMaterielChange.component.scss', '../../scss/materiel.component.scss']
})

export class EditApprovalMaterielChangeComponent implements OnInit {
  userInfo = new Person();// 登录人头像
  materielChangeData: MaterielChangeData = new MaterielChangeData();
  salseList: SalseList = new SalseList();
  approveData: ApproveData = new ApproveData();//初始化审批组件数据
  backSaleApproval:BackSaleApproval=new BackSaleApproval();//初始化销售订单反填环节的审批基础数据

  modal: XcModalRef;//初始化弹窗

  materielTips: string;//提示信息（内容为此单本月全部销售或者此单本月未销售，或者此单本月部分销售）

  detailExportList: any = [];//转出物料列表
  detailImportList: any;//转入物料列表

  isSubmit: boolean = false;//是否点击“提交或者保存”按钮

  materielSales: any;//物料号对应的销售合同列表

  textareaArr: any;//用来保存符合条件的dom节点

  isOrderReversal: boolean = true;//判断是否到了销售订单反填的环节，如果不是则“销售订单号”不能填写    
  wfviewData: any;//流程全景图
  wfHistory: any = "";//审批历史记录
  tabType: string;//用来标示是从”我的申请“跳转进来的链接还是”我的审批“跳转进来，”我的申请“标示为”a“，”我的审批“标示为”e“
  isShowApprovalButton: boolean = true;//是否显示审批按钮
  isApproval: boolean;//用来判断是否截断审批流程
  approveresult: boolean = false;//用来保存审批结果，主要用来验证是否显示“导出excel”按钮    
  taskState: string;//用来接收从路由传过来的审批状态（0:未处理，1:已处理）
  ADP: string;//用来接收从路由传过来的值（0:正常审批，1:加签审批）

  newDetailImportList: any = [];//用来存储销售订单反填环节，填入销售订单号的数组对象列表

  constructor(
    private materielChangeService: MaterielChangeService,
    private activatedRouter: ActivatedRoute,
    private windowSerive: WindowService,
    private http: Http,
    private xcModalService: XcModalService,
    private ref: ElementRef
  ) { }

  @ViewChild("form") public form: NgForm;
  @ViewChild('wfView') public wfView: DbWfviewComponent;

  ngOnInit() {

    this.approveData.apiUrl_AR = "/materialchange/approve";//同意，驳回接口地址
    this.approveData.apiUrl_Sign = "/materialchange/addtask";//加签审批接口
    this.approveData.apiUrl_Transfer = "/materialchange/addtransfertask";//转办接口
    this.approveData.apiUrl = "materialchange/approveaddtask";//被加签人审批接口

    //根据获取路由中的值，来请求数据数据库
    this.activatedRouter.params.subscribe(params => {
      if (params.id != 0) {

        this.materielChangeData.Id = params.id.substring(1);//保存主键ID
        this.tabType = params.id.substring(0, 1);//获取标示，“a”为“我的申请”，“b”为“我的审批”

        if (this.tabType == "a") {//如果标示类型为“a”，则不显示审批按钮
          this.isShowApprovalButton = false;
        } else {
          this.isShowApprovalButton = true;
        }

        //通过ID获取审批全景图
        this.materielChangeService.getPanoramagram(this.materielChangeData.Id).then(data => {
          if (data.success) {
            //增加申请人的审批节点
            this.wfviewData = [{IsAlready:true,IsShow:true,NodeName:"申请人"},...JSON.parse(data.data).wfProgress];
            this.wfHistory = JSON.parse(data.data).wfHistory;
            //console.log(data.data);
            console.log(this.wfviewData);
            this.wfView.onInitData(this.wfviewData);
            this.approveresult = this.wfHistory.some(item => item.approveresult === '驳回');

          }
          // console.log(data.data);
        });

        let url = window.location.search;//获取地址栏的链接
        let parameterUrl = url.split("&"); //分割链接字符串，以获取链接里的值   
        if (parameterUrl[0] != "") {
          this.approveData.taskid = url.substring(url.indexOf("=") + 1, url.indexOf("&"));//保存链接中的TaskId
          this.approveData.nodeid = parameterUrl[1].substr(-1, 1);//保存链接中的nodeID  
          this.approveData.instanceid = parameterUrl[4].substring(parameterUrl[4].indexOf("=") + 1);//保存instanceid
          //console.log(parameterUrl[4].substring(parameterUrl[4].indexOf("=") + 1));
          this.taskState = parameterUrl[2].substr(-1, 1);//保存taskState状态，用来判断是否隐藏审批按钮（值为0:显示按钮，1:隐藏按钮）
          this.ADP = parameterUrl[3].substr(-1, 1);//保存ADP状态，用来判断是否显示加签（值为0:显示按钮，1:隐藏按钮）
        }

        //请求详情接口，获取详情页数据
        this.materielChangeService.detailData({ id: this.materielChangeData.Id }).then(data => {

          //如果获取数据成功
          if (data.success) {
      
            this.materielChangeData = data.data;//将数据存入基础数据
            this.isSela(this.materielChangeData.SaleStatus);//判断是否销售
            
            //console.log(this.materielChangeData);

            this.userInfo["userID"] = this.materielChangeData.ApplyItCode;
            this.userInfo["userEN"] = this.materielChangeData.ApplyItCode.toLocaleLowerCase();
            this.userInfo["userCN"] = this.materielChangeData.ApplyName;

            //console.log(this.materielChangeData.ApplyItCode);

            //如果到了销售订单反填环节，请求接口刷新导入物料数据
            if (this.approveData.nodeid === "7") {
              this.materielChangeService.getSaleImportMaterial(this.materielChangeData.Id).then(data => {
                if (data.success) {
                  this.detailExportList = this.materielChangeData.DetailExport;//将转出物料列表存入变量
                  this.detailImportList = data.data.list;
                  
                  this.materielChangeData.SaleStatus=data.data.SaleStatus;//用来判断显示销售转态
                  this.isSela(this.materielChangeData.SaleStatus);//判断是否销售

                  //判断转出数据列表和转入数据列表的长度，以增加对应的空数组，填补空缺列表
                  this.pushList();

                  this.newDetailImportList = this.detailImportList.filter(item => !item.ImportSaleOrderId);
                  console.log(data, this.materielChangeData.Id);
                  this.detailImportList.forEach(element => {//判断销售订单号是否存在，如果存在则将isImportSaleOrder置为true
                    if (element.ImportSaleOrderId) {
                      element.isImportSaleOrder = true;
                    }
                  });
                  setTimeout(() => {this.getDetailExportTextareaHeight();});
                }
              });
            } else {
              this.detailExportList = this.materielChangeData.DetailExport;//将转出物料列表存入变量
              this.detailImportList = this.materielChangeData.DetailImport;//将转入物料列表存入变量

              //如果nodeid不等于7，则库存数量处于保密目的，重置为空；
              this.detailImportList.forEach(element => {
                element.QuantityInStock=null;
                console.log(element.QuantityInStock)
              });

              setTimeout(() => {
                this.getDetailExportTextareaHeight();
              });
              
              //判断转出数据列表和转入数据列表的长度，以增加对应的空数组，填补空缺列表
              this.pushList();
  
            }

            //如果存在成本差异，则弹出提示框，在物流器材岗和销售订单反填环节不出现
            if (this.materielChangeData.IsVaryCost) {
              if (this.materielChangeData.ApplicationState != "0" && this.materielChangeData.ApplicationState != "6" && this.materielChangeData.ApplicationState != "7" && this.tabType != "a"&&this.approveData.nodeid!="6"&&this.approveData.nodeid!="7") {
                this.windowSerive.alert({ message: "成本金额异常请关注", type: "fail" });
              }
            }

          } else {
            this.windowSerive.alert({ message: data.message, type: "fail" });
          }

        });


      } else {
        // console.log(this.materielChangeData.ApplyTime);

        let user = JSON.parse(localStorage.getItem("UserInfo"));
        if (user) {//获取登录人头像信息
          this.userInfo["userID"] = user["ITCode"];
          this.userInfo["userEN"] = user["ITCode"].toLocaleLowerCase();
          this.userInfo["userCN"] = user["UserName"];

        } else {
          // this.router.navigate(['/login']); // 未登录 跳转到登录页面
        }
       
        this.materielChangeData = new MaterielChangeData();
        this.materielChangeData.ApplyItCode = this.userInfo["userID"];//将获取到的itcode存入基础数据对象
        this.materielChangeData.ApplyName = this.userInfo["userCN"];//将获取到的申请人姓名存入基础数据对象

        this.detailExportList = this.materielChangeData.DetailExport;
        this.detailImportList = this.materielChangeData.DetailImport;

      }
    });
    
  }

  //获取导出物料名称的内容高度
  getDetailExportTextareaHeight() {

    this.detailExportList.forEach((item, index) => {//遍历转出物料列表
      let exportMaterialLength: any = 0;//用来保存字符串的长度
      for (let i = 0; i < item.ExportMaterial.length; i++) {//循环物料名称字符串，计算出整个字符的实际长度                  
        if (item.ExportMaterial[i].search(RegEnglish) != "-1") {
          exportMaterialLength++;
        } else {
          exportMaterialLength += 2;
        }
      }
      let textHeight = parseInt(exportMaterialLength) / 4;//物料名称的长度，除以一行的字数，得到字符在文本域里的行数
      this.getDomTextareaHeight(textHeight, index);
      if (this.detailImportList[index].ImportMaterial) {//如果同行的转入物料名称存在
        if (item.ExportMaterial.length < this.detailImportList[index].ImportMaterial.length) {//如果转出的物料名称长度小于同行的转入物料的长度
          this.getImportMaterialTextareaHeight(index);
        }
      }
      console.log(item.ExportMaterial.length,this.detailImportList[index].ImportMaterial.length)
    });
   
  }
  //获取导入物料名称的内容高度
  getImportMaterialTextareaHeight(index) {

    let importMaterialLength: any = 0;//用来保存字符串的长度
    for (let i = 0; i < this.detailImportList[index].ImportMaterial.length; i++) {//循环物料名称字符串，计算出整个字符的实际长度
          if (this.detailImportList[index].ImportMaterial[i].search(RegEnglish) != "-1") {
            importMaterialLength++;
          } else {
            importMaterialLength += 2;
          }
        }
        let textHeight = parseInt(importMaterialLength) / 6;//物料名称的长度，除以一行的字数，得到字符在文本域里的行数
        this.getDomTextareaHeight(textHeight, index);
  }
  //将根据物料名称计算出的文本域高度赋值各所在行的所有文本域
  getDomTextareaHeight(textHeight, index) {
    textHeight = Math.ceil(textHeight);//将行数上取整
    this.textareaArr = this.ref.nativeElement.querySelectorAll(`textarea[data-textarea=m-nmc-textarea${index}]`);

    if (textHeight > 3) {
      [].forEach.call(this.textareaArr, (element) => { element.setAttribute("rows", textHeight); });
    }
  }
  //获得变更成本差异明细
  getDetailed() {
    this.aClick(environment.server + "materialchange/exportdeviate/" + this.materielChangeData.Id)
    //window.open(environment.server + "materialchange/exportdeviate/" + this.materielChangeData.Id);
  }
  //导出物料明细表
  getMaterielDetailed() {
    this.aClick(environment.server + "materialchange/exportdeviate/" + this.materielChangeData.Id+ "_d");  
    //window.open(environment.server + "materialchange/exportdeviate/" + this.materielChangeData.Id + "_d");
  }
  //关闭
  cancel() {
    window.close();
  }
  //在销售订单反填环节，将填入销售合同号的列表内容，发送给数据库
  writeImportMateriel() {

    //如果到了物流器材岗，没有填写物料凭证号，不允许提交审批
    if (this.approveData.nodeid === "6" && (this.approveData.vouncher === ""&&!this.materielChangeData.MaterialVoucher)) {
      this.isApproval = false;
      this.windowSerive.alert({ message: "请填写物料凭证号", type: "fail" });
    } else{
      this.isApproval = true;
    }

  }
  //在销售订单反填环节，将填入销售合同号的列表内容，发送给数据库并提交审批
  backSaleApplval(){
    if (this.approveData.nodeid === "7") {
      let tmpList = this.detailImportList.filter(item => !!item.ImportSaleOrderId && this.newDetailImportList.some(e => e.Id === item.Id))
      //console.log('最终要提交的数组:',tmpList);

      //请求接口，将反填环节的列表数据发送给后端
      this.materielChangeService.writeImportMaterial(tmpList).then(data => {
        if (!data.success) {
          this.windowSerive.alert({ message: "物料明细写入失败", type: "fail" });
          return;

        } else {
          this.backSaleApproval.nodeid=this.approveData.nodeid;//将nodeid存入反填环节的审批变量
          this.backSaleApproval.taskid=this.approveData.taskid;//将taskid存入反填环节的审批变量

          //请求审批接口
          this.SendOutBackSaleData();
          
        }
      });
    } else {
      //请求审批接口
      this.SendOutBackSaleData();
    }
  }

  //销售订单反填环节请求审批接口
  SendOutBackSaleData() {
    this.materielChangeService.backSaleApprove(this.backSaleApproval).then(data => {
      if (data.success) {
        this.windowSerive.alert({ message: "审批成功", type: "success" }).subscribe(() => {
          window.close();
        });
      } else {
        this.windowSerive.alert({ message: data.message, type: "fail" });
      }
    });
  }
  //判断转出物料数据列表和转入物料数据列表的长度，以增加对应的空数组，填补空缺列表
  pushList(){
    if(this.detailExportList.length>this.detailImportList.length){//如果转出物料列表的长度大于转入物料的列表
      let i=this.detailExportList.length-this.detailImportList.length;
      for(let j=0;j<i;j++){
        this.detailImportList.push(new DetailImport());
      }
   }else if(this.detailExportList.length<this.detailImportList.length){//如果转入物料列表的长度大于转出物料的列表
     let i=this.detailImportList.length-this.detailExportList.length;
     for(let j=0;j<i;j++){
       this.detailExportList.push(new DetailExport());
     }
   }
  }
  //判断是否销售
  isSela(SaleStatus){
    switch (SaleStatus) {//根据数据库返回值，判断要显示的内容
      case 1:
        this.materielTips = "此单本月全部销售";
        break;
      case 2:
        this.materielTips = "此单本月未销售";
        break;
      case 3:
        this.materielTips = "此单本月部分销售";
        break;
      default:
        break;
    }
  }

  //模拟a标签点击下载，此种接口请求window.open和window.location.href不可用
  aClick(link){
    let a=document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style","display:none");
    a.setAttribute("href",link)
    //a.setAttribute("download","成本差异明细表");
    a.click();
    document.body.removeChild(a);
    
  }

}