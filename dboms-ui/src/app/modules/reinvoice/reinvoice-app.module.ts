import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../shared/shared.module';
import { HttpServer } from '../../shared/services/db.http.server';
import { ReInvoiceRoutingModule } from "./reinvoice-routing.module";
import { ReInvoice_APP_COMPONENT } from "./components/index";
import { billBackService } from "./service/bill-back.service";
import { RedApplyService } from "./service/ri-red.service";
import { InvoiceQueryResultComponent } from "./components/invoice-query-result/invoice-query-result.component";

@NgModule({
    imports: [
        SharedModule,
        ReInvoiceRoutingModule
    ],
    declarations: [ ReInvoice_APP_COMPONENT ],
    providers: [ HttpServer, RedApplyService, billBackService ],
    entryComponents: [ InvoiceQueryResultComponent ]
})
export class ReInvoiceAppModule { }
