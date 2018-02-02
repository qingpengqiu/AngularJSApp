import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {TestContainerComponent} from './components/test-container.component';
import {TestPageComponent} from './index';
import {TestMainComponent} from './index';
import {TestAddComponent} from './index';
import {TestAlertComponent} from './index';
import {TestMainDefaultComponent} from './index';

import {AddapplyComponent} from './components/addapply/addapply.component';
import {ApplyProgressComponent} from './components/apply-progress/apply-progress.component';
import {ApplyProgressStep1Component} from './components/apply-progress-step1/apply-progress-step1.component';
import {ApplyProgressStep2Component} from './components/apply-progress-step2/apply-progress-step2.component';
import {ApplyRedComponent} from './components/apply-red/apply-red.component';
import {MyapplyComponent} from './components/myapply/myapply.component';
import {MyapplyReadyComponent} from './components/myapply-ready/myapply-ready.component'

const routes: Routes = [
    {
        path: '', component: TestContainerComponent,
        children: [
            {path: '', redirectTo: "index"},
            {path: 'index', data: {"breadcrumb": "测试"}, component: TestPageComponent},
            {path: 'main', data: {"breadcrumb": "首頁"}, component: TestMainComponent},
            {path: 'addApply', data: {"breadcrumb": "新建"}, component: AddapplyComponent},
            {path: 'addApply-progress', data: {"breadcrumb": "新建"}, component: ApplyProgressComponent},
            {path: 'addApply-progress-step', data: {"breadcrumb": "新建"}, component: ApplyProgressStep1Component},
            {path: 'addApply-progress-step2', data: {"breadcrumb": "新建"}, component: ApplyProgressStep2Component},
            {
                path: 'addApply-red', component: ApplyRedComponent, children: [
                {path: 'myapply', component: MyapplyComponent},
                {path: 'myapply-ready', component: MyapplyReadyComponent},
            ]
            },
            {path: 'add', data: {"breadcrumb": "新建"}, component: TestAddComponent},
            {path: 'alertcont', data: {"breadcrumb": "发票号"}, component: TestAlertComponent},
            {path: 'default', data: {"breadcrumb": "发票号"}, component: TestMainDefaultComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TestRoutingModule {
}
