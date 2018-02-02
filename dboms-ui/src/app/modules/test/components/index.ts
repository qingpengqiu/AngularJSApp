
import { TestPageComponent } from './test-page/test-page.component';
import { TestHeaderComponent } from './test-header/test-header.component';
import { TestMainComponent } from './test-main/test-main.component';
import { TestAddComponent } from './test-main-add/test-add.component';
import { TestAlertComponent } from './test-main-alert/test-alert.component';
import { TestMainDefaultComponent } from './test-main-default/test-main-default.component';

import { TestContainerComponent } from './test-container.component';

export { TestPageComponent, TestHeaderComponent,TestMainComponent,TestAddComponent, TestAlertComponent,TestMainDefaultComponent,TestContainerComponent };

// export declare const DEMO_APP_COMPONENTS:(typeof TestPageComponent | typeof TestMainComponent |typeof DemoContainerComponent | typeof DemoNavComponent | typeof DemoPageComponent | typeof DemoEditComponent )
export let TEST_APP_COMPONENTS =
[ TestPageComponent, TestHeaderComponent,TestMainComponent, TestAddComponent,TestAlertComponent,TestMainDefaultComponent,TestContainerComponent ];
