// Angular Imports
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SelectModule } from 'ng2-select';
import { HttpServer } from '../../shared/services/db.http.server';

import { Materiel_APP_COMPONENT, MATERIEL_APP_ENTRY_COMPONENT } from "./index";

import { MaterielRoutingModule } from "./materiel-routing.module";//引入内部路由

import { SelectSearchService } from './services/select-search.service';
import { MaterielDataModifyService } from './services/materiel-dataModify.service';
import { MaterielExtendPlatService } from './services/materiel-extendPlat.service';
import { MaterielTemplateService } from './services/materiel-template.service';
import { MaterielExtendMaterielService } from './services/materiel-extendMateriel.service';
import { CommonlyMaterielAndReturnService } from "./services/materiel-commonlyMateriel&return.service";
import {MaterielChangeService } from "./services/materiel-materielChange.service";

import { MaterielApplyStatusPipe } from "./pipes/materiel-applyStatus.pipe";//自定义申请状态管道
import { MaterielExtendTypePipe } from './pipes/materiel-extendType.pipe';
import { MaterielDataModifyPipe } from "./pipes/materiel-dataModify.pipe";

@NgModule({
  imports: [
    SharedModule,
    SelectModule,
    MaterielRoutingModule
  ],
  declarations: [
    Materiel_APP_COMPONENT,
    MaterielApplyStatusPipe,
    MaterielExtendTypePipe,
    MaterielDataModifyPipe
  ],
  entryComponents:[MATERIEL_APP_ENTRY_COMPONENT],
  providers: [
    HttpServer,
    SelectSearchService,
    MaterielDataModifyService,
    MaterielExtendPlatService,
    MaterielTemplateService,
    MaterielExtendMaterielService,
    CommonlyMaterielAndReturnService,
    MaterielChangeService
  ]
})
export class MaterielAppModule { }
