import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { WindowService } from "app/core";
import { NgForm } from "@angular/forms";
import { Headers, Http, RequestOptions } from "@angular/http";

import { Person } from 'app/shared/services/index';
import { dbomsPath, environment } from "environments/environment";
import { Pager, XcModalService, XcBaseModal, XcModalRef } from 'app/shared/index';
import { MaterielChangeService, MaterielChangeData, DetailExport, DetailImport, SalseList, MaterielCodeFactory, GetBasedata, GetSaleMaterielData } from "../../services/materiel-materielChange.service";
import { EditNewMaterielChangeSalesListComponent } from "../edit-newMaterielChange-salesList/edit-newMaterielChange-salesList.component";

declare var window;
declare var document;
declare var $;

const RegEnglish: RegExp = /^[a-zA-Z0-9\s]*$/;//验证英文的正则,**获取文本域高度时使用

@Component({
  selector: 'edit-nmc',
  templateUrl: 'edit-newMaterielChange.component.html',
  styleUrls: ['edit-newMaterielChange.component.scss', "../../scss/materiel.component.scss"]
})

export class EditNewMaterielChangeComponent implements OnInit {

  userInfo = new Person();// 登录人头像
  materielChangeData: MaterielChangeData = new MaterielChangeData();
  salseList: SalseList = new SalseList();
  materielCodeFactory: MaterielCodeFactory = new MaterielCodeFactory();
  getBasedata: GetBasedata = new GetBasedata();//获取审批基础数据
  getSaleMaterielData: GetSaleMaterielData = new GetSaleMaterielData();
  modal: XcModalRef;//初始化弹窗

  materielTips: string = "此单本月全部销售";//提示信息（内容为此单本月全部销售或者此单本月未销售，或者此单本月部分销售）

  detailExportList:any = [];//转出物料列表
  detailImportList:any = [];//转入物料列表

  loading:boolean=false;//是否显示loading画面

  isSubmit: boolean = false;//是否点击“提交或者保存”按钮

  personInfo;//保存人物信息

  materielSales: any;//物料号对应的销售合同列表

  textareaArr: any;//用来保存符合条件的dom节点

  approvalPerson: any;//用来保存审批流程字符串对象
  wfHistory: any;//用来保存历史记录
  departmentPerson: any;//保存获取到的本部审批人信息
  approveresult: boolean = false;//用来保存审批结果，主要用来验证是否显示“导出excel”按钮
  isOrderReversal: boolean = false;//判断是否到了销售订单反填的环节，如果不是则“销售订单号”不能填写

  urlLink: string;//保存路由链接

  financialApprovalPerson: any = [{ userID: "pusd", userEN: "pusd", userCN: "浦少栋" },
  { userID: "abewong", userEN: "abewong", userCN: "黄恺仪" },
  { userID: "lihui", userEN: "lihui", userCN: "李辉" }, { userID: "liuxmp", userEN: "liuxmp", userCN: "刘学敏" },
  { userID: "weihonga", userEN: "weihonga", userCN: "魏弘" }];//财务审批人基础数据
  financialApproval: any;//保存财务岗审批人
  purchaseApproval: any = [{ userID: "erss", userEN: "erss", userCN: "耳杉杉" },
  { userID: "zhangjingt", userEN: "zhangjingt", userCN: "张婧" }, { userID: "zhangxyx", userEN: "zhangxyx", userCN: "张筱雲" },
  { userID: "tiangyinga", userEN: "tianyinga", userCN: "田颖" }];//保存采购运控审批人
  saleApproval: any = { userID: "lihui", userEN: "lihui", userCN: "李辉" };//保存销售订单反填

  constructor(
    private materielChangeService: MaterielChangeService,
    private activatedRouter: ActivatedRoute,
    private windowSerive: WindowService,
    private http: Http,
    private ref: ElementRef,
    private xcModalService: XcModalService,
  ) { }

  @ViewChild("form") public form: NgForm;

  ngOnInit() {
    this.urlLink = environment.server + "materialchange/import";//导入excel接口地址，在上传组件处使用
    this.getPerson();//获取人员基本信息

    //根据获取路由中的值，来请求数据数据库
    this.activatedRouter.params.subscribe(params => {
      if (params.id != 0) {

        if ((params.id).substr(0, 2) === 'mc') {//判断是否是从销售订单过来的物料变更
          this.loading=true;
          this.getSaleMaterielData.Data = params.id;//如果是，将路由ID存入请求变量
          //请求接口获取销售订单过来的物料明细
          this.materielChangeService.getSaleMateriel(this.getSaleMaterielData).then(data => {
            console.log(JSON.parse(data.data));

            if (data.success) {//请求接口成功
              this.loading=false;
              this.detailExportList = JSON.parse(data.data);//请求成功，将返回的数据存入数组对象              
              for (let i = 0; i < this.detailExportList.length; i++) {//通过循环，向detailImportList列表中，插入空行
                this.detailImportList.push(new DetailImport());
                this.detailExportList[i].isNoEdit = true;//从销售订单传递过来的数据，转出销售合同号不能修改
                this.detailImportList[i].isNoEdit = true;//从销售订单传递过来的数据，转入销售合同号不能修改
                this.detailExportList[i].From=2;//表示是从销售订单传来的数据
                this.detailImportList[i].From=2;//表示是从销售订单传来的数据
                this.detailExportList[i].ExportCountSource=this.detailExportList[i].ExportCount;//将从销售订单传入的数量备份存储一份，用来在后面比对时使用
              }
              this.detailImportList[0].ImportSC_Code = this.detailExportList[0].ExportSC_Code;//将从销售合同获取的转出物料销售合同号，赋值到对应行的转入销售合同号

              this.materielChangeData.From = "2";//表示是从销售订单传来的数据
              this.materielChangeData.Factory = this.detailExportList[0].ExportFactory;//将工厂赋值给绑定字段
              this.getFinancePerson();//根据工厂判断财务审批人
              /**
             因为在获取视图时，还要得到数据，根据获取的内容的高度，改变文本域的高度，而在angular生命周期中没有即获得视图又获得数据的阶段，所以使用setTimeout(),
             利用定时器的原理，在所有程序都执行完成之后在执行当前程序
             */
              setTimeout(() => { this.getDetailExportTextareaHeight()});
            } else {
              this.windowSerive.alert({ message: data.message, type: "fail" });
            }
          });

        } else {
          this.loading=true;
          this.materielChangeData.Id = params.id.substring(1);//保存主键ID
          this.materielChangeService.detailData({ id: this.materielChangeData.Id }).then(data => {

            if (data.success) {//如果获取数据成功
              this.loading=false;
              this.materielChangeData = data.data;//将数据存入基础数据
              console.log(this.materielChangeData);
              this.userInfo["userID"] = this.materielChangeData.ApplyItCode;
              this.userInfo["userEN"] = this.materielChangeData.ApplyItCode.toLocaleUpperCase();
              this.userInfo["userCN"] = this.materielChangeData.ApplyName;

              if(this.materielChangeData.BBApprover){
                this.departmentPerson=JSON.parse(this.materielChangeData.BBApprover);
              }

              this.detailExportList = this.materielChangeData.DetailExport;//将转出物料列表存入变量
              this.detailImportList = this.materielChangeData.DetailImport;//将转入物料列表存入变量

              this.pushList();//动态增加列表的长度

              //遍历转出物料明细的数据，如果是有包含销售订单的标记，则将对应行的转入物料明细字段赋值
              this.detailExportList.forEach((element,index) => {
                if(element.From=="2"){
                  this.detailImportList[index].From=2;
                }
              });

              this.getFinancePerson();//根据工厂判断财务审批人
              setTimeout(() => { this.getDetailExportTextareaHeight();});//根据物料名称的长度改变文本域的高度

            } else {
              this.windowSerive.alert({ message: data.message, type: "fail" });
            }
          });
          //通过ID获取审批历史记录
          this.materielChangeService.getPanoramagram(this.materielChangeData.Id).then(data => {
            if (data.success) {
              this.wfHistory = JSON.parse(data.data).wfHistory;
              this.approveresult = this.wfHistory.some(item => item.approveresult === '驳回');
            }
          });
        }
      } else {
        this.materielChangeData = new MaterielChangeData();
        this.materielChangeData.ApplyItCode = this.userInfo["userID"].toLocaleUpperCase();//将获取到的itcode存入基础数据对象
        this.materielChangeData.ApplyName = this.userInfo["userCN"];//将获取到的申请人姓名存入基础数据对象

        this.detailExportList = this.materielChangeData.DetailExport;
        this.detailImportList = this.materielChangeData.DetailImport;
      }
    });

    //如果详情加载时没有获取到时间，获取当前时间显示
    if (!this.materielChangeData.ApplyTime) {
      this.materielChangeData.ApplyTime = new Date().toString();//获取申请时间
    }

    //在初始化的时候 创建模型
    this.modal = this.xcModalService.createModal(EditNewMaterielChangeSalesListComponent);
    //模型关闭的时候 如果有改动，请求刷新
    this.modal.onHide().subscribe((data?: any) => {
      if (data) {
        //console.log(data);
        this.detailExportList[data[1]].ExportSC_Code = data[0];
        this.detailExportList[data[1]].ExportCount=this.detailExportList[data[1]].ExportCountSource=data[2];//保存转出物料的可用数量
      }
    })

    this.materielChangeService.getBasedata(this.getBasedata).then(data => {
      if (data.success) {
        this.materielChangeData.WFApproveUserJSON = JSON.parse(data.data);
        this.approvalPerson = this.materielChangeData.WFApproveUserJSON;
      }
    });
    this.getFinancePerson();//判断工厂的代码，显示对应的财务环节审批人
  }
  //提交和暂存
  save(applicationState) {

    this.isSubmit = true;//提交按钮被点击

    if (applicationState == "0") {//暂存
      this.loading=true;
      this.materielChangeData.ApplicationState = "0";//状态为“0”，保存为草稿
      this.materielChangeData.DetailExport = this.detailExportList;//将转出列表数据存入请求对象
      this.materielChangeData.DetailImport = this.detailImportList;//将转入列表数据存入请求对象

      this.materielChangeData.WFApproveUserJSON = JSON.stringify(this.approvalPerson);//将获取到的数组对象转换为字符串

      this.materielChangeService.saveData(this.materielChangeData).then(data => {

        if (data.success) {
          this.loading=false;
          if (this.materielChangeData.Id) {
            this.windowSerive.alert({ message: "更新成功", type: "success" }).subscribe(() => {
              window.close();
            });
          } else {
            this.materielChangeData.Id = data.data.id;
            this.windowSerive.alert({ message: "保存成功", type: "success" }).subscribe(() => {
               window.close();
            });
          }

        } else {
          this.windowSerive.alert({ message: data.message, type: "fail" });
          this.loading=false; 
        }

      });

    } else if (applicationState == "1") {//提交       
      this.loading=true;     
      this.materielChangeData.ApplicationState = "1";//状态为“1”，提交到审批流程

      if (this.materielChangeData.BBApprover == undefined) {
        this.loading=false; 
        this.windowSerive.alert({ message: "请选择本部审批人", type: "fail" }); 
        return;
      }

      if (this.detailExportList.some(item => item.ExportMaterialNo != "")) {//验证整个列表的转出物料编号是否有填写，如果填写了，验证所在行的必填字段是否填写

        if (this.detailExportList.some(item => item.ExportMaterialNo != "" && (item.ExportCount === "" ||item.ExportCount === null || item.InStorageThirtyDays === undefined|| item.InStorageThirtyDays === null))) {
          console.log(this.detailExportList);
          this.loading=false; 
          this.windowSerive.alert({ message: "请填写'转出物料编号'所在行的必填字段", type: "fail" });
          return;
        }

      } else {
        this.loading=false; 
        this.windowSerive.alert({ message: "请填写'转出物料编号'", type: "fail" });
        return;
      }
      //验证整个列表的转入物料编号是否有填写，如果填写了，验证所在行的必填字段是否填写
      if (this.detailImportList.some(item => item.ImportMaterialNo != "")) {
        if (this.detailImportList.some(item => item.ImportMaterialNo != "" && (item.ImportCount === "" ||item.ImportCount === null || item.ImportStorageLocation === "" || item.ImportSC_Code === "" || item.SaleInCurrentMonth === undefined|| item.SaleInCurrentMonth === null))) {
          this.loading=false; 
          this.windowSerive.alert({ message: "请填写'转入物料编号'所在行的必填字段", type: "fail" });
          return;
        }
      } else {
        this.loading=false; 
        this.windowSerive.alert({ message: "请填写'转入物料编号'", type: "fail" });
        return;
      }
      //判断是否填写“工厂”
      if (!this.materielChangeData.Factory) {
        this.loading=false; 
        this.windowSerive.alert({ message: "请填写'工厂'", type: "fail" });
        return;
      }
      //判断是否填写了“联系方式”
      if (!this.materielChangeData.Contact || this.materielChangeData.Contact === "X") {
        this.loading=false; 
        this.windowSerive.alert({ message: "请填写'联系方式'", type: "fail" });
        return;
      }
      //判断是否填写了“调整物料原因”
      if (!this.materielChangeData.Reason) {
        this.loading=false; 
        this.windowSerive.alert({ message: "请填写'调整物料原因'", type: "fail" });
        return;
      }
      //从销售订单转出的物料数据，提交时新增的转出物料的销售合同号，只能为空或者为销售订单转出的物料销售合同号一致
      if(this.getSaleMaterielData.Data||this.materielChangeData.From=="2"){
        this.detailExportList.forEach(element => {
          if(element.ExportSC_Code!=""&&element.ExportSC_Code!=this.detailExportList[0].ExportSC_Code){
            this.loading=false; 
            this.windowSerive.alert({message:"通过合同清单触发的物料变更，转出物料的销售合同号只能空或与销售合同的销售合同号一致",type:"fail"});     
           return;       
         }
        });
      }

      //用户填写的转出物料数量不能大于可用数量
      this.detailExportList.forEach((element,index) => {
        if(element.ExportCountSource){
          if(element.ExportCount>element.ExportCountSource){
            this.loading=false; 
            this.windowSerive.alert({message:"转出物料数量不能大于此合同下对应物料的可用数量",type:"fail"});
            return;            
          }
        }
      });

      if (this.form.invalid) {
        this.loading=false;
        this.windowSerive.alert({ message: "表单填写有误，请检查后重新提交", type: "fail" });
      } else {
        this.materielChangeData.DetailExport = this.detailExportList;//将转出列表数据存入请求对象
        this.materielChangeData.DetailImport = this.detailImportList;//将转入列表数据存入请求对象

        this.materielChangeService.isDeviate(this.materielChangeData).then(data => {//请求接口判断是否提示变更成本差异
          if (data.success) {
            this.loading=false;
            if (data.data.IsVary === 2) {//如果返回值为“2”，则提示变更成本差异，询问用户是否继续
              this.windowSerive.confirm({ message: "成本金额异常，是否继续提交？" }).subscribe({
                next: (v) => {//如果用户点击确定，则请求接口，保存数据，否则返回页面
                  if (v) {
                    this.loading=true;
                    this.saveData();//请求接口，保存物料信息
                  } else {
                    return;
                  }
                }
              });
            } else if (data.data.IsVary === 3) {
              this.windowSerive.alert({ message: "税收分类不合法，请检查后重新提交", type: "fail" });
            } else {
              this.saveData();//请求接口，保存物料信息
            }
          }
        });
      }
    }
  }
  //获取人员基本信息
  getPerson() {
    let user = JSON.parse(localStorage.getItem("UserInfo"));
    if (user) {//获取登录人头像信息
      this.userInfo["userID"] = user["ITCode"];
      this.userInfo["userEN"] = user["ITCode"].toLocaleUpperCase();
      this.userInfo["userCN"] = user["UserName"];
    } else {
      // this.router.navigate(['/login']); // 未登录 跳转到登录页面
    }
    //请求数据接口，查询登录人的相关信息
    let headers = new Headers({ 'Content-Type': 'application/json', 'ticket': localStorage.getItem('ticket') });
    let options = new RequestOptions({ headers: headers });
    this.http.get(environment.server + "base/GetCurrentUserInfo", options).subscribe(data => {//获取登录人信息

      this.personInfo = data;//赋值给绑定字段

      if (JSON.parse(this.personInfo._body).Result) {//如果存在基本信息，则将信息存入
        this.materielChangeData.Contact = JSON.parse(JSON.parse(this.personInfo._body).Data).Phone;
        this.materielChangeData.BBMC = JSON.parse(JSON.parse(this.personInfo._body).Data).BBMC;
        this.materielChangeData.SYBMC = JSON.parse(JSON.parse(this.personInfo._body).Data).SYBMC;
      }

    });
  }
  //取消
  cancel() {
    window.close();
  }
  //跳转到新建一般物料,
  addMateriel() {
    window.open(dbomsPath + "mate/edit-newMateriel/0");
  }
  //增加一行
  addLine() {

    this.detailExportList.push(new DetailExport());
    this.detailImportList.push(new DetailImport());
    //如果是从销售订单过来的数据，则转入物料明细的销售合同号不可修改，且等于转出的销售合同号
    if (this.getSaleMaterielData.Data||this.materielChangeData.From=="2") {
      this.detailImportList.forEach(element => {
        element.isNoEdit = true;
      });
    }
  }
  //删除一行
  removeLine(i) {
    if (this.detailExportList.length > 1) {
      this.detailExportList.splice(i, 1);
      this.detailImportList.splice(i, 1);
    }
  }
  //获取销售合同号
  showSalesList(ExportMaterialNo,Batch,StorageLocation,i) {

    this.materielChangeService.editSalesList({ MaterialERPCode: ExportMaterialNo,Batch:Batch, StorageLocation:StorageLocation}).then(data => {

      if (data.success && data.data.list.length > 0) {
        this.materielSales = data.data.list;//将查询到的内容存入变量               
        if (this.materielSales.length > 0) {//判断获取到的销售合同号的条数
          let materielSalesIndex = [this.materielSales, i];//存储查询返回的对象和弹出数据数据的下标
          this.modal.show(materielSalesIndex);
        } else {
          this.detailExportList[i].ExportSC_Code = this.materielSales[0].MainContractCode;
        }
      }else if(data.data.list.length===0){
        this.detailExportList[i].ExportSC_Code = null;        
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
      let textHeight = parseInt(exportMaterialLength) / 8;//物料名称的长度，除以一行的字数，得到字符在文本域里的行数
      this.getDomTextareaHeight(textHeight, index);
      if (this.detailImportList[index].ImportMaterial) {//如果同行的转入物料名称存在
        if (item.ExportMaterial.length < this.detailImportList[index].ImportMaterial.length) {//如果转出的物料名称长度小于同行的转入物料的长度
          this.getImportMaterialTextareaHeight(index);
        }
      }
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
        let textHeight = parseInt(importMaterialLength) / 8;//物料名称的长度，除以一行的字数，得到字符在文本域里的行数
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
  //获取本部审批人
  getPersonInfor(PI?) {
    this.materielChangeData.BBApprover=JSON.stringify(PI);
    this.approvalPerson[0].UserSettings = `[{'ITCode':'${PI[0].userEN}','UserName':'${PI[0].userCN}'}]`;//将获取的本部审批人以字符串的形式存入变量
    this.materielChangeData.WFApproveUserJSON = JSON.stringify(this.approvalPerson);//把整个审批字符串存入提交操作的请求对象
  }
  //三个参数分别是“物料编号”，“所在行数”，“转出物料（参数为：1）或转入物料（参数为：2）”
  getMaterielInformation(MI?, I?, type?) {

    this.materielCodeFactory.MaterialERPCode = MI;
    this.materielCodeFactory.Factory = this.materielChangeData.Factory;

    if (!!MI && !!this.materielChangeData.Factory) {//如果传入的物料编号不为空和工厂不为空

      this.materielChangeService.getMaterielInformation(this.materielCodeFactory).then(data => {//调用接口
        if (data.success) {

          if (type === 1) {//如果为转出物料，则把值付给对应的变量
            this.detailExportList[I].ExportMaterial = data.data.zhDesc;
            this.clearExportSCCode(I);
          } else {
            this.detailImportList[I].ImportMaterial = data.data.zhDesc;
          }
          if (data.data.zhDesc == "") {
            this.windowSerive.alert({ message: "物料编号不存在", type: "fail" });
          }
          setTimeout(() => { this.getDetailExportTextareaHeight();});
        } else {

          if (type === 1) {
            this.windowSerive.alert({ message: data.message, type: "fail" }).subscribe(()=>{
              this.detailExportList[I].ExportMaterial = null;//如果没有查到物料名称，则将对应的转出物料名称置为空                              
              this.clearExportSCCode(I);
              console.log(this.detailExportList[I].ExportMaterial);
            });          
          } else {
            this.windowSerive.alert({ message: data.message, type: "fail" }).subscribe(()=>{
              this.detailImportList[I].ImportMaterial = null;//如果没有查到物料名称，则将对应的转入物料名称置为空              
            });
          }
        }
      });

      //if(type===2&&this.detailImportList[I].ImportMaterialNo!=""){
        this.setSaleCode(I);//获取销售合同号
      //}

    } else if (!MI && type == 1) {//如果传入的物料号为空，类型为1，则清除对应的转出物料名称
      this.detailExportList[I].ExportMaterial = "";
    } else if (!MI && type == 2) {//如果传入的物料号为空，类型为2，则清除对应的转入物料名称
      this.detailImportList[I].ImportMaterial = "";
    }
  }
  //导入附件成功的回调函数
  fileUploadSuccess(e) {
    if (e.success) {
      this.detailExportList = e.data.exports;
      this.detailImportList = e.data.imports;
      this.materielChangeData.DetailExport = this.detailExportList;
      this.materielChangeData.DetailImport = this.detailImportList;
      console.log(e.data);
      setTimeout(() => { this.getDetailExportTextareaHeight();});//根据字符串的长度，改变文本域的高度          
      this.loading=false;
    } else {
      this.windowSerive.alert({ message: e.message, type: "fail" });
    }
  }
  //物料变更模版下载
  downLoadFile() {
    window.open(dbomsPath + 'assets/downloadtpl/物料变更_导入明细表.xls');
  }
  //导出物料明细表
  getDetailed() {
    window.open(environment.server + "/materialchange/exportdeviate/" + this.materielChangeData.Id + "_d");
  }
  //根据工厂的前两位判断，显示对应的采购审批人，并格式化小些字母为大些字母
  getFinancePerson() {
    if (this.materielChangeData.Factory) {
      this.materielChangeData.Factory = this.materielChangeData.Factory.toLocaleUpperCase();//转换工厂字母为大写
      let mF = this.materielChangeData.Factory.substr(0, 2);
      switch (mF) {
        case "24":
          this.financialApproval = this.financialApprovalPerson.slice(0, 1);
          break;
        case "65":
          this.financialApproval = this.financialApprovalPerson.slice(1, 2);
          break;
        case "80":
          this.financialApproval = this.financialApprovalPerson.slice(1, 2);
          break;
        default:
          this.financialApproval = this.financialApprovalPerson.slice(2);
          break;
      }
    } else {
      this.financialApproval = this.financialApprovalPerson;
    }
  }
  //用来请求接口，保存页面数据
  saveData() {
    this.materielChangeService.saveData(this.materielChangeData).then(data => {
      if (data.success) {
        this.loading=false;
        this.windowSerive.alert({ message: "提交成功", type: "success" }).subscribe(() => {
          window.close();
        });
      } else {
        this.windowSerive.alert({ message: data.message, type: "fail" });
        return;
      }
    });
  }
  //清空物料明细列表
  clearMaterileList() {
    this.detailExportList = [new DetailExport()];
    this.detailImportList = [new DetailImport()];
  }
  //当从销售订单获取转出物料后，自动写入转出物料的销售合同号到转入物料的销售合同号，删除时清除转入物料的销售合同号
  setSaleCode(i) {
    //如果销售订单ID存在或者标记来源为“2”，表示是从销售订单提交的物料变更
    if (this.getSaleMaterielData.Data||this.materielChangeData.From=="2") {
      //触发事件所在行的转出物料编号或者转入物料编号不为空
      if (this.detailImportList[i].ImportMaterialNo != "") {
        this.detailImportList[i].ImportSC_Code = this.detailExportList[0].ExportSC_Code;//将转出物料的销售合同号写入转入物料的销售合同号
      } else {
        this.detailImportList[i].ImportSC_Code === "";
      }
    }
  }
  //判断如果是从销售订单传来的转出物料，那么用户输入的转出物料数量不能大于从销售订单穿过的可用数量
  saleCountIsValid(ec,i){
    //如果销售订单ID存在或者标记来源为“2”，表示是从销售订单提交的物料变更
    if (this.detailExportList[i].ExportCountSource) {
      //如果用户输入数量大于从销售订单的传过来的转出物料数量，给予报错提示
      if(ec>this.detailExportList[i].ExportCountSource){
        this.windowSerive.alert({message:`第 ${i+1} 行的转出物料数量不能大于 ${this.detailExportList[i].ExportCountSource} `,type:"fail"});
      }
      
    }
  }

  //判断转出数据列表和转入数据列表的长度，以增加对应的空数组，填补空缺列表
  pushList(){
    if(this.detailExportList.length>this.detailImportList.length){
      let i=this.detailExportList.length-this.detailImportList.length;
      for(let j=0;j<i;j++){
        this.detailImportList.push(new DetailImport());
      }
   }else if(this.detailExportList.length<this.detailImportList.length){
     let i=this.detailImportList.length-this.detailExportList.length;
     for(let j=0;j<i;j++){
       this.detailExportList.push(new DetailExport());
     }
   }
  }

  //当物料编号，库存地，批次改变时，清空销售合同号
  clearExportSCCode(i){
    this.detailExportList[i].ExportSC_Code=null;
  }

  //当上传文件成功时显示loading
  isLoading(e){
    if(e){
      this.loading=true;
    }
  }


}