import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemoListComponent, DemoPageComponent,
  DemoRootComponent, DemoIndexComponent,
  ToastyPageComponent, IcheckPageComponent,
  PublicServicePageComponent, PagerPageComponent,
  TestPageComponent,PageStyleComponent,
  ImageUploadPageComponent,
  ModalPageComponent,TabSwitchDemoComponent,PreparePersonDemoComponent,
  DemoContainerComponent,WindowComponent,StaticResourceComponent,StaticResourceComponent2,StaticResourceComponent3,UserImagePageComponent,DatepickerDemoComponent,PipesPageComponent,IqSelectDemoComponent} from './index';

import { IqTlrFrameComponent } from 'app/shared/components/frame-components/iq-tlr-frame.component';

import { MyCardComponent, MyApplyComponent, MyNewApplyComponent, MySearchComponent } from './components/widgets/page-style/index';

const routes: Routes = [
    { path: '', component: DemoRootComponent, outlet: 'left' },
    {
      path: '', component: DemoContainerComponent,
      children: [
        { path: '', redirectTo:"index" },
        { path: 'index', data:{"breadcrumb":"首页"}, component: DemoIndexComponent },
        {
          path: 'app',data:{"breadcrumb":"应用"},
          children: [
            { path: 'list',data:{"breadcrumb":"列表"}, component: DemoListComponent },
            { path: 'item/:id',data:{"breadcrumb":"?"}, component: DemoPageComponent }
          ]
        },
        {
          path: "widget",data:{"breadcrumb":"组件"},
          children: [
            { path: 'toasty', component: ToastyPageComponent },
            { path: 'pipes', component: PipesPageComponent },

            { path: 'icheck',data:{"breadcrumb":"icheck"}, component: IcheckPageComponent },
            { path: 'public-service', component: PublicServicePageComponent },
            { path: 'pager',data:{"breadcrumb":"分页?"}, component: PagerPageComponent },
            { path: 'image-upload', component: ImageUploadPageComponent },
            { path: 'confirm', component: WindowComponent },
            { path: 'test',component:TestPageComponent},
            { path: 'static-resource',component:StaticResourceComponent},
            { path: 'static-resource2',component:StaticResourceComponent2},
            { path: 'static-resource3',component:StaticResourceComponent3},
            { path: 'user-image',component:UserImagePageComponent},
            { path: 'datepicker',component:DatepickerDemoComponent},
            { path: 'modal',data:{'breadcrumb':'浮动层'},component:ModalPageComponent},
            { path: 'tab-switch',data:{'breadcrumb':'tab切换'},component:TabSwitchDemoComponent},
            { path: 'prepare-person',data:{'breadcrumb':'预备选人'},component:PreparePersonDemoComponent},
            { path: 'iq-select',component: IqSelectDemoComponent},
            { path: 'page-style', component: PageStyleComponent,
              children: [
                { path: 'my-card', component: MyCardComponent},
                { path: 'my-apply', component: MyApplyComponent},
                { path: 'my-new-apply', component: MyNewApplyComponent},
                { path: 'my-search', component: MySearchComponent}
              ]
            }
          ]
        }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRoutingModule { }
