import { Component, OnInit, ViewChild } from '@angular/core';
import { ScService, SCData, SCBaseData, SelectData, PlatForm, Buyer, HeadquarterList, BusinessUnitList,AccessList,Access,Seal,PersonInfo,contractAddTaskApp } from "../../service/sc-service";
import { ActivatedRoute, Router } from "@angular/router";
import { WindowService } from "app/core";
import { Person } from 'app/shared/services/index';
import { NgForm } from "@angular/forms";
import { Headers, RequestOptions } from "@angular/http";
import { DbWfviewComponent } from "../../../../shared/index";
import { EcContractCommonClass } from "../ectemplates/common/utilityclass/eccontractcommon";
declare var window: any;

@Component({
  selector: 'db-sc-view',
  templateUrl: './sc-view.component.html',
  styleUrls: ['./sc-view.component.scss']
})
export class ScViewComponent implements OnInit {

  constructor(
    private scService: ScService,
    private router: Router,
    private routerInfo: ActivatedRoute,
    private windowService: WindowService) { }

  @ViewChild('form') form: NgForm;
  @ViewChild('accessories') accessories;//上传附件组件ID注入
  ecContractCommonClass = new EcContractCommonClass();
  sc_Code;
  taskid;
  recordid;
  nodeid;
  adp;
  uploadChapterApiUrl;
  customerAuthInfo;//代理商认证信息
  customerFrozenInfo;//代理商冻结信息
  showModalContentType: string;
  isShowModal: boolean = false;
  isAllowRevoke: boolean = false;//是否允许撤回
  formData: SCData = new SCData();//表单数据
  selectData: SelectData = new SelectData();//下拉框数据
  sealInfo: Seal = new Seal();// 用印数据
  accessList: AccessList = new AccessList();//附件数据
  userInfo: PersonInfo = new PersonInfo();//人员信息
  accessorySealUrl: any = "";//模板PDF附件制作地址
  localUserInfo = JSON.parse(window.localStorage.getItem("UserInfo"));//本地localstorage 用户信息
  isSealRole:boolean = false;//是否印章岗
  isRiskRole:boolean = false;//是否风险岗
  approveUser: any;//审批人
  isRecoveryTxt:string = "";//合同是否回收
  accessListD:Array<any> = [];//双章扫描件
  isAnent: boolean = false;//是否可上传双章扫描件
  isShowRecovery: boolean = false;//是否显示 是否回收字段 可操作状态
  isSealView: boolean = false;//是否印章岗回收查看页面
  accessoryStatus: number = 0;//判断当前审批人，附件是否修改
  TaskOpinions: string = "";//印章反原岗审批意见
  isApping: boolean = true;//是否审批中 审批中 true 审批完成 false
  showRecoveryTxt: boolean = false;
  sealHasApp:boolean = false;//是否已有印章岗审批
  ngOnInit() {
    this.uploadChapterApiUrl = this.scService.uploadSCAccessories(19);
    this.getUrlParams();
    this.getSelectData();
  }

  //获取url参数
  getUrlParams() {
    this.sc_Code = this.routerInfo.snapshot.queryParams['SC_Code'];
    this.taskid = this.routerInfo.snapshot.queryParams['taskid'];
    this.recordid = this.routerInfo.snapshot.queryParams['recordid'];
    this.nodeid = this.routerInfo.snapshot.queryParams['nodeid'];
    this.adp = this.routerInfo.snapshot.queryParams['ADP'];
    this.getUrlParamsCallBack();
  }
  //获取url参数后业务处理
  getUrlParamsCallBack(){
    this.appParms.taskid = this.taskid;
    this.adpAppParms.taskid = this.taskid;
    this.initViewByUrlParms();
  }

  //获取下拉框数据
  getSelectData(sc_code = this.sc_Code) {
    let id = sc_code || this.recordid;
    if (id) {
      this.scService.getSelectData(id).subscribe(
        data => {
          if (data.Result) {
            this.selectData = JSON.parse(data.Data);
            this.getEcData(id);
          } else {
            this.windowService.alert({ message: data.Message, type: "fail" });
          }
        }
      );
    }else{
      this.windowService.alert({ message: "获取信息失败！", type: "fail" });
    }
  }

  //获取销售合同数据
  getEcData(sc_code) {
    if (sc_code) {
      let body = {
        sc_code: sc_code,
        itcode: this.localUserInfo["ITCode"]
      };
      this.scService.getEContractByScCode(body).subscribe(
        data => {
          if (data.Result) {
            //业务处理
            let tempData = JSON.parse(data.Data);
            this.formData = tempData;
            this.getEcDataCallBack(this.formData);
          } else {
            this.windowService.alert({ message: data.Message, type: "fail" });
          }
        }
      );
    } else {
      this.windowService.alert({ message: "sc_code为空，获取数据失败!", type: "fail" });
    }

  }
  //获取销售合同数据 回调
  getEcDataCallBack(data = this.formData) {
    this.getCustomerAuthAndFrozenInfo();
    this.getWfData();
    let baseData = data.SCBaseData;
    let itcode = !baseData.SalesITCode ? this.localUserInfo["ITCode"] : baseData.SalesITCode;
    let name = !baseData.SalesITCode ? this.localUserInfo["UserName"] : baseData.SalesName;
    //是否审批中
    if (baseData.SC_Status == "2") {
      this.isApping = false;
    }
    //是否可上传双章扫描件
    if (this.localUserInfo["ITCode"] == data.SCBaseData.AgentITcode) {
      this.isAnent = true;
    }
    //是否显示 是否回收 可操作状态
    if (this.formData.SCBaseData.IsRecovery != 0) {
      this.isShowRecovery = true;
    }
    //初始化基本信息
    // if (itcode) {
    //   this.getUserDeptmentByItcode(itcode);
    // }else{
    //   return;
    // }
    //附件信息
    if(data.AccessList){
      this.accessories.accessoriesChange(data.AccessList);
      this.accessListD = data.AccessList["AccessoryD"];
    }
    //用印信息
    if (baseData.SealInfoJson) {
      let sealData= JSON.parse(baseData.SealInfoJson);
      this.sealInfo = sealData;
    }
    //初始化选人组件
    this.userInfo["itcode"] = itcode;
    this.userInfo["name"] = name;
    // this.person.list.push(new Person(this.userInfo));
    //币种
    this.formData.SCBaseData.Currency = "0001";
    let current = this.getNameByIdForSelect(this.selectData.CurryList,"CurrencyID",this.formData.SCBaseData.Currency);
    if (current) {
      this.formData.SCBaseData.CurrencyName = current["CurrencyName"];
    }
    //系统账期
    let AccountPeriod = this.getNameByIdForSelect(this.selectData.AccountPeriodList,"AccountPeriodID",this.formData.SCBaseData.AccountPeriodType);
    if (AccountPeriod) {
      this.formData.SCBaseData.AccountPeriodName = AccountPeriod["AccountPeriodName"];
    }
    //项目类型
    let ProjectType = this.getNameByIdForSelect(this.selectData.ProjectTypeList,"ProjectTypeID",this.formData.SCBaseData.ProjectType);
    if (ProjectType) {
      this.formData.SCBaseData.ProjectTypeName = ProjectType["ProjectTypeName"];
    }
    //税率
    let TaxRate = this.getNameByIdForSelect(this.selectData.TaxRateList,"TaxRateID",this.formData.SCBaseData.TaxRateCode);
    if (TaxRate) {
      this.formData.SCBaseData.TaxRateName = TaxRate["TaxRateName"];
    }
    //付款方式
    let Payment = this.getNameByIdForSelect(this.selectData.PayMendList,"Paymentcode",this.formData.SCBaseData.PaymentMode);
    if (Payment) {
      this.formData.SCBaseData.PaymentName = Payment["PayMentName"];
    }
    //权限确认
    this.approveUser = JSON.parse(this.formData.SCBaseData.WFApproveUserJSON);
    this.roleValidation(this.localUserInfo["ITCode"]);
    this.accessories.isRiskRole = this.isRiskRole;
    //合同是否回收
    let IsRecovery = this.formData.SCBaseData.IsRecovery;
    if (IsRecovery == 0) {
      this.isRecoveryTxt = "是";
    } else if(IsRecovery == 1) {
      this.isRecoveryTxt = "否";
    } else if(IsRecovery == 2) {
      this.isRecoveryTxt = "PO";
    }

    //
    if (this.isView && this.isSeal && !this.isShowRecovery) {
      this.showRecoveryTxt = true;
    }else if (this.isView && !this.isSeal) {
      this.showRecoveryTxt = true;
    }
  }

  /** 废弃代码 暂时不删除 
  //获取人员组织信息
  getUserDeptmentByItcode(itcode){
    this.scService.getUserDeptmentByItcode(itcode).subscribe(
      data => {
        if(data.Result){
          let userDeptmentInfo = JSON.parse(data.Data);
          if (userDeptmentInfo["UserInfo"]) {
            this.getUserDeptmentByItcodeCallBack(userDeptmentInfo);
          }else{
            this.windowService.alert({ message: "获取人员组织信息失败！", type: "fail" });
          }
        }else{
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      }
    );
  }

  //获取人员组织信息后业务处理 回调
  getUserDeptmentByItcodeCallBack(userDeptmentInfo){
    let temp;
    if(userDeptmentInfo["UserInfo"].length > 0){
      temp = userDeptmentInfo["UserInfo"][0];
    }
    if(temp){
      this.formData.SCBaseData.Headquarter = temp.BBMC;
      this.formData.SCBaseData.BusinessUnit = temp.SYBMC;
      this.formData.SCBaseData.PlatformID = temp.FlatCode;
      this.formData.SCBaseData.Platform = temp.FlatName;
      this.formData.SCBaseData.ApplyTel = temp.UserTel;
    }
  }

  */

  //附件上传 回调事件
  scAccessory(e) {
    this.accessoryStatus = 1;
    this.accessList = e;
  }

  //跳转合同制作页面之前保存
  needSave(e?){
    this.scService.isToTpl = true;
    this.onSave({opType:"Reject"});// 调用保存  不验证
  }

  //用印组件 回调
  scSeals(e){
    // console.log(e);

  }

  //下拉框方法
  getNameByIdForSelect(data = [], arrt_id, arrt_id_value){
    let arrItem;
    if (data.length > 0) {
      data.map(function (item) {
        if (item[arrt_id] === arrt_id_value) {
          arrItem = item;
          return;
        }
      });
    }
    return arrItem;
  }

  //保存
  onSave(parms?:any){
    if (parms["opType"] != "Reject") {
      if (this.nodeid && this.nodeid == "7") {//风险岗审批时校验
        let temp = false;
        let indiaAccessList = this.formData.AccessList["AccessorySeal"];
        if (indiaAccessList && indiaAccessList.length >= 0) {
          this.formData.AccessList["AccessorySeal"].map(function (item) {
            if (item["AccessoryType"] == "16" && item["AccessoryURL"]) {
              temp = true;
            }
          });
        }
        if (!temp || (indiaAccessList && indiaAccessList.length == 0)) {
          this.scService.isAllowApp = false;
          this.windowService.alert({ message: "请完善合同第十三条款!", type: "fail" });
          return;
        }
      }
      if (this.isSeal && this.formData.SCBaseData.SealApprovalTime) {//印章岗（回收） 逻辑
        if (this.formData.SCBaseData.IsRecovery != "0" &&
          this.formData.SCBaseData.IsRecovery != "1" &&
          this.formData.SCBaseData.IsRecovery != "2") {
          this.scService.isAllowApp = false;
          this.windowService.alert({ message: "请选择合同回收状态!", type: "fail" });
          return;
        }
        if (this.formData.SCBaseData["IsRecovery"] == "0" && this.accessListD.length == 0) {
          this.scService.isAllowApp = false;
          this.windowService.alert({ message: "请上传双章扫描件!", type: "fail" });
          return;
        }
      }
      this.scService.isAllowApp = true;
    }
    if (parms && parms["BizConcernInfo"]) {
      this.formData.SCBaseData["BizConcernInfo"] = parms["BizConcernInfo"];
    }
    let body = {
        "SCBaseData": {
            "ItCode": this.localUserInfo["ITCode"],
            "SC_Code": this.formData.SCBaseData["SC_Code"],    //销售合同ID
            "AccountPeriodType": this.formData.SCBaseData["AccountPeriodType"],   //系统帐期类型
            "AccountPeriodValue": this.formData.SCBaseData["AccountPeriodValue"],  //系统帐期值 （手动输入的那个）
            "BizConcernInfo": this.formData.SCBaseData["BizConcernInfo"],   //商务关注信息
            "IsRecovery":this.formData.SCBaseData["IsRecovery"], //是否回收
            "RecoveryTime":this.formData.SCBaseData["RecoveryTime"], //回收时间
            "DeleteStatus": this.accessoryStatus,  //用于区别附件list为空时，是否执行删除当前登录人所有的附件）  注：DeleteStatus 为 0 时，不执行删除操作，DeleteStatus为 1   时  执行   删除操作。
            "UserName": this.localUserInfo["UserName"],
            "TaskOpinions": this.TaskOpinions//印章反原岗审批意见
        },
        "AccessList": {
            // "AccessoryD":this.formData.AccessList["AccessoryD"],
            "AccessoryD":this.accessListD,
            "AccessoryS":this.accessList["AccessoryS"]
        }
    };
    this.scService.updateSCApproval(body).subscribe(
      data => {
        if (data.Result) {
          if (parms["opType"] == "save") {//只有保存时提示保存成功，审批时不提示
            this.windowService.alert({ message: "保存成功", type: "success" });
          }
          if (parms["opType"] == "saveback") {
            window.close();
          }
          if(this.scService.isToTpl){
              this.scService.isToTpl = false;
              this.scService.returnUrl = window.location.href;
              let templateId = this.formData.SCBaseData.TemplateID;
              let sc_code = this.formData.SCBaseData.SC_Code;
              let queryParams = { queryParams: { SC_Code: sc_code, isRiskRole: this.isRiskRole } };
              let ecPageRouteUrl = this.ecContractCommonClass.returnECRouterUrlByTemplateID(templateId);
              this.router.navigate([ecPageRouteUrl], queryParams);
          }
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      }
    );
  }
  //撤销
  revoke(){
    let id = this.sc_Code || this.recordid;
    this.windowService.confirm({ message: "流程相关数据将删除!" }).subscribe({
        next: (v) => {
          if (v) {
            this.scService.contractRevoke(id).subscribe(
              data => {
                if (data.Result) {
                  this.windowService.alert({ message: "成功撤销!", type: "success" });
                  this.router.navigate(["/india/contract"], { queryParams: { SC_Code: id } });                  
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
  onBack(){
    // this.onSave({opType:'saveback'});
    window.close();
  }

  //上传双章扫描件回调
  onFileCallBack(e){
    this.accessoryStatus = 1;
    this.accessListD = e;
  }

  //显示
  showModal(type){
    this.isShowModal = true;
    this.showModalContentType = type;
  }
  //隐藏
  hideModal(type){
    this.isShowModal = false;
  }
  //代理商相关信息 认证及冻结信息
  getCustomerAuthAndFrozenInfo(){
    let erpCode = this.formData.SCBaseData.BuyerERPCode;
    let parms = {
      "CustomerName": this.formData.SCBaseData.BuyerName,
      "CustomerCode": erpCode
    }
    if (erpCode == "A" || !erpCode) {
      return;
    }
    this.scService.getCustomerAuth(parms).subscribe(data => {
      if (data.Result) {
        this.customerAuthInfo = JSON.parse(data.Data);

      }
    });
    this.scService.getCustomerFrozen(erpCode).subscribe(data => {
      if (data.Result) {
        this.customerFrozenInfo = JSON.parse(data.Data);
      }
    });
  }
  //权限确认
  roleValidation(itcode:string){
    let sealUerArr = [];
    let riskUerArr = [];
    let _that = this;
    this.approveUser.map(function (item) {
      if (item["NodeID"] == 14) {//印章岗审批人
        item["UserSettings"].forEach(element => {
          sealUerArr.push(element["ITCode"]);
        });
      } else if (item["NodeID"] == 7) {//风险岗审批人
        item["ApproverList"].forEach(element => {
          riskUerArr.push(element["ITCode"]);
        });
      }
    });
    sealUerArr.forEach((element:string) => {
      if (itcode.toUpperCase() == element.toUpperCase()) {
        _that.isSeal = true;
      }
    });
    riskUerArr.forEach((element:string) => {
      if (itcode.toUpperCase() == element.toUpperCase()) {
        // if (this.nodeid && this.nodeid == "7") {
        //   _that.isRiskRole = true;
        // }
        _that.isRiskRole = _that.isRisk = true;
      }
    });
  }

  //验证 账期 正整数
  validAccount(value){
    let valid = /^[1-9][0-9]{0,2}$/.test(value);
    if (value && !valid) {
      this.formData.SCBaseData.AccountPeriodValue = "";
      this.windowService.alert({ message: "输入非法", type: "fail" });
    }
  }

  clickIsRecovery(val) {
    if (!this.isSealView) {
      if (val == "1") {
        this.isView = true;
      } else {
        this.isView = false;
      }
    }
  }

  /** approve begin */
    @ViewChild('wfview') wfView: DbWfviewComponent;
    isView: boolean = true;//是否查看页面 查看页面(true) 审批页面(false)
    isADP: boolean = false;//是否加签审批
    isRisk: boolean = false;//是否风险岗
    isSeal: boolean = false;//是否印章岗
    wfData = {
        wfHistory: null,//审批历史记录
        wfProgress: null//流程全景图
    };
    viewInitParm = {//审批组件
      isRiskApp: false,
      isEdit: false
    }
    appParms = { taskid : "" };//审批组件 参数
    adpAppParms = {//加签审批组件
      apiUrl: contractAddTaskApp,
      taskid: ""
    }
    //获取审批历史、流程全景数据
    getWfData() {
      let sc_code = this.sc_Code || this.recordid;
      if (sc_code) {
        this.scService.getAppData(sc_code).subscribe(data => {
          if (data.Result) {
            this.wfData = JSON.parse(data.Data);
            if (this.wfData["wfHistory"] != null && this.wfData["wfHistory"].length > 0)
              this.wfData["wfHistory"].reverse();
            this.getWfDataCallBack(this.wfData["wfHistory"]);
            this.wfView.onInitData(this.wfData["wfProgress"]);
          }else {
            this.windowService.alert({ message: data.Message, type: "fail" });
          }
        });
      }
    }
    getWfDataCallBack(wfHistory){
      if (wfHistory && wfHistory.length>0) {
        let _that = this;
        wfHistory.map(function (item){
          if (item["nodename"].toString().indexOf("印章") != -1) {
            _that.sealHasApp = true;
          }
        });
      }
      this.resetApp();
    }

    //是否可以撤回流程
    resetApp() {
      let sc_status = this.formData.SCBaseData.SC_Status;
      let agentTemp = this.localUserInfo["ITCode"] == (this.formData.SCBaseData.ApplyITcode || this.formData.SCBaseData.AgentITcode);
      if (sc_status != "0" && agentTemp && !this.sealHasApp) {
        this.isAllowRevoke = true;
      }
    }
    //根据url参数初始化页面显示
    initViewByUrlParms(){
      if (this.sc_Code) {//查看页面
        this.isView = true;
        this.isSealView = true;
        return;
      } else {//审批页面
        this.isView = false;
        this.isSealView = false;
        if (this.adp) {//加签审批
          this.isADP = true;
          return;
        }
        if (this.nodeid == "7") {//风险岗审批页面
          this.isRisk = true;
          this.viewInitParm.isRiskApp = true;
          this.viewInitParm.isEdit = true;
          return;
        }
        if (this.nodeid == "14" || this.nodeid == "15") {//印章岗
          this.isSeal = true;
          this.viewInitParm.isRiskApp = false;
          this.viewInitParm.isEdit = true;
          return;
        }
      }

    }
    /** approve eng */

}
