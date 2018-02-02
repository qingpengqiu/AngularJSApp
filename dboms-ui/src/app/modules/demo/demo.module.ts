import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SharedModule } from 'app/shared/shared.module';

import { DemoRoutingModule } from './demo-routing.module';
//
// import { DemoListComponent } from './components/demo-list.component';
// import { DemoPageComponent } from './components/demo-page.component';

import { DemoService } from './services/demo.service';
import { DEMO_APP_COMPONENTS,DEMO_ENTRY_COMPONENTS } from './index';
// import { TreeModule } from 'primeng/primeng';
// import { IcheckDirective } from './directives/jquery-demo.directive'
import { PAGE_STYLE } from './components/widgets/page-style/index';

import { UserImagePageComponent } from './components/widgets/user-image/user-image-page.component';
import { HoverPageComponent } from './components/widgets/user-image/hover-page.component';

@NgModule({
  imports: [
    SharedModule,
    DemoRoutingModule
  ],
  //引入组件
  declarations: [DEMO_APP_COMPONENTS, PAGE_STYLE,UserImagePageComponent,HoverPageComponent],
  bootstrap: [UserImagePageComponent],
  entryComponents:[DEMO_ENTRY_COMPONENTS,HoverPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  //引入服务
  providers: [DemoService]
})
export class DemoModule { }
