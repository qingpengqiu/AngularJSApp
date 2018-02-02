import { NgModule } from '@angular/core';
import { DemoRoutingModule } from './demo-routing.module';
import { SharedModule } from 'app/shared/shared.module';

import { DEMO_APP_COMPONENTS,
  DEMO_APP_DIRECTIVES,
  DEMO_APP_PIPES,
  DEMO_APP_PROVIDERS } from './index';


@NgModule({
  imports: [
    SharedModule,
    DemoRoutingModule
  ],
  declarations: [
    DEMO_APP_COMPONENTS,
    DEMO_APP_DIRECTIVES,
    DEMO_APP_PIPES
  ],
  providers: [DEMO_APP_PROVIDERS]
})
export class DemoAppModule { }
