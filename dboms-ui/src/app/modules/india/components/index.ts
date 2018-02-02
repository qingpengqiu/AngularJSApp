import { IndiaMainComponent } from './india-main/india-main.component';
import { ScListComponent } from './sc-list/sc-list.component';
import { ScCreatComponent } from './sc-creat/sc-creat.component';
import { ScSelecttplComponent } from './sc-selecttpl/sc-selecttpl.component';
import { ScUploadComponent } from './sc-creat/sc-accessory/sc-upload.component';
import { ScAccessoryComponent } from './sc-creat/sc-accessory/sc-accessory.component';
import { ScSealsComponent } from './sc-creat/sc-seals/sc-seals.component';
import { scSealsAddComponent } from './sc-creat/sc-seals/add-seals.component';
import { ScApproverComponent } from './sc-creat/sc-approver/sc-approver.component';
import { ScViewComponent } from './sc-view/sc-view.component';
import { ScWfApprovalComponent } from './sc-wf-approval/sc-wf-approval.component';
import { ProductdetailComponent } from "./ectemplates/common/productdetail/productdetail.component";
import { HardwareGeneralComponent } from "./ectemplates/compnents/hardwaregeneral/hardwaregeneral.component";
import { HardwareChinaThree } from "./ectemplates/compnents/hardchinathree/hardchinathree.component";
import { SoftwareStandardComponent } from "./ectemplates/compnents/softwarestandard/softwarestandard.component";
import { SoftwareMicroComponent } from "./ectemplates/compnents/softwaremicro/softwaremicro.component";
import { SoftwareAdobeComponent } from "./ectemplates/compnents/softwareadobe/softwareadobe.component";

export let India_APP_COMPONENT = [
    IndiaMainComponent, ScListComponent, ScCreatComponent, ScSelecttplComponent,
    HardwareGeneralComponent, HardwareChinaThree, SoftwareStandardComponent, ProductdetailComponent, ScUploadComponent, ScAccessoryComponent,
    ScSealsComponent, scSealsAddComponent, ScApproverComponent, ScViewComponent, ScWfApprovalComponent, SoftwareMicroComponent,
    SoftwareAdobeComponent

];
export let India_APP_ENTRY_COMPONENT = [//entryComponents
    scSealsAddComponent
];
