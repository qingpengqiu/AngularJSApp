import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    SupplierAppComponent,
    SupplierContainerComponent,
    SupplierManageComponent,
    SupplierMyApplyComponent,
    SupplierMyApprovalComponent,
    EditSupplierNewCreatSupplier
 
} from './index';

 const supplierRoutes: Routes = [
    {
      path: '', component: SupplierAppComponent,
      children: [//列表页面
        {path: '', redirectTo: "supplier-sm"},
        {path: 'supplier-sm',data: { "breadcrumb": "" }, component: SupplierManageComponent },
        {path: 'supplier-mApply',data: { "breadcrumb": "" }, component: SupplierMyApplyComponent},
        {path: 'supplier-mApproval', data: { "breadcrumb": "" },component: SupplierMyApprovalComponent }              
      ]
    },
    {
      path: '', component: SupplierContainerComponent,
      children: [//弹出页面
        {path: 'edit-supplier-ncs/:id',data: { "breadcrumb": ""},component: EditSupplierNewCreatSupplier},        
      ]
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(supplierRoutes)],
    exports: [RouterModule]
})

export class SupplierRoutingModule { };
