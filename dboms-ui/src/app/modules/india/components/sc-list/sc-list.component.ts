import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ScService,ApplySearch,ApproveSearch } from "../../service/sc-service";
import { Pager } from 'app/shared/index';
import { newApply, indiaType } from "../../animate/sc-list.animate";
import { URLSearchParams } from "@angular/http";
import { Router } from "@angular/router";
import { WindowService } from "app/core";
import { EcContractCommonClass } from "../ectemplates/common/utilityclass/eccontractcommon";
import { PageRefresh } from "../../service/pagerefresh.service";
declare var $: any;
declare var window: any;

@Component({
  selector: 'db-sc-list',
  templateUrl: './sc-list.component.html',
  styleUrls: ['./sc-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [ newApply,indiaType ]
})
export class ScListComponent implements OnInit {

  constructor(
    private scService:ScService, 
    private router: Router,
    private pageRef: PageRefresh,
    private windowService: WindowService) { }
  
  ecContractCommonClass = new EcContractCommonClass();
  //缺省时模板中绑定使用
  currentDataTypeName:string = "审批中";
  // apply/我的申请 approval/我的审批
  currentMenuType:string = "apply";
  // 我的申请 approval/审批中 completed/已完成 all/全部 draft/草稿
  // 我的审批 waitapproval/待我审批 examinedapproved/我已审批 allapproval/全部
  currentDataState:string = "approval";
  //当前列表数据
  currentTableData: any = [];
  //我的申请 数据查询参数
  query: ApplySearch = new ApplySearch();
  //我的审批 数据查询参数
  approveQuery: ApproveSearch = new ApproveSearch();
  userInfo = JSON.parse(window.localStorage.getItem('UserInfo'));
  //待我审批任务数量
  myApproverTotal: any = 0;
  //是否首次加载
  isInitLoad: boolean = true;
  //分页
  pagerData = new Pager();
  //缺省标识
  default: boolean = false;
  //是否显示高级搜索
  searchState: boolean = false;
  //表格 列呈现描述
  table_col_isView = {
    currentNode: true,
    currentUser: true,
    SubmitTime: true,
    operation: true,
    SalesName: true,
    ApplyName: true
  }
  departmentAndBusinessList = [];//事业部 本部
  companyData = [];//我方主体
  DepartmentList = [];//本部
  BusinessList = [];//事业部
  PlatformList = [];//平台
  bizScopeCode = "GQ01";
  noticeIsOpre: boolean = true;//采购通知是可点击
  ngOnInit() {
    if (this.userInfo) {
      this.query.CreateITcode = this.approveQuery.CreateITcode = this.userInfo.ITCode;
      if(this.userInfo.YWFWDM){
        this.bizScopeCode = this.userInfo.YWFWDM;
      }else{
        this.bizScopeCode = "GQ01";
      }
    } else {
      // 未登录 跳转到登录页面
      this.router.navigate(['/login']);
    }
    this.initBaseData();
    this.initTableView(this.currentMenuType, this.currentDataState);
    this.onReset();
    this.initMyApproverTotal();
    
    this.pageRef.onFousRefresh(() => {
      this.onReset();
    });
  }

  //申请、审批Tab切换
  tabMenu(menuType){
    let _flag = false;
    this.searchState = false;
    if(menuType === "approval"){
      this.currentDataState = "waitapproval";
    }else{
      this.currentDataState = "approval";
    }
    this.stateChange(this.currentDataState);
    _flag = menuType !== this.currentMenuType;
    this.currentMenuType = menuType;
    if (_flag) {
      this.onReset();
    }    
    this.initTableView(this.currentMenuType, this.currentDataState);
  }
  //审批中、已完成、全部、草稿Tab切换
  tabData(dataState){
    this.stateChange(dataState);
    if (dataState !== this.currentDataState) {
      this.onReset();
    }
    this.currentDataState = dataState;
    this.initTableView(this.currentMenuType, this.currentDataState);
  }

  //初始化下拉框数据
  initBaseData(){
    this.scService.getCompanyData(this.bizScopeCode).subscribe(
      data => {
        if(data.Result){
          this.companyData = JSON.parse(data.Data).CompanyList;
        }else{
          this.windowService.alert({ message: "获取我方主体信息失败", type: "fail" });
        }
      }
    );
    this.scService.getAppSelectData().subscribe(
      data => {
        if(data.Result){
          let resuleData = JSON.parse(data.Data);
          this.departmentAndBusinessList = resuleData["DepartmentList"];
          let tempdata = this.analysisDepartmentList(this.departmentAndBusinessList);
          this.DepartmentList = tempdata["DepartmentList"];
          this.BusinessList = tempdata["BusinessList"];
          this.PlatformList = resuleData.PlatformList;
        }else{
          this.windowService.alert({ message: "获取下拉框数据失败", type: "fail" });
        }
      }
    );
  }

  analysisDepartmentList(DepartmentList:any = []){
    let data = {
      DepartmentList: [],
      BusinessList: [],
    };
    DepartmentList.map(function (item) {
      let bbmcObj = {BBMC:""};
      let sybmcObj = {SYBMC:""};
      bbmcObj.BBMC = item["BBMC"];
      data.DepartmentList.push(bbmcObj);
      for (var i in item["SYBMC"]) {
        sybmcObj.SYBMC = item["SYBMC"][i];
        data.BusinessList.push(sybmcObj);
      }
    });
    return data;
  }

  onDepartmentChange(value){
    if (value) {
      let _that = this;
      this.departmentAndBusinessList.map(function (item) {
        if (item["BBMC"] == value) {
          _that.approveQuery["BusinessUnit"] = "";
          _that.BusinessList.length = 0;
          let sybmcObj = { SYBMC: "" };
          let obj = item["SYBMC"];
          for (let i in obj) {
            sybmcObj.SYBMC = obj[i];
            _that.BusinessList.push(sybmcObj);
          }
        }
      });      
    }
  }

  //查询我的申请数据
  getListData(params, event?){
    if(!!event){
      this.query.pagesize = event.pageSize;
      this.query.currentpage = event.pageNo;
      this.approveQuery.pagesize = event.pageSize;
      this.approveQuery.currentpage = event.pageNo;
    }
    if (this.currentMenuType == "apply") {
      let observable = this.scService.getMyApplyData(params);
      if (observable) {
        this.getData_Callback(observable);
      }
    } else {
      let observable = this.scService.getMyApprovData(params);
      if (observable) {
        this.getData_Callback(observable);
      }
    }
  }
  //业务处理
  getData_Callback(observable) {
    observable.subscribe(
      data => {
        if (data.Result) {
          if (data.Data) {
            let resData = JSON.parse(data.Data);
            let total:number;
            let totalPages:number;
            if (this.currentMenuType == "apply" && resData.ContractList) {
              this.currentTableData = resData.ContractList;
              total = Number(resData.totalnum);
              totalPages = Math.ceil(resData.totalnum / resData.pagecount);
              this.initPager(this.pagerData, total, totalPages);
              this.default = false;
            } else if (this.currentMenuType == "approval" && resData.TaskList) {
              this.currentTableData = resData.TaskList;
              total = Number(resData.allcount);
              totalPages = Math.ceil(resData.allcount / resData.pagesize);
              this.initPager(this.pagerData, total, totalPages);
              this.default = false;
              if (this.approveQuery.QueryType == "ToDo") {
                this.initMyApproverTotal();
              }
            } else {
              this.default = true;
            }
          }
        } else {
          this.default = true;
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      });
  }
  //初始化分页器
  initPager(pager = this.pagerData, total, totalPages){
    let customSetting =  JSON.parse(window.localStorage.getItem('iq_custom_setting'));
    let pageSize = 10;
    if (customSetting) {
      pageSize = customSetting["pageSize"] || 10;
    }
    pager.set({
      pageSize: pageSize, //默认10条
      total: total,
      totalPages: totalPages
    });
  }

  stateChange(type){
    this.pagerData.pageNo = 1;
    this.query.currentpage = 1;
    this.query.pagesize = 10;
    this.approveQuery.currentpage = 1;
    this.approveQuery.pagesize = 10;
    switch (type) {
      case "approval":
        this.query.ContractState = "1";
        this.currentDataTypeName = "审批中";
        break;
      case "completed":
        this.query.ContractState = "2";
        this.currentDataTypeName = "已完成";
        break;
      case "all":
        this.query.ContractState = "-1";
        this.currentDataTypeName = "全部";
        break;
      case "draft":
        this.query.ContractState = "0";
        this.currentDataTypeName = "草稿";
        break;
      case "waitapproval":
        this.approveQuery.QueryType="ToDo";
        this.currentDataTypeName = "待我审批";
        break;
      case "examinedapproved":
        this.approveQuery.QueryType="Done";
        this.currentDataTypeName = "我已审批";
        break;
      case "allapproval":
        this.approveQuery.QueryType="All";
        this.currentDataTypeName = "全部";
        break;
      default:
        break;
    }
  }

  //列表排序
  sortCurrentTableData(){
    this.currentTableData.reverse();
  }

  toggleSearchState(){
    this.searchState ? this.searchState = false : this.searchState = true;
  }

  //初始化列表显示
  initTableView(menuType,dataState){
    if (menuType == "apply") {//我的申请
      switch (dataState) {
        case "approval":
        case "all":
          this.table_col_isView = {
            currentNode: false,
            currentUser: false,
            SubmitTime: false,
            operation: true,
            SalesName: true,
            ApplyName: true
          }
          break;
        case "completed":
          this.table_col_isView = {
            currentNode: true,
            currentUser: true,
            SubmitTime: false,
            operation: true,
            SalesName: true,
            ApplyName: true
          }
          break;
        case "draft":
          this.table_col_isView = {
            currentNode: true,
            currentUser: true,
            SubmitTime: false,
            operation: false,
            SalesName: true,
            ApplyName: true
          }
          break;
        default:
          break;
      }
    } else {//我的审批
      switch (dataState) {
        case "examinedapproved":
        case "allapproval":
          this.table_col_isView = {
            currentNode: true,
            currentUser: true,
            SubmitTime: true,
            operation: true,
            SalesName: false,
            ApplyName: true
          }
          break;
        case "waitapproval":
          this.table_col_isView = {
            currentNode: true,
            currentUser: true,
            SubmitTime: true,
            operation: true,
            SalesName: false,
            ApplyName: true
          }
          break;
        default:
          break;
      }
    }
  }

  getDate(date,flag){
    let dataObj = new Date(date);
    let year = dataObj.getFullYear();
    let month = (dataObj.getMonth()+1).toString();
    let day = dataObj.getDate().toString();
    if (month.length == 1) {
      month = "0" + month
    }
    if (Number(day) < 10) {
      day = "0" + day;
    }
    let temp = year + "-" + month + "-" + day;
    if (flag == "start") {
      this.query.SealApprovalTimeStart = temp;
    }else if(flag == "end"){
      this.query.SealApprovalTimeEnd = temp;
    }
  }

  onSearch(){
    this.getListData(this.currentMenuType == "apply"? this.query : this.approveQuery);
  }
  onReset() {
    let customSetting =  JSON.parse(window.localStorage.getItem('iq_custom_setting'));
    let pageSize = 10;
    if (customSetting) {
      pageSize = customSetting["pageSize"] || 10;
    }
    if (this.currentMenuType == "apply") {
      let state = this.query.ContractState;
      let itCode =  this.userInfo.ITCode;
      this.query = new ApplySearch();
      this.query.ContractState = state;
      this.query.CreateITcode = itCode;
      this.query.pagesize = pageSize;
    } else {
      let QueryType = this.approveQuery.QueryType;
      let itCode =  this.userInfo.ITCode
      this.approveQuery = new ApproveSearch();
      this.approveQuery.QueryType = QueryType;
      this.approveQuery.CreateITcode = itCode;
      this.approveQuery.pagesize = pageSize;
    }
    $(".iradio_square-blue").removeClass('checked');
    this.getListData(this.currentMenuType == "apply" ? this.query : this.approveQuery);
  }

  initMyApproverTotal() {
    let customSetting = JSON.parse(window.localStorage.getItem('iq_custom_setting'));
    let pageSize = 10;
    if (customSetting) {
      pageSize = customSetting["pageSize"] || 10;
    }
    let itCode = this.userInfo.ITCode
    this.approveQuery = new ApproveSearch();
    // this.approveQuery.QueryType = "ToDo";
    this.approveQuery.CreateITcode = itCode;
    this.approveQuery.pagesize = pageSize;
    this.scService.getMyApprovData(this.approveQuery).subscribe(data => {
      if (data.Result) {
        let resData = JSON.parse(data.Data);
        $("#myApproverTotal").html(resData.allcount);
      }
    });
  }

  onDelete(item) {
    let sc_code = item["SC_Code"];
    if (sc_code) {
      let scType = item["SCType"];
      this.windowService.confirm({ message: "确定删除？" }).subscribe({
        next: (v) => {
          if (v) {
            let temp = (data) => {
              if (data.Result) {
                this.windowService.alert({ message: "删除成功", type: "success" });
                this.onReset();
              } else {
                this.windowService.alert({ message: data.Message, type: "fail" });
              }
            }
            if (scType == "1") {
              this.scService.deleteSContract(sc_code).subscribe(temp);
            }else if(scType == "0"){
              this.scService.deleteEContract(sc_code).subscribe(temp);
            }
            
          }
        }
      });
    }
  }

  //点击表格行 跳转页面
  onClickTr(item){
    let serverUrl:string = "http://" + window.location.host + "/dboms";
    let targetUrl:string = "/india/tplmake";
    switch (this.currentDataState) {
      case "approval":
      case "completed":
      case "waitapproval":
      case "allapproval":
        let approveUrl = item["ApprovalTaskUrl"];
        targetUrl = "/india/contractview";
        if (approveUrl) {//审批
          window.open(approveUrl);
        } else {//查看
          let id = item["SC_Code"];
          window.open(serverUrl + targetUrl + "?SC_Code=" + id);
        }
        break;
      case "draft":
      case "all":
      case "examinedapproved":
        let scType = item.SCType;
        let SC_Status = item.SC_Status;
        //scType 0:电子合同阶段 1:销售合同阶段
        if (scType == "0") {
          targetUrl = this.ecContractCommonClass.returnECRouterUrlByTemplateID(item["TemplateID"]);
        }else{
          if (SC_Status == "0" || SC_Status == "3") {
            targetUrl = "/india/contract";
          }else{
            targetUrl = "/india/contractview";
          }
        }
        let id = item["SC_Code"];
        window.open(serverUrl + targetUrl + "?SC_Code=" + id);
        break;
      default:
        break;
    }
  }
  

  //采购通知
  notice(item){
    let id = item["SC_Code"];
    let PurchaseNotified = item['PurchaseNotified'];
    if(id && PurchaseNotified == 0){
      this.scService.UpdatePurchaseNotified(id).subscribe(data => {
        if (data.Result) {
          this.noticeIsOpre = false;
          item['PurchaseNotified'] = 1;
          this.windowService.alert({ message: "通知成功！", type: "success" });
        }else{
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      });
    }
  }
  
  showIndiaList(){
    $(".newIndia").css("display","block");
  }
  hideIndiaList(){
    $(".newIndia").css("display","none");
  }
}
