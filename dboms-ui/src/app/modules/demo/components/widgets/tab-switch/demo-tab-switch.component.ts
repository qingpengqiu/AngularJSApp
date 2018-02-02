import { Component} from '@angular/core';

@Component({
  templateUrl: './demo-tab-switch.component.html',
  styleUrls: ["../../../../../shared/components/widgets/tab-switch/tab-switch.component.scss"]
})
export class TabSwitchDemoComponent {
  tabList=[{
    text:"合同1",
    invalid:true,
    id:1
  },{
    text:"合同2",
    invalid:false,
    id:2
  },{
    text:"合同3",
    invalid:false,
    id:3
  }];
  contentList=["内容1","内容2","内容3"];
 
  active=0;//默认现显示哪个
  onChange(e){
    this.active=e;
  }
  deleteTab(e){
    this.contentList.splice(e,1);
  }
  addTab(e){
    this.tabList[e].text="合同"+(e+1);
    this.contentList[e]="内容"+(e+1);
  }
  changeErr(){
    this.tabList[this.active].invalid=!this.tabList[this.active].invalid;
  }
}