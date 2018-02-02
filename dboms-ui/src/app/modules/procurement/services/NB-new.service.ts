export class PurchaseOrderObj {//采购订单-整体数据结构
  public ID = null;
  public ApplicantOrderNumber: string = "";//申请订单号
  public TemplateID = null;//模板id
  public ApplicantName: string = "";//申请人名字
  public ApplicantItCode: string = "";//申请人ItCode
  public ERPOrderNumber = null;
  public VendorClass: string = ""; //新产品
  public ApproveID = null;
  public UpdateTime: Date = new Date;
  public AddTime: Date = new Date;
  public WFApproveUserJSON = null;
  public CurrentApprovalNode = null;
  public CostCenter: string = ""; //成本中心
  public Department: string = "";   //申请人部门
  public Platform: string = "";    //平台
  public Telephone: string = "";//申请人电话
  public BBMC: string = "";//本部名称
  public SYBMC: string = "";//事业部名称
  public YWFWDM: string = "";//业务范围代码
  public FlatCode: string = "";//平台代码
  public OrderType: string = "";//采购订单类型（NB）
  public CompanyName: string = "";//公司名称
  public CompanyCode: string = "";//公司代码
  public FactoryCode: string = "";//工厂编号
  public Vendor: string = "";//供应商名称
  public VendorNo: string = "";//供应商代码
  public IsInternalGroup = 0; //是否集团内供应商（0:集团内；1:集团外）
  public BusinessRange: string = "";//对方业务范围
  public RateCode: string = "";//税率在ERP中的标识
  public RateName: string = "";//税率显示名称 
  public RateValue: number = null;//税率值，两位小数
  public Currency: string = "";//币种
  public CurrencyCode: string = "";//币种编码
  public TrackingNumber: string = "";//需求跟踪号
  public PurchaseOrganization = null;//采购组织，根据根据选择的我方主体自动带出
  public PurchaseGroup: string = "";//采购组，默认为默认A01
  public ApproveState: string = '';//提交/草稿/驳回/审批/完成
  public PruchaseAmount: number = null;//未税采购金额统计（采购清单汇总）
  public PruchaseAmountTax: number = null;//含税采购金额统计（采购清单汇总）
  public paymentterms: string = '';
  public paymenttermscode: string = '';
  public VendorCountry: string = '';
  public PurchaseOrderDetails: Array<PurchaseOrderDetails> = [];//采购清单
  public PurchaseOrderAccessories: Array<PurchaseOrderAccessory> = [];//附件
}
export class PurchaseOrderDetails {//采购清单-物料信息
  public ID = "00000000-0000-0000-0000-000000000000";
  public MaterialNumber = '';//物料号
  public MaterialDescription = '';//物料描述
  public Count = null;//数量
  public Price = null;//未税单价
  public Amount = null;//未税总价
  public StorageLocation = "";//库存地
  public Batch = "";//批次
  public isImport = false;//是否为导入
  public AddTime = new Date;//添加时间
  public TrackingNumber = "";//需求跟踪号
  public PurchaseOrder_ID = "00000000-0000-0000-0000-000000000000";//采购订单主键
  public MaterialSource = "";//物料来源，当不是BH或PL时 表示采购合同主键
  public PurchaseRequisitionNum = "";//采购申请单号
  public MainContractCode = "";//采购合同号
  public DBOMS_PurchaseRequisitionSaleContract_ID = "";//采购申请、采购合同  关系表主键 ID
}
export class PurchaseOrderAccessory {//附件
  public AccessoryID = "";
  public AccessoryName: string = "";
  public AccessoryURL: string = "";
  public AccessoryType: string = "";
  public CreatedTime: Date = new Date;
  public CreatedByITcode: string = "";
  public CreatedByName: string = "";
  public InfoStatus = null;
}