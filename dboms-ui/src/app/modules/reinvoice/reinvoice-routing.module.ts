import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReInvoiceComponent } from "./components/ri-list/ri-list.component";
import { RedApplyComponent } from "./components/red-apply/red-apply.component";
import { RedApproveComponent } from "./components/red-approve/red-approve.component";
const ReInvoicRoutes: Routes = [
    { path: '', redirectTo: 'ri-list' },
    { path: 'ri-list', data: { "breadcrumb": "" }, component: ReInvoiceComponent },
    { path: 'red-apply', data: { "breadcrumb": "" }, component: RedApplyComponent },
    { path: 'red-approve', data: { "breadcrumb": "" }, component: RedApproveComponent }
]

@NgModule({
    imports: [RouterModule.forChild(ReInvoicRoutes)],
    exports: [RouterModule]
})
export class ReInvoiceRoutingModule {};
