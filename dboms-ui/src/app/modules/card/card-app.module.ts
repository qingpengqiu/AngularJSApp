import { NgModule } from '@angular/core';
import { CardRoutingModule } from './card-routing.module';
import { SharedModule } from 'app/shared/shared.module';

import { CARD_APP_COMPONENTS } from './index';



@NgModule({
  imports: [
    SharedModule,
    CardRoutingModule
  ],
  declarations: [
    CARD_APP_COMPONENTS,
  ],
  providers: []
})
export class CardAppModule { }
