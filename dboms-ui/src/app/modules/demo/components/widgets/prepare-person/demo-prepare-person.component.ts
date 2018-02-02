import { Component, OnInit, ViewChild} from '@angular/core';
import { Person } from 'app/shared/services/index';

@Component({
  templateUrl: './demo-prepare-person.component.html'
})
export class PreparePersonDemoComponent implements OnInit{
  min=1;
  max=4;
  personList = [];
 @ViewChild('person') person;//
  ngOnInit(){
      let list = [];
      let person = JSON.parse("{}");
      person = {
          id: "1",
          name: "任月",
          itcode: "renyue"
      };
      list.push(new Person(person));
      this.personList.push({person:list});
      //接口返回数据，在组件初始化之后调用
    //   this.person.initPerson(this.personList);
  }
  getChange(e){
    console.log(e);
  }
}
