// Angular Imports
import { NgModule } from '@angular/core';
import { procurementRoutingModule } from './procurement-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SelectModule } from 'ng2-select';
import { PROCUREMENT_APP_COMPONENT,PROCUREMENT_APP_ENTRY_COMPONENT } from './index';
import { HttpServer } from '../../shared/services/db.http.server';
import { PROCUREMENT_PROVIDERS } from './services/index';
// import { rotateDirective } from './rotateDirective.directive';
import { PROCUREMENT_DIRECTIVES } from './directives/index';

@NgModule({
    imports: [
        SharedModule,
        procurementRoutingModule,
        SelectModule     
    ],
    declarations: [
        PROCUREMENT_APP_COMPONENT,
        PROCUREMENT_DIRECTIVES
        // ,rotateDirective
    ],
    entryComponents:[PROCUREMENT_APP_ENTRY_COMPONENT],
    providers: [
        HttpServer,
        PROCUREMENT_PROVIDERS
    ]
})
export class ProcurementAppModule { }
