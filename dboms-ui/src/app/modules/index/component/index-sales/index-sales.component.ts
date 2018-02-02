import { Component, OnInit,} from '@angular/core';

import { shrinkOut, shrinkOutC } from "../../animate/animate";
import { NAV_CONFIG } from '../../nav-config';

@Component({
  templateUrl: './index-sales.component.html',
  styleUrls: ['./index-sales.component.scss'],
  animations: [ shrinkOut, shrinkOutC ]
})

export class IndexSalesComponent implements OnInit{
  navConfig = NAV_CONFIG;
  
  constructor(){}

  ngOnInit(){

  }
}
