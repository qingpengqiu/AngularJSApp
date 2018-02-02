import { FactoryProvider } from "@angular/core";
import { PersonAPIConfig } from "environments/environment";

import { Http } from '@angular/http';

import { AllCheckService } from "./allcheck.service";
import { AddressService } from "./address.service";
import { BreadcrumbService } from "./breadcrumb.service";
import { PersonService, Person } from "./person.service";
import { AuthenticationService } from "./authentication.service";

export { BreadcrumbService, PersonService, Person, AuthenticationService};

export function iqPersonFactory(Http) {
  return new PersonService(PersonAPIConfig,Http);
}

export let iqPersonProvider: FactoryProvider =
  {
    provide: PersonService,
    useFactory: iqPersonFactory,
    deps: [Http]
  }

export let SHARED_PROVIDERS = [AllCheckService,AddressService,BreadcrumbService, iqPersonProvider, AuthenticationService];
