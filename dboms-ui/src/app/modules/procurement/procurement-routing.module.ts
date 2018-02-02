import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  ProcurementAppComponent, ProcurementApplyComponent, ProcurementOrderComponent,
  ProcurementOrderModifyComponent,
  ContainerComponent,
  ProcurementApplyMyApprovalComponent, ProcurementApplyMyApplyComponent,
  ProcurementOrderMyApplyComponent, ProcurementOrderMyApprovalComponent,
  ContractApplyNewComponent, ContractApplySubmitComponent, ContractApplyViewComponent,
  ProcurementOrderNewComponent, NBNewComponent, NBViewComponent,
  ProcurementTemplateList,ProcurementTemplateEdit,
  PrepareApplyNewComponent,PrepareApplySubmitComponent,PrepareApplyDealComponent,
  StockApplySubmitComponent,StockApplyDealComponent
} from './index';

const procurementRoutes: Routes = [
  {
    path: '', component: ProcurementAppComponent,
    children: [
      { path: '', data: { "breadcrumb": "" }, redirectTo: "procurement-apply" },
      {//采购申请
        path: 'procurement-apply', data: { "breadcrumb": "" }, component: ProcurementApplyComponent,
        children: [
          { path: '', redirectTo: "my-apply" },
          { path: 'my-apply', data: { "breadcrumb": "" }, component: ProcurementApplyMyApplyComponent },
          { path: 'my-approval', data: { "breadcrumb": "" }, component: ProcurementApplyMyApprovalComponent }
        ]
      },
      {//采购订单
        path: 'procurement-order', data: { "breadcrumb": "" }, component: ProcurementOrderComponent,
        children: [
          { path: '', redirectTo: "my-apply" },
          { path: 'my-apply', data: { "breadcrumb": "" }, component: ProcurementOrderMyApplyComponent },
          { path: 'my-approval', data: { "breadcrumb": "" }, component: ProcurementOrderMyApprovalComponent }
        ]
      },
      { path: 'procurement-orderModify', data: { "breadcrumb": "" }, component: ProcurementOrderModifyComponent },//采购订单修改
      { path: 'procurementTpl-list', data: { "breadcrumb": "" }, component: ProcurementTemplateList }//模板列表
    ]
  },
  {
    path: '', component: ContainerComponent,
    children: [
      //合同单采购申请
      { path: 'new-contractApply', data: { "breadcrumb": "" }, component: ContractApplyNewComponent },
      { path: 'submit-contractApply', data: { "breadcrumb": "" }, component: ContractApplySubmitComponent },
      { path: 'submit-contractApply/:id', data: { "breadcrumb": "" }, component: ContractApplySubmitComponent },
      { path: 'approval-contractapply', data: { "breadcrumb": "" }, component: ContractApplyViewComponent },
      { path: 'view-contractApply/:id', data: { "breadcrumb": "" }, component: ContractApplyViewComponent },

      //采购订单-NB类型
      { path: 'new-procurementOrder', data: { "breadcrumb": "" }, component: ProcurementOrderNewComponent },
      { path: 'new-NB', data: { "breadcrumb": "" }, component: NBNewComponent },
      { path: 'new-NB/:id', data: { "breadcrumb": "" }, component: NBNewComponent },
      { path: 'approval-nb', data: { "breadcrumb": "" }, component: NBViewComponent },
      { path: 'view-NB/:id', data: { "breadcrumb": "" }, component: NBViewComponent },

      //模板
      { path: 'procurementTpl-edit', data: { "breadcrumb": "" }, component: ProcurementTemplateEdit },
      { path: 'procurementTpl-edit/:id', data: { "breadcrumb": "" }, component: ProcurementTemplateEdit },

      //预下单采购申请
      { path: 'new-prepareApply', data: { "breadcrumb": "" }, component: PrepareApplyNewComponent },
      { path: 'submit-prepareApply', data: { "breadcrumb": "" }, component: PrepareApplySubmitComponent },
      { path: 'submit-prepareApply/:id', data: { "breadcrumb": "" }, component: PrepareApplySubmitComponent },
      { path: 'deal-prepareApply/:id', data: { "breadcrumb": "" }, component: PrepareApplyDealComponent },

      //备货采购申请
      { path: 'submit-stockApply', data: { "breadcrumb": "" }, component: StockApplySubmitComponent },
      { path: 'submit-stockApply/:id', data: { "breadcrumb": "" }, component: StockApplySubmitComponent },
      { path: 'deal-stockApply/:id', data: { "breadcrumb": "" }, component: StockApplyDealComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(procurementRoutes)],
  exports: [RouterModule]
})

export class procurementRoutingModule { };
