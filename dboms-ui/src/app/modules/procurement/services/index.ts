import { FactoryProvider } from "@angular/core";
import { Http } from '@angular/http';

import { ContractListService } from './contract-list.service';
import { SubmitMessageService } from './submit-message.service';
import { ProcurementListDataService } from './procurement-listData.service';
import { ProcumentOrderNewService } from './procumentOrder-new.service';
import { ProcurementTemplateService } from './procurement-template.service';
import { ShareDataService } from './share-data.service';
import { ShareMethodService } from "./share-method.service";

export { ContractListService, SubmitMessageService,ProcurementListDataService,
        ProcumentOrderNewService,ProcurementTemplateService,ShareDataService,
        ShareMethodService };


export let PROCUREMENT_PROVIDERS = [
    ContractListService, SubmitMessageService,ProcurementListDataService,
    ProcumentOrderNewService,ProcurementTemplateService,ShareDataService,
    ShareMethodService
];
