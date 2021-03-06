import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { WindowService } from 'app/core';
import { Pager, XcModalService, XcModalRef, DbWfviewComponent } from 'app/shared/index';
import { OrderViewService, OrderViewForm, contractAppUrl, contractSignUrl, contractTransferUrl, contractAddTaskUrl, downloadIp } from './../../services/order-view.service';
import {
  MaterialInfo, SaleOrderForm, ChannelType, CurrencyType, InvoiceType, OrderType, Platform, Rebatetype, LoadingInfo, UnadingInfo,
  DeliveryType, DepProGroupInfo, DCIndustryInfo, IndustryInfo, DeliveryMaterialInfo, TermInfo,
  OrderCreateService
} from './../../services/order-create.service';
import { CashDetailComponent } from './../order-create/cashDetail/cash-detail.component';
import { dbomsPath } from "environments/environment";

@Component({
  templateUrl: 'order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit {
  public Otype: string = '';//订单类型
  public typeParam: number;//订单类型标准为0，澳门为1，其他合同为2
  public ContractSubject: string = '';//合同主体
  public isSpecial: boolean = false;//合同主体为00M5和00M6,特殊合同
  public loading: boolean = false;//写入erp的loding
  public sc_Code: string = '';
  public so_Code: string = '';
  public taskid: string = '';
  public recordid: string = '';
  public nodeid: string = '';
  public adp: string = '';
  public localUserInfo = JSON.parse(window.localStorage.getItem("UserInfo"));//本地localstorage 用户信息
  public orderViewForm: OrderViewForm = new OrderViewForm();//合同的数据
  public modalCash: XcModalRef;//应还账款明细
  public isAllowRevoke: boolean = false;//是否允许撤回
  public riskHasApp: boolean = false;//是否已有风险岗审批
  public aprOpenList: any = {//页面每部分打开关闭数组
    baseMes: false,
    payMes: false,
    busMes: false,
    otherMes: false,
    careMessage: false,
    contractMes: {},
    salMes: false,
    relatMes: false,
    markMes: false,
    addrssMes: false,
    fileMes: false,
    approvMes: false,
  };

  public isACustomer: boolean = false;//是否为一次性用户
  public ListChannel: ChannelType[] = [];//分销渠道
  public ListCurrency: CurrencyType[] = [];//币种
  public ListInvoice: InvoiceType[] = [];//发票类型
  public ListOrderType: OrderType[] = [];//订单类型
  public ListPlatform: Platform[] = [];//平台
  public ListRebate: Rebatetype[] = [];//返款
  public ListDepPro: DepProGroupInfo[] = [];//部门产品组
  public deliveryTypeList: DeliveryType[] = [];//发货方式
  public ListDCIndustry: DCIndustryInfo[] = [];//DC部门大类
  public ListIndustry: IndustryInfo[] = [];//部门行业
  public ListLoading: LoadingInfo[] = [];//装货点
  public ListUnading: UnadingInfo[] = [];//卸货点
  public ListTerm: TermInfo[] = [];//国际贸易条款

  public provinceCityInfo: any = {};//省市区信息

  @ViewChildren('sale') saleDom;//表单控件DOM元素
  @ViewChildren('agent') agentDom;//表单控件DOM元素

  /**
  *获取流程数据信息（流程审批历史，流程审批全景）
  */
  @ViewChild('wfview') wfView: DbWfviewComponent;//展示流程图
  isView: boolean = true;//是否查看页面 查看页面(true) 审批页面(false)
  isADP: boolean = false;//是否加签审批
  isRisk: boolean = false;//是否风险岗
  isSale: boolean = false;//是否銷售崗
  isCanErp: boolean = false;//是否可以点击erp
  isCanApprol: boolean = true;//是否可以点击审批
  isMesCtr: boolean = false;//是否信控岗
  wfData = {
    wfHistory: null,//审批历史记录
    wfProgress: null//流程全景图
  };
  public hasSaved = false;//审批按钮是否可用
  appParms = {//审批组件
    "apiUrl_AR": contractAppUrl,//同意、驳回审批接口地址
    "apiUrl_Sign": contractAddTaskUrl,//加签审批接口地址
    "apiUrl_Transfer": contractTransferUrl,//转办审批接口地址
    "taskid": "",
    "nodeid": ""
  }


  adpAppParms = {//加签审批组件
    apiUrl: contractSignUrl,//地址
    taskid: ""
  }

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute,
    private windowService: WindowService,
    private xcModalService: XcModalService,
    private orderCreateService: OrderCreateService,
    private orderViewService: OrderViewService
  ) { }
  ngOnInit() {
    if (!this.localUserInfo) {
      this.windowService.confirm({ message: "当前登录信息失效，请重新登录!" }).subscribe({
        next: (v) => {
          if (v) {
            window.location.href = "/login";
          }
        }
      })
      return;
    }
    //在初始化的时候 创建模型；；；查询应收款明细
    this.modalCash = this.xcModalService.createModal(CashDetailComponent);
    //模型关闭的时候 如果有改动，请求刷新
    this.modalCash.onHide().subscribe((data) => {
    })

    this.getUrlParams();
    this.getData();
    this.getAddress();
  }
  //获取数据
  getData() {
    let params = {
      salesOrderID: this.so_Code || this.recordid,
      Type: this.typeParam
    };
    this.orderCreateService.getSOFullData(params).subscribe(data => {
      if (data.Result) {
        if (data.Data) {
          let dataForm = JSON.parse(data.Data);
          this.orderViewForm = JSON.parse(data.Data);
          console.log(this.orderViewForm)
          this.sc_Code = dataForm.SalesOrderData.SC_Code;
          let ACustomerNub = dataForm.SalesOrderData.CustomerERPCode;
          let ERPOrderCode = dataForm.SalesOrderData.ERPOrderCode;
          //物料可能多个，初始化物料关闭按钮格式
          this.orderViewForm.DeliveryData.forEach((item, i) => {
            this.aprOpenList.contractMes[i] = false;
          })
          if (this.typeParam == 1) {
            if (this.nodeid == "5") {//销售岗才判断erp
              if (ERPOrderCode == '') {
                this.isCanErp = true;
                this.isCanApprol = false;

              } else {
                this.isCanErp = false;
                this.isCanApprol = true;
              }
            }
          } else if (this.typeParam == 0 || this.typeParam == 2) {
            if (this.nodeid == "9") {//销售岗才判断erp
              if (ERPOrderCode == '') {
                this.isCanErp = true;
                this.isCanApprol = false;

              } else {
                this.isCanErp = false;
                this.isCanApprol = true;
              }
            }
          }

          //判断是否为一次性用户
          if (ACustomerNub == "A" || ACustomerNub == "ALY") {
            this.isACustomer = true;
          } else {
            this.isACustomer = false;
          }
          //判断是否为特殊合同
          if (dataForm.SalesOrderData.ContractSubjectCode == "00M5" || dataForm.SalesOrderData.ContractSubjectCode == "00M6") {
            this.isSpecial = true;
          } else if (dataForm.SalesOrderData.ContractSubjectCode) {
            this.ContractSubject = dataForm.SalesOrderData.ContractSubjectCode + "-" + dataForm.SalesOrderData.ContractSubject;
          } else {
            this.ContractSubject = dataForm.SalesOrderData.ContractSubjectCode;
          }
          //是否为特折单
          if (this.isSpecial && !dataForm.SalesOrderData.IsSuperDiscount) {
            this.orderViewForm.SalesOrderData.IsSuperDiscount = "0";
          }

          let contractInfo = this.orderViewForm.SalesOrderData;
          if (contractInfo) {
            //销售员人员
            let saleInfo = {
              userID: contractInfo["SalesITCode"],
              userEN: contractInfo["SalesITCode"].toLocaleLowerCase(),
              userCN: contractInfo["SalesName"]
            };
            this.saleDom._results[0].Obj = saleInfo;
            //收款人
            let agentPerson = {
              userID: contractInfo["AgentITCode"],
              userEN: contractInfo["AgentITCode"].toLocaleLowerCase(),
              userCN: contractInfo["AgentName"]
            };
            this.agentDom._results[0].Obj = agentPerson;

          }

          this.getWfData();
          this.getSelectedListData();
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      } else {
        this.windowService.alert({ message: data.Message, type: "fail" });
      }
    })

  }
  //获取下拉列表基本信息
  getSelectedListData() {
    let params = {
      OType: this.typeParam,
      YWFWDM: this.orderViewForm.SalesOrderData.YWFWDM
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
          this.deliveryTypeList = allList["ListCM"];//发货方式
          this.ListLoading = allList["ListLoading"];//装货点
          this.ListUnading = allList["ListUnading"];//卸货点
          this.ListTerm = allList["ListTerm"];//国际贸易条款
          //部门行业
          // if(this.ListIndustry && this.ListIndustry.length > 0 && this.formData.SalesOrderData.ProjectIndustryID){
          //     let ProjectIndustryID = this.formData.SalesOrderData.ProjectIndustryID;
          //     let selected = this.ListIndustry.filter(item => item.ProjectIndustryID == ProjectIndustryID);
          //     this.ProjectIndustryName = selected[0]["IndustryName"];
          // }

        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      });
  }
  //获取地址信息
  getAddress() {
    this.orderCreateService.getProvinceCityInfo().subscribe(
      data => {
        if (data && data.Data) {
          let info = JSON.parse(data.Data);
          this.provinceCityInfo = info;
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      }
    );
  }
  //查看合同
  SeeOrderInfo() {
    window.open(dbomsPath + 'india/contractview?SC_Code=' + this.sc_Code);
  }
  //查看明细
  seeDtailLis() {
    this.modalCash.show(this.orderViewForm.SalesOrderData.CustomerERPCode);
  }
  //折叠
  foldMess(foldName, i?) {
    if (foldName != 'contractMes') {//非物料
      this.aprOpenList[foldName] = !this.aprOpenList[foldName];
    } else {//物料关闭
      this.aprOpenList[foldName][i] = !this.aprOpenList[foldName][i];
    }

  }
  //下载
  download(downUrl) {
    window.location.href = downloadIp + downUrl;
  }
  //获取url参数
  getUrlParams() {
    this.so_Code = this.routerInfo.snapshot.queryParams['SO_Code'];
    this.taskid = this.routerInfo.snapshot.queryParams['taskid'];
    this.recordid = this.routerInfo.snapshot.queryParams['recordid'];
    this.nodeid = this.routerInfo.snapshot.queryParams['nodeid'];
    this.adp = this.routerInfo.snapshot.queryParams['ADP'];
    this.Otype = this.routerInfo.snapshot.queryParams['type'];
    this.getUrlParamsCallBack();
  }
  //获取url参数后业务处理
  getUrlParamsCallBack() {
    this.appParms.taskid = this.taskid;
    this.appParms.nodeid = this.nodeid;
    this.adpAppParms.taskid = this.taskid;
    console.log(this.appParms)
    console.log(this.adpAppParms)
    this.initViewByUrlParms();
  }
  //根据url参数初始化页面显示
  initViewByUrlParms() {
    if (this.so_Code) {//查看页面
      if (this.Otype == 'normal') {
        this.typeParam = 0;
      } else if (this.Otype == 'macao') {
        this.typeParam = 1;
      } else if (this.Otype == 'others') {
        this.typeParam = 2;
      }
      this.isView = true;
      return;
    } else {//审批页面
      this.isView = false;
      if (this.Otype == 'normal' || this.Otype == 'others') {
        if (this.Otype == 'normal') {
          this.typeParam = 0;
        } else {
          this.typeParam = 2;
        }
        if (this.nodeid == "7") {//风险岗审批页面
          this.isRisk = true;
          return;
        }
        if (this.nodeid == "9") {//销售商务岗审批页面
          this.isSale = true;
          return;
        }
        if (this.nodeid == "1") {//信控岗
          this.isMesCtr = true;
          return;
        }
      } else if (this.Otype == 'macao') {
        this.typeParam = 1;
        if (this.nodeid == "3") {//信控岗
          this.isMesCtr = true;
          return;
        }
        if (this.nodeid == "5") {//销售商务岗审批页面
          this.isSale = true;
          return;
        }
      }
      if (this.adp) {//加签审批
        this.isADP = true;
        return;
      }
    }

  }
  //获取审批历史、流程全景数据
  getWfData() {
    let so_code = this.so_Code || this.recordid;
    if (so_code) {
      this.orderViewService.contractRevoke(so_code).subscribe(data => {
        if (data.Result) {
          this.wfData = JSON.parse(data.Data);
          if (this.wfData["wfHistory"] != null && this.wfData["wfHistory"].length > 0)
            this.wfData["wfHistory"].reverse();
          this.getWfDataCallBack(this.wfData["wfProgress"]);
          this.getWfHistoryCallBack(this.wfData["wfHistory"]);
          this.wfView.onInitData(this.wfData["wfProgress"]);
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      });
    }
  }
  getWfDataCallBack(wfProgress) {
    if (this.typeParam == 0 || this.typeParam == 2) {//标准订单风险岗审批之后不能撤回
      let _that = this;
      wfProgress.map(function(item, index) {
        if (item["NodeID"] == '7') {
          if (item["IsAlready"] == true) {
            _that.riskHasApp = true;
          }

        }
      });
    } else if (this.typeParam == 1) {//澳门订单写入erp之后不能撤回
      if (this.orderViewForm.SalesOrderData.ERPOrderCode != '') {
        let _that = this;
        _that.riskHasApp = true;
      }
    }
    //判断是不是本人才允许撤回
    let agentTemp = this.localUserInfo["ITCode"] == (this.orderViewForm.SalesOrderData.EditITCode || this.orderViewForm.SalesOrderData.CreaterITCode);
    if (agentTemp && !this.riskHasApp) {
      this.isAllowRevoke = true;
    }
  }
  //针对历记录的驳回不让写入erp
  getWfHistoryCallBack(wfHistory) {
    let _that = this;
    if (wfHistory.length === 0) {
      return;
    }
    let length = wfHistory.length - 1;
    if (this.typeParam == 0 || this.typeParam == 2) {
      if (wfHistory[length].nodename.indexOf('销售商务') != -1) {
        if (wfHistory[length].approveresult == '驳回') {
          _that.isCanErp = false;
          _that.isCanApprol = true;
        }
      }
    } else if (this.typeParam == 1) {
      if (wfHistory[length].nodename.indexOf('写入ERP') != -1) {
        if (wfHistory[length].approveresult == '驳回') {
          _that.isCanErp = false;
          _that.isCanApprol = true;
        }
      }
    }

  }
  //撤销
  revoke() {
    this.windowService.confirm({ message: "流程相关数据将删除!" }).subscribe({
      next: (v) => {
        if (v) {
          this.orderViewService.getAppData(this.so_Code).subscribe(
            data => {
              if (data.Result) {
                this.windowService.alert({ message: "成功撤销!", type: "success" });
                setTimeout(() => {
                  this.windowService.close();
                  window.close();
                }, 1500);
              } else {
                this.windowService.alert({ message: data.Message, type: "fail" });
              }
            }
          );
        }
      }
    });
  }
  //返回
  onBack() {
    window.close();
  }
  //写入erp
  wrERP() {
    let so_code = this.so_Code || this.recordid;
    this.orderViewService.isAutoDelivery(so_code).subscribe(data => {
      data.Result = true;
      if (data.Result) {
        let param = {
          "SalesOrderID": so_code,
          // "busiApproveITCode":this.localUserInfo["ITCode"],
          "isAutoDelivery": "",
          "Type": this.typeParam
        }
        this.windowService.confirm({ message: `该订单可自动交货，是否自动交货？` }).subscribe(v => {
          if (v) {
            param.isAutoDelivery = 'true';
            this.wrERPAuto(param);
          } else {
            param.isAutoDelivery = 'false';
            this.wrERPAuto(param);
          }
        })
      } else {
        this.windowService.alert({ message: data.Message, type: "fail" });
      }
    })

  }
  //调用erp接口
  wrERPAuto(param) {
    this.loading = true;
    this.orderViewService.wrERPAuto(param).subscribe(data => {
      if (data.Result) {
        this.windowService.alert({ message: data.Message, type: "success" });
        this.isCanErp = false;
        this.isCanApprol = true;
      } else {
        this.windowService.alert({ message: data.Message, type: "fail" });
        this.isCanErp = true;
        this.isCanApprol = false;
      }
      this.loading = false;
    })
  }

  onApprovalSave(event) {
    this.hasSaved = true;
  }
  //审批的callback（这里是针对关闭取消后状态更改）
  approveCallBack() {
    if (this.typeParam == 0 || this.typeParam == 2) {
      if (this.nodeid == "9") {
        this.isCanErp = false;
        this.isCanApprol = true;
      }
    } else if (this.typeParam == 1) {
      if (this.nodeid == "5") {
        this.isCanErp = false;
        this.isCanApprol = true;
      }
    }

  }

}
