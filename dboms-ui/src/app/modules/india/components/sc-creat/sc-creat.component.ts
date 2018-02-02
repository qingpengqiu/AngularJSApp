import { Component, OnInit, ViewChild } from '@angular/core';
import { ScService, SCData, SCBaseData, SelectData, PlatForm, Buyer, HeadquarterList, BusinessUnitList,AccessList,Access,Seal,PersonInfo } from "../../service/sc-service";
import { ActivatedRoute, Router } from "@angular/router";
import { WindowService } from "app/core";
import { Person } from 'app/shared/services/index';
import { NgForm } from "@angular/forms";
import { EcContractCommonClass } from "../ectemplates/common/utilityclass/eccontractcommon";
import { PageRefresh } from "../../service/pagerefresh.service";
declare var window: any;

@Component({
  selector: 'db-sc-creat',
  templateUrl: './sc-creat.component.html',
  styleUrls: ['./sc-creat.component.scss']
})
export class ScCreatComponent implements OnInit {

  constructor(
    private scService: ScService,
    private pageRef: PageRefresh,
    private router: Router,
    private routerInfo: ActivatedRoute,
    private windowService: WindowService) { }
  
  ecContractCommonClass = new EcContractCommonClass();
  sc_Code;
  formData: SCData = new SCData();//表单数据
  wfHistory: Array<any> = [];//审批历史
  selectData: SelectData = new SelectData();//下拉框数据
  sealInfo: Seal = new Seal();// 用印数据
  accessList: AccessList = new AccessList();//附件数据
  userInfo: PersonInfo = new PersonInfo();//人员信息
  isSubmit:boolean = true;
  isTemplate: boolean = true;//是否模板数据来源
  isRiskRole:boolean = false;//是否风险岗
  localUserInfo = JSON.parse(window.localStorage.getItem("UserInfo"));//本地localstorage 用户信息
  ApproverInfo;//审核数据
  //审批人员
  public approveUsers = [];

  @ViewChild('form') form: NgForm;
  @ViewChild('person') person;//基本信息选人组件ID注入
  @ViewChild('accessories') accessories;//上传附件组件ID注入
  @ViewChild('seals') seals;//用印组件ID注入
  @ViewChild('approvers') approvers;//审批组件ID注入
  ngOnInit() {
    this.getUrlParams();
    this.getSelectData();
  }

  //获取url参数
  getUrlParams() {
    this.sc_Code = this.routerInfo.snapshot.queryParams['SC_Code'] || this.routerInfo.snapshot.queryParams['sc_code'];
  }

  //获取下拉框数据
  getSelectData(sc_code = this.sc_Code) {
    if (sc_code) {
      this.scService.getSelectData(sc_code).subscribe(
        data => {
          if (data.Result) {
            this.selectData = JSON.parse(data.Data);
            this.getEcData(this.sc_Code);
          } else {
            this.windowService.alert({ message: data.Message, type: "fail" });
          }
        }
      );
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
            if(tempData.SCBaseData["SC_Status"] == 0 || tempData.SCBaseData["SC_Status"] == 3){
              this.formData = tempData;
              this.getEcDataCallBack(this.formData);
            }else{
                this.windowService.alert({ message: "该合同已进入审批流程", type: "fail" });
                this.router.navigate(["/india/sclist"]);
            }
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
    let baseData = data.SCBaseData;
    let itcode = !baseData.SalesITCode ? this.localUserInfo["ITCode"] : baseData.SalesITCode;
    let name = !baseData.SalesITCode ? this.localUserInfo["UserName"] : baseData.SalesName;
    //流程历史
    if (baseData.SC_Code && baseData.SC_Status == "3") {
      this.getWfData(baseData.SC_Code);
    }
    //初始化选人组件
    this.userInfo["itcode"] = itcode.toLocaleLowerCase();
    this.userInfo["name"] = name;
    this.userInfo["userID"] = this.userInfo["itcode"];
    this.person.list.push(new Person(this.userInfo));
    //初始化基本信息
    if (itcode) {
      if (!this.formData.SCBaseData.ApplyTel) {
        this.scService.getUserPhone().subscribe(data => {
          if (data.Result) {
            this.formData.SCBaseData.ApplyTel = data.Data;
          }
        });
      }
      this.getUserDeptmentByItcode(itcode);
    }else{
      return;
    }
    //是否含外购
    if (!this.formData.SCBaseData.Outsourcing) {
      this.formData.SCBaseData.Outsourcing = "0";
    }
    //代理商
    if (this.formData.SCBaseData.BuyerERPCode) {
      let code = this.formData.SCBaseData.BuyerERPCode;
      let name = code + "-"+ this.formData.SCBaseData.BuyerName;
      this.selectData.Buyer = [new Buyer(code, name)];
    }
    //币种业务处理
    if (!this.formData.SCBaseData.Currency) {
      this.formData.SCBaseData.Currency = "0001";
    }
    //数据来源 设置表单项是否可编辑
    if (baseData.ContractSource && baseData.ContractSource =="模板") {
      //代理商
      if (this.formData.SCBaseData.BuyerERPCode) {
        this.form.controls["Buyer"].disable({onlySelf:false});
      }
      //平台
      this.form.controls["Platform"].disable({onlySelf:false});
      //项目类型
      this.form.controls["ProjectType"].disable({onlySelf:false});
      //付款方式
      if (this.formData.SCBaseData.PaymentMode) {
        this.form.controls["PaymentMode"].disable({onlySelf:false});
      }else{
        this.formData.SCBaseData.PaymentMode = "";
      }
    }else{
      this.isTemplate = false;
    }
    //附件信息
    if(data.AccessList){
      this.accessories.accessoriesChange(data.AccessList);
    }
    //用印信息
    if (baseData.SealInfoJson) {
      let sealData= JSON.parse(baseData.SealInfoJson);
      this.sealInfo = sealData;
      this.approvers.sealChange(sealData["SealData"]);//初始化时传入审核组件，用印管理数据
    }
    //业务范围代码
    if (!this.formData.SCBaseData.YWFWDM) {
      this.formData.SCBaseData.YWFWDM = this.localUserInfo["YWFWDM"];
    }
    //审核信息
    if (baseData.WFApproveUserJSON&&baseData.WFApproveUserJSON!=null) {
      let approversData= JSON.parse(baseData.WFApproveUserJSON);
      this.approveUsers = approversData;
      this.approvers.approversChange(approversData);
    }else{
        let approversData= this.selectData["WFApproveUserJSON"];
        this.approvers.approversChange(approversData);
    }
    //申请人信息
    baseData.ApplyITcode = this.localUserInfo["ITCode"];
    baseData.ApplyName = this.localUserInfo["UserName"];
  }

  //根据销售员itcode获取所有本部事业部及平台，电话
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
      let oldPlatformID = this.formData.SCBaseData.PlatformID;
      this.formData.SCBaseData.Headquarter = temp.BBMC;
      this.formData.SCBaseData.BusinessUnit = temp.SYBMC;
      this.formData.SCBaseData.PlatformID = temp.FlatCode;
      this.formData.SCBaseData.Platform = temp.FlatName;
      // this.formData.SCBaseData.ApplyTel = temp.UserTel;
      this.selectData.PlatForm= [new PlatForm(temp.FlatCode, temp.FlatName)];
      this.selectData.HeadquarterList= [new HeadquarterList(temp.BBMC, temp.BBMC)];
      this.selectData.BusinessUnitList= [new BusinessUnitList(temp.SYBMC, temp.SYBMC)];
      //本部
      if (this.isTemplate && this.formData.SCBaseData.Headquarter) {
        this.form.controls["Headquarter"].disable({onlySelf:false});
      }
      //事业部
      if (this.isTemplate && this.formData.SCBaseData.BusinessUnit) {
        this.form.controls["BusinessUnit"].disable({onlySelf:false});
      }
      // 判断平台 当前选择人平台 != 已选人平台 清空用印信息(调用用印组件清空用印信息事件) 否则 return
      if (this.formData.SCBaseData.PlatformID != oldPlatformID) {
        this.sealInfo = new Seal();
        this.formData.SCBaseData.SealInfoJson = JSON.stringify(this.sealInfo);
      }else{
        return;
      }
    }
  }

  //选人组件change事件
  changePerson(userInfo) {
    let oldItcode = this.formData.SCBaseData.SalesITCode.toString().toUpperCase();
    let itcode = userInfo[0]["itcode"].toString().toUpperCase();
    let name = userInfo[0]["name"];
    if (itcode != oldItcode) {
      this.formData.SCBaseData.SalesITCode = itcode;
      this.formData.SCBaseData.SalesName = name;
      this.formData.SCBaseData.ApplyITcode = itcode;
      this.formData.SCBaseData.ApplyName = name;
      //如果当前选择人 != 已选人 重置基本信息 否则 return
      this.getUserDeptmentByItcode(itcode);
    } else {
      return;
    }
  }

  //提交流程
  onSubmit(form: any){
    if(form.valid){//验证通过
      if(!this.formData.SCBaseData.AccountPeriodValue){
          this.windowService.alert({ message: "请填写账期信息", type: "warn" });
          return ;
      }
      //检测用印信息
      if(this.sealInfo.SealData.length==0){
          this.windowService.alert({ message: "印章至少应选择一个", type: "warn" });
          return ;
      }
      let reg = /^\+?[1-9][0-9]*$/;
      if(!reg.test(this.sealInfo.PrintCount)){
          this.windowService.alert({ message: "请填写正确的用印份数", type: "warn" });
          return ;
      }
      if(this.isSubmit){
        this.formData.SCBaseData.SealInfoJson = JSON.stringify(this.sealInfo);
        let body = this.formData;
        this.scService.submitContractData(body).subscribe(
          data => {
            if (data.Result) {
              this.pageRef.setPageNeedRef();//设置列表页面刷新
              this.windowService.alert({ message: "提交成功", type: "success" });
              this.router.navigate(["/india/sclist"]);
            } else {
              this.windowService.alert({ message: data.Message, type: "fail" });
            }
          }
        );
      }
    }else{
      this.windowService.alert({ message: "请将合同主信息填写完整", type: "warn" });
    }


  }
  //暂存
  onSave(type){
    this.formData.SCBaseData.SealInfoJson = JSON.stringify(this.sealInfo);
    let body = this.formData;
    this.scService.saveContractData(body).subscribe(
      data => {
        if (data.Result) {
          if (type == "save") {
            this.pageRef.setPageNeedRef();//设置列表页面刷新
            this.windowService.confirm({ message: "保存成功,是否返回列表?" }).subscribe({
              next: (v) => {
                if (v) {
                  this.router.navigate(['/india']);
                }
              }
            });
          }
          if(this.scService.isToTpl){
              this.scService.isToTpl = false;
              this.scService.returnUrl = window.location.href;
              let templateId = body.SCBaseData.TemplateID;
              let sc_code = body.SCBaseData.SC_Code;
              let queryParams = { queryParams: { SC_Code: this.sc_Code, isRiskRole: this.isRiskRole } };
              let ecPageRouteUrl = this.ecContractCommonClass.returnECRouterUrlByTemplateID(templateId);
              this.router.navigate([ecPageRouteUrl], queryParams);
          }
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      }
    );
  }
  //上一步
  onPrev(){
    let sc_code = this.formData.SCBaseData.SC_Code;
    let templateId = this.formData.SCBaseData.TemplateID;
    if (sc_code) {
      this.windowService.confirm({ message: "页面数据将删除" }).subscribe({
        next: (v) => {
          if (v) {
            this.scService.deleteStepUp(sc_code).subscribe(
              data => {
                if (data.Result) {
                  let queryParams = { queryParams: {SC_Code: sc_code} };
                  let ecPageRouteUrl = this.ecContractCommonClass.returnECRouterUrlByTemplateID(templateId);
                  this.router.navigate([ecPageRouteUrl], queryParams);
                } else {
                  this.windowService.alert({ message: data.Message, type: "fail" });
                }
              }
            );
          }
        }
      });
    }else{
      this.windowService.alert({ message: "sc_code为空，操作失败！", type: "fail" });
    }
  }
  //取消
  onCancel(){
    this.router.navigate(["/india"]);
  }

  //用印选择 确定 回调事件
  scSeals(e) {
    this.approvers.sealChange(e['SealData']);
  }
  //附件上传 回调事件
  scAccessory(e) {
    this.formData.AccessList = e;
  }
  //跳转合同制作页面之前保存
  needSave(e?){
    this.scService.isToTpl = true;
    this.onSave("viewec");
  }

  scApprover(e) {
    this.approveUsers  = e;
    this.formData.SCBaseData.WFApproveUserJSON = JSON.stringify(e);
  }

  //验证 账期 正整数
  validAccount(value){
    let valid = /^[1-9][0-9]{0,2}$/.test(value);
    if (value && !valid) {
      this.formData.SCBaseData.AccountPeriodValue = "";
      this.windowService.alert({ message: "输入非法", type: "fail" });
    }
  }

  //获取审批历史
  getWfData(sc_code) {
    if (sc_code) {
      this.scService.getAppData(sc_code).subscribe(data => {
        if (data.Result) {
          let temp = JSON.parse(data.Data);
          if (temp["wfHistory"] && temp["wfHistory"].length > 0)
            this.wfHistory = temp["wfHistory"].reverse();
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      });
    }
  }

}
