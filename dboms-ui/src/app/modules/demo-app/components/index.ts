
import { DemoListComponent } from './demo-list.component';
import { DemoContainerComponent } from './demo-container.component';
import { DemoNavComponent } from './demo-nav.component';
import { DemoPageComponent } from './demo-page.component';
import { DemoEditComponent } from './demo-edit.component';

export { DemoListComponent,DemoContainerComponent,DemoNavComponent,DemoPageComponent,DemoEditComponent };

// export declare const DEMO_APP_COMPONENTS:(typeof DemoListComponent | typeof DemoContainerComponent | typeof DemoNavComponent | typeof DemoPageComponent | typeof DemoEditComponent )
export let DEMO_APP_COMPONENTS =
[ DemoListComponent,
  DemoContainerComponent,
  DemoNavComponent,
  DemoPageComponent,
  DemoEditComponent ];
