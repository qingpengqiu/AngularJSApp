import { DemoListComponent } from './demo-list.component';
import { DemoRootComponent } from './demo-root.component';
import { DemoPageComponent } from './demo-page.component';
import { DemoIndexComponent } from './demo-index.component';
import { ToastyPageComponent } from './widgets/toasty/toasty-page.component';
import { IcheckPageComponent } from './widgets/icheck/icheck-page.component';
import { PublicServicePageComponent } from './widgets/public-service/public-service-page.component';
import { PagerPageComponent } from './widgets/pager/pager-page.component';
import { ImageUploadPageComponent } from './widgets/image-upload/image-upload-page.component';
import { DemoContainerComponent } from './demo-container.component';
import { WindowComponent } from './widgets/window/window.component';
import { StaticResourceComponent } from './widgets/static-resource/static-resource.component';
import { StaticResourceComponent2 } from './widgets/static-resource2/static-resource2.component';
import { StaticResourceComponent3 } from './widgets/static-resource3/static-resource3.component';
import { UserImagePageComponent } from './widgets/user-image/user-image-page.component';
import { DatepickerDemoComponent } from './widgets/datepicker/demo-detepicker.component';
import { PageStyleComponent } from './widgets/page-style/page-style.component';
import { PipesPageComponent } from './widgets/pipes/pipes-page.component';
import { ModalPageComponent,ModalPageModal1Component,ModalPageModal2Component } from './widgets/modal/modal-page.component';
import { TabSwitchDemoComponent } from './widgets/tab-switch/demo-tab-switch.component';
import { PreparePersonDemoComponent } from './widgets/prepare-person/demo-prepare-person.component';
import { IqSelectDemoComponent } from './widgets/iq-select/iq-select.component';

import { TestPageComponent } from './widgets/test/test.component';


export let DEMO_ENTRY_COMPONENTS = [ModalPageModal1Component,ModalPageModal2Component];

export { PageStyleComponent,TestPageComponent,ModalPageComponent,DemoListComponent,DemoRootComponent,
    DemoPageComponent,DemoIndexComponent,ToastyPageComponent,IcheckPageComponent,PublicServicePageComponent,
    PagerPageComponent,ImageUploadPageComponent,DemoContainerComponent,WindowComponent,
    StaticResourceComponent,StaticResourceComponent2,StaticResourceComponent3,UserImagePageComponent,
    DatepickerDemoComponent,PipesPageComponent,TabSwitchDemoComponent,PreparePersonDemoComponent,IqSelectDemoComponent};

// export declare const DEMO_APP_COMPONENTS:(typeof DemoListComponent | typeof DemoContainerComponent | typeof DemoNavComponent | typeof DemoPageComponent | typeof DemoEditComponent )
export let DEMO_APP_COMPONENTS = [
    PageStyleComponent,TestPageComponent,ModalPageComponent,ModalPageModal1Component,
    ModalPageModal2Component,DemoListComponent,DemoRootComponent,DemoPageComponent,
    DemoIndexComponent,ToastyPageComponent,IcheckPageComponent,PublicServicePageComponent,
    PagerPageComponent,ImageUploadPageComponent,DemoContainerComponent,WindowComponent,
    StaticResourceComponent,StaticResourceComponent2,StaticResourceComponent3,UserImagePageComponent,
    DatepickerDemoComponent,PipesPageComponent,TabSwitchDemoComponent,PreparePersonDemoComponent,
    IqSelectDemoComponent
];
