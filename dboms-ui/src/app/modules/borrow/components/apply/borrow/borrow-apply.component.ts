import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { Pager, XcModalService, XcBaseModal, XcModalRef } from 'app/shared/index';
import {
    Query,
    BorrowApply,
    BorrowListService,
    Materiel,
    Transport,
    BorrowApplytransportPoL,
    BorrowApplyFormData,
    BorrowAttachment
} from './../../../services/borrow-list.service';
import {
    SelectOption,
    ApplyUser,
    PersonnelInfo,
    DeliveryAddress
} from '../../common/borrow-entitys';

import { BorrowUnclearListComponent } from '../../common/borrow-unclear-list.component';

import { PopInventoryListComponent } from '../../common/pop-inventory-list.component';

import { WindowService } from 'app/core';

import { Person } from 'app/shared/services/index';

@Component({
    templateUrl: './borrow-apply.component.html',
    styleUrls: ['./borrow-apply.component.scss']
})
export class BorrowApplyComponent implements OnInit {

    borrowApplyFormData: BorrowApplyFormData = new BorrowApplyFormData();
    loading: boolean = true;//加载中效果
    /*!!!!表单中没有借用类型、事业部、以及业务范围编号，这些数据的来源需要确认 */
    transportTypesOpts: SelectOption[] = [];//运输方式选项
    borrowAttrOpts: SelectOption[] = [];//借用属性选项   
    deliveryTypeOpts: SelectOption[] = [];//交货方式
    borrowTypeOpts: Array<SelectOption> = [];//借用类型
    applyUser: ApplyUser = new ApplyUser();


    businessDepts: Array<string> = [];//事业部列表
    businessScopeDepts: Array<Object> = [];//事业部范围编号

    deliveryAddresses: Array<DeliveryAddress> = [];
    public customerName: string;

    platforminv = [];
    public applyId: string = '';

    public person = [];//申请人员信息
    public newFreezePerson: PersonnelInfo;

    public userInfo:Person = new Person();//申请人

    public addressId: string;
    public showLocation = false;
    //model窗口对象
    modalAddForm: XcModalRef;
    public baseUserIsShow = true;

    public canOperatingBorrow: boolean = false;

    public hideTransportInfo: boolean = false;

    borrowAttachmentList: BorrowAttachment[] = [];

    public createUserInfo:Person = new Person();//申请人

     //borrowApplytransportPoL: BorrowApplytransportPoL=null;


     //model窗口对象
    modalAddForm2: XcModalRef;

    tranSportIndex:number =0;
    checkBorrowDate:string= '';
    //private id="8a81e6ab5b7ebe30015b7ec60f900002";
    constructor(private router: Router, http: Http, private route: ActivatedRoute, private location: Location,
        private borrowListService: BorrowListService,
        private xcModalService: XcModalService,
        private windowService: WindowService) {

    }
    name = '借用申请新建'
    ngOnInit() {
        this.checkBorrowDate = this.getDate1(new Date());
        this.route.params.subscribe(params => { this.applyId = params["applyId"] });
        // if (this.applyId) {

        // } else {

        // }
        this.newFreezePerson = new PersonnelInfo();

        this.borrowListService.getBorrowPageAttrOption(1).then(data => {
            for (let i of data.list) {
                i.code = i.code + "_" + i.name;
                this.borrowAttrOpts.push(i);
            }
            // console.info(data.list);
        });
        // this.borrowListService.getBorrowPageTypeOption(1,"REVIEW").then(data=>{
        //     this.borrowTypeOpts=data.list;
        // });   
        this.borrowListService.getPlatforminv('21').then(data => {
            this.platforminv = data.list;
        });
        this.borrowListService.queryNowMonth().then(data => {
            let month = data.item.month;
            if (month == 11 || month == 12) {
                this.canOperatingBorrow = true;
            }
        });

        this.borrowListService.getBorrowPageAttrOption(2).then(data => {
            this.deliveryTypeOpts = [];
            for (let i of data.list) {
                i.code = i.code + "_" + i.name;
                this.deliveryTypeOpts.push(i);
            }
        });
        this.borrowListService.getBorrowPageAttrOption(3).then(data => {
            this.transportTypesOpts = [];
            for (let i of data.list) {
                i.code = i.code + "_" + i.name;
                this.transportTypesOpts.push(i);
            }
        });
        this.borrowListService.getUserContext().then(data => {
            this.userInfo.userEN = data.item.sysUsers.itcode;
            this.userInfo.userID = data.item.sysUsers.itcode.toLocaleLowerCase();
            this.userInfo.userCN = data.item.sysUsers.userName;
            this.person.push(this.userInfo);
            this.applyUser.itcode = data.item.sysUsers.itcode;
            this.applyUser.name = data.item.sysUsers.userName;
            this.applyUser.personNo = data.item.sysUsers.userNo;
            this.applyUser.mobile = data.item.mobile;
            this.applyUser.platformCode = data.item.sysUsers.flatCode;
            this.applyUser.platformName = data.item.sysUsers.flatName;
            this.baseUserIsShow = true;
            this.initPerson(data);

        });
        // this.borrowListService.getIqUserContext("luheng1").then(data=>{
        //     console.info(data);
        //     //this.applyUser=data.item;
        // });
        this.modalAddForm = this.xcModalService.createModal(BorrowUnclearListComponent);
        this.modalAddForm.onHide().subscribe((data) => {
            if (data) {
                //子组件将数据回写
            }
        })

        this.modalAddForm2 = this.xcModalService.createModal(PopInventoryListComponent);
        this.modalAddForm2.onHide().subscribe((data) => {
            if (data) {
                if (data.type == "save") {
                    this.borrowApplyFormData.transportPoList[this.tranSportIndex].transport.inventory = data.inventoryNo;

                    this.borrowApplyFormData.transportPoList[this.tranSportIndex].transport.inventoryName = data.inventoryNo;
                }
                //子组件将数据回写
            }
            this.tranSportIndex = 0;
        })

        //console.log(this.applyId);
        if (this.applyId) {//新建
            this.borrowListService.queryBorrowApplyById(this.applyId).then(data => {
                this.borrowApplyFormData = data.item as BorrowApplyFormData;

                //if(this.borrowApplyFormData.borrowApply.borrowDate)
                if(this.borrowApplyFormData.borrowApply.flowStatus!=5){
                     this.borrowApplyDateToString();
               
                    this.getUserExtendsInfo(this.borrowApplyFormData.borrowApply.applyItCode);

                   
                    // console.log(this.borrowApplyFormData);
                    //console.log("tttttttttttttttt" + this.borrowApplyFormData.transportPoList[0].transport.transportCode);
                   
                }else{
                    this.borrowListService.queryUserInfoById(this.borrowApplyFormData.borrowApply.createBy).then(data => {
                             console.error("createUserInfo ==="+JSON.stringify(data));
                                this.createUserInfo.userEN = data.item.itcode;
                                this.createUserInfo.userID = data.item.itcode.toLocaleLowerCase();
                                this.createUserInfo.userCN = data.item.name;
                 });
                }
                 this.initBorrowPageTypeOption();
                 this.changeBorrowCustomer(this.borrowApplyFormData.borrowApply.borrowCustomerName);
                 this.borrowAttachmentList = this.borrowApplyFormData.borrowApply.attachmentList;
                if (this.borrowApplyFormData.borrowApply.deliveryType == 'CUSTSELF' || this.borrowApplyFormData.borrowApply.deliveryType == 'SALEMAN') {
                        this.hideTransportInfo = true;

                 }
            });

        } else {//查询
            //console.log(" create borrowApply ");
            //console.error(this.borrowApplyFormData.borrowApply.borrowDate+"%%%%%%%");
            this.borrowApplyFormData.borrowApply.borrowDate = this.getDate1(new Date());
            

        }

    }
    i: number = 0;
    borrowAttrChange(e: any) {
        let codeValue = e.target.value;
        let values: string[] = codeValue.split("_");
        this.borrowApplyFormData.borrowApply.borrowAttributeCode = values[0];
        this.borrowApplyFormData.borrowApply.borrowAttributeName = values[1];
        this.initBorrowPageTypeOption();
        if (typeof (this.borrowApplyFormData.borrowApply.borrowDayCount) != 'undefined' && this.borrowApplyFormData.borrowApply.borrowDayCount != 0) {
            let isout: boolean = true;
            if (this.borrowApplyFormData.borrowApply.borrowAttributeCode == "LOGBOR" && this.borrowApplyFormData.borrowApply.borrowDayCount > 30) {//物流借用
                isout = false;
            } else if (this.borrowApplyFormData.borrowApply.borrowAttributeCode == "SALESIGN" && this.borrowApplyFormData.borrowApply.borrowDayCount > 70) {//售前签单
                isout = false;
            } else if (this.borrowApplyFormData.borrowApply.borrowAttributeCode == "REVIEW" && this.borrowApplyFormData.borrowApply.borrowDayCount > 30) {//评测
                isout = false;
            } else if (this.borrowApplyFormData.borrowApply.borrowAttributeCode == "PROPAGA" && this.borrowApplyFormData.borrowApply.borrowDayCount > 30) {//宣传
                isout = false;
            } else if (this.borrowApplyFormData.borrowApply.borrowAttributeCode == "MAINTEN" && this.borrowApplyFormData.borrowApply.borrowDayCount > 60) {//维修
                isout = false;
            }
            if (!isout) {
                this.windowService.confirm({ message: `借用天数超过规定天数，会加签至总经理和风控审批？` }).subscribe(v => {
                    if (v) {

                    }
                    if (!v) {
                        this.borrowApplyFormData.borrowApply.borrowDayCount = null;
                        this.borrowApplyFormData.borrowApply.giveBackDay = null;
                        return false;
                    }
                })
            }
        }
    }
    paltforminvChange(e: any, borrowApplytransportPoL: BorrowApplytransportPoL) {
        let codeValue = e.target.value;
        let values: string[] = codeValue.split("_");
        borrowApplytransportPoL.transport.inventory = values[0];
        borrowApplytransportPoL.transport.inventoryName = values[1];
    }
    borrowApplyDateToString() {
        this.borrowApplyFormData.borrowApply.borrowDate = this.dateToString(this.borrowApplyFormData.borrowApply.borrowDate);
        this.borrowApplyFormData.borrowApply.lastModifiedDate = this.dateToString(this.borrowApplyFormData.borrowApply.lastModifiedDate);
        this.borrowApplyFormData.borrowApply.createDate = this.dateToString(this.borrowApplyFormData.borrowApply.createDate);
        this.borrowApplyFormData.borrowApply.giveBackDay = this.dateToString(this.borrowApplyFormData.borrowApply.giveBackDay);
        for (let i of this.borrowApplyFormData.transportPoList) {
            i.transport.arrivalDate = this.dateToString(i.transport.arrivalDate);
            i.transport.createDate = this.dateToString(i.transport.createDate);
            i.transport.lastModifiedDate = this.dateToString(i.transport.lastModifiedDate);
            for (let j of i.materielList) {
                j.createDate = this.dateToString(j.createDate);
                j.lastModifiedDate = this.dateToString(j.lastModifiedDate);
            }
        }

    }

    dataChange(type: string) {
        if (type == 'start') {
            //   console.error("12312312===="+ this.getDate1(new Date()));
            //      let cdate=new Date();
            //     let startDate = new Date(this.dateDiff2(this.borrowApplyFormData.borrowApply.borrowDate,1));
            //    if(cdate.getTime()>startDate.getTime()){
            //      this.windowService.alert({ message: "借用日期必须大于等于今天", type: "fail" });
            //      this.borrowApplyFormData.borrowApply.borrowDate =null;
            //       return false;
            //    }

            if (this.borrowApplyFormData.borrowApply.borrowDayCount && this.borrowApplyFormData.borrowApply.giveBackDay) {
                console.error("12312312====2");
                let days = this.borrowApplyFormData.borrowApply.borrowDayCount - 1;
                let startDate = this.borrowApplyFormData.borrowApply.borrowDate;
                this.borrowApplyFormData.borrowApply.giveBackDay = this.dateDiff2(startDate, days);
                return;
            }
        } else if (type == 'days') {

            if (typeof (this.borrowApplyFormData.borrowApply.borrowAttributeCode) == 'undefined' || this.borrowApplyFormData.borrowApply.borrowAttributeCode == "undefined") {
                this.windowService.alert({ message: "请先选择借用属性", type: "fail" });
                this.borrowApplyFormData.borrowApply.borrowDayCount = null;
                return false;
            }
            if (!this.borrowApplyFormData.borrowApply.borrowDate) {
                this.windowService.alert({ message: "请先填写借用日期", type: "fail" });
                this.borrowApplyFormData.borrowApply.borrowDayCount = null;
                return false;
            }
            if (typeof (this.borrowApplyFormData.borrowApply.borrowAttributeCode) != 'undefined' && this.borrowApplyFormData.borrowApply.borrowAttributeCode != "") {
                let isout: boolean = true;
                if (this.borrowApplyFormData.borrowApply.borrowAttributeCode == "LOGBOR" && this.borrowApplyFormData.borrowApply.borrowDayCount > 30) {//物流借用
                    isout = false;
                } else if (this.borrowApplyFormData.borrowApply.borrowAttributeCode == "SALESIGN" && this.borrowApplyFormData.borrowApply.borrowDayCount > 70) {//售前签单
                    isout = false;
                } else if (this.borrowApplyFormData.borrowApply.borrowAttributeCode == "REVIEW" && this.borrowApplyFormData.borrowApply.borrowDayCount > 30) {//评测
                    isout = false;
                } else if (this.borrowApplyFormData.borrowApply.borrowAttributeCode == "PROPAGA" && this.borrowApplyFormData.borrowApply.borrowDayCount > 30) {//宣传
                    isout = false;
                } else if (this.borrowApplyFormData.borrowApply.borrowAttributeCode == "MAINTEN" && this.borrowApplyFormData.borrowApply.borrowDayCount > 60) {//维修
                    isout = false;
                }
                if (!isout) {
                    this.windowService.confirm({ message: `借用天数超过规定天数，会加签至总经理和风控审批？` }).subscribe(v => {
                        if (v) {

                        }
                        if (!v) {
                            this.borrowApplyFormData.borrowApply.borrowDayCount = null;
                            this.borrowApplyFormData.borrowApply.giveBackDay = null;
                            return false;
                        }
                    })
                }
            }
            console.error("22333223");
            if (this.borrowApplyFormData.borrowApply.borrowDate) {
                let days = this.borrowApplyFormData.borrowApply.borrowDayCount - 1;
                let startDate = this.borrowApplyFormData.borrowApply.borrowDate;
                this.borrowApplyFormData.borrowApply.giveBackDay = this.dateDiff2(startDate, days);
                return;
            }
        } else {

            if (this.borrowApplyFormData.borrowApply.borrowDate && this.borrowApplyFormData.borrowApply.giveBackDay) {
                console.error("444444444444");
                let startDate = this.borrowApplyFormData.borrowApply.borrowDate;
                let endDate = this.borrowApplyFormData.borrowApply.giveBackDay;
                this.borrowApplyFormData.borrowApply.borrowDayCount = this.dateDiff(this.getDate1(startDate), this.getDate1(endDate)) + 1;
                return;
            } if (!this.borrowApplyFormData.borrowApply.borrowDate && this.borrowApplyFormData.borrowApply.borrowDayCount && this.borrowApplyFormData.borrowApply.giveBackDay) {
                let days = (this.borrowApplyFormData.borrowApply.borrowDayCount - 1) * -1;
                let startDate = this.borrowApplyFormData.borrowApply.giveBackDay;
                this.borrowApplyFormData.borrowApply.borrowDate = this.dateDiff2(startDate, days);
                return;
            }
        }
        //console.error(type);
    }
    contrastDate(sDate1: string, sDate2: string, sDate3: string): boolean {
        let start = new Date(sDate1);
        let end = new Date(sDate2);
        let send = new Date(sDate3);
        if (start.getTime() <= send.getTime() && send.getTime() <= (end.getTime() + (24 * 3600 * 1000))) {
            return true;
        }
        return false;
    }
    backDateChange(backdate: string) {
        if (this.borrowApplyFormData.borrowApply.borrowDate && this.borrowApplyFormData.borrowApply.giveBackDay) {
            let valadata = this.contrastDate(this.borrowApplyFormData.borrowApply.borrowDate, this.borrowApplyFormData.borrowApply.giveBackDay, backdate);
            if (!valadata) {
                this.windowService.alert({ message: "归还日期不合法，请重新填写", type: "fail" });
            }
        } else {
            this.windowService.alert({ message: "请先填写借用日期和归还日期", type: "fail" });
            return false;
        }
    }
    dateDiff(sDate1: string, sDate2: string): number { //sDate1和sDate2是2002-12-18格式  
        sDate1 = this.getDate1(sDate1);
        sDate2 = this.getDate1(sDate2);

        let aDate, oDate1: Date, oDate2: Date, iDays;

        aDate = sDate1.split('-');

        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);//转换为12-18-2002格式   
        aDate = sDate2.split("-");
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);

        iDays = parseInt((Math.abs(oDate1.getTime() - oDate2.getTime()) / 1000 / 60 / 60 / 24) + "") //把相差的毫秒数转换为天数   
        return iDays
    }

    dateDiff2(startDate, intValue) {

        startDate = this.getDate1(startDate);

        let aDate, oDate1: Date, endDate: Date;
        let times: number;
        aDate = startDate.split("-")
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])

        times = oDate1.getTime();
        times += (intValue) * (24 * 3600 * 1000);
        endDate = new Date(times);
        return this.getDate1(endDate);
    }

    dateToString(obj: any): any {
        if (obj != null && obj != "null" && (obj + "").length == 13) {
            obj = this.getDate1(obj);
        }
        return obj;
    }
    initBorrowPageTypeOption() {
        this.borrowListService.getBorrowPageTypeOption(1, this.borrowApplyFormData.borrowApply.borrowAttributeCode).then(data => {
            this.borrowTypeOpts = [];
            for (let obj of data.list) {
                obj.code = obj.code + "_" + obj.name;
                this.borrowTypeOpts.push(obj);
            }
        });
    }
    borrowTypeChange(e: any) {
        console.info(e.target);
        let codeValue = e.target.value;
        let values: string[] = codeValue.split("_");
        this.borrowApplyFormData.borrowApply.borrowTypeCode = values[0];
        this.borrowApplyFormData.borrowApply.borrowTypeName = values[1];
    }
    deliveryTypeChange(e: any) {
        console.info(e.target);
        let codeValue = e.target.value;
        let values: string[] = codeValue.split("_");
        this.borrowApplyFormData.borrowApply.deliveryType = values[0];
        this.borrowApplyFormData.borrowApply.deliveryTypeName = values[1];
        if (this.borrowApplyFormData.borrowApply.deliveryType == 'CUSTSELF' || this.borrowApplyFormData.borrowApply.deliveryType == 'SALEMAN') {
            this.hideTransportInfo = true;
            return;
        } else {
            this.hideTransportInfo = false;
        }
        //this.borrowApplyFormData.borrowApply.borrowTypeName=values[1];
    }
    transportTypeChange(borrowApplytransportPoL: BorrowApplytransportPoL, e: any) {
        let codeValue = e.target.value;
        let values: string[] = codeValue.split("_");
        borrowApplytransportPoL.transport.transportCode = values[0];
        borrowApplytransportPoL.transport.transportName = values[1];
    } 

    openInventoryList(index:number){
        this.tranSportIndex=index;
        this.modalAddForm2.show();
    }

    addTransport(e: any) {
        this.borrowApplyFormData.transportPoList.push(new BorrowApplytransportPoL());
    }
    delTransport(i) {
        let transport: BorrowApplytransportPoL = this.borrowApplyFormData.transportPoList[i];
        if (transport.transport.transportId) {
            this.windowService.confirm({ message: `确定删除？` }).subscribe(v => {
                if (v) {
                    this.borrowListService.delRemoteTransport(transport.transport).then(data => {
                        if (data.success) {
                            this.borrowApplyFormData.transportPoList.splice(i, 1);
                            this.windowService.alert({ message: "操作成功", type: "success" });
                        } else {
                            this.windowService.alert({ message: data.message, type: "fail" });
                        }
                    });

                }
            })
        } else {
            this.borrowApplyFormData.transportPoList.splice(i, 1);
        }

    }
    addMateriel(transport: BorrowApplytransportPoL) {
        let materiel: Materiel = new Materiel();
        materiel.batch = '999';
        materiel.count = 1;
        materiel.factory = this.borrowApplyFormData.borrowApply.factory;
        materiel.meterialMemo = 'H3C S5560-30C-EI L3以太网交换机主机';
        materiel.meterialNo = '255017432';
        materiel.price = 4974.36;
        transport.materielList.push(materiel);

        transport.transport.borrowAmount = this.totalTransportBorrowAmount(transport.materielList);
        this.borrowApplyFormData.borrowApply.borrowTotalAmount = this.totalBorrowApplyAmount();
    }
    materielChange(transport: BorrowApplytransportPoL) {
        transport.transport.borrowAmount = this.totalTransportBorrowAmount(transport.materielList);
        this.borrowApplyFormData.borrowApply.borrowTotalAmount = this.totalBorrowApplyAmount();
    }
    delMateriel(transport: BorrowApplytransportPoL, i) {
        let materiel: Materiel = transport.materielList[i];
        if (materiel.materielId) {
            this.windowService.confirm({ message: `确定删除？` }).subscribe(v => {
                if (v) {
                    this.borrowListService.delRemoteMateriel(materiel).then(data => {
                        if (data.success) {
                            transport.materielList.splice(i, 1);
                            transport.transport.borrowAmount = this.totalTransportBorrowAmount(transport.materielList);
                            this.borrowApplyFormData.borrowApply.borrowTotalAmount = this.totalBorrowApplyAmount();
                            this.windowService.alert({ message: "操作成功", type: "success" });
                        } else {
                            this.windowService.alert({ message: data.message, type: "fail" });
                        }
                    });
                }
            })
        } else {
            transport.materielList.splice(i, 1);
            transport.transport.borrowAmount = this.totalTransportBorrowAmount(transport.materielList);
            this.borrowApplyFormData.borrowApply.borrowTotalAmount = this.totalBorrowApplyAmount();
        }
    }
    materielNumberChange(item: Materiel) {
        item.totalAmount = item.price * item.count;
    }
    totalTransportBorrowAmount(materielList: Materiel[]): number {
        let totalAmount = 0;
        for (let i of materielList) {
            i.totalAmount = this.fmoney((i.price * i.count) + "", 2);
            totalAmount += i.price * i.count;
        }
        //this.fmoney(totalAmount+"",2)
        totalAmount = this.fmoney(totalAmount + "", 2);
        return totalAmount;
    }

    totalBorrowApplyAmount(): number {
        try {
            let totalAmount = 0;
            for (let i of this.borrowApplyFormData.transportPoList) {
                totalAmount += i.transport.borrowAmount;
            }
            //this.fmoney(totalAmount+"",2)
            totalAmount = this.fmoney(totalAmount + "", 2);
            return totalAmount;
        } catch (error) {
            console.error(error);
        }

    }

    changePerson(info) {
        if (info && info.length > 0) {
            this.applyUser.itcode = info[0]["itcode"];
            this.applyUser.personNo = info[0]["personNo"];
            this.applyUser.name = info[0]["name"];
            this.applyUser.mobile = info[0]["mobile"];

            this.borrowApplyFormData.borrowApply.applyItCode = info[0]["itcode"];
            this.borrowApplyFormData.borrowApply.applyUserNo = info[0]["personNo"];
            this.borrowApplyFormData.borrowApply.applyUserName = info[0]["name"];
            this.borrowApplyFormData.borrowApply.applyUserTel = info[0]["mobile"];
            //this.borrowApplyFormData.borrowApply.applyUserTel ='15249203759';
            //this.getUserExtendsInfo("wuzk");
            this.getUserExtendsInfo(this.applyUser.itcode);
            //this.newFreezePerson.freeResult = 0;
            this.baseUserIsShow = false;

        }
    }
    initPerson(data) {
        this.borrowApplyFormData.borrowApply.applyItCode = data.item.sysUsers.itcode;
        this.borrowApplyFormData.borrowApply.applyUserNo = data.item.sysUsers.userNo;
        this.borrowApplyFormData.borrowApply.applyUserName = data.item.sysUsers.userName;
        this.borrowApplyFormData.borrowApply.applyUserTel = data.item.mobile;
        this.getUserExtendsInfo(data);
        //this.newFreezePerson.freeResult = 0;
        this.baseUserIsShow = false;
    }
    getUserExtendsInfo(data) {
        // this.borrowListService.getUserExtendInfo(userCode).then(data => {
        //平台编号
        this.borrowApplyFormData.borrowApply.platformCode = data.item.sysUsers.flatCode;
        //平台名称
        this.borrowApplyFormData.borrowApply.platformName = data.item.sysUsers.flatName;
        //本部
        this.borrowApplyFormData.borrowApply.baseDeptName = data.item.baseDepartment.bbmc;
        //成本中心编号
        this.borrowApplyFormData.borrowApply.costcenterCode = data.item.sysUsers.costCenter;
        //成本中心名称
        this.borrowApplyFormData.borrowApply.costcenterName = data.item.sysUsers.costCenterName;

        this.borrowApplyFormData.borrowApply.subDeptName = data.item.baseDepartment.sybmc;
        this.borrowApplyFormData.borrowApply.businessScope = data.item.baseDepartment.ywfwdm;
        //获取事业部列表
        this.borrowListService.getbusinessDepts(data.item.baseDepartment.bbmc).then(data => {
            this.businessDepts = data.list;
        });
        //获取事业部业务范围列表
        this.borrowListService.getbusinessDeptScopes(data.item.baseDepartment.sybmc, data.item.baseDepartment.bbmc).then(data => {

            this.businessScopeDepts = data.list;
        });
        // });
    }
    borrowsybchange(e:any) {
        //获取事业部业务范围列表
        this.borrowListService.getbusinessDeptScopes(this.borrowApplyFormData.borrowApply.subDeptName, this.borrowApplyFormData.borrowApply.baseDeptName).then(data => {
            this.borrowApplyFormData.borrowApply.businessScope = '';//把业务范围清空
            this.businessScopeDepts = data.list;
        });
    }
    //运输信息，送货地址
    changeBorrowCustomer(e: any) {
        // this.customerName=this.borrowApplyFormData.borrowApply.borrowCustomerName;
        this.borrowListService.getBorrowCustomer(this.borrowApplyFormData.borrowApply.borrowCustomerName).then(data => {
            this.deliveryAddresses = [];
            for (let i of data.list) {
                i.deliveryAddressId = i.deliveryAddressId + "_" + i.deliveryAddress;
                this.deliveryAddresses.push(i);
            }
        });
    }
    deliveryAddressesChange(borrowApplytransportPoL: BorrowApplytransportPoL, e: any) {
        let codeValue = e.target.value;
        let values: string[] = codeValue.split("_");
        borrowApplytransportPoL.transport.deliveryAddressId = values[0];
        borrowApplytransportPoL.transport.deliveryAddress = values[1];
    }
    clickSaveBorrowApply(e: any) {
        console.info(JSON.stringify(this.borrowApplyFormData));
        // this.borrowApplyFormData.borrowApply.flowStatus=0;
        if (this.validateFormData()) {
            if (this.borrowApplyFormData.borrowApply.applyId) {
                this.borrowListService.updateBorrowApply(this.borrowApplyFormData).then(res => {
                    // res.status=res.status+"";
                    if (res.success) {
                        this.windowService.alert({ message: "操作成功", type: "success" });
                        this.router.navigate(["/borrow/list"]);
                    } else if ((res.status + "") === "2001") {
                        //验证失败
                        let errorMessage = "";
                        res.list.forEach(item => {
                            errorMessage += item.message + ";";
                        });
                        this.windowService.alert({ message: errorMessage, type: "fail" });

                    } else if ((res.status + "") === "500") {
                        this.windowService.alert({ message: res.message, type: "fail" });
                    } else {
                        console.info(res)
                    }
                })
            } else {

                this.borrowListService.postBorrowApply(this.borrowApplyFormData).then(res => {
                    //res.status=res.status+"";
                    if (res.success) {
                        this.windowService.alert({ message: "操作成功", type: "success" });
                        this.router.navigate(["/borrow/list"]);
                    } else if ((res.status + "") === "2001") {
                        //验证失败
                        let errorMessage = "";
                        res.list.forEach(item => {
                            errorMessage += item.message + ";";
                        });
                        this.windowService.alert({ message: errorMessage, type: "fail" });

                    } else if ((res.status + "") === "500") {
                        this.windowService.alert({ message: res.message, type: "fail" });
                    } else {
                        console.info(res)
                    }
                })
            }
        }
    }
    postBorrowApplySubmit(e: any) {
        //this.borrowApplyFormData.borrowApply.baseDeptName="基础网络事业部";
        // this.borrowApplyFormData.borrowApply.subDeptName="基础网络事业部";
        //this.borrowApplyFormData.borrowApply.platformName="北京";
        if (this.validateFormData()) {
            if (this.borrowApplyFormData.borrowApply.applyId) {
                this.borrowListService.postBorrowApplySubmit(this.borrowApplyFormData).then(res => {
                    res.status = res.status + "";
                    if (res.success) {
                        this.windowService.alert({ message: "操作成功", type: "success" });
                        this.router.navigate(["/borrow/list"]);
                    } else if (res.status + "" == "2001") {
                        //验证失败
                        let errorMessage = "";
                        res.list.forEach(item => {
                            errorMessage += item.message + ";";
                        });
                        this.windowService.alert({ message: errorMessage, type: "fail" });

                    } else if (res.status + "" == "500") {
                        this.windowService.alert({ message: res.message, type: "fail" });
                    }
                })
            } else {
                console.info(" Add borrowApply 223344 ");
                console.info(this.borrowApplyFormData);
                this.borrowListService.postBorrowApplyUnsave(this.borrowApplyFormData).then(res => {
                    res.status = res.status + "";
                    if (res.success) {
                        this.windowService.alert({ message: "操作成功", type: "success" });
                        this.router.navigate(["/borrow/list"]);
                    } else if (res.status + "" == "2001") {
                        //验证失败
                        let errorMessage = "";
                        res.list.forEach(item => {
                            errorMessage += item.message + ";";
                        });
                        this.windowService.alert({ message: errorMessage, type: "fail" });

                    } else if (res.status + "" == "500") {
                        this.windowService.alert({ message: res.message, type: "fail" });
                    }
                })
            }
        }
    }
    openUnClearItems() {
        if (typeof (this.borrowApplyFormData.borrowApply.applyItCode) == 'undefined' || this.borrowApplyFormData.borrowApply.applyItCode == null) {
            this.windowService.alert({ message: "请先选择申请人", type: "fail" });
        } else {
            this.modalAddForm.show({ "userItCode": this.borrowApplyFormData.borrowApply.applyItCode });
        }
    }


    getDate(date, obj: any) {
        let dataObj = new Date(date);
        let year = dataObj.getFullYear();
        let month = (dataObj.getMonth() + 1).toString();
        let day = dataObj.getDate().toString();
        if (month.length == 1) {
            month = "0" + month
        }
        if (Number(day) < 10) {
            day = "0" + day;
        }
        let temp = year + "-" + month + "-" + day;
        obj = temp;
    }

  

    getDate1(date) {
        let dataObj = new Date(date);
        let year = dataObj.getFullYear();
        let month = (dataObj.getMonth() + 1).toString();
        let day = dataObj.getDate().toString();
        if (month.length == 1) {
            month = "0" + month
        }
        if (Number(day) < 10) {
            day = "0" + day;
        }
        let temp = year + "-" + month + "-" + day;
        return temp;
    }
    //附件信息
    public attachmentList(e) {
        this.borrowApplyFormData.borrowApply.attachmentList = [];
        for (let i of e) {
            let borrowAttachment: BorrowAttachment = new BorrowAttachment();
            console.log("file==" + JSON.stringify(i));
            borrowAttachment.filePath = i.filePath;
            borrowAttachment.fileName = i.fileName;
            borrowAttachment.accordId = i.AccessoryID;
            borrowAttachment.applyId = this.borrowApplyFormData.borrowApply.applyId;
            this.borrowApplyFormData.borrowApply.attachmentList.push(borrowAttachment);
        }
    }
    public editTimeMap(aid: string) {
        if (typeof (aid) == 'undefined') {
            this.showTimeMap();
        } else {
            this.addressId = aid;
            this.showLocation = true;
        }
    }
    public showTimeMap() {
        this.addressId = "";
        this.showLocation = true;
    }
    public missData(e) {
        this.showLocation = e;
    }

    public fmoney(s, n): number {
        /*
        * 参数说明：
        * s：要格式化的数字
        * n：保留几位小数
        * */
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        let l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        let t: string = "";
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "" : "");
        }
        //console.error(t.split("").reverse().join("") + "." + r);
        return parseFloat(t.split("").reverse().join("") + "." + r);
    }

    public validateFormData() {
       
        if(this.borrowApplyFormData.borrowApply.subDeptName === ''){
            this.windowService.alert({ message: "事业部不能为空", type: "fail" });
            return false;
        }
         console.log(this.borrowApplyFormData.borrowApply.businessScope);
        if(this.borrowApplyFormData.borrowApply.businessScope === ''){
            this.windowService.alert({ message: "业务范围不能为空", type: "fail" });
            return false;
        }
        if (this.borrowApplyFormData.borrowApply.factory === undefined || this.borrowApplyFormData.borrowApply.factory === '') {
            this.windowService.alert({ message: "工厂不能为空", type: "fail" });
            return false;
        }
        if (this.borrowApplyFormData.borrowApply.deliveryType != undefined && this.borrowApplyFormData.borrowApply.factory.length > 0) {
            let length = this.borrowApplyFormData.borrowApply.factory.length;
            let scope = this.borrowApplyFormData.borrowApply.factory.substring(length - 2, length).toLocaleLowerCase();
            let scopevalue = this.borrowApplyFormData.borrowApply.businessScope.toLocaleLowerCase();
            if (scopevalue.indexOf(scope) == -1) {
                this.windowService.alert({ message: "请确保业务范围前两位等于工厂后两位", type: "fail" });
                return false;
            }
        } 
        if (typeof (this.borrowApplyFormData.borrowApply.borrowAttributeCode) == 'undefined') {
            this.windowService.alert({ message: "借用属性不能为空", type: "fail" });
            return false;
        } if (typeof (this.borrowApplyFormData.borrowApply.borrowTypeCode) == 'undefined') {
            this.windowService.alert({ message: "借用类型不能为空", type: "fail" });
            return false;
        } if (typeof (this.borrowApplyFormData.borrowApply.projectName) != 'undefined') {
            if (this.borrowApplyFormData.borrowApply.projectName.length > 40) {
                this.windowService.alert({ message: "项目名称不能超过40个字符", type: "fail" });
                return false;
            }
        } if (typeof (this.borrowApplyFormData.borrowApply.projectName) == 'undefined' || this.borrowApplyFormData.borrowApply.projectName == "") {
            if (this.borrowApplyFormData.borrowApply.borrowAttributeCode == 'SALESIGN') {
                this.windowService.alert({ message: "售前签单项目名称不能为空", type: "fail" });
                return false;
            } if (this.borrowApplyFormData.borrowApply.borrowAttributeCode == 'REVIEW' && this.borrowApplyFormData.borrowApply.borrowTypeCode == '69') {
                this.windowService.alert({ message: "外部评测项目名称不能为空", type: "fail" });
                return false;
            }
        }
        if (typeof (this.borrowApplyFormData.borrowApply.borrowCustomerName) == 'undefined' || this.borrowApplyFormData.borrowApply.borrowCustomerName == '') {
            this.windowService.alert({ message: "借用客户名称不能为空", type: "fail" });
            return false;
        }
         if (typeof (this.borrowApplyFormData.borrowApply.borrowDate) == 'undefined' || this.borrowApplyFormData.borrowApply.borrowDate == null || this.borrowApplyFormData.borrowApply.borrowDate == "") {
            this.windowService.alert({ message: "借用日期不能为空", type: "fail" });
            return false;
        } 
         if (typeof (this.borrowApplyFormData.borrowApply.borrowDayCount) == 'undefined' || this.borrowApplyFormData.borrowApply.borrowDayCount == null || this.borrowApplyFormData.borrowApply.borrowDayCount < 1) {
            this.windowService.alert({ message: "借用天数不能为空", type: "fail" });
            return false;
        }
         if (typeof (this.borrowApplyFormData.borrowApply.deliveryType) == 'undefined') {

            this.windowService.alert({ message: "交货方式不能为空", type: "fail" });
            return false;
        }
        if (this.borrowApplyFormData.borrowApply.borrowMemo != null && typeof (this.borrowApplyFormData.borrowApply.borrowMemo) != 'undefined' && this.borrowApplyFormData.borrowApply.borrowMemo != "") {
            if (this.borrowApplyFormData.borrowApply.borrowMemo.length > 140) {
                this.windowService.alert({ message: "借用说明不能超过40个字符", type: "fail" });
                return false;
            }
        }
         if (this.borrowApplyFormData.borrowApply.attachmentList.length == 0) {
            this.windowService.alert({ message: "借用依据不能为空", type: "fail" });
            return false;
        } if (this.borrowApplyFormData.transportPoList.length == 0) {
            this.windowService.alert({ message: "物料与运输信息不能为空", type: "fail" });
            return false;
        }

        for (let transport of this.borrowApplyFormData.transportPoList) {
            if (typeof (transport.transport.inventory) == 'undefined' || transport.transport.inventory == '') {
                this.windowService.alert({ message: "库存地不能为空", type: "fail" });
                return false;
            }

            if (!this.hideTransportInfo) {
                if (typeof (transport.transport.arrivalDate) == 'undefined' || transport.transport.arrivalDate == '') {
                    this.windowService.alert({ message: "期望到货日期不能为空", type: "fail" });
                    return false;
                } if (typeof (transport.transport.transportCode) == 'undefined' || transport.transport.transportCode == '') {
                    this.windowService.alert({ message: "运输方式不能为空", type: "fail" });
                    return false;
                }
                if (typeof (transport.transport.deliveryAddressId) == 'undefined' || transport.transport.deliveryAddressId == '') {
                    this.windowService.alert({ message: "送货地址不能为空", type: "fail" });
                    return false;
                } if (typeof (transport.transport.startTransport) == 'undefined' || transport.transport.startTransport == '') {
                    this.windowService.alert({ message: "运输起点不能为空", type: "fail" });
                    return false;
                }

            }

            if (transport.materielList.length == 0) {
                this.windowService.alert({ message: "运输单内物料不能为空", type: "fail" });
                return false;
            }
            for (let materiel of transport.materielList) {
                if (typeof (materiel.meterialNo) == 'undefined' || materiel.meterialNo == '') {
                    this.windowService.alert({ message: "物料编号不能为空", type: "fail" });
                    return false;
                }
                if (typeof (materiel.batch) == 'undefined' || materiel.batch == '') {
                    this.windowService.alert({ message: "物料批次不能为空", type: "fail" });
                    return false;
                }
                if (typeof (materiel.unit) == 'undefined' || materiel.unit == '') {
                    this.windowService.alert({ message: "物料单位不能为空", type: "fail" });
                    return false;
                } if (typeof (materiel.count) == 'undefined') {
                    this.windowService.alert({ message: "物料数量不能为空", type: "fail" });
                    return false;
                }
            }
        }
        return true;
    }

}
//