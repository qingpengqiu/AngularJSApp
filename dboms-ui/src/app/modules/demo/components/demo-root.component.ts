import { Component, OnInit } from '@angular/core';
import { Location} from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './demo-root.component.html',
})
export class DemoRootComponent implements OnInit {
  constructor( private location:Location,
    private router: Router){
    }

    path = "";
    open: boolean;
    ngOnInit() {
     let _this = this;
     let reg = /demo\/widget\/page-style/;
     var resetPath = function(){
       _this.path=_this.location.path();
       _this.open = reg.test(_this.path);
     }
     this.router.events.subscribe(event => {
       if (event instanceof NavigationEnd) {
         resetPath();
       }
     });
     resetPath();
   }
}
