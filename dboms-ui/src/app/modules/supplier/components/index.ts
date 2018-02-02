import { SupplierAppComponent } from "./supplier-app.component";
import { SupplierContainerComponent } from "./supplier-container/supplier-container.component";
import { SupplierManageComponent } from "./supplier-supplierManage/supplier-supplierManage.component";
import { SupplierMyApplyComponent } from "./supplier-myApply/supplier-myApply.component";
import { SupplierMyApprovalComponent } from "./supplier-myApproval/supplier-myApproval.component";

import { EditSupplierExtendClassComponentd } from "./edit-supplier-extendClass/edit-supplier-extendClass.component";
import { EditSupplierNewCreatSupplier } from "./edit-supplier-newCreatSupplier/edit-supplier-newCreatSupplier.component";

//import { SupplierRoutingModule } from "../supplier-routing.module";//导入内部路由

export {
    SupplierAppComponent,
    SupplierContainerComponent,
    SupplierManageComponent,
    SupplierMyApplyComponent,
    SupplierMyApprovalComponent,
    EditSupplierExtendClassComponentd,
    EditSupplierNewCreatSupplier
  
};

export let SUPPLIER_APP_ENTRY_COMPONENT = [
    EditSupplierExtendClassComponentd,
    EditSupplierNewCreatSupplier
]

export let SUPPLIER_APP_COMPONENT = [
    SupplierAppComponent,
    SupplierContainerComponent,
    SupplierManageComponent,
    SupplierMyApplyComponent,
    SupplierMyApprovalComponent,
    EditSupplierExtendClassComponentd,
    EditSupplierNewCreatSupplier
];
