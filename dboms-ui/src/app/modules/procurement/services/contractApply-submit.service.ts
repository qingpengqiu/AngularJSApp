export class ContractApply {//整体数据结构
  public purchaserequisitionid = null;//采购申请id
  public TemplateID = null;//模板id
  public companycode = '';
  public company = '';//公司
  public factory = '';//工厂
  public vendorno = '';
  public vendor = '';//供应商
  public vendorbizscope = '';//对方业务范围
  public taxrate = 0;//税率
  public taxratecode = '';//税率编码
  public taxratename = '';//税率名称
  public currency = '';//币种
  public currencycode = '';//币种代码
  public preselldate = new Date;//预售日期
  public excludetaxmoney = 0;//未税总金额
  public foreigncurrencymoney = 0;//外币总金额
  public taxinclusivemoney = 0;//含税总金额
  public internationaltradelocation = 0;//国际贸易地点
  public internationaltradeterms: string = '';//国际贸易条件
  public receiver: string = '';//收货人
  public traceno: string = '';//需求跟踪号
  public purchasetype: string = '';//采购类型
  public purchaseorg: string = '';//采购组织
  public purchasegroup: string = '';//采购组
  public paymentterms: string = '';//付款条款
  public paymenttermscode: string = '';
  public istoerp: boolean = false;//是否写入erp
  public sealmoney: number = 0;//用印金额
  public itcode: string = '';//申请人ITCode
  public username: string = '';//申请人名称
  public addtime: Date = new Date;//申请时间
  public phone: string = '';//电话
  public homeoffice: string = '';//本部
  public FlatCode: string = '';//平台代码
  public plateform: string = '';//平台
  public bizdivision: string = '';//事业部
  public YWFWDM: string = '';//业务范围代码
  public VendorCountry = 0;//0-国内 1国外(海外供应商)
  // public orderno: string = '';//采购订单号
  public purchaserequisitiontype: string = "合同单采购";//采购申请类型：合同单采购，预下单采购，备货单采购
  // public wfid: string = '00000000-0000-0000-0000-000000000000';//流程id
  public wfstatus: string = '';//采购申请状态：提交/草稿/驳回/审批/完成
  public requisitionnum: string = '';//申请单号
  public currentapprove: string = '';//当前审批环节
  public WFApproveUserJSON: string = "";
  public PurchaseRequisitionDetailsList: Array<PurchaseRequisitionDetailsList> = [];
  public AccessoryList: Array<AccessoryList> = [];
  public PurchaseRequisitionSaleContractList: Array<PurchaseRequisitionSaleContractList> = []
}
export class PurchaseRequisitionDetailsList {//采购清单-物料信息
  public ID = 0;
  public MaterialNumber = '';//物料号
  public MaterialDescription = '';//物料描述
  public Count = null;//数量
  public Price = null;//未税单价
  public Amount = null;//未税总价
  public StorageLocation = "";//库存地
  public traceno = "";//需求跟踪号
  public Batch = "";//批次
  public MaterialSource = "";//物料来源
  public MaterialSourceType = "";//物料来源类型
  public AddTime = new Date;//添加时间
  public purchaserequisitionid = 0;//采购申请外键
}
export class AccessoryList {//附件列表
  public AccessoryID;
  public AccessoryName;
  public AccessoryURL;
  public AccessoryType;
  public CreatedTime;
  public CreatedByITcode;
  public CreatedByName;
  public InfoStatus
}
export class PurchaseRequisitionSaleContractList {//销售信息-原体
  // public id = null;
  // public purchaserequisitionid = null;//采购申请id
  public salecontractcode = '';//销售合同号
  public MainContractCode = '';//销售合同名称
  public excludetaxmoney = null;//未税总金额
  public taxinclusivemoney = null;//含税总金额
  public foreigncurrencymoney = 0;//	外币总金额
  // public cumulativeconsumemoney = 0;//采购订单累计用掉合同未税金额
  public addtime = new Date//添加时间
}
export class PurchaseRequisitionSaleContractListData {//销售信息
  constructor(
    public salecontractcode = '',//销售合同号
    public MainContractCode = '',//销售合同名称
    public excludetaxmoney = null,//未税总金额
    public taxinclusivemoney = null,//含税总金额
    public foreigncurrencymoney = 0,//	外币总金额
    // public cumulativeconsumemoney = 0,//采购订单累计用掉合同未税金额
    public addtime = new Date//添加时间
  ) { }
}
export class UserSettingsData {//销售信息
  constructor(
    public ITCode = '',//销售合同号
    public UserName = ''//销售合同名称
  ) { }
}