import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { NgForm, NgModel } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { WindowService } from 'app/core';
import { Pager, XcModalService, XcModalRef } from 'app/shared/index';

export class PageNo { }
import {
  LogisticsInfo, LogisticParams, OrderStatus,
  OrderCompletedService
} from './../../../services/order-completed.service';

@Component({
  templateUrl: './logistics-info.component.html',
  styleUrls: ['./logistics-info.component.scss']
})
export class LogisticsInfoComponent implements OnInit {
  public modal: XcModalRef;
  public loading: boolean = true;//加载中
  public submitOnce: boolean;
  public pagerData = new Pager();
  public logisticsInfo: LogisticsInfo = new LogisticsInfo();//物流数据
  public customerName;//公司名称
  public orderStatus = OrderStatus;//包裹状态
  public mailNoList;//快递单号列表
  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute,
    private xcModalService: XcModalService,
    private windowService: WindowService,
    private orderCompletedService: OrderCompletedService
  ) { }

  initData(data) {
    let params = new LogisticParams();
    params = {
      providerID: "" || "",// 承运商简称logisticProviderID
      orderNo: "" || "",//"订单号"
      doNo: "" || "",//"科捷单号"
      mailNo: "" || "",//"快递单号"
      tradeNo: "" || "",//"交易单号"
      erpNo: data || ""//"科捷erp单号"
    }
    this.loading = true;
    this.orderCompletedService.getLogisticsInfo(params).subscribe(
      data => {
        if (data.Result) {
          let info = JSON.parse(data.Data);
          let response = info.logisticsQueryResponse.orders.order;
          if (response.success === "true") {
            this.logisticsInfo = response;
          } else {
            this.windowService.alert({ message: response.reason, type: "fail" });
          }
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
        this.loading = false;
      }
    );
  }

  ngOnInit() {

    //获得弹出框自身
    this.modal = this.xcModalService.getInstance(this);

    this.modal.onShow().subscribe((data) => {
      if (data) {
        let ERPCodeArr = data.split(",");
        let params = new LogisticParams();
        this.initData(ERPCodeArr[0]);
        let list = [{ "id": ERPCodeArr[0], "active": true }];
        ERPCodeArr.forEach(function(item, index) {
          if (item.length > 0 && index !== 0) {
            list.push({
              "id": item,
              "active": false
            });
          }
        });
        this.mailNoList = list;
      }

    })
  }

  //关闭弹出框
  hide(data?: any) {
    this.modal.hide(data);
  }
  //切换tab
  tabChange(tab) {
    let initInfo = false;
    this.mailNoList.forEach(function(item, index) {
      if (tab.id === item.id && tab.active === false) {
        item.active = true;
        initInfo = true;
      } else if (tab.id !== item.id) {
        item.active = false;
      }
    });
    if (initInfo) {
      this.initData(tab.id)
    }
  }
  onChange(tab?) {

  }
}
