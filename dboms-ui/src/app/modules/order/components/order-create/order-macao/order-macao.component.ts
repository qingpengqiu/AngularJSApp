import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NgForm, NgModel } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { WindowService } from 'app/core';

import { XcModalService, XcModalRef } from 'app/shared/index';
import { Person } from 'app/shared/services/index';
import { dbomsPath } from "environments/environment";

import { SelectAdvanceComponent } from './../selectAdvance/select-advance.component';
import { CashDetailComponent } from './../cashDetail/cash-detail.component';
import { SoldToInfoComponent } from './../soldToInfo/soldTo-info.component';
// import { AddTaxCodeComponent } from './addTaxCode/add-TaxCode.component';
import { PaymentListComponent } from './../paymentList/payment-list.component';
import { SelecteIndustryComponent } from './../selectIndustry/select-industry.component';
import { InterCustomerComponent } from './../interCustomer/inter-customer.component';

import {
  MaterialInfo, SaleOrderForm, ChannelType, CurrencyType, InvoiceType, OrderType, Platform, Rebatetype, LoadingInfo, UnadingInfo, TermInfo, AccoriesInfo,
  DeliveryType, DepProGroupInfo, DCIndustryInfo, IndustryInfo, DeliveryMaterialInfo,
  OrderCreateService
} from './../../../services/order-create.service';
import {
  OrderListService
} from './../../../services/order-list.service';

@Component({
  templateUrl: 'order-macao.component.html',
  styleUrls: ['./../order-create.component.scss']
})
export class OrderCreateMacaoComponent implements OnInit {
  public userInfo = JSON.parse(localStorage.getItem("UserInfo"));//销售人员信息
  public SC_Code;//合同单号
  public SO_Code;//销售单号
  // public Type;//订单类型
  public formData: SaleOrderForm = new SaleOrderForm();//表单数据
  public materialList: MaterialInfo[] = [];//物料信息列表
  public modalAdvance: XcModalRef;//预收款
  public modalInterme: XcModalRef;//查询居间服务方
  public modalCash: XcModalRef;//应还账款明细
  public modalSold: XcModalRef;//售达方
  // public modalTaxCode: XcModalRef;//维护税号
  public modalPayment: XcModalRef;//查询付款条件
  public modalIndustry: XcModalRef;//查询部门行业
  // public deliveryData = [];//送达方数据
  public loading: boolean = false;
  public approverList = [];//预审人员信息
  public unSelectApprover = [];//系统匹配审批人
  public filesList: AccoriesInfo[] = [];//附件列表
  public firstNodeName;//第一个审批人节点名称

  public ListChannel: ChannelType[] = [];//分销渠道
  public ListCurrency: CurrencyType[] = [];//币种
  public ListInvoice: InvoiceType[] = [];//发票类型
  public ListOrderType: OrderType[] = [];//订单类型
  public ListPlatform: Platform[] = [];//平台
  public ListRebate: Rebatetype[] = [];//返款
  public ListDepPro: DepProGroupInfo[] = [];//部门产品组
  public ListDeliveryType: DeliveryType[] = [];//发货方式
  public ListDCIndustry: DCIndustryInfo[] = [];//DC部门大类
  public ListIndustry: IndustryInfo[] = [];//部门行业
  public ListLoading: LoadingInfo[] = [];//装货点
  public ListUnading: UnadingInfo[] = [];//卸货点
  public ListTerm: TermInfo[] = [];//国际贸易条款

  public contractSubjectName;//合同主体
  public uploadFilesApi;//上传附件api
  public provinceCityInfo;//省市区信息
  public provinceList;//省
  public cityList;//市
  public countyList;//区县
  public province = "";//省
  public city = "";//市
  public county = "";//区县
  public projectIndustryName;//部门行业名称
  public invoiceCountAmount: number = 0;//支票总金额
  public rebateAmountVal;//返款信息

  public isACustomer: boolean = false;//是否为一次性用户
  public firstInit: boolean = true;//是否为初始化数据
  public modifyTaxNumber: boolean = false;//是否维护税号
  public paymentSearch: boolean = false;//是否显示付款条件查询
  public invoiceFirstTip: boolean = true;//是否是提一次提示支票验证
  public isSubmit: boolean = false;//是否提交
  public isOverAmount: boolean = false;//是否超额超期
  public firstSave: boolean = true;//是否为第一次保存，判断取消键是否为删除功能

  @ViewChildren(NgModel) inputList;//表单控件
  @ViewChildren('forminput') inputListDom;//表单控件DOM元素
  @ViewChild(NgForm) myApplyForm;//表单
  @ViewChildren("salePerson") salePerson;//销售人员
  @ViewChildren("agentPerson") agentPerson;//收款人员
  @ViewChildren("busPerson") busPerson;//事业部审批人员
  @ViewChildren('shipToParty') shipToDomList;//表单控件DOM元素
  @ViewChild('approver') approver;//审批信息
  @ViewChild('cheque') cheque;//支票信息
  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute,
    private xcModalService: XcModalService,
    private windowService: WindowService,
    private orderCreateService: OrderCreateService,
    private orderListService: OrderListService
  ) { }

  //获取url参数
  getUrlParams() {
    this.SC_Code = this.routerInfo.snapshot.queryParams['SC_Code'];
    this.SO_Code = this.routerInfo.snapshot.queryParams['SO_Code'];
  }

  //获取销售订单信息
  getOrderBaseData() {
    this.loading = true;
    if (this.SO_Code) {
      let params = {
        salesOrderID: this.SO_Code,
        Type: this.formData.Type
      };
      this.orderCreateService.getSOFullData(params).subscribe(
        data => {
          if (data.Result && data.Data) {
            let info = JSON.parse(data.Data);
            if (info.SalesOrderData.Status == 0 || info.SalesOrderData.Status == 3) {
              this.getFormDataCallBack(info);
            } else {
              this.windowService.alert({ message: "该订单已进入审批流程或已完成，无法编辑！", type: "success" });
              // window.close();
              setTimeout(() => {
                window.close();
              }, 1500);
            }
          } else {
            this.windowService.alert({ message: data.Message, type: "fail" });
          }
          this.loading = false;
        });
    } else {
      let params = {
        SC_Code: this.SC_Code,
        Type: this.formData.Type
      };
      this.orderCreateService.getCreateSalesOrder(params).subscribe(
        data => {
          if (data.Result && data.Data) {
            let info = JSON.parse(data.Data);
            if (info["SalesOrderData"]) {
              window.history.pushState({}, "", location.href + "&SO_Code=" + info["SalesOrderData"]["SalesOrderID"]);//新建页面，再次刷新。避免一直新加订单
            }
            this.getFormDataCallBack(info);
          } else {
            this.windowService.alert({ message: data.Message, type: "fail" });
          }
          this.loading = false;
        });
    }

  }

  //获取下拉列表基本信息
  getSelectedListData(info?) {
    let params = {
      OType: this.formData.Type,
      YWFWDM: info["SalesOrderData"]["YWFWDM"]
    };
    this.orderCreateService.getSOBaseData(params).subscribe(
      data => {
        if (data.Result) {
          let allList = JSON.parse(data.Data);
          this.ListChannel = allList["ListChannel"];//分销渠道
          this.ListCurrency = allList["ListCurrency"];//币种
          this.ListInvoice = allList["ListInvoice"];//发票类型
          this.ListOrderType = allList["ListOrderType"];//订单类型
          this.ListPlatform = allList["ListPlatform"];//平台
          this.ListRebate = allList["ListRebate"];//返款
          this.ListDepPro = allList["ListDepPro"];//部门产品组
          this.ListDCIndustry = allList["ListIndustry"];//DC部门大类
          this.ListIndustry = allList["ListProIndustry"];//部门行业
          this.ListDeliveryType = allList["ListCM"];//发货方式
          this.ListLoading = allList["ListLoading"];//装货点
          this.ListUnading = allList["ListUnading"];//卸货点
          this.ListTerm = allList["ListTerm"];//国际贸易条款
          //部门行业
          if (this.ListIndustry && this.ListIndustry.length > 0 && this.formData.SalesOrderData.ProjectIndustryID) {
            let ProjectIndustryID = this.formData.SalesOrderData.ProjectIndustryID;
            let selected = this.ListIndustry.filter(item => item.ProjectIndustryID == ProjectIndustryID);
            this.projectIndustryName = selected[0]["IndustryName"];
          }
          //物料信息传入返款
          this.rebateAmountFun();
          console.info(allList)
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      });
  }

  getProvinceCityData() {
    //获取省市区信息
    this.orderCreateService.getProvinceCityInfo().subscribe(
      data => {
        if (data && data.Data) {
          let info = JSON.parse(data.Data);
          this.provinceCityInfo = info;
          this.provinceList = info["province"];
          //省市区数据回显
          if (this.formData.SalesOrderData.InvoiceAreaID && info) {
            this.changeProvince();
          }
          //物料送达方地址编辑
          this.shipToDomList._results.forEach(function(item, index) {
            item.toProvinceCityInfo(info)
          })
        }
      }
    );
  }

  ngOnInit() {
    if (!this.userInfo) {
      this.windowService.confirm({ message: "当前登录信息失效，请重新登录!" }).subscribe({
        next: (v) => {
          if (v) {
            window.location.href = "/login";
          }
        }
      })
      return;
    };
    this.formData.Type = 1;//订单框架类型
    this.getUrlParams();//获取URL参数信息
    this.getOrderBaseData();//获取订单基础信息
    //查询预收款
    this.modalAdvance = this.xcModalService.createModal(SelectAdvanceComponent);
    this.modalAdvance.onHide().subscribe((data) => {
      // console.info(data);
    })

    //查询居间服务方
    this.modalInterme = this.xcModalService.createModal(InterCustomerComponent);
    this.modalInterme.onHide().subscribe((data) => {
      if (data) {
        this.formData.SalesOrderData.IntermediateCustomerName = data["NAME"];
        this.formData.SalesOrderData.IntermediateCustomerERPCode = data["KUNNR"];
      }
    })

    //查询应收款明细
    this.modalCash = this.xcModalService.createModal(CashDetailComponent);
    this.modalCash.onHide().subscribe((data) => {
      //   console.info(data);
    })

    //查询售达方列表
    this.modalSold = this.xcModalService.createModal(SoldToInfoComponent);
    this.modalSold.onHide().subscribe((data) => {
      if (data) {
        this.formData.SalesOrderData.CustomerERPCode = data["KUNNR"];
        this.formData.SalesOrderData.CustomerName = data["NAME"];
        this.formData.SalesOrderData.EndUserName = data["NAME"];
        if (data.KUNNR == "A" || data.KUNNR == "ALY") {
          this.formData.SalesOrderData.OrderTypeId = "0002";
          this.myApplyForm.controls["orderType"].disable({ onlySelf: false });
          this.isACustomer = true;
        } else {
          this.myApplyForm.controls["orderType"].enable({ onlySelf: false });
          this.isACustomer = false;
        }
        let params = {
          CustomerERPCode: data["KUNNR"]
        }
        //获取售达方应收账款
        this.orderCreateService.getCustomerUnClerData(params).subscribe(
          res => {
            if (res && res.Data) {
              let info = JSON.parse(res.Data);
              this.formData.SalesOrderData.Receivable = info["Receivable"].toFixed(2);
              this.formData.SalesOrderData.Overdue = info["Overdue"].toFixed(2);
              if (parseFloat(info["Overdue"]) > 0) {
                this.isOverAmount = true;
              } else {
                this.isOverAmount = false;
              }
            }
          }
        );
      }

    })

    //维护税号
    // this.modalTaxCode = this.xcModalService.createModal(AddTaxCodeComponent);
    // this.modalTaxCode.onHide().subscribe((data) => {
    //     if(data){
    //         this.formData.SalesOrderData.CustomerTaxNumber = data;
    //     }
    // })

    //查询付款条件
    this.modalPayment = this.xcModalService.createModal(PaymentListComponent);
    this.modalPayment.onHide().subscribe((data) => {
      if (data) {
        this.formData.SalesOrderData.PaymentTermsCode = data["PaymentCode"];
        this.formData.SalesOrderData.PaymentTerms = data["PaymentText"];
      }
    })
    //查询部门行业
    this.modalIndustry = this.xcModalService.createModal(SelecteIndustryComponent);
    this.modalIndustry.onHide().subscribe((data) => {
      if (data) {
        this.formData.SalesOrderData.ProjectIndustryID = data["ProjectIndustryID"];
        this.projectIndustryName = data["IndustryName"];
      }
    })

    this.uploadFilesApi = this.orderCreateService.uploadFilesApi();

  }

  //数据回调函数
  getFormDataCallBack(data) {
    //表单数据先填充，再获取基础数据
    this.getProvinceCityData();//获取省市区信息
    this.getSelectedListData(data);//获取下拉列表基础信息
    if (data["AccessoryList"]) {
      this.formData["AccessoryList"] = data["AccessoryList"];
      this.filesList = data["AccessoryList"];
    }
    if (data["ReceiptData"]) {
      this.formData["ReceiptData"] = data["ReceiptData"];
      this.cheque.initData(data["ReceiptData"]);
      this.chequeCallBack(data["ReceiptData"]);
    }
    this.formData["DeliveryData"] = data["DeliveryData"];

    if (data["UnSalesAmount"]) {
      this.formData.UnSalesAmount = data["UnSalesAmount"]
    };
    let user = this.userInfo;
    let saleOrderInfo = data["SalesOrderData"];
    // this.deliveryData = data["DeliveryData"];
    if (saleOrderInfo) {
      for (let key in saleOrderInfo) {
        if (saleOrderInfo[key] == null) {
          saleOrderInfo[key] = "";
        }
      }
      this.formData["SalesOrderData"] = saleOrderInfo;

      //销售人员
      let saleInfo = {
        userID: saleOrderInfo["SalesITCode"],
        userEN: (saleOrderInfo["SalesITCode"] || "").toLocaleLowerCase(),
        userCN: saleOrderInfo["SalesName"]
      };
      this.salePerson._results[0].Obj = saleInfo;
      //收款人员
      if (!saleOrderInfo["AgentITCode"]) {
        saleOrderInfo.AgentITCode = user["ITCode"];
        saleOrderInfo.AgentName = user["UserName"];
      };
      let agentPerson = {
        userID: saleOrderInfo["AgentITCode"],
        userEN: (saleOrderInfo["AgentITCode"]).toLocaleLowerCase(),
        userCN: saleOrderInfo["AgentName"]
      };
      this.agentPerson._results[0].list.push(agentPerson);
      //超期超额欠款
      if (parseFloat(saleOrderInfo.Overdue) > 0) {
        this.isOverAmount = true;
      }
      //判断是否为一次性用户
      if (saleOrderInfo.CustomerERPCode == "A" || saleOrderInfo.CustomerERPCode == "ALY") {
        this.formData.SalesOrderData.OrderTypeId = "0002";
        this.myApplyForm.controls["orderType"].disable({ onlySelf: false });
        this.isACustomer = true;
      } else {
        this.isACustomer = false;
      }
      //判断是否为特殊合同
      if (saleOrderInfo.ContractSubjectCode) {
        this.contractSubjectName = saleOrderInfo.ContractSubjectCode + "-" + saleOrderInfo.ContractSubject;
      } else {
        this.contractSubjectName = saleOrderInfo.ContractSubjectCode
      }
      //分销渠道。默认为11/分销
      if (!saleOrderInfo.ChannelOfDistributionID) {
        this.formData.SalesOrderData["ChannelOfDistributionID"] = "11";
      } else if (saleOrderInfo.CustomerERPCode.slice(0, 1) == "2") {
        this.formData.SalesOrderData["ChannelOfDistributionID"] = "15";
      }
      //是否显示付款条件查询
      if (!saleOrderInfo.PaymentTermsCode || saleOrderInfo.IsContractPayment === 0) {
        this.paymentSearch = true;
      }
      //是否有无返款
      if (!saleOrderInfo.RebatePercentageID) {
        this.formData.SalesOrderData.RebatePercentageID = "0001";
        this.shipToDomList._results.forEach(function(item, index) {
          item.toRebateAmount("0.00")
        })
        this.rebateAmountVal = "0.00";
      } else {
        this.rebateAmountFun();
      }
      //最终用户名称默认为客户名称
      if (!saleOrderInfo.EndUserName) {
        this.formData.SalesOrderData.EndUserName = saleOrderInfo.CustomerName
      }
      //商务审批平台
      if (!saleOrderInfo.BusiApprovePlatform) {
        this.formData.SalesOrderData.BusiApprovePlatform = "80";
      }
      //部门行业
      if (this.ListIndustry && this.ListIndustry.length > 0 && saleOrderInfo.ProjectIndustryID) {
        let ProjectIndustryID = this.formData.SalesOrderData.ProjectIndustryID;
        let selected = this.ListIndustry.filter(item => item.ProjectIndustryID == ProjectIndustryID);
        this.projectIndustryName = selected[0]["IndustryName"];
      }
      //是否选择发票
      if (!saleOrderInfo.IsMailingInvoice) {
        this.formData.SalesOrderData.IsMailingInvoice = "0";
      }
      //发票类型。默认为海外商业发票
      if (!saleOrderInfo.InvoiceTypeID) {
        this.formData.SalesOrderData.InvoiceTypeID = "0005";
      }
      if (!saleOrderInfo.TermsofShipment) {
        this.formData.SalesOrderData.TermsofShipment = "80";
      }


      // 审批人员
      if (saleOrderInfo["WFApproveUserJSON"]) {
        let busInfo = {};
        let approveUser = JSON.parse(saleOrderInfo["WFApproveUserJSON"]);
        let unSelectApprover = [];
        let firstNodeName = "";
        approveUser.forEach(function(item, index) {
          if (parseInt(item.NodeID) < 3) {
            let userSeting = [];
            firstNodeName = item.NodeName;
            if (item.UserSettings) {
              if (typeof item.UserSettings == "string") {
                userSeting = JSON.parse(item.UserSettings);
              } else {
                userSeting = item.UserSettings;
              }
              if (userSeting.length > 0) {
                busInfo = {
                  userID: item.ID,
                  userEN: (userSeting[0]["ITCode"] || "").toLocaleLowerCase(),
                  userCN: userSeting[0]["UserName"]
                }
              }
            }
          } else {
            let obj = {};
            let list = [];
            let approverList = JSON.parse(item.ApproverList);
            approverList.forEach(function(m, i) {
              let person = JSON.parse("{}");
              person = {
                id: "1",
                name: m["UserName"],
                itcode: (m["ITCode"] || "").toLocaleLowerCase()
              }
              list.push(new Person(person));
            })
            obj = {
              nodeName: item.NodeName,
              nodeID: item.NodeID,
              personList: list
            }
            unSelectApprover.push(obj)
          }
        })
        this.unSelectApprover = unSelectApprover;
        this.firstNodeName = firstNodeName;
        if (JSON.stringify(busInfo) != "{}") {
          this.busPerson._results[0].list.push(busInfo);
        }
      }
    }
    console.log(this.formData);
  }

  //查看合同
  contractView() {
    window.open(dbomsPath + "india/contractview?SC_Code=" + this.formData.SalesOrderData["SC_Code"] || this.SC_Code);
  }
  //选择省份
  changeProvince() {
    let provinceCode = this.formData.SalesOrderData.InvoiceAreaID;
    let cityInfo = this.provinceCityInfo["city"];
    if (this.firstInit && this.formData.SalesOrderData.InvoiceCity) {
      this.changeCity();
      this.firstInit = false;
    } else {
      //点击修改省市区
      this.formData.SalesOrderData.InvoiceCity = "";
      this.formData.SalesOrderData.InvoiceDistrict = "";
      this.cityList = [];
      this.countyList = [];
    }
    this.cityList = cityInfo.filter(item => item.CityCode.indexOf(provinceCode) == 0);
  }

  //选择城市
  changeCity() {
    let citycode = this.formData.SalesOrderData.InvoiceCity;
    let countyInfo = this.provinceCityInfo["district"];

    if (this.firstInit) {
      this.firstInit = false;
    } else {
      //点击修改清空后面数据
      this.formData.SalesOrderData.InvoiceDistrict = "";
      this.countyList = [];
    }
    this.countyList = countyInfo.filter(item => item.CityCode.indexOf(citycode) == 0);
  }

  //选择县区
  changeCounty() { }

  //查询预收款弹层
  selectAdvance() {
    let params = {
      SalesAmountTotal: this.formData.SalesOrderData.SalesAmountTotal,
      CustomerERPCode: this.formData.SalesOrderData.CustomerERPCode,
      CompanyCode: this.formData.SalesOrderData.ContractSubjectCode,
      SalesOrderID: this.formData.SalesOrderData.SalesOrderID
    }
    this.modalAdvance.show(params);
  }
  //返款信息修改
  rebateAmountFun() {
    let id = ""
    if (this.formData.SalesOrderData.RebatePercentageID) {
      id = this.formData.SalesOrderData.RebatePercentageID;
    } else {
      id = "0001";
    }
    let selected = this.ListRebate.filter(item => item.RebatePercentageID == id);
    this.shipToDomList._results.forEach(function(item, index) {
      item.toRebateAmount(selected[0]["RebatePercentageValue"])
    })
    if (selected && selected.length > 0) {
      this.rebateAmountVal = selected[0]["RebatePercentageValue"];
    }
    this.shipToCallBack();
  }
  //查询居间服务方
  searchInterCustomer() {
    this.modalInterme.show(this.formData.SalesOrderData.CustomerName);
  }
  //查询现金账单明细
  cashDetail() {
    this.modalCash.show(this.formData.SalesOrderData.CustomerERPCode);
  }
  //查询售达方信息
  saleToParty() {
    let params = {
      CustomerName: this.formData.SalesOrderData.CustomerName
    }
    this.modalSold.show(params);
  }
  //查询付款条件
  searchPayment() {
    this.modalPayment.show();
  }
  //查询部门行业
  selectedIndustry() {
    this.modalIndustry.show(this.ListIndustry);
  }
  //修改发票类型
  changeInvoiceType() { }
  //增加送达方及物料
  addShipTo() {
    // this.deliveryData.push(new DeliveryMaterialInfo());
    this.formData.DeliveryData.push(new DeliveryMaterialInfo());
    let firstDeliverinfo = this.formData.DeliveryData[0]["Deliverinfo"];
    this.formData.DeliveryData[this.formData.DeliveryData.length - 1]["Deliverinfo"] = {
      SDFID: "",
      SDFName: firstDeliverinfo["SDFName"],
      SDFAddress: firstDeliverinfo["SDFAddress"],
      SDFCode: "A",
      AreaID: "",
      SDFCity: "",
      SDFDistrict: "",
      IsDelegate: 0
    }
  }

  //送达方物料数据返回
  shipToCallBack(data?, i?) {
    if (data && data == "del") {
      this.formData.DeliveryData.splice(i, 1);
    } else if (data && typeof data == "object") {
      //物料转移
      let acceptMaterialList = this.formData.DeliveryData[data.shipToParty]["MaterialList"];
      if (acceptMaterialList.length > 0) {
        let IDList = [];
        let ID = data["info"]["ContractMaterialID"];
        acceptMaterialList.forEach(function(item, index) {
          IDList.push(item["ContractMaterialID"]);
        })
        if (IDList.indexOf(ID) != -1) {
          acceptMaterialList
          let index = IDList.indexOf(ID);
          acceptMaterialList[index]["Quantity"] = acceptMaterialList[index]["Quantity"] + data["info"]["Quantity"];
        } else {
          acceptMaterialList.push(data["info"]);
        }
      } else {
        acceptMaterialList.push(data["info"]);
      }
      this.formData.DeliveryData[data.shipToParty]["MaterialList"] = acceptMaterialList;
    }
    let amountTotal = 0;
    let rebateAmountTotal = 0;
    this.formData.DeliveryData.forEach(function(item, index) {
      if (item.MaterialList && item.MaterialList.length > 0) {
        item.MaterialList.forEach(function(m, i) {
          amountTotal += parseFloat(m.TotalPrice || 0);
          rebateAmountTotal += parseFloat(m.RebateAmount || 0);
        })
      }
    });
    this.formData.SalesOrderData.SalesAmountTotal = amountTotal;
    this.formData.SalesOrderData.RebateAmountTotal = rebateAmountTotal;
  }
  //
  icheckFun(e?) {
    // console.info(typeof this.formData.SalesOrderData.IsMailingInvoice)
  }
  //发票组件，数据回调函数
  chequeCallBack(e?) {
    if (e.length > 0) {
      this.formData.ReceiptData = e;
      let contAmount = 0;
      e.forEach(function(item, index) {
        contAmount += parseFloat(item.amount);
      })
      this.invoiceCountAmount = contAmount;
    } else {
      this.invoiceCountAmount = 0;
    }
  }
  //提交
  submit(e?) {
    this.isSubmit = true;
    if (this.myApplyForm.valid) {//表单验证通过
      //销售员验证
      if (this.formData.SalesOrderData["AgentITCode"] == "") {
        this.windowService.alert({ message: "请选择收款人!", type: "fail" });
        return;
      }
      if (this.formData.DeliveryData.length > 0) {
        let singleSDF = true;
        if (this.formData.DeliveryData.length != 1) {
          singleSDF = false;
        }
        let deliveryData = this.formData.DeliveryData;
        let windowService = this.windowService;
        let needReturn = false;
        deliveryData.forEach(function(item, index) {
          //送达方验证
          if (!item.Deliverinfo["SDFID"]) {
            if (singleSDF) {
              windowService.alert({ message: "送达方地址未编辑！", type: "fail" });
            } else {
              windowService.alert({ message: "第" + (index + 1) + "个送达方地址未编辑！", type: "fail" });
            }
            needReturn = true;
            return;
          }
          //物料验证
          if (item.MaterialList && item.MaterialList.length == 0) {
            if (singleSDF) {
              windowService.alert({ message: "送达方未选择物料！", type: "fail" });
            } else {
              windowService.alert({ message: "第" + (index + 1) + "个送达方未选择物料！", type: "fail" });
            }
            needReturn = true;
            return;
          }
          //物料工厂验证
          let otherFactory = "A" + item.MaterialList[0]["Factory"].slice(1);
          if (item.MaterialList) {
            item.MaterialList.forEach(function(m, i) {
              if (m.Quantity === 0) {
                windowService.alert({ message: "物料数量不可为零！", type: "fail" });
                needReturn = true;
                return;
              };
              if (item.MaterialList.length > 1 && (i + 1) < item.MaterialList.length && (m["Factory"] != item.MaterialList[i + 1]["Factory"] && otherFactory != item.MaterialList[i + 1]["Factory"])) {
                windowService.alert({ message: "多个物料应出自同一家工厂！", type: "fail" });
                needReturn = true;
                return;
              }
            })
            if (needReturn) {
              return;
            }
          }
          //多送达方之间工厂判断
          if (!singleSDF && (index + 1) < deliveryData.length && item.MaterialList && item.MaterialList.length > 0 && deliveryData[index + 1]["MaterialList"].length > 0) {
            if (item.MaterialList[0]["Factory"] != deliveryData[index + 1]["MaterialList"][0]["Factory"] && otherFactory != deliveryData[index + 1]["MaterialList"][0]["Factory"]) {
              windowService.alert({ message: "多送达方，物料应出自同一家工厂！", type: "fail" });
              needReturn = true;
              return;
            }
          }
        })
        if (needReturn) {
          return;
        };
        if (this.formData.SalesOrderData.DepartmentProductGroupID !== this.formData.DeliveryData[0].MaterialList[0]["Factory"].slice(2)) {
          windowService.alert({ message: "部门产品组与物料工厂不匹配,请修改相关数据！", type: "fail" });
          return;
        };
      }
      //销售单金额不可为零
      if (parseFloat(this.formData.SalesOrderData.SalesAmountTotal) === 0) {
        this.windowService.alert({ message: "销售订单金额不能为零！", type: "fail" });
        return;
      }
      //未开销售单金额
      if (this.formData.UnSalesAmount < this.formData.SalesOrderData.SalesAmountTotal) {
        this.windowService.alert({ message: "当前订单销售金额已经大于未开销售单金额！", type: "fail" });
        return;
      }
      //物料返款金额
      if (this.formData.SalesOrderData.RebatePercentageID === "0004") {
        if (parseFloat(this.formData.SalesOrderData.RebateAmountTotal) / (parseFloat(this.formData.SalesOrderData.SalesAmountTotal) + parseFloat(this.formData.SalesOrderData.RebateAmountTotal)) > 0.3) {
          this.windowService.alert({ message: "物料返款金额不得高于最大返款率30%，请重新填写!", type: "fail" });
          return;
        }
      }
      //是否必须关联支票
      if (this.invoiceFirstTip && (this.formData.SalesOrderData.PaymentMode == "002" || this.formData.SalesOrderData.PaymentMode == "003") && this.formData.ReceiptData.length == 0) {
        this.windowService.alert({ message: "您还没有关联支票信息，是否补充支票信息？", type: "fail" });
        this.invoiceFirstTip = false;
        return;
      }
      //支票使用金额大于销售金额
      if (this.invoiceCountAmount > parseFloat(this.formData.SalesOrderData.SalesAmountTotal)) {
        this.windowService.alert({ message: "当前支票使用总金额大于订单销售金额！", type: "fail" });
        return;
      }
      //审批人
      if (this.formData.SalesOrderData["WFApproveUserJSON"]) {
        let approverList = JSON.parse(this.formData.SalesOrderData["WFApproveUserJSON"]);
        let userSeting = [];
        if (typeof approverList[0].UserSettings == "string") {
          userSeting = JSON.parse(approverList[0].UserSettings);
        } else {
          userSeting = approverList[0].UserSettings;
        }
        if (userSeting.length == 0) {
          this.windowService.alert({ message: "请选择审批人", type: "fail" });
          return;
        }
        let isOverAmount = this.isOverAmount;
        approverList.forEach(function(item, index) {
          if (item.NodeID == '3') {
            if (isOverAmount) {
              item["IsOpened"] = 1;
            } else {
              item["IsOpened"] = 0;
            }
          }
        })
        this.formData.SalesOrderData["WFApproveUserJSON"] = JSON.stringify(approverList)
      } else {
        this.windowService.alert({ message: "请选择审批人", type: "fail" });
        return;
      }
      //非一次性售达方，增值专用发票
      // if(this.formData.SalesOrderData.InvoiceTypeID == "0002"){
      //
      // }
      this.loading = true;
      //首先验证物料金额
      this.checkMaterialAmount();
    } else {//表单验证未通过
      let flag = false;
      for (let i = 0; i < this.inputList.length && !flag; i++) {//遍历表单控件
        if (this.inputList._results[i].invalid) {//验证未通过
          let ele = this.inputListDom._results[i];//存储该表单控件元素
          if (ele && ele.nativeElement) {
            ele.nativeElement.focus();//使该表单控件获取焦点
          }
          flag = true;
        }
      }
    }
  }
  /*
  *维护税号
  */
  modifyCustomerTaxCode() {
    //非一次性用户无税号，普通发票0002，进行维护
    if (!this.isACustomer && this.formData.SalesOrderData.InvoiceTypeID == "0002" && this.modifyTaxNumber) {
      let params = {
        CustomerERPCode: this.formData.SalesOrderData.CustomerERPCode,
        CompanyCode: this.formData.SalesOrderData.ContractSubjectCode,
        SalesOrderID: this.formData.SalesOrderData.SalesOrderID,
        ChannelOfDistrubution: this.formData.SalesOrderData.ChannelOfDistributionID,
        DepartmentProductGroup: this.formData.SalesOrderData.DepartmentProductGroupID,
        InvoiceTypeId: this.formData.SalesOrderData.InvoiceTypeID,
        TaxNumber: this.formData.SalesOrderData.CustomerTaxNumber
      }
      //写入税号
      this.windowService.alert({ message: "维护税号需要时间，请稍候！", type: "fail" });
      this.orderCreateService.modifyCustomerTaxCode(params).subscribe(
        data => {
          this.windowService.close();
          if (data.Result) {
            let info = JSON.parse(data.Data);
            //提交
            this.submitApi();
          } else {
            this.windowService.alert({ message: data.Message, type: "fail" });
            this.loading = false;
          }
        }
      );
    } else {
      this.submitApi();
    }
  }
  /*
  *验证物料金额
  */
  checkMaterialAmount() {
    let params = {
      SalesAmountTotal: this.formData.SalesOrderData.SalesAmountTotal,
      DeliveryData: this.formData.DeliveryData
    }
    this.orderCreateService.checkMaterialAmount(params).subscribe(
      data => {
        this.windowService.close();
        if (data.Result) {
          let info = JSON.parse(data.Data);
          //false物料金额不合规定
          if (info === false) {
            this.loading = false;
            this.windowService.confirm({ message: data.Message }).subscribe({
              next: (v) => {
                if (v) {
                  this.loading = true;
                  //判断是否维护税号或者提交
                  this.modifyCustomerTaxCode();
                }
              }
            });
          } else {
            this.modifyCustomerTaxCode();
          }
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
          this.loading = false;
        }
      }
    );
  }
  //提交接口
  submitApi() {
    this.orderCreateService.submitSaleOrder(this.formData).subscribe(
      data => {
        if (data.Result) {
          this.windowService.alert({ message: "提交成功", type: "success" });
          window.close();
          setTimeout(() => {
            window.close();
          }, 1000);
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
          if (data.Message == "请到支付信息中维护售达方税号") {
            this.modifyTaxNumber = true;
            this.inputListDom._results[12].nativeElement.focus();
          }
        }
        this.loading = false;
      }
    );
  }
  //暂存
  save() {
    //未开销售单金额
    if (this.formData.UnSalesAmount < this.formData.SalesOrderData.SalesAmountTotal) {
      this.windowService.alert({ message: "该订单金额大于未开销售单金额！", type: "fail" });
      return;
    }
    //支票使用金额大于销售金额
    if (this.invoiceCountAmount > parseFloat(this.formData.SalesOrderData.SalesAmountTotal)) {
      this.windowService.alert({ message: "当前支票使用总金额大于订单销售金额！", type: "fail" });
      return;
    }
    //送达方地址验证
    if (this.formData.DeliveryData.length > 0) {
      let singleSDF = true;
      if (this.formData.DeliveryData.length != 1) {
        singleSDF = false;
      }
      let deliveryData = this.formData.DeliveryData;
      let windowService = this.windowService;
      let needReturn = false;
      deliveryData.forEach(function(item, index) {
        //送达方验证
        if (!item.Deliverinfo["SDFID"]) {
          if (singleSDF) {
            windowService.alert({ message: "送达方地址未编辑！", type: "fail" });
          } else {
            windowService.alert({ message: "第" + (index + 1) + "个送达方地址未编辑！", type: "fail" });
          }
          needReturn = true;
          return;
        }
      })
      if (needReturn) {
        return;
      }
    }
    this.orderCreateService.saveSaleOrderData(this.formData).subscribe(
      data => {
        if (data.Result) {
          this.firstSave = false;
          this.windowService.alert({ message: "保存成功", type: "success" });
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      }
    );
  }
  //取消
  cancel() {
    //新建的订单，不保存订单直接删除
    if (!this.SO_Code && this.firstSave) {
      this.windowService.confirm({ message: "确认取消新建订单?" }).subscribe({
        next: (v) => {
          if (v) {
            let params = {
              SalesOrderID: this.formData.SalesOrderData.SalesOrderID,
              Type: this.formData.Type
            }
            this.orderListService.deleteOrder(params).subscribe(data => {
              if (data.Result) {
                this.windowService.alert({ message: '成功取消订单', type: "fail" });
                setTimeout(() => {
                  window.close();
                }, 1000);
              } else {
                this.windowService.alert({ message: data.Message, type: "fail" });
              }
            })
          }
        }
      });
    } else {
      window.close();
    }
  }
  //上传附件回调函数
  onFileCallBack(files?) {
    this.formData.AccessoryList = files;
  }
  //预审信息
  getChange(info?) {
    let approveUserList = JSON.parse(this.formData.SalesOrderData["WFApproveUserJSON"]);
    let itcode = "";
    let name = "";
    let id = "";
    if (info.length > 0) {
      id = info[0]["userID"];
      itcode = info[0]["userEN"];
      name = info[0]["userCN"];
    }
    approveUserList.forEach(function(item, index) {
      if (parseInt(item.NodeID) == 2) {
        let userSeting = [];
        if (typeof approveUserList[index]["UserSettings"] == "string") {
          userSeting = JSON.parse(approveUserList[index]["UserSettings"]);
        } else {
          userSeting = approveUserList[index]["UserSettings"];
        }
        userSeting[0] = {
          UserID: id,
          ITCode: itcode,
          UserName: name
        };
        item["UserSettings"] = userSeting;
        if (id != "") {
          item["IsOpened"] = 1;
        } else {
          item["IsOpened"] = 0;
        }
      }
    });
    this.formData.SalesOrderData["WFApproveUserJSON"] = JSON.stringify(approveUserList);
  }
  //销售人员选择修改
  changePerson(info?) {
    if (info.length > 0) {
      this.formData.SalesOrderData["AgentITCode"] = info[0]["userEN"];
      this.formData.SalesOrderData["AgentName"] = info[0]["userCN"];
    } else {
      this.formData.SalesOrderData["AgentITCode"] = "";
      this.formData.SalesOrderData["AgentName"] = "";
    }
  }
}
