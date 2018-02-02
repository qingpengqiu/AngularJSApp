import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'icheck-page.component.html',
  styleUrls:["icheck-page.component.scss"]
})
export class IcheckPageComponent implements OnInit {
  constructor() {  }
  gender = 1;
  isSelected = false;
  isSelected1 = false;
  disabled1 = true;
  disabled2 = true;
  logList = [];
  textarea1 = "";

  logRec = 0;
  choose(item){
    if(item.target){
      item.target.parentElement.classList.add("border-red");
    }
  }
  unchoose(item){
    if(item.target){
      item.target.parentElement.classList.remove("border-red");
    }
  }

  log(f,e,t){
    let _this = this;
    let cap = `id:${t.id}
value:${t.value}
checked:${t.checked}`;

    if(this.logRec>0){
      clearTimeout(this.logRec);
    }
    this.logList.push({class:this.logRec,event:f,target:t,cap:cap,value:e});
    this.logRec = setTimeout(()=>{
      _this.logRec = 0;
    })
    setTimeout(()=>{
      _this.logList.splice(0,1);
    },10000);
  }
  clickInput(e,t){
    this.log("click",e,t);
  }
  changeInput(e,t){
    this.log("change",e,t);
  }
  ngOnInit() {

  }
}
