import { OrderAppComponent } from './order-app.component';
import { OrderContainerComponent } from './order-container/order-container.component';
import { OrderContractComponent } from './order-contract/order-contract.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderOthersComponent } from './order-list/order-others/order-others.component';
import { MaterialDetailComponent } from './material-detail/material-detail.component';
import { OrderCreateComponent } from './order-create/order-create.component';
import { OrderCreateMacaoComponent } from './order-create/order-macao/order-macao.component';
import { OrderCreateOthersComponent } from './order-create/order-others/order-others.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { OrderCompletedListComponent } from './order-completed/order-completed.component';
// 弹窗-模态框组件
import { SelectContractComponent } from './order-list/selectContract/select-contract.component';
import { NewContractComponent } from './order-contract/newContract/new-contract.component';
import { SelectAdvanceComponent } from './order-create/selectAdvance/select-advance.component';
import { detailTipsComponent } from './material-detail/errTips/detail-tips.component';
import { ShipToInfoComponent } from './order-create/shipToInfo/shipTo-info.component';
import { SoldToInfoComponent } from './order-create/soldToInfo/soldTo-info.component';
import { MaterialChangeComponent } from './order-create/materialChange/material-change.component';
import { SelectChequeComponent } from './order-create/selectCheque/select-cheque.component';
import { AddMaterialComponent } from './order-create/addMaterial/add-material.component';
import { CashDetailComponent } from './order-create/cashDetail/cash-detail.component';
import { AddTaxCodeComponent } from './order-create/addTaxCode/add-TaxCode.component';
import { PaymentListComponent } from './order-create/paymentList/payment-list.component';
import { SelecteIndustryComponent } from './order-create/selectIndustry/select-industry.component';
import { InterCustomerComponent } from './order-create/interCustomer/inter-customer.component';
import { LogisticsInfoComponent } from './order-completed/logisticsInfo/logistics-info.component';
// 页面子组件
import { ShipToPartyComponent } from './order-create/shipToParty/shipTo-party.component';
import { NoCShipToPartyComponent } from './order-create/noC-shipTo-party/shipTo-party.component';
import { LinkChequeComponent } from './order-create/linkCheque/link-cheque.component';
import { UploadFilesComponent } from './order-create/uploadFiles/upload-files.component';

export {
  OrderAppComponent, OrderContainerComponent,
  OrderContractComponent, OrderListComponent, OrderOthersComponent, OrderCreateComponent, OrderCreateMacaoComponent, NoCShipToPartyComponent,
  MaterialDetailComponent, OrderViewComponent, OrderCompletedListComponent, OrderCreateOthersComponent,
  ShipToPartyComponent, LinkChequeComponent, UploadFilesComponent
};

export let ORDER_APP_ENTRY_COMPONENT = [
  SelectContractComponent, NewContractComponent, SelectAdvanceComponent, detailTipsComponent, ShipToInfoComponent, MaterialChangeComponent,
  SelectChequeComponent, AddMaterialComponent, CashDetailComponent, SoldToInfoComponent, AddTaxCodeComponent, LogisticsInfoComponent,
  PaymentListComponent, SelecteIndustryComponent, InterCustomerComponent
]

export let ORDER_APP_COMPONENT = [
  OrderAppComponent, OrderListComponent, OrderOthersComponent, SelectContractComponent, NewContractComponent, SelectAdvanceComponent, detailTipsComponent, ShipToInfoComponent, MaterialChangeComponent, SelectChequeComponent, AddMaterialComponent, SoldToInfoComponent, InterCustomerComponent, AddTaxCodeComponent, OrderCreateMacaoComponent, OrderCompletedListComponent,
  OrderContainerComponent, OrderCreateComponent, OrderViewComponent, CashDetailComponent, PaymentListComponent, LogisticsInfoComponent, OrderCreateOthersComponent,
  OrderContractComponent, SelecteIndustryComponent,
  MaterialDetailComponent, ShipToPartyComponent, LinkChequeComponent, NoCShipToPartyComponent,
  UploadFilesComponent
];
