import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { WindowService } from 'app/core';
import { Pager, XcModalService, XcModalRef } from 'app/shared/index';
import * as moment from 'moment';

export class PageNo { }

import {
  AdvancesInfo, QueryAdvances,
  OrderCreateService
} from './../../../services/order-create.service';

@Component({
  templateUrl: './select-advance.component.html',
  styleUrls: ['./select-advance.component.scss']
})
export class SelectAdvanceComponent implements OnInit {
  public modal: XcModalRef;
  public loading: boolean = true;//加载中
  public submitOnce: boolean;
  public pagerData = new Pager();
  public advancesList: AdvancesInfo[] = [];//合同列表数据
  public query: QueryAdvances = new QueryAdvances();//搜索条件
  public SalesAmountTotal;//销售单总金额

  public fullChecked = false;//全选状态
  public fullCheckedIndeterminate = false;//半选状态
  public advanceAmount: number = 0;//预收款总金额
  public defauls: boolean = false;//暂无相关数据
  constructor(
    private router: Router,
    private routerInfo: ActivatedRoute,
    private xcModalService: XcModalService,
    private windowService: WindowService,
    private orderCreateService: OrderCreateService
  ) { }
  //初始化数据
  initData() {
    this.loading = true;
    this.query.StartDate = moment(this.query.StartDate).format("YYYY-MM-DD");
    this.query.EndDate = moment(this.query.EndDate).format("YYYY-MM-DD");
    this.fullChecked = false;//全选状态
    this.fullCheckedIndeterminate = false;//半选状态
    this.orderCreateService.getAdvancesData(this.query).subscribe(
      data => {
        if (data.Result) {
          if (data.Data) {
            let info = JSON.parse(data.Data);
            this.advancesList = info["ListPrepayment"];
            if (!info["ListPrepayment"] || info["ListPrepayment"].length == 0) {
              this.defauls = true;
            } else {
              this.defauls = false;
            }
          } else {
            this.defauls = true;
            this.advancesList = [];
            // this.windowService.alert({ message: data.Message, type: "fail" });
          }
        } else {
          this.defauls = true;
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
        this.query.StartDate = moment().subtract(30, 'days').calendar();
        this.query.EndDate = new Date();
        this.SalesAmountTotal = data["SalesAmountTotal"];
        this.query = {
          StartDate: this.query.StartDate,
          EndDate: this.query.EndDate,
          isACustomer: this.query.isACustomer || false,
          SalesOrderID: data["SalesOrderID"],
          CustomerERPCode: data["CustomerERPCode"],
          CompanyCode: data["CompanyCode"],
          CurrentPage: "1",
          PageSize: "10"
        };
        if (data["CustomerERPCode"] == "A" || data["CustomerERPCode"] == "ALY") {
          this.query.isACustomer = true;
        }
        this.initData();
      }
    })
  }

  //关闭弹出框
  hide(data?: any) {
    this.modal.hide(data);
  }


  search() {
    this.initData();
  }

  public currentPageSize;//当前每页显示条数
  public initChange = true;
  onChangePage(e: any) {
    //   if(this.initChange){
    //       this.initChange = false;
    //       return ;
    //   }
    //   //非第一页，切换条数。跳为第一页
    //   if(this.currentPageSize != e.pageSize){
    //       this.pagerData.pageNo = 1;
    //   }
    //   this.currentPageSize = e.pageSize
    //
    //   this.query.name = this.query.name || "";
    //   this.query.currage = e.pageNo;
    //   this.query.pagesize = e.pageSize;
    //   this.initData(this.query);
  }
  //预收款总金额计算
  advanceSelected() {
    let selectedList = this.advancesList.filter(item => item.checked == true);
    let amount = 0;
    selectedList.forEach(function(item, i) {
      amount += item.AMOUNT;
    })
    this.advanceAmount = amount;
  }
  //保存数据
  save() {
    let selectedList = this.advancesList.filter(item => item.checked == true);
    //选择预收款为0，点击确定
    if (selectedList.length == 0) {
      if (this.advancesList.length > 0) {
        this.windowService.alert({ message: "请选择预收款", type: "fail" });
      } else {
        this.hide()
      }
      return;
    }
    let params = {
      ListPrepayment: selectedList,
      SalesOrderID: this.query.SalesOrderID
    }
    this.orderCreateService.saveAdvancesData(params).subscribe(
      data => {
        if (data.Result) {
          this.windowService.alert({ message: "预收款选择成功！", type: "fail" });
          this.modal.hide(this.advanceAmount);
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      }
    );
  }

  //检查是否全选
  CheckIndeterminate(v) {
    this.fullCheckedIndeterminate = v;
  }

  getDate(e?) {
    // console.info(e)
  }
  //删除预收款
  delPrepanyment(item?, i?) {
    let params = {
      "AMOUNT": item.AMOUNT,
      "SHEET_NO": item.SHEET_NO,
      "BUZEI": item.BUZEI,
      "SalesOrderID": this.query.SalesOrderID
    };
    let advancesList = this.advancesList;
    this.orderCreateService.delAdvancesData(params).subscribe(
      data => {
        if (data.Result) {
          advancesList.slice(i, 1);
        } else {
          this.windowService.alert({ message: data.Message, type: "fail" });
        }
      }
    );
    this.advancesList = advancesList;
  }
  toNewPage() {
    window.open("http://10.1.128.136/")
  }
}
