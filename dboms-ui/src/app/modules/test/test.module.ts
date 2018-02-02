import { NgModule } from '@angular/core';
import { TestRoutingModule } from './test-routing.module';
import { SharedModule } from 'app/shared/shared.module';

import { TEST_APP_COMPONENTS } from './index';
import { AddapplyComponent } from './components/addapply/addapply.component';
import { ApplyProgressComponent } from './components/apply-progress/apply-progress.component';
import { ApplyProgressStep1Component } from './components/apply-progress-step1/apply-progress-step1.component';
import { ApplyModulesComponent } from './components/apply-modules/apply-modules.component';
import { ApplyProgressStep2Component } from './components/apply-progress-step2/apply-progress-step2.component';
import { ApplyRedComponent } from './components/apply-red/apply-red.component';
import { MyapplyComponent } from './components/myapply/myapply.component';
import { MyapplyReadyComponent } from './components/myapply-ready/myapply-ready.component';



@NgModule({
  imports: [
    SharedModule,
    TestRoutingModule
  ],
  declarations: [
    TEST_APP_COMPONENTS,
    AddapplyComponent,
    ApplyProgressComponent,
    ApplyModulesComponent,
    ApplyProgressStep1Component,
    ApplyProgressStep2Component,
    ApplyRedComponent,
    MyapplyComponent,
    MyapplyReadyComponent,
  ]
})
export class TestModule { }
