import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    TemporarysaveAppComponent,InWarehouseManageComponent,OutWarehouseManageComponent,
    InOrderFindComponent,OutOrderFindComponent,MaterielStockFindComponent,
    InnerWarehouseInfoFindComponent,TableManageComponent,WarehouseTransformComponent,
    FinanceTableComponent,NewApplyComponent,ApplyOrderInfoComponent,ContainerComponent
} from './index';

const temporarysaveRoutes: Routes = [
    {
      path: '', component: TemporarysaveAppComponent,
      children: [
        {path: '',data: { "breadcrumb": "入库管理" }, redirectTo: "inwarehousemanage"},
        {path: 'inwarehousemanage',data: { "breadcrumb": "入库管理" }, component: InWarehouseManageComponent },
        {path: 'outwarehousemanage',data: { "breadcrumb": "出库管理" }, component: OutWarehouseManageComponent,},
        {path: 'inorderfind', data: { "breadcrumb": "入库单查询" },component: InOrderFindComponent },
        {path: 'outorderfind',data: { "breadcrumb": "出库单查询" }, component: OutOrderFindComponent },
        {path: 'materielstockfind',data: { "breadcrumb": "物料库存查询" }, component: MaterielStockFindComponent },
        {path: 'innerwarehouseinfofind', data: { "breadcrumb": "在库明细查询" },component: InnerWarehouseInfoFindComponent  },
        {path: 'tablemanage',data: { "breadcrumb": "报表管理" }, component: TableManageComponent },
        {path: 'warehousetransform',data: { "breadcrumb": "库内转储" }, component: WarehouseTransformComponent  },                   
        {path: 'financetable',data: { "breadcrumb": "财务统计表" }, component: FinanceTableComponent  },                   
      ]
    },
    {
      path: '',component: ContainerComponent,
      children: [
        {path: 'newapply',data: { "breadcrumb": "新建入库申请" }, component: NewApplyComponent  },                   
        {path: 'applyorderinfo',data: { "breadcrumb": "订单详情" }, component: ApplyOrderInfoComponent  },
      ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(temporarysaveRoutes)],
    exports: [RouterModule]
})

export class TemporarysaveRoutingModule { };
