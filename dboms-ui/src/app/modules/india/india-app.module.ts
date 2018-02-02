import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../shared/shared.module';
import { HttpServer } from '../../shared/services/db.http.server';
import { IndiaRoutingModule } from "./india-routing.module";
import { India_APP_COMPONENT } from './components/index';
import { India_APP_ENTRY_COMPONENT } from './components/index';
import { ScService } from "./service/sc-service";
import { ScSelectService } from "./service/sc-selecttpl.service";
import { PageRefresh } from "./service/pagerefresh.service";

@NgModule({
    imports: [
        SharedModule,
        IndiaRoutingModule
    ],
    declarations: [ India_APP_COMPONENT ],
    entryComponents:[India_APP_ENTRY_COMPONENT],
    providers: [ HttpServer,ScService,ScSelectService, PageRefresh ]
})
export class IndiaAppModule { }
