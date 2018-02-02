import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  CardContainerComponent} from './index';

const cardRoutes: Routes = [
  {
    path:'',component: CardContainerComponent
    /*children:[
      {}
    ]*/
  }
];

@NgModule({
  imports: [RouterModule.forChild(cardRoutes)],
  exports: [RouterModule]
})

export class CardRoutingModule {}
