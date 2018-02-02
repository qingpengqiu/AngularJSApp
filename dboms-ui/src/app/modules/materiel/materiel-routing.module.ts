import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  MaterielAppComponent,
  MaterielContainerComponent,
  MaterielCommonlyComponent,
  MaterielDataModifyComponent,
  ReturnServiceComponent,
  MaterielApplyTemplateComponent,
  ExtendPlatformComponent,
  ExtendMaterielComponent,
  BatchCreateMaterielComponent,
  MaterielChangeComponent,  
  CreateNewMaterielComponent, 
  MaterielDataModifyMyApplyComponent,
  MaterielDataModifyMyApprovalComponent,
  EditMaterielDataModifyComponent,
  EditMaterielNewReturnService,
  EditSeeReturnServiceComponent,
  EditMaterielExtendMaterielComponent,
  EditSeeCommonlyMateriel,
  MaterielChangeMyApplyComponent,
  MaterielChangeMyApprovalComponent,
  EditNewMaterielChangeComponent,
  EditApprovalMaterielChangeComponent
} from './index';

 const materielRoutes: Routes = [
    {
      path: '', component: MaterielAppComponent,
      children: [
        {path: '',data: { "breadcrumb": "" }, redirectTo: "m-c"},
        {path: 'm-c',data: { "breadcrumb": "" }, component: MaterielCommonlyComponent },
        {path: 'm-dm',data: { "breadcrumb": "" }, component: MaterielDataModifyComponent,
          children:[
            {path: '', redirectTo: "my-apply/a"},
            {path: 'my-apply/:id',data: { "breadcrumb": "" }, component: MaterielDataModifyMyApplyComponent},
            {path: 'my-approval/:id',data: { "breadcrumb": "" }, component: MaterielDataModifyMyApprovalComponent}
          ]
        },
        {path: 'm-rs', data: { "breadcrumb": "" },component: ReturnServiceComponent },
        {path: 'm-at',data: { "breadcrumb": "" }, component: MaterielApplyTemplateComponent },
        {path: 'm-ep',data: { "breadcrumb": "" }, component: ExtendPlatformComponent },
        {path: 'm-em', data: { "breadcrumb": "" },component: ExtendMaterielComponent  },
        {path: 'm-bcm',data: { "breadcrumb": "" }, component: BatchCreateMaterielComponent },
        {path: 'm-cm',data: { "breadcrumb": "" }, component: MaterielChangeComponent,
          children:[
            {path: '', redirectTo: "my-apply/a"},
            {path: 'my-apply/:id',data: { "breadcrumb": "" }, component: MaterielChangeMyApplyComponent},
            {path: 'my-approval/:id',data: { "breadcrumb": "" }, component: MaterielChangeMyApprovalComponent}
          ]
      }                   
      ]
    },
    {
      path: '', component: MaterielContainerComponent,
      children: [
        {path: 'edit-newMateriel/:id',data: { "breadcrumb": "" },component: CreateNewMaterielComponent},
        {path: 'edit-data/:id', data: { "breadcrumb": "" }, component: EditMaterielDataModifyComponent},
        {path: 'edit-nrs/:id', data: { "breadcrumb": "" }, component: EditMaterielNewReturnService},
        {path: 'edit-srs/:id', data: { "breadcrumb": "" }, component: EditSeeReturnServiceComponent},
        {path: 'edit-scm/:id', data: { "breadcrumb": "" }, component: EditSeeCommonlyMateriel},
        {path: 'edit-extendMateriel/:id', data: { "breadcrumb": "" }, component: EditMaterielExtendMaterielComponent},
        {path: 'edit-nmc/:id', data: { "breadcrumb": "" }, component: EditNewMaterielChangeComponent},
        {path: 'edit-amc/:id', data: { "breadcrumb": "" }, component: EditApprovalMaterielChangeComponent}
      ]
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(materielRoutes)],
    exports: [RouterModule]
})

export class MaterielRoutingModule { };
