import { Injectable } from '@angular/core';

export class date {
  constructor(public id: number, public ct: Array<any>) { }
}
export class tab {

}
let dates: date[] = [
  new date
  (11, [
      {"RRYID":"111","公共部分":"22.0440","设备管理":"0","班组管理":"0","运行管理":"-0.20","安全管理":"-0.10"},
      {"RRYID":"586","公共部分":"33.2670","设备管理":"0","班组管理":"0","运行管理":"-1.50","安全管理":"-0.20"},
      {"RRYID":"429","公共部分":"10.7290","设备管理":"0","班组管理":"0","运行管理":"-0.20","安全管理":"0"},
      {"RRYID":"372","公共部分":"54.4370","设备管理":"0","班组管理":"0","运行管理":"0","安全管理":"0"},
      {"RRYID":"061","公共部分":"29.7760","设备管理":"0","班组管理":"0","运行管理":"-0.20","安全管理":"-0.20"},
      {"RRYID":"008","公共部分":"19.1960","设备管理":"0","班组管理":"0","运行管理":"0","安全管理":"-0.50"},
      {"RRYID":"0363","公共部分":"27.6040","设备管理":"0","班组管理":"0","运行管理":"-1","安全管理":"0"},
      {"RRYID":"0521","公共部分":"38.0160","设备管理":"0","班组管理":"0","运行管理":"0","安全管理":"0"},
      {"RRYID":"0163","公共部分":"27.7390","设备管理":"0","班组管理":"0","运行管理":"0","安全管理":"-0.60"}
  ]),
];

@Injectable()
export class modalService {
  constructor(){};
  getTable() {
    let table = [];
    table=dates[0].ct;
    return table;
  }
getHead(){
    var head = [];
    for(var i=0;i<dates.length;i++){
      for(var j=0;j<dates[i].ct.length;j++){
          if(j==0){
            for (var key in dates[i].ct[j]) {
              head.push(key);
            }
          }
        }
        return head;
    }
  }
}
