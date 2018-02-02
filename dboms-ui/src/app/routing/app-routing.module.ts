import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeModule } from '../modules/base/home/home.module';

import {
  PageErrorComponent,
  PageNotFoundComponent,
  HeaderComponent, IqTlrFrameComponent,
  IqTbFrameComponent, DbContentComponent,DefindexComponent
} from 'app/shared/components/index';

import { PopoverModule } from 'ng2-bootstrap';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [

  { path: '', component: DefindexComponent},
  {
    path: "login", data: { "breadcrumb": "登陆" },
    loadChildren: "app/modules/base/login/login.module#LoginModule"
  },

  {
    // path: '', component: IqTbFrameComponent,
    path: '', data: { "breadcrumb": "首页" }, component: IqTlrFrameComponent,
    children: [
      {
        path: 'demo', data: { "breadcrumb": "demo" },
        loadChildren: 'app/modules/demo/demo.module#DemoModule'
        // ,outlet:'right'
      },
      {
        path: 'demo-app',
        loadChildren: 'app/modules/demo-app/demo-app.module#DemoAppModule'
      },
      {
        path: 'card', data: { "breadcrumb": "名片申请" },
        loadChildren: 'app/modules/card/card-app.module#CardAppModule'
      },
      {
        path: 'apptpl', data: { "breadcrumb": "应用模板" },
        loadChildren: 'app/modules/apptpl/apptpl.module#ApptplModule'
      }
    ]
  },
  {
    path: 'test',
    loadChildren: 'app/modules/test/test.module#TestModule'
  },
  {//暂存routere
    path: 'temporarysave', component: IqTbFrameComponent,
    loadChildren: 'app/modules/temporarysave/temporarysave-app.module#TemporarysaveAppModule'
  },
  {
    path: '', component: IqTbFrameComponent,
    children: [
      {
        path: 'index', data: { "breadcrumb": "首页" },
        loadChildren: 'app/modules/index/index-app.module#IndexAppModule'
      },
      {
        path: 'bill', data: { "breadcrumb": "冲红" },
        loadChildren: 'app/modules/bill/bill-app.module#BillAppModule'
      },
      {
        path: 'reinvoice', data: { "breadcrumb": "冲红退换货" },
        loadChildren: 'app/modules/reinvoice/reinvoice-app.module#ReInvoiceAppModule'
      },
      {
        path: 'borrow', data: { "breadcrumb": "借用管理" },
        loadChildren: 'app/modules/borrow/borrow-app.module#BorrowAppModule'
      },
      {
        path: 'invoice', data: { "breadcrumb": "票据管理" },
        loadChildren: 'app/modules/invoice/invoice-app.module#InvoiceAppModule'
      },
      {
        path: "mate", data: { "breadcrumb": "物料" },
        loadChildren: 'app/modules/materiel/materiel-app.module#MaterielAppModule'
      },
      {
        path: 'india', data: { "breadcrumb": "用印管理" },
        loadChildren: 'app/modules/india/india-app.module#IndiaAppModule'
      },
      {
        path: 'procurement', data: { "breadcrumb": "采购管理" },
        loadChildren: 'app/modules/procurement/procurement-app.module#ProcurementAppModule'
      },
      {
        path: "order", data: { "breadcrumb": "销售管理" }, 
        loadChildren: 'app/modules/order/order-app.module#OrderAppModule'
      },
      {
        path: 'supplier',
        loadChildren: 'app/modules/supplier/supplier-app.module#SupplierAppModule'
      }
    ]
  },
  {
    path: '', component: DbContentComponent,
    children: [
      {
        path: 'contpl',
        loadChildren: 'app/modules/contracttemplate/contpl-app.module#ContplAppModule'
      }
    ]
  },
  {
    path: '', component: IqTbFrameComponent,
    // path: '', component: IqTlrFrameComponent,
    children: [
      {
        path: 'demo-app2',
        loadChildren: 'app/modules/demo-app/demo-app.module#DemoAppModule'
      }
    ]
  }, {
    path: 'demo-app3',
    loadChildren: 'app/modules/demo-app/demo-app.module#DemoAppModule'
  },
  {
    path: '500', component: IqTbFrameComponent,
    children: [
      { path: '', component: PageErrorComponent }
    ]
  },
  {
    path: '**', component: IqTbFrameComponent,
    children: [
      { path: '', component: PageNotFoundComponent }
    ]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeModule,
    PopoverModule.forRoot()
  ],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
