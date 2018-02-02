import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;

@Component({
    selector: "view-child-modal",
    templateUrl: 'view-child-modal.html',
    styleUrls: ['view-child-modal.scss']
})
export class viewChildModalComponent implements OnInit {
    @Input()
    set viewChildTopData(data) {
        this.modalData = data;
        let list = data.procurementList;
        let i;
        let len = list.length;
        for (i = 0; i < len; i++) {
            let index = this.isSimilarity(list[i]);
            if (index == -1) {
                this.procurementList.push(list[i]);
            } else {
                this.procurementList[index].Count += Number(list[i].Count);
                this.procurementList[index].Amount += Number(list[i].Amount);
            }
        }
    };
    @Output() hideMes = new EventEmitter;
    constructor() { }
    public showData;
    public showlist = [];
    ngOnInit() { }

    procurementList = [];//过滤后的采购清单
    modalData = {
        procurementList: [],
        untaxAmount: '',
        factory: '',
        vendor: ''
    };

    isSimilarity(listItem) {//在this.procurementList中寻找（物料号、未税单价、库存地、批次）相同的下标
        let j;
        let len = this.procurementList.length;
        for (j = 0; j < len; j++) {
            let item = this.procurementList[j];
            if (listItem.MaterialNumber == item.MaterialNumber
                && listItem.Price == item.Price
                && listItem.StorageLocation == item.StorageLocation
                && listItem.Batch == item.Batch) {
                return j;
            }
        }
        return -1;
    }
    messageShow() {
        this.hideMes.emit(false);
    }
    ngDoCheck() {
        if(this.procurementList && this.procurementList.length>=10){//出现滚动条的宽度调整
            $(".w60").addClass("w66");
        }else{
            $(".w60").removeClass("w66");
        }
    }
}




