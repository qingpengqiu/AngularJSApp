import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'applyStatus'
})

export class MaterielApplyStatusPipe implements PipeTransform {
    transform(value: any, exponent: any): any {
         
        // let stateOne="草稿";
        // let stateTwo="已完成";

        // let stateExtendOne="未扩展";
        // let stateExtendTwo="部分扩展";
        // let stateExtendThree="全部扩展";

        let stateName:any;//

        if (exponent == undefined) {

            switch (value) {
                case "0":
                    stateName = "草稿";
                    break;
                case "1":
                    stateName = "已完成";
                    break;
                default:
                    break;
            }
            return stateName;

        }else if(exponent==="extend"){//扩展物料对应参数，当给管道赋值“extend”时自动调用

            switch (value) {
                case "0":
                    stateName = "未扩展";
                    break;
                case "1":
                    stateName = "部分扩展";
                    break;
                case "2":
                    stateName = "全部扩展";
                    break;
                case "3":
                    stateName = "扩展中";
                    break;
                default:
                    break;
            }
            return stateName;

        }
        
    }
}