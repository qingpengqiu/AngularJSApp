import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  IndexAppComponent, IndexSalesComponent
} from './index';

const INDEX_ROUTES: Routes = [
  {
    path: '', component: IndexAppComponent,
    children: [
      {path: '', data: {breadcrumb: '销售员首页'}, redirectTo: 'index-sales'},
      {path: 'index-sales', component: IndexSalesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(INDEX_ROUTES)],
  exports: [RouterModule]
})
export class IndexRoutingModule {};
