// Angular Imports
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SelectModule } from 'ng2-select';
import { HttpServer } from '../../shared/services/db.http.server';

import { SUPPLIER_APP_COMPONENT,SUPPLIER_APP_ENTRY_COMPONENT } from "./index";

import { SupplierRoutingModule } from "./supplier-routing.module";//引入内部路由
import { SupplierService } from "./services/supplier.service";//


@NgModule({
  imports: [
    SharedModule,
    SelectModule,
    SupplierRoutingModule
  ],
  declarations: [
    SUPPLIER_APP_COMPONENT,
  ],
  entryComponents:[SUPPLIER_APP_ENTRY_COMPONENT],
  providers: [
    HttpServer,
    SupplierService
  ]
})
export class SupplierAppModule { }
