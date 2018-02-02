import { Component, OnInit, ViewChild, ViewChildren, EventEmitter, Output, Input } from '@angular/core';
import { NgForm, NgModel } from "@angular/forms";

import { WindowService } from 'app/core';
import { Pager, XcModalService, XcModalRef } from 'app/shared/index';
import { Person } from 'app/shared/services/index';

import { ShipToInfoComponent } from './../shipToInfo/shipTo-info.component';
import { MaterialChangeComponent } from './../materialChange/material-change.component';
import { AddMaterialComponent } from './../addMaterial/add-material.component';

import {
  MaterialInfo,
  OrderCreateService
} from './../../../services/order-create.service';

@Component({
  selector: 'oc-shipTo-party',
  templateUrl: 'shipTo-party.component.html',
  styleUrls: ['./shipTo-party.component.scss']
})
export class ShipToPartyComponent implements OnInit {
  @Output() shipToCallBack = new EventEmitter();
  @Input() partyInfo;//送达方与物料数据
  @Input() currentIndex: number;//当前送达方排序位置
  @Input() num: number;//送达方个数
  @Input() provinceCityInfo;//省市区信息
  @Input() deliveryTypeList;//发货方式
  @Input() contractCode;//合同号
  @Input() customerName;//客户名称
  @Input() salesOrderID;//销售单号
  @Input() channel;//分销渠道
  @Input() customerERPCode;//售达方编码
  @Input() rebateAmount;//返款方式
  @Input() orderTypeId;//订单类型
  @Input() departmentProductGroupID;//部门产品组
  @Input() isSubmit;//是否提交订单

  public isModifies: boolean = false;//送达方是否修改
  public modalShipTo: XcModalRef;//编辑送达方信息模态框
  public modalChange: XcModalRef;//物料转移模态框
  public modalAdd: XcModalRef;//物料添加模态框
  public changeIndex;//转移物料index
  public fullAddress;//完整地址

  @ViewChildren('forminput')
  inputList;//表单控件DOM元素
  @ViewChild(NgForm)
  myApplyForm;//表单


  constructor(
    private xcModalService: XcModalService,
    private windowService: WindowService,
    private orderCreateService: OrderCreateService
  ) { }
  /*
  *   省市信息传入函数
  */
  toProvinceCityInfo(data?) {
    if (this.partyInfo.Deliverinfo && data) {
      this.provinceCityInfo = data;
      this.concatAddress(this.partyInfo.Deliverinfo);
    }
  }
  /*
  *   返款信息传入函数
  */
  toRebateAmount(data?) {
    //计算物料返款
    this.rebateAmount = parseFloat(data);
    let rebateAmount = this.rebateAmount;
    if (this.partyInfo.MaterialList && this.partyInfo.MaterialList.length > 0) {
      this.partyInfo.MaterialList.forEach(function(item, index) {
        if (rebateAmount != 1.00) {
          item.RebateAmount = (item.Price * rebateAmount).toFixed(2);
        } else {
          item.RebateAmount = "0.00";
        }
        item.TotalPrice = parseFloat(item.Price || 0) - parseFloat(item.RebateAmount || 0);
      })
    }
  }

  ngOnInit() {
    if (this.partyInfo.MaterialList && this.partyInfo.MaterialList.length > 0) {
      this.partyInfo.MaterialList.forEach(function(item, index) {
        item.Price = parseFloat(item.Price).toFixed(2);//数据初始化时，金额取两位
        if (!item.ConsignmentModeID) {
          item.ConsignmentModeID = "01";//数据初始化时，金额取两位，
        }
      });
      // this.departmentProductGroupID = this.partyInfo.MaterialList[0].Factory.slice(2);//数据初始化时，部门产品组取工场后两位
    } else {
      this.partyInfo.MaterialList = [];
    }
    //测试数据过多时，样式问题
    // let list = [];
    // for(let i = 0; i < 18; i++){
    //     list.push(new MaterialInfo());
    // }
    // this.partyInfo.MaterialList = list;
    //在初始化的时候 创建模型;;;;编辑送达方信息
    this.modalShipTo = this.xcModalService.createModal(ShipToInfoComponent);
    //模型关闭的时候 如果有改动，请求刷新
    this.modalShipTo.onHide().subscribe((data) => {
      if (data) {
        // this.partyInfo.Deliverinfo.IsDelegate = data["isModifies"];
        this.partyInfo.Deliverinfo = data["DeliveryInfo"];
        this.concatAddress(data["DeliveryInfo"]);
      }
    })

    //在初始化的时候 创建模型;;;;物料添加
    this.modalAdd = this.xcModalService.createModal(AddMaterialComponent);
    //模型关闭的时候 如果有改动，请求刷新
    this.modalAdd.onHide().subscribe((data) => {
      if (data) {
        //已存在物料的合同物料ID
        let oldMaterialIdList = [];
        this.partyInfo.MaterialList.forEach(function(item, index) {
          oldMaterialIdList.push(item.ContractMaterialID);
        });
        //新添加的物料去重
        let delrepeat = data.filter(item => oldMaterialIdList.indexOf(item.ContractMaterialID) == -1);
        let rebateAmount = this.rebateAmount;
        //新添加的物料数据处理
        delrepeat.forEach(function(item, index) {
          item.Price = "0.00";
          item.RebateAmount = "0.00";
          if (!item.ConsignmentModeID) {
            item.ConsignmentModeID = "01";
          }
        });
        this.partyInfo.MaterialList = this.partyInfo.MaterialList.concat(delrepeat);
        this.shipToCallBack.emit();
      }
    })

    //在初始化的时候 创建模型;;;;物料转移
    this.modalChange = this.xcModalService.createModal(MaterialChangeComponent);
    //模型关闭的时候 如果有改动，请求刷新
    this.modalChange.onHide().subscribe((data) => {
      if (data) {
        let info = new MaterialInfo();
        let material = this.partyInfo.MaterialList[this.changeIndex];
        //深拷贝，防止修改params["count"]影响this.materialList数据
        for (let key in material) {
          info[key] = material[key];
        }
        let params = {
          info: info,
          shipToParty: data.shipToParty
        };
        //当前送达方，物料变化
        if (data.surplusCount == 0) {
          this.partyInfo.MaterialList.splice(this.changeIndex, 1);
        } else {
          this.partyInfo.MaterialList[this.changeIndex]["Quantity"] = data.surplusCount;
        }
        params["info"]["Quantity"] = data["changeCount"];
        this.shipToCallBack.emit(params);
      }
    })

  }
  //物料转移
  materialChange(item, i) {
    this.changeIndex = i;//转移物料所在位置
    this.modalChange.show({ num: this.num, index: this.currentIndex, count: item.Quantity });
  }
  //修改送达方信息
  changeInfo() {
    //物料转移后，工厂可能发生变化
    // if (this.partyInfo.MaterialList.length == 0) {
    //   this.departmentProductGroupID = "";
    // } else {
    //   this.departmentProductGroupID = this.partyInfo.MaterialList[0].Factory.slice(2);
    // }
    let params = {
      provinceCityInfo: this.provinceCityInfo,
      deliveryTypeList: this.deliveryTypeList,
      curstomerName: this.customerName,
      deliverinfo: this.partyInfo.Deliverinfo,
      SalesOrderID: this.salesOrderID,
      DepartmentProductGroupID: this.departmentProductGroupID,
      Channel: this.channel,
      CustomerERPCode: this.customerERPCode,
      OrderTypeId: this.orderTypeId
    }
    this.modalShipTo.show(params);//编辑送达方
  }
  //送达方地址拼接
  concatAddress(data?) {
    let fullAddress = "";
    let provinceCityInfo = this.provinceCityInfo;
    let provinceCode = data["AreaID"];
    //特殊地区拼写
    if (provinceCode === "330") {
      this.fullAddress = "香港特别行政区" + data["SDFAddress"];
      return;
    } else if (provinceCode === "340") {
      this.fullAddress = "澳门特别行政区" + data["SDFAddress"];
      return;
    } else if (provinceCode === "310") {
      this.fullAddress = "台湾" + data["SDFAddress"];
      return;
    };
    let provinceList = provinceCityInfo["province"].filter(item => item.ProvinceCode.indexOf(provinceCode) == 0);
    let province = "";
    if (provinceCode && provinceList.length > 0) {
      province = provinceList[0]["ProvinceName"];
    }
    let cityCode = data["SDFCity"]
    let cityList = provinceCityInfo["city"].filter(item => item.CityCode.indexOf(cityCode) == 0);
    let city = "";
    if (cityCode && cityList.length > 0) {
      city = cityList[0]["CityName"];
      //直辖市拼写
      if (province == city) {
        fullAddress = province + "市";
      } else {
        fullAddress = province + "省" + city + "市";
      }
    }
    //区县行政不确定
    if (data["SDFDistrict"]) {
      fullAddress = fullAddress + data["SDFDistrict"] + "(区/县)";
    }
    if (data["SDFAddress"]) {
      fullAddress = fullAddress + data["SDFAddress"];
    }
    this.fullAddress = fullAddress;
  }
  //删除送达方及物料信息
  delSelf() {
    //有SDFID时，需要删除数据库内相关信息
    if (this.partyInfo.Deliverinfo["SDFID"]) {
      this.windowService.confirm({ message: "是否要删除送达方及物料信息!" }).subscribe({
        next: (v) => {
          if (v) {
            let params = {
              SaleOrderID: this.salesOrderID,
              SDFID: this.partyInfo.Deliverinfo["SDFID"]
            };
            this.orderCreateService.delDeliveryInfo(params).subscribe(
              data => {
                if (data.Result) {
                  let info = JSON.parse(data.Data);
                  this.windowService.alert({ message: "送达方及物料信息删除成功！", type: "success" });
                  this.shipToCallBack.emit("del");
                } else {
                  this.windowService.alert({ message: data.Message, type: "fail" });
                }
              }
            );
          }
        }
      })
    } else {
      this.shipToCallBack.emit("del");
    }
  }
  //添加物料信息
  addMaterial() {
    let params = {
      contractCode: this.contractCode,
      salesOrderID: this.salesOrderID
    }
    //物料添加，工厂必须相同。因此传入工厂值
    if (this.partyInfo.MaterialList.length > 0) {
      params["Factory"] = this.partyInfo.MaterialList[0]["Factory"];
    } else {
      params["Factory"] = "";
    }
    this.modalAdd.show(params);
  }
  //删除物料信息
  delMaterial(list, i) {
    list.splice(i, 1);
    //物料清空后，部门产品组同样清空
    // if (list.length == 0) {
    //   this.departmentProductGroupID = "";
    // }
    this.shipToCallBack.emit();
  }
  //金额格式化,单价金额变化
  amountFormatP(item) {
    let price = parseFloat(item.Price || 0);
    if (price > 0) {
      item.Price = price.toFixed(2);
    } else {
      item.Price = (0).toFixed(2);
    }
    //返款计算
    if (this.rebateAmount != "1.00") {
      item.RebateAmount = (parseFloat(item.Price || 0) * parseFloat(this.rebateAmount || 0)).toFixed(2);
    }
    //总额计算
    item.TotalPrice = parseFloat(item.Price || 0) - parseFloat(item.RebateAmount || 0);
    this.shipToCallBack.emit();
  }
  //自定义返款
  amountFormatR(item) {
    let amount = parseFloat(item.RebateAmount || 0);
    if (amount > 0) {
      item.RebateAmount = amount.toFixed(2);
    } else {
      item.RebateAmount = (0).toFixed(2);
    }
    //总额计算
    item.TotalPrice = parseFloat(item.Price || 0) - parseFloat(item.RebateAmount || 0);
    // - parseFloat(item.RebateAmount || 0);
    //物料总金额，在返款自定义时，可能会出现负数。自动置零
    if (item.TotalPrice < 0) {
      this.windowService.alert({ message: "请正确填写返款金额！", type: "fail" });
      item.TotalPrice = 0;
      item.RebateAmount = parseFloat(item.Price || 0).toFixed(2);
    }
    this.shipToCallBack.emit();
  }
  //数量修改
  changeQuantity(item) {
    item.Quantity = parseInt(item.Quantity || 0);
    //返款计算
    // if(this.rebateAmount != "1.00"){
    //     item.RebateAmount = (item.Price*parseFloat(this.rebateAmount || 0)).toFixed(2);
    // }
    //总额计算
    // item.TotalPrice = parseFloat(item.Price || 0) - parseFloat(item.rebateAmount || 0);
    this.shipToCallBack.emit();
  }
}
