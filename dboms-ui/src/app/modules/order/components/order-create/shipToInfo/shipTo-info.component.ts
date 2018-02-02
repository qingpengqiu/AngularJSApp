import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NgForm, NgModel } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { WindowService } from 'app/core';
import { Pager, XcModalService, XcModalRef } from 'app/shared/index';

export class PageNo { }
import {
  DeliveryInfo, DeliveryType, PartyInfo,
  OrderCreateService
} from './../../../services/order-create.service';

@Component({
  templateUrl: './shipTo-info.component.html',
  styleUrls: ['./shipTo-info.component.scss']
})
export class ShipToInfoComponent implements OnInit {
  public modal: XcModalRef;
  public loading: boolean = false;//加载中
  public isACustomer: boolean = false;
  public pagerData = new Pager();
  public deliveryList: PartyInfo[] = [];//送达方列表数据
  public formData: PartyInfo = new PartyInfo();//送达方数据
  public SDFCondition;//客户名称,客户编码
  public isSubmit: boolean = false;
  public defauls: boolean = false;//无数据默认显示

  public deliveryTypeList: DeliveryType[] = [];//发货方式
  public deliverinfo;//初始送达方数据
  public provinceCityInfo;//省市区信息
  public provinceList;//省
  public cityList;//市
  public countyList;//区县
  public province = "";//省
  public city = "";//市
  public county = "";//区县
  public deliveryType;//发货方式
  public isModifies = [];//是否修改
  public allowReset: boolean = false;//是否可以点击重置
  public salesOrderID;//销售订单ＩＤ
  public departmentProductGroupID;//部门产品组
  public channel;//分销渠道
  public customerERPCode;//客户ERP
  public orderTypeId;//销售订单
  public firstInit: boolean = true;
  public saleType;//订单模板类型

  @ViewChildren(NgModel) inputList;//表单控件
  @ViewChildren('forminput') inputListDom;//表单控件DOM元素
  @ViewChild(NgForm) myApplyForm;//表单

  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute,
    private xcModalService: XcModalService,
    private windowService: WindowService,
    private orderCreateService: OrderCreateService
  ) { }


  changeProvince() {
    let provinceCode = this.formData.AreaID;
    let cityInfo = this.provinceCityInfo["city"];
    if (this.firstInit && this.formData.SDFCity) {
      this.changeCity();
    } else {
      this.firstInit = false;
      this.isModifies[4] = true;
      this.allowReset = true;
      //点击修改清空后面数据
      this.formData.SDFCity = "";
      this.formData.SDFDistrict = "";
      this.cityList = [];
      this.countyList = [];
    }
    this.cityList = cityInfo.filter(item => item.CityCode.indexOf(provinceCode) == 0);
  }
  changeCity() {
    let citycode = this.formData.SDFCity;
    let countyInfo = this.provinceCityInfo["district"];
    if (this.firstInit) {
      this.firstInit = false;
    } else {
      this.isModifies[5] = true;
      this.allowReset = true;
      //点击修改清空后面数据
      this.formData.SDFDistrict = "";
      this.countyList = [];
    }
    this.countyList = countyInfo.filter(item => item.CityCode.indexOf(citycode) == 0);
  }
  changeCounty() {
    this.isModifies[6] = true;
    this.allowReset = true;
  }

  initData(data?) {
    let SDFC = "";
    if (this.SDFCondition) {
      SDFC = this.SDFCondition.trim();
    }
    let params = {
      SalesOrderID: this.salesOrderID,
      DepartmentProductGroupID: this.departmentProductGroupID,
      CustomerERPCode: this.customerERPCode,
      Channel: this.channel,
      SDFCondition: SDFC
    }
    this.loading = true;
    this.orderCreateService.getDeliveryList(params).subscribe(
      data => {
        if (data.Result) {
          let info = JSON.parse(data.Data);
          if (info.length == 0) {
            this.defauls = true;
          } else {
            this.defauls = false;
          }
          this.deliveryList = info;
          // console.info(this.deliveryList);
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
        this.loading = false;
      }
    );
  }


  ngOnInit() {
    //数据初始化，未修改
    for (let i = 0; i < 8; i++) {
      this.isModifies.push(false);
    }

    //获得弹出框自身
    this.modal = this.xcModalService.getInstance(this);

    this.modal.onShow().subscribe((data) => {
      this.isACustomer = false;
      this.isSubmit = false;
      if (data) {
        this.formData.ConsignmentModeID = "01";
        this.provinceList = data["provinceCityInfo"]["province"];
        this.provinceCityInfo = data["provinceCityInfo"];
        this.deliveryTypeList = data["deliveryTypeList"];
        this.deliverinfo = data["deliverinfo"];
        this.salesOrderID = data["SalesOrderID"];
        this.orderTypeId = data["OrderTypeId"];
        this.saleType = data["saleType"] || 0;
        //从ERP获取数据，无法编辑
        if (data["deliverinfo"]["SDFCode"] != "A" && data["deliverinfo"]["SDFCode"] != "ALY") {
          this.isACustomer = false;
          for (let key in this.myApplyForm.controls) {
            if (key != "name" && key != "deliveryType") {
              this.myApplyForm.controls[key].disable({ onlySelf: true })
            }
          }
        } else {
          this.isACustomer = true;
        }
        //判断是否有SDFID，调取送达方详细信息
        this.getInitSDF(data["deliverinfo"]["SDFID"]);
        //送达方列表数据需要字段
        if (data["Channel"]) {
          this.channel = data["Channel"];
        } else {
          this.windowService.alert({ message: "查询送达方列表信息，请先选择分销渠道", type: "fail" });
        }
        this.customerERPCode = data["CustomerERPCode"];
        if (data["DepartmentProductGroupID"]) {
          this.departmentProductGroupID = data["DepartmentProductGroupID"];
        } else {
          this.windowService.alert({ message: "查询送达方列表信息，请先选择部门产品组！", type: "fail" });
          return;
        }
        this.initData(data);

      }
    })
  }

  //关闭弹出框
  hide(data?: any) {
    this.modal.hide(data);
  }

  search() {
    if (this.departmentProductGroupID) {
      this.initData();
    } else {
      this.windowService.alert({ message: "查询送达方列表信息，请先添加物料", type: "fail" });
    }
  }

  SDFModify(index) {
    this.isModifies[index] = true;
    this.allowReset = true;
  }
  selected(item) {
    for (let key in item) {
      if (this.formData["SDFCode"] !== item["SDFCode"]) {
        this.allowReset = true;
        return;
      }
      this.formData[key] = item[key] || "";
    };
    if (this.formData["SDFCode"] != "A" && this.formData["SDFCode"] != "ALY") {
      this.isACustomer = false;
      for (let key in this.myApplyForm.controls) {
        if (key != "name" && key != "deliveryType") {
          this.myApplyForm.controls[key].disable({ onlySelf: true })
        }
      };
    } else {
      this.isACustomer = true;
    }
  }
  //重置
  reSet() {
    if (this.allowReset) {
      this.getInitSDF(this.deliverinfo["SDFID"]);
    }
  }
  //判断是否是一次性客户重置
  resetForm() {
    if (this.formData.SDFCode == "A" || this.formData.SDFCode == "ALY") {
      this.isACustomer = true;
      for (let key in this.myApplyForm.controls) {
        if (key != "name") {
          this.myApplyForm.controls[key].enable({ onlySelf: false });
        }
      }
    }
  }
  /**
  *获取送达方ID
  */
  getInitSDF(SDFID) {
    //判断是否有SDFID，调取送达方详细信息
    if (SDFID) {
      this.loading = true;
      this.orderCreateService.getDeliveryInfo(SDFID).subscribe(
        data => {
          if (data.Result) {
            let info = JSON.parse(data.Data);
            this.formData = info;

            if (info["AreaID"] && this.firstInit) {
              this.changeProvince();
            }
            this.isModifies = [];
            for (let i = 0; i < 8; i++) {
              this.isModifies.push(false);
            }
            this.allowReset = false;
            this.resetForm();
            // console.info(this.formData)
          } else {
            this.windowService.alert({ message: data.Message, type: "fail" });
          }
          this.loading = false;
        }
      );
    } else {
      let formData = this.formData;
      for (let key in formData) {
        if (key != "SDFCode" && key != "SDFName" && key != "ConsignmentModeID" && key != "SDFAddress") {
          formData[key] = "";
        }
      }
      this.formData.SDFCode = this.deliverinfo["SDFCode"];
      this.formData.SDFName = this.deliverinfo["SDFName"];
      this.formData.SDFAddress = this.deliverinfo["SDFAddress"];
      this.resetForm();
    }
  }
  //保存数据
  submit(e?) {
    this.isSubmit = true;
    if (this.myApplyForm.valid) {//表单验证通过
      let message = "确定保存？";
      let isModifies = false;
      this.isModifies.forEach(function(item, index) {
        if (item) {
          isModifies = true;
        }
      });
      if (this.saleType !== 2 && isModifies && this.orderTypeId != '0005') {
        message = "请同时提交委托发货原件给商务";
        this.formData.IsDelegate = 1;
      } else {
        this.formData.IsDelegate = 0;
      };
      let user = JSON.parse(localStorage.getItem("UserInfo"));
      this.formData.EditorName = user["UserName"];
      this.formData.EditorITCode = user["ITCode"];
      this.formData.SalesOrderId = this.salesOrderID;
      this.windowService.confirm({ message: message }).subscribe({
        next: (v) => {
          if (v) {
            this.loading = true;
            if (this.formData.SDFCode !== this.deliverinfo["SDFCode"]) {
              this.formData.IsDelegate = 1;
            };
            if (this.deliverinfo["SDFID"]) {
              //送达方有SDFID更新送达方数据
              this.formData["SDFID"] = this.deliverinfo["SDFID"];
              this.formData["ID"] = this.deliverinfo["SDFID"];
              this.orderCreateService.updateDeliveryInfo({ DeliveryModel: this.formData }).subscribe(
                data => {
                  if (data.Result) {
                    let info = JSON.parse(data.Data);
                    let emitData = {
                      DeliveryInfo: this.formData
                    }
                    this.hide(emitData);
                  } else {
                    this.windowService.alert({ message: data.Message, type: "fail" });
                  }
                  this.loading = false;
                }
              );
            } else {
              //没有SDFID，保存送达方
              this.formData["ID"] = "0";
              this.orderCreateService.addDeliveryInfo({ DeliveryModel: this.formData }).subscribe(
                data => {
                  if (data.Result) {
                    let info = JSON.parse(data.Data);
                    this.formData["ID"] = info["SDFID"];
                    this.formData["SDFID"] = info["SDFID"];
                    let emitData = {
                      DeliveryInfo: this.formData
                    }
                    this.hide(emitData);
                  } else {
                    this.windowService.alert({ message: data.Message, type: "fail" });
                  }
                  this.loading = false;
                }
              );
            }
          }
        }
      });
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
}
