import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemoListComponent,
  DemoContainerComponent,
  DemoNavComponent,
  DemoPageComponent,
  DemoEditComponent } from './index';

const routes: Routes = [
  {
    path: '', component: DemoContainerComponent,
    children: [
      { path: '', redirectTo: "list" },//默认页面
      { path: 'list', component: DemoListComponent },

      { path: 'view/:id', component: DemoPageComponent },
      { path: 'item', component: DemoEditComponent },
      { path: 'item/:id', component: DemoEditComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
