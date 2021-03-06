
import { ImageUploadComponent } from './widgets/image-upload.component';
import { UserImageComponent } from './widgets/user-image/user-image.component';
import { UserImageHeadComponent } from './widgets/user-image/user-image-head.component';
import { UserImageHoverComponent } from './widgets/user-image/user-image-hover.component';
import { IqBreadCrumbComponent } from './widgets/iq-breadcrumb.component';
import { IqNewCreatComponent } from './widgets/iq-newcreat.component';
import { IqRtWidgetComponent } from './widgets/iq-rt-widget.component';
import { IqDialogPersonSelectComponent } from './widgets/input-select/iq-dialog-person-select.component';
import { IqPersonSelectComponent } from './widgets/input-select/iq-person-select.component';
import { IqPopoverPersonSelectComponent } from './widgets/input-select/iq-popover-person-select.component';
import { PagerPageComponent,Pager } from './widgets/pager/iq-pager.component';
import { IqNavDropComponent } from './widgets/iq-nav-drop/iq-nav-drop.component';
import { SwitcherComponent } from "./widgets/switcher/switcher.component";
import { DatePickerComponent } from './widgets/datepicker/datepicker.component';
import { MyDatePickerComponent } from './widgets/my-datepicker/my-datepicker.component';

import { HeaderComponent } from './frame-components/header.component';
import { IqTlrFrameComponent } from './frame-components/iq-tlr-frame.component';
import { IqTbFrameComponent } from './frame-components/iq-tb-frame.component';
import { DbContentComponent } from './frame-components/db-content.component';
import { DbWfhistoryComponent } from './widgets/db-wfhistory/db-wfhistory.component';
import { DbWfviewComponent } from './widgets/db-wfview/db-wfview.component';
import { DbWfapprovalComponent } from './widgets/db-wfapproval/db-wfapproval.component';
import { DbWfadpComponent } from './widgets/db-wfadp/db-wfadp.component';

import { HeadtitleComponent } from './widgets/headtitle/headtitle.component';
import {PageErrorComponent} from "./page-components/page-error.component";
import {PageNotFoundComponent} from "./page-components/page-not-found.component";
import { FileUploadComponent } from './widgets/file-upload/file-upload.component';
import { LoadingComponent } from './widgets/loading/loading.component';
import { TabSwitchComponent } from './widgets/tab-switch/tab-switch.component';
import { PreparePersonComponent } from './widgets/prepare-person/prepare-person.component';
import { IqSelectComponent } from './widgets/iq-select/iq-select.component';
import { IqSelectDialogComponent } from './widgets/iq-select/iq-select-dialog.component';
import { IqDropdownComponent } from './widgets/iq-dropdown/iq-dropdown.component';

import { DefindexComponent } from './frame-components/defindex.component';

export let SHARED_ENTRY_COMPONENTS = [IqDialogPersonSelectComponent, IqSelectDialogComponent];

export { IqBreadCrumbComponent,IqNewCreatComponent, IqDialogPersonSelectComponent,
IqPersonSelectComponent, ImageUploadComponent,UserImageComponent,UserImageHeadComponent,UserImageHoverComponent,
HeaderComponent, IqTlrFrameComponent,IqPopoverPersonSelectComponent,
IqTbFrameComponent, IqRtWidgetComponent,
PageErrorComponent, PageNotFoundComponent,
PagerPageComponent,Pager,IqNavDropComponent,SwitcherComponent, DbContentComponent,
DatePickerComponent, MyDatePickerComponent,
DbWfhistoryComponent, DbWfviewComponent, DbWfapprovalComponent,
HeadtitleComponent, DbWfadpComponent,FileUploadComponent,LoadingComponent,TabSwitchComponent,PreparePersonComponent,IqSelectComponent,DefindexComponent};

export let SHARED_COMPONENTS = [IqBreadCrumbComponent,IqNewCreatComponent, IqDialogPersonSelectComponent,
  IqPersonSelectComponent, ImageUploadComponent,UserImageComponent,UserImageHeadComponent,UserImageHoverComponent
  , HeaderComponent, IqTlrFrameComponent, IqPopoverPersonSelectComponent, IqSelectComponent, IqSelectDialogComponent,
  IqTbFrameComponent, IqRtWidgetComponent,
  PageErrorComponent, PageNotFoundComponent,
  PagerPageComponent,IqNavDropComponent,SwitcherComponent,DbContentComponent,DatePickerComponent,MyDatePickerComponent,DbWfhistoryComponent,
  DbWfviewComponent, DbWfapprovalComponent, HeadtitleComponent, DbWfadpComponent,FileUploadComponent,LoadingComponent,TabSwitchComponent,PreparePersonComponent,DefindexComponent,IqDropdownComponent];
