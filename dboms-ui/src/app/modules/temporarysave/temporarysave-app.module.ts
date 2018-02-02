// Angular Imports
import { NgModule } from '@angular/core';
import { TemporarysaveRoutingModule } from './temporarysave-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SelectModule } from 'ng2-select';
import { TEMPORARYSAVE_APP_COMPONENT } from './index';
import { HttpServer } from '../../shared/services/db.http.server';

@NgModule({
    imports: [
        SharedModule,
        TemporarysaveRoutingModule,
        SelectModule
    ],
    declarations: [
        TEMPORARYSAVE_APP_COMPONENT,
    ],
    providers: [  HttpServer]
})
export class TemporarysaveAppModule { }
