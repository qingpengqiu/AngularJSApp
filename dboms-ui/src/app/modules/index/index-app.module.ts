import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { IndexRoutingModule } from './index-routing.module';
import { INDEX_APP_COMPONENT } from './component/index';

@NgModule({
    imports: [
      SharedModule,
      IndexRoutingModule
    ],
    declarations: [
      INDEX_APP_COMPONENT
    ],
    entryComponents:[],
    providers: []
})
export class IndexAppModule { }
