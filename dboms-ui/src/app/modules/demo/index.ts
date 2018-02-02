
export * from './components/index';
// export * from './directives/index';
export * from './services/index';
// export * from './pipes/index';


export class SomeThing{
  apply="";
  name="";
  applyDate=new Date();
  id="";
  constructor(){
    let applyList = ["交通费报销","招待费报销","我要还款","其它费用报销","我要借款","差旅费报销","文印费报销"];
    let nameList = ["徐超","小小超","蜗牛","随便","徐小超","想不出","名字啊"];

    this.name = nameList[(Math.random()*6).toFixed(0)];
    this.apply = applyList[(Math.random()*6).toFixed(0)];
    this.id= (Math.random()*10000000000).toFixed(0) + "";
  }
}
