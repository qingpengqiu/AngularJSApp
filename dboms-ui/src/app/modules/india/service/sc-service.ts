import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { HttpServer } from "../../../shared/services/db.http.server";
declare var window: any;

/**
 * 接口地址
 */
const getAppSelectData = "S_Contract/GetDepartmentPlatform";
const api_applyUrl = "S_Contract/GetMyApplyContracts";
const api_approvUrl = "S_Contract/GetMyApprovals";//我的审批列表
const api_companyUrl = "S_Contract/GetBaseCompany/";
const api_deleteUrl = "S_Contract/DeleteSContract/";
const getscbyscUrl = "S_Contract/GetSCBaseDataBySCode";
const getSelectDataUrl = "S_Contract/GetSCheckBaseData/";
const getUserDeptmentUrl = "S_Contract/GetUserDeptmentByItcode/";
const deleteStepUp = "S_Contract/DeleteStepUp/";
const saveContractData = "S_Contract/UpdateScContract";
const contractRevoke = "S_Contract/RevokSCApproval/";//撤销
const getCustomerAuth = "S_Contract/GetCustomerCreate";
const getCustomerFrozen = "S_Contract/GetCustomerFreeze/";
const api_getSealsUrl = "S_Contract/GetOASealList";//获取用印数据
const api_uploadFilesUrl ="api/S_Contract/UploadSCAccessories/";//上传附件
const UpdatePurchaseNotified ="S_Contract/UpdatePurchaseNotified/";//采购通知
const deleteEContract = "E_Contract/DeleteEContract/";
const getUserPhoneUrl = "InitData/GetCurrentUserPhone";//获取登陆人信息
//审批相关接口
const contractSubmit = "S_Contract/SubmitSContract";//提交、重新提交
const getAppData = "S_Contract/GetApprHistoryAndProgress/";//加签
const contractApp = "S_Contract/ApproveSContract";//同意、驳回、同意并加签风险总监
const contractSignApp = "S_Contract/AddApprovalTask";//加签
const contractTransferApp = "S_Contract/HandOverApproval";//转办
export const contractAddTaskApp = "S_Contract/ApproveAdditional";//被加签人审批
const updateSCData = "S_Contract/UpdateSCForApprover";//审批暂存
//附件下载IP
const downloadIp = "http://10.0.1.26:88/";
@Injectable()
export class ScService {
    constructor(private http: HttpServer) { }

    //页面加载时，分页组件会多调用一次获取数据，防止重复调用数据
    _flag = false;
    //网站发布地址
    // dbomsUiWebUrl: string = dbomsUiWebSetting.webUiServer;
    dbomsUiWebUrl: string = "http://dir2.digitalchina.com/dboms";
    //附件地址
    downloadUrl: string = "http://10.0.1.26:88";
    /** 上一个页面 url地址(查看电子合同制作内容) */
    returnUrl:any = "";
    isAllowApp:boolean = true;//是否可审批
    isToTpl:boolean = false;//是否跳转到合同制作页面
    //设置请求头
    headers = new Headers({ 'ticket': window.localStorage.getItem('ticket') });
    options = new RequestOptions({ headers: this.headers });
    /**
     * 获取我的申请列表数据
     */
    getMyApplyData(params: any): Observable<any> {
        if (!this._flag && params.pagesize == 10) {
            this._flag = true;
            return;
        } else {
            return this.http.post(api_applyUrl, params, this.options);
        }
    }

    /**
     * 获取我的审批列表数据
     */
    getMyApprovData(params: any): Observable<any> {
        if (!this._flag && params.pageSize == 20) {
            this._flag = true;
            return;
        } else {
            return this.http.post(api_approvUrl, params, this.options);
        }
    }

    /**
     * 获取我方主体
     */
    getCompanyData(params): Observable<any> {
        return this.http.post(api_companyUrl + params, this.options);
    }

    /**
     * 获取我的审批  查询条件中下拉框数据
     */
    getAppSelectData(): Observable<any> {
        return this.http.post(getAppSelectData,null, this.options);
    }

    /**
     * 列表 删除 销售合同
     */
    deleteSContract(scCode): Observable<any> {
        return this.http.post(api_deleteUrl + scCode,null, this.options);
    }

    /**
     * 列表 删除 电子合同
     */
    deleteEContract(scCode): Observable<any> {
        return this.http.post(deleteEContract + scCode,null, this.options);
    }

    /**
     * 获取销售合同信息
     */
    getEContractByScCode(body): Observable<any> {
        return this.http.post(getscbyscUrl, body, this.options);
    }

    /**
     * 获取下拉框数据
     */
    getSelectData(sc_code): Observable<any> {
        return this.http.post(getSelectDataUrl+sc_code,null, this.options);
    }

    /**
     * 根据销售员itcode获取所有本部事业部及平台，电话
     */
    getUserDeptmentByItcode(itcode): Observable<any> {
        return this.http.post(getUserDeptmentUrl + itcode,null, this.options);
    }

    /**
     * 销售合同 上一步
     */
    deleteStepUp(sc_code): Observable<any> {
        return this.http.post(deleteStepUp + sc_code,null, this.options);
    }

    /**
     * 销售合同 暂存
     */
    saveContractData(body: any): Observable<any> {
        return this.http.post(saveContractData, body, this.options);
    }

    /**
     * 获取销售合同审批历史及流程全景数据
     */
    contractRevoke(sc_code): Observable<any> {
        return this.http.post(contractRevoke + sc_code,null, this.options);
    }

    /**
     * 销售合同审批 同意 驳回 同意并加签风险总监
     */
    contractApp(body: any): Observable<any> {
        return this.http.post(contractApp, body, this.options);
    }

    /**
     * 销售合同审批 加签
     */
    contractSignApp(body: any): Observable<any> {
        return this.http.post(contractSignApp, body, this.options);
    }

    /**
     * 销售合同审批 转办
     */
    contractTransferApp(body: any): Observable<any> {
        return this.http.post(contractTransferApp, body, this.options);
    }

    /**
     * 销售合同审批 被加签人审批
     */
    contractAddTaskApp(body: any): Observable<any> {
        return this.http.post(contractAddTaskApp, body, this.options);
    }

    /**
     * 撤销合同审批
     */
    getAppData(sc_code): Observable<any> {
        return this.http.post(getAppData + sc_code,null, this.options);
    }

    /**
     * 获取代理商认证信息
     */
    getCustomerAuth(params): Observable<any> {
        return this.http.post(getCustomerAuth, params, this.options);
    }

    /**
     * 获取代理商冻结信息
     */
    getCustomerFrozen(customercode): Observable<any> {
        return this.http.post(getCustomerFrozen + customercode,null, this.options);
    }
    /**
     * 获取印章信息数据
     */
    getSealsData(body: any): Observable<any> {
        return this.http.post(api_getSealsUrl, body, this.options);
    }

    /**
     * 选择上传风险附件时:accessoryType=1 ;
     * 选择上传事业部附件时，accessoryType= 3;
     * 选择自定义附件时，accessoryType=18
     */
     uploadSCAccessories(params: any) {
       return downloadIp+api_uploadFilesUrl+params;
     }

    /**
     * 销售合同 提交、重新提交
     */
    submitContractData(body: any): Observable<any> {
        return this.http.post(contractSubmit, body, this.options);
    }

    /**
     * 销售合同 审批暂存
     */
    updateSCApproval(body: any): Observable<any> {
        return this.http.post(updateSCData, body, this.options);
    }

    /**
     * 附件下载
     */
    upFilesDownload(params: any) {
        return downloadIp+params;
    }

    /**
     * 采购通知
     */
    UpdatePurchaseNotified(sc_code): Observable<any> {
        return this.http.post(UpdatePurchaseNotified + sc_code,null, this.options);
    }
    /**
     * 获取登陆人电话
     */
    getUserPhone(): Observable<any> {
        return this.http.get(getUserPhoneUrl, this.options);
    }
}

// 印章列表中印章信息
export class sealsQuery{
  public platfromid: string;  //平台id  (必传)
  public pagesize: number ; //每页记录数
  public currage: number ;  //当前页
  public name: string ;// 搜索关键字
}
//表单数据
export class SCData {
    AccessList: any = "";
    SCBaseData: SCBaseData = new SCBaseData();
}
//销售合同主数据
export class SCBaseData {
    SC_Code: any = "";//销售合同编号
    SalesITCode: any = "";//销售员itcode
    SalesName: any = "";//销售员名字
    // Headquarterid: any = "";//本部编号
    Headquarter: any = "";//本部名称
    // BusinessUnitid: any = "";//事业部编号
    BusinessUnit: any = "";//事业部名称
    PlatformID: any = "";//平台编号
    Platform: any = "";//平台名称
    BuyerERPCode: any = "";//供应商ERPcode
    BuyerName: any = "";//供应商名称
    ContractMoney: any = "";//合同金额
    Currency: any = "";//币种
    AccountPeriodType: any = "";//系统账期
    AccountPeriodValue: any = "";//系统账期值
    ProjectType: any = "";//项目类型
    TaxRateCode: any = "";//税率
    PaymentMode: any = "";//付款方式
    ProjectName: any = "";//项目名称
    BuyerContractNo: any = "";//自定义合同编号
    PayItem: any = "";//付款条款
    Outsourcing: any = "";//是否外购
    SupplyChain1: any = "";//供应链1
    SupplyChain2: any = "";//供应链2
    SupplyChain3: any = "";//供应链3
    SupplyChain4: any = "";//供应链4
    SupplyChain5: any = "";//供应链5
    AgentITcode: any = "";//代办人itcode(当前登录人 )
    AgentName: any = "";//代办人姓名
    ApplyITcode: any = "";//销售员(申请人)
    ApplyName: any = "";//销售员名字
    ApplyTel: any = "";//销售员电话
    SC_Status: any = "";//合同状态
    SealInfoJson: any = "";//用印信息
    WFApproveUserJSON: any = "";//审批人信息
    ContractType: any = "";//合同类型
    ContractSource: any = "";//合同创建
    YWFWDM: any = "";//业务范围代码
    CurrencyName: any = "";//币种
    AccountPeriodName: any = "";//系统账期
    ProjectTypeName: any = "";//项目类型
    TaxRateName: any = "";//税率
    PaymentName: any = "";//付款方式
    SealApprovalTime: any = "";//印章岗审批时间
    IsRecovery: any = "";//合同是否回收
    BizConcernInfo: any = "";//商务关注信息
    TemplateID: any = "";//模板ID
}
//附件信息
export class AccessList {
    AccessoryBus: Access[] = [];//事业部可见类型
    AccessorySub: Access[] = [];//风险可见类型
    AccessoryZ: Access[] = [];//自定义合同类型
    AccessorySeal: Access[] = [];//用印文件
    AccessoryS: Access[] = [];//审批文件
}
export class Access {
    AccessoryID: any;
    AccessoryName: any;
    AccessoryType: any;
    AccessoryURL: any;
}
//用印信息
export class Seal {
    SealData: any = [];
    PrintCount: any = "4";
}
//下拉框
export class SelectData {
    HeadquarterList: HeadquarterList[] = [];
    CurryList: CurryList[] = [];
    PayMendList: PayMendList[] = [];
    TaxRateList: TaxRateList[] = [];
    ProjectTypeList: ProjectTypeList[] = [];
    AccountPeriodList: AccountPeriodList[] = [];
    BusinessUnitList: BusinessUnitList[] = [];
    AgentList: AgentList[] = [];
    PlatForm: PlatForm[] = [];
    Buyer: Buyer[] = []
}
export class HeadquarterList {
    constructor(
        public HeadquarterID: any,
        public HeadquarterName: any
    ) { }
}
export class CurryList {
    CurrencyID: any;
    CurrencyName: any
}
export class PayMendList {
    Paymentcode: any;
    PayMentName: any
}
export class TaxRateList {
    TaxRateID: any;
    TaxRateName: any
}
export class ProjectTypeList {
    ProjectTypeID: any;
    ProjectTypeName: any
}
export class AccountPeriodList {
    AccountPeriodID: any;
    AccountPeriodName: any
}
export class BusinessUnitList {
    constructor(
        public BusinessUnitID: any,
        public BusinessUnitName: any
    ) { }
}
export class AgentList {
    AgentID: any;
    AgentName: any
}
export class PlatForm {
    constructor(
        public FlatCode: any,
        public FlatName: any
    ) { }
}
export class Buyer {
    constructor(
        public BuyerERPCode: any,
        public BuyerName: any
    ) { }
}
export class UserDeptment {
    BBMC: any;
    FlatCode: any;
    FlatName: any;
    SYBMC: any;
    UserTel: any;
}
//用户信息
export class PersonInfo {
    "id": any = "";
    "prefixId": any = "";
    "itcode": any = "";
    "personNo": any = "";
    "name": any = "";
    "enname": any = "";
    "pinyin": any = "";
    "pinyinPrefix": any = "";
    "shortname": any = "";
    "position": any = "";
    "joindate": any = "";
    "sex": any = "";
    "hometown": any = "";
    "mobile": any = "";
    "telephone": any = "";
    "fax": any = "";
    "email": any = "";
    "signature": any = "";
    "qualifications": any = "";
    "bankCard": any = "";
    "status": any = 0;
    "statusReason": any = "";
    "innerEmail": any = "";
    "innerEmailContact": any = "";
    "type": any = 0;
    "isTrialAccount": any = "";
    "department": ""
  }
export class ApplySearch {
    ContractState: any = 1; //状态(0-草稿&&驳回，1-申请中，2-已完成)
    SellerCompanyCode: any = ""; //我方主体 //0001
    BuyerName: any = null; //客户名称
    ProjectName: any = null; //项目名称
    ContractType: any = null; //合同类型
    ContractSource: any = null; //合同创建
    SealApprovalTimeStart: any = null; //盖章完成起始日期
    SealApprovalTimeEnd: any = null; //盖章完成 结束日期
    currentpage: any = 1; //页码
    pagesize: any = 10; //每页大小
    CreateITcode: any = null //当前登录人itcode
}
export class ApproveSearch {
    QueryType: any = "ToDo";    //ToDo待审批 Done己审批 All全部
    SellerCompanyCode: any = "";//我方主体公司代码
    ApplyInfo: any = null;//申请人名称/ItCode
    BuyerName: any = null;//客户名称
    MainContractCode: any = null;//申请单号
    ProjectName: any = null;//项目名称
    Headquarter: any = "";//本部
    BusinessUnit: any = "";//事业部
    //SubmitTimeBegin:any =  ;//申请日期开始值：yyyy-MM-dd
    //SubmitTimeEnd:any =  ;//申请日期结束值：yyyy-MM-dd
    FinishTimeBegin: any = null;//完成日期开始值：yyyy-MM-dd
    FinishTimeEnd: any = null;//完成日期结束值：yyyy-MM-dd
    pagesize: any = 10; //每页记录数
    currentpage: any = 1;   //当前页数
    CreateITcode: any = null;   //当前登录人itcode
    PlatformID: any = "";  //平台ID
    ContractType: any = null;  //合同类型
    ContractSource: any = null;  //合同创建
}
