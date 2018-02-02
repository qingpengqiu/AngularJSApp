import { Component} from '@angular/core';
import { Pager } from 'app/shared/index';
import { SomeThing } from 'app/modules/demo/index';


@Component({
    templateUrl: 'pager-page.component.html'
})
export class PagerPageComponent {
  pagerData0 = new Pager();
  onChangePager0 = function(e,t){
      console.log(e,t);
      this.pagerData0.set({
        total: 103,
        totalPages:10
      })
  }
  list1:SomeThing[] = [];

  pagerData1 = new Pager();
  onChangePager1 = function(e,t){
      //修改list
      this.list1 = [];
      for(let i=0;i<10;i++){
        this.list1.push(new SomeThing());
      }
      
      //重置pager
      this.pagerData1.set({
        total: (new Date().getTime())%50 +1,
        totalPages: (new Date().getTime())%50 +1
      })
  }
}
