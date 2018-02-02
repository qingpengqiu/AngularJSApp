import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndiaMainComponent } from './components/india-main/india-main.component';
import { ScListComponent } from './components/sc-list/sc-list.component';
import { ScSelecttplComponent } from './components/sc-selecttpl/sc-selecttpl.component';
import { ScCreatComponent } from './components/sc-creat/sc-creat.component';
import { ScViewComponent } from './components/sc-view/sc-view.component';
import { HardwareGeneralComponent } from "./components/ectemplates/compnents/hardwaregeneral/hardwaregeneral.component";
import { HardwareChinaThree } from "./components/ectemplates/compnents/hardchinathree/hardchinathree.component";
import { SoftwareStandardComponent } from "./components/ectemplates/compnents/softwarestandard/softwarestandard.component";
import { SoftwareMicroComponent } from "./components/ectemplates/compnents/softwaremicro/softwaremicro.component";
import { SoftwareAdobeComponent } from "./components/ectemplates/compnents/softwareadobe/softwareadobe.component";

const IndiaRoutes: Routes = [
    { path :'', data:{'breadcrumb':''}, component: IndiaMainComponent,
      children: [
          { path :'', redirectTo: 'sclist' },
          {path :'sclist', component: ScListComponent}
      ]
    },
    {  path :'selecttpl',data:{'breadcrumb':''}, component: ScSelecttplComponent },
    {  path :'contract',data:{'breadcrumb':''}, component:  ScCreatComponent},
    {  path :'contractview',data:{'breadcrumb':''}, component:  ScViewComponent},
    {  path :'tplmake',data:{'breadcrumb':''}, component: HardwareGeneralComponent },
    {  path :'hchinathree',data:{'breadcrumb':''}, component: HardwareChinaThree },
    {  path :'softwarestandard',data:{'breadcrumb':''}, component: SoftwareStandardComponent },
    {  path :'softwaremicro',data:{'breadcrumb':''}, component: SoftwareMicroComponent },
    {  path :'softwareadobe',data:{'breadcrumb':''}, component: SoftwareAdobeComponent }
]

@NgModule({
    imports: [RouterModule.forChild(IndiaRoutes)],
    exports: [RouterModule]
})
export class IndiaRoutingModule {};
