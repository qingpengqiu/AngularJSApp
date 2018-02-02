import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";

import { WindowService } from 'app/core';
import { Pager, XcModalService, XcModalRef } from 'app/shared/index';
import { newApply, indiaType } from "../../animate/order-animate";
import { dbomsPath } from "environments/environment";
import * as moment from 'moment';

export class PageNo { };
import { LogisticsInfoComponent } from './logisticsInfo/logistics-info.component';
import {
  OrderCompletedService, SalesOrderInfo
} from './../../services/order-completed.service';

@Component({
  templateUrl: 'order-completed.component.html',
  styleUrls: ['./order-completed.component.scss']
})
export class OrderCompletedListComponent implements OnInit {
  public modalLogistics: XcModalRef;//模态框
  public userInfo = JSON.parse(localStorage.getItem("UserInfo"));//销售人员信息
  public pagerData = new Pager();
  public loading: boolean = false;
  public default: boolean = false;
  public highSearchShow: boolean = false;
  public query;//查询条件
  public listSalesOrder: SalesOrderInfo[] = [];
  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute,
    private xcModalService: XcModalService,
    private windowService: WindowService,
    private orderCompletedService: OrderCompletedService
  ) { }

  initData() {
    this.orderCompletedService.getOrdersCompeltedList(this.query).subscribe(
      data => {
        if (data.Result) {
          let info = JSON.parse(data.Data);
          if (info) {
            this.listSalesOrder = info.ListSalesOrder;
            // console.info(info.ListSalesOrder);
            this.pagerData.set({
              total: parseInt(info.TotalCount),
              totalPages: parseInt(info.PageCount),
              pageNo: parseInt(info.CurrentPage)
            })
          }
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
        this.loading = false;
      }
    );
  }
  ngOnInit() {
    if (!this.userInfo) {
      this.windowService.confirm({ message: "当前登录信息失效，请重新登录!" }).subscribe({
        next: (v) => {
          if (v) {
            window.location.href = "/login";
          }
        }
      });
      return;
    }
    //邮寄地址
    this.modalLogistics = this.xcModalService.createModal(LogisticsInfoComponent);
    this.modalLogistics.onHide().subscribe((data) => {
      if (data) {
        console.info(2)
      }
    });
    this.query = {
      InputCondition: "",//合同单号,客户名称
      CreatedTimeStart: "",//申请开始时间
      CreatedTimeEnd: "",//申请结束时间
      CurrentPage: 1,//当前页
      PageSize: 10  //每页数据条数
    }
  }
  search() {
    this.initData();
  }
  reset() {
    this.query = {
      InputCondition: "",//合同单号,客户名称
      CreatedTimeStart: "",//申请开始时间
      CreatedTimeEnd: "",//申请结束时间
      CurrentPage: 1,//当前页
      PageSize: 10  //每页数据条数
    }
    this.initData();
  }
  getDelivery(item) {
    this.modalLogistics.show(item.ERPOrderCode);
  }
  onChangePager(e?: any) {
    this.query.CurrentPage = e.pageNo;
    this.query.PageSize = e.pageSize;
    this.initData();
  }
  contractView(item) {
    // window.open(dbomsPath + 'india/contractview?SC_Code=' + item.SC_Code);
  }
  salesOrderView(item) {
    let type = "normal";
    if (item.SalesType === 1) {
      type = "macao";
    } else if (item.SalesType === 2) {
      type = "others";
    }
    window.open(dbomsPath + 'order/order-view?SO_Code=' + item.SalesOrderID + '&type=' + type);
  }
}
