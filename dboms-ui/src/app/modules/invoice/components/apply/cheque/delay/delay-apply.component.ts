import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Pager, XcModalService, XcBaseModal, XcModalRef, DbWfviewComponent } from 'app/shared/index';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { InvoiceCommonListComponent } from '../../../common/invoice-common-list.component';
import { ErrorTipMessageComponent } from '../../../common/error-tip-message.component';
import { WindowService } from 'app/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DelayApply, DelayInvoice, InvoiceSelectPo } from './delay-info';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { InvoiceChangeService } from "../../../../services/invoice/invoice-change.service";
import { environment_java,environment } from '../../../../../../../environments/environment';
import { Person } from 'app/shared/services/index';

declare var window;

declare var navigator;

class DelayAttachment {
    constructor(
        public fileId: string,
        public fileName: string,
        public filePath: string
    ) { }
}

@Component({
    templateUrl: './delay-apply.component.html',
    styleUrls: ['./delay-apply.component.scss'],
    providers: [DatePipe]
})

export class InvoiceDelayApplyComponent implements OnInit {
    showSbumitBtn: boolean = true; //显示提交按钮
    modalAddForm: XcModalRef;
    errorMessageForm: XcModalRef;
    invoiceList = new Array();  //申请单的支票列表信息
    delayApply = new DelayApply();
    itcodeAndUserName: string = "";
    platformCode: string = "";//平台代码
    javaurl: string = environment_java.server;
    fileUploadApi: string;//上传excel文件接口
    errorMessageList = new Array();//excel错误信息
    attachList = new Array();//附件信息
    message: string = "";//附件上传失败提醒信息
    public upLoadECFile: FileUploader = new FileUploader({ url: environment.server+"InvoiceRevise/UploadIRAccessories" });
    public sqr = [];
    deptApprover: string = "";
    riskApprover: string = "";
    riskManagerApprover: string = "";
    applyId: string = "";
    serverAddress: string = "http://10.0.1.26:88";
    @ViewChild('wfview')
    wfView: DbWfviewComponent;
    isClick: boolean = false;//是否提交
    wfData = {
        wfHistoryData: null,//流程日志列表数据
        wfprogress: null//流程图数据
    };
    public approverList = new Array();

    constructor(private windowService: WindowService,
        private xcModalService: XcModalService,
        private http: Http,
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        private changeService: InvoiceChangeService) { }

    ngOnInit() {
        // if (this.route.snapshot.queryParams['id']) {//驳回再发起
        //     this.applyId = this.route.snapshot.queryParams['id'];
        //     this.getInvoiceDelayData(this.applyId);
        // } else {//新建申请单
        //     this.getUserInfo();
        //     this.fileUploadApi = this.getFileUploadUrl();
        //     this.modalAddForm = this.xcModalService.createModal(InvoiceCommonListComponent);
        //     this.errorMessageForm = this.xcModalService.createModal(ErrorTipMessageComponent);
        //     //模型关闭的时候 如果有改动，请求刷新
        //     this.modalAddForm.onHide().subscribe((data) => {
        //         if (data) {
        //             data.forEach(item => {
        //                 let invoice = new DelayInvoice();
        //                 invoice.invoiceNum = item.ticketNum;
        //                 invoice.invoiceAmount = item.ticketAmount;
        //                 invoice.customCode = item.customCode;
        //                 invoice.customName = item.customName;
        //                 invoice.contractNum = item.contractNum;
        //                 invoice.checkoutDate = item.checkoutDate;
        //                 this.invoiceList.push(invoice);
        //             });
        //         }
        //     })
        //     this.fileUploadApi = this.getFileUploadUrl();

        // }

        this.route.params.subscribe((params) => {
            if (params['id']) {//驳回再发起
                this.applyId = params['id'];
                this.getInvoiceDelayData(this.applyId);
            } else {//新建
                this.getUserInfo();
                this.fileUploadApi = this.getFileUploadUrl();
                this.modalAddForm = this.xcModalService.createModal(InvoiceCommonListComponent);
                this.errorMessageForm = this.xcModalService.createModal(ErrorTipMessageComponent);
                //模型关闭的时候 如果有改动，请求刷新
                this.modalAddForm.onHide().subscribe((data) => {
                    if (data) {
                        data.forEach(item => {
                            let invoice = new DelayInvoice();
                            invoice.invoiceNum = item.ticketNum;
                            invoice.invoiceAmount = item.ticketAmount;
                            invoice.customCode = item.customCode;
                            invoice.customName = item.customName;
                            invoice.contractNum = item.contractNum;
                            invoice.checkoutDate = item.checkoutDate;
                            this.invoiceList.push(invoice);
                        });
                    }
                })
                this.fileUploadApi = this.getFileUploadUrl();
            }
        });
    }

    getInvoiceDelayData = function (applyId) {
        let url = this.javaurl + 'invoice/delay-apply-detail/' + applyId;
        this.http.get(url)
            .map(res => res.json())
            .subscribe(res => {
                this.delayApply = res.item[0].invoiceDelayApply;
                let dataPerson = {
                    userID: this.delayApply.applyItcode,
                    userEN: this.delayApply.applyItcode,
                    userCN: this.delayApply.applyUserName
                };
                this.sqr.push(dataPerson);
                this.invoiceList = res.item[0].delayInvoiceList;
                this.attachList = res.item[0].attachList;
                this.wfData.wfHistoryData = res.item[1];//流程审批记录信息
                this.wfData.wfprogress = res.item[2];//流程图信息
                //  this.wfView.onInitData(this.wfData.wfprogress);
                this.isCurrApprover = res.item[3];
                if (this.delayApply.flowStatus == 1 && this.isCurrApprover == 1) {
                    this.isShowApproverBtn = true;
                } else {
                    this.isShowApproverBtn = false;
                }
                this.currentNode = this.delayApply.flowCurrNodeId;
                this.getApprovers(this.delayApply.applyItcode);
                this.changeService.getUserByItcode(this.delayApply.applyItcode).subscribe(data => {
                    this.platformCode = data.item.flatCode;//申请人平台
                });
            });
    }

    //查看
    showErrorMesForm(errorMessageList) {
        this.errorMessageForm.show(errorMessageList);
    }



    getUserInfo(): void {
        this.http.get(this.javaurl + 'common/getCurrentLoginUser')
            .map(res => res.json())
            .subscribe(res => {
                let userInfo = res.item.sysUsers;
                let itcode = userInfo.itcode.toLowerCase();
                console.log("itcode is =" + userInfo.itcode.toLowerCase());
                this.itcodeAndUserName = userInfo.userName + "\\" + itcode;
                this.delayApply.applyItcode = itcode;
                this.delayApply.applyUserName = userInfo.userName;
                this.delayApply.applyPhone = res.item.mobile;
                this.delayApply.applyDept = userInfo.deptName;
                this.platformCode = userInfo.flatCode;//登录人平台
                var data1 = {
                    userCN: userInfo.userName, userEN: itcode, userID: itcode
                };
                this.sqr.push(data1);
                this.getApprovers(this.delayApply.applyItcode);
            })
    }

    changePerson(info?) {
        this.invoiceList = new Array();//变更申请人 清空支票列表
        if (info) {
            this.delayApply.applyItcode = info[0]["userEN"];
            this.delayApply.applyUserName = info[0]["userCN"];
            this.delayApply.applyPhone = info[0]["mobile"];
            this.delayApply.applyDept = info[0]["department"].name;
            this.getApprovers(this.delayApply.applyItcode);
            this.changeService.getUserByItcode(this.delayApply.applyItcode).subscribe(data => {
                this.platformCode = data.item.flatCode;//申请人平台
            });
        }
    }

    //增加空行信息
    addtr = function () {
        let status: string = "1,3";//默认商务、财务已接收
        if (this.platformCode === "21") {//总部、北京平台
            status = "1";//商务已接收
        }
        var data1 = { "applyids": "0", "status": status, "typeval": "YQ", "sqruserItcode": this.delayApply.applyItcode };

        this.modalAddForm.show(data1);
    }

    //删除行信息
    deltr = function (idx) {
        this.invoiceList.splice(idx, 1);
    }

    close = function () {
        window.close();
    }

    getFormatDate(dataObj): string {
        if (!dataObj) {
            return "";
        }
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
        console.log(temp);
        return temp;
    }

    hasName(item) {
        let namelen = item.delayEnterDate.trim().length;
        item.isName = item.delayEnterDate && namelen > 0 ? false : true;
        let tempdate = this.getFormatDate(item.checkoutDate);
        if (tempdate > item.delayEnterDate) {
            item.isValidDate = true;
            item.delayDays = 0;
        } else {
            item.isValidDate = false;
            //延期天数计算
            let sDate = new Date(tempdate);
            let eDate = new Date(item.delayEnterDate);
            let days = eDate.getTime() - sDate.getTime();
            let time = days / (1000 * 60 * 60 * 24);
            item.isBigTen = time > 10 ? true : false;
            item.delayDays = time;
        }
    }

    //出票日期和延期入账日期比较·
    chkDate(startDate, endDate): boolean {
        let tempdate = this.getFormatDate(new Date(startDate));
        let eDate = this.getFormatDate(new Date(endDate));
        if (tempdate >= eDate) {
            return true;
        }
        return false;
    }

    //延期天数计算
    calDelayDays(item): void {
        let tempdate = this.getFormatDate(new Date(item.checkoutDate));
        let endTime = this.getFormatDate(item.delayEnterDate);
        if (tempdate > endTime) {
            this.windowService.alert({ message: "延期入账时间不能早于出票日期！", type: 'fail' });
            item.delayDays = 0;
        } else {
            item.isValidDate = false;
            let sDate = new Date(tempdate);
            let eDate = new Date(endTime);
            let days = eDate.getTime() - sDate.getTime();
            let time = days / (1000 * 60 * 60 * 24);
            item.delayDays = time;
        }
    }

    //提交申请单
    submit(): void {
        if (this.delayApply.applyItcode === "") {
            this.windowService.alert({ message: "请选择申请人！", type: 'fail' });
            return;
        }
        if (this.delayApply.applyPhone === "") {
            this.windowService.alert({ message: "联系电话不能为空！", type: 'fail' });
            return;
        }

        if (this.delayApply.delayReason == "") {
            this.windowService.alert({ message: "延期原因不能为空！", type: 'fail' });
            return;
        }
        if (this.invoiceList.length <= 0) {
            this.windowService.alert({ message: "支票不能为空！", type: 'fail' });
            return;
        }
        for (var index = 0; index < this.invoiceList.length; index++) {
            let invoiceBean = this.invoiceList[index];
            var row = index + 1;
            if (invoiceBean.delayEnterDate == "") {
                this.windowService.alert({ message: "第" + row + "行延期入账时间为空！", type: 'fail' });
                return;
            }
            if (this.chkDate(invoiceBean.checkoutDate, invoiceBean.delayEnterDate)) {
                this.windowService.alert({ message: "第" + row + "行延期入账时间不能早于出票日期！", type: 'fail' });
                return;
            }
        }
        if (this.deptApprover.length <= 0) {
            this.windowService.alert({ message: "请选择事业部审批人！", type: 'fail' });
            return;
        }
        // if (this.riskApprover.length <= 0) {
        //     this.windowService.alert({ message: "请选择风险岗审批人！", type: 'fail' });
        //     return;
        // }
        if (this.attachList.length < 1) {
            this.windowService.alert({ message: "请上传附件！", type: 'fail' });
            return;
        }
        if (this.message == "文件上传不能大于5M") {
            this.windowService.alert({ message: "文件上传不能大于5M", type: 'fail' });
            return;
        }

        this.delayApply.attachmentFileName = "t";
        this.delayApply.deptApprover = this.getStrUser(this.deptApprover);
        // this.delayApply.riskApprover = this.getStrUser(this.riskApprover);
        // if (this.riskManagerApprover != "") {
        //     this.delayApply.riskManagerApprover = this.getStrUser(this.riskManagerApprover);
        // }
        var data = {
            "invoiceDelayApply": this.delayApply,
            "delayInvoiceList": this.invoiceList,
            "attachList": this.attachList
        }
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        this.isClick = true;
        let url = "";
        if (this.applyId == "") {//submit
            url = this.javaurl + 'invoice/invoice-delay-apply/submit';
        } else {
            url = this.javaurl + 'invoice/invoice-delay-apply/reSubmit';
        }
        this.http.post(url, data, options)
            .toPromise()
            .then(res => {
                let resp = res.json();
                if (resp.success) {
                    this.windowService.alert({ message: "延期申请发起成功！", type: 'success' });
                    this.showSbumitBtn = false;
                    window.opener.document.getElementById('queryList').click();
                } else {
                    this.windowService.alert({ message: resp.message, type: 'fail' });
                    this.showSbumitBtn = true;
                    this.isClick = false;
                }
            })
    }

    getStrUser(obj) {
        var stringuser = "";
        obj.forEach(user => {
            stringuser += user.userID + ",";
        });
        if (stringuser.length > 0) {
            stringuser = stringuser.substring(0, stringuser.length - 1);
        }
        return stringuser;
    }

    downloadDelayTemplate() {
        window.location.href = '../../assets/downloadtpl/支票延期-导入模板.xlsx';
    }

    getFileUploadUrl() {

        return this.javaurl + '/invoice/delay-applys/upload-excel?id=111';
    }

    onFileCallBack(data) {//excel上传回传数据
        if (data.success) {
            console.log("len==" + data.item.errorList.length);
            if (data.item.errorList.length > 0) {
                this.showErrorMesForm(data.item.errorList);
            } else {
                for (let i = 0; i < data.item.invoiceList.length; i++) {
                    let invoiceBean = data.item.invoiceList[i];
                    this.invoiceList.push(invoiceBean);
                }
            }
        } else {
            this.windowService.alert({ message: data.message, type: 'fail' });
        }
    }

    //上传附件
    onUploadFiles(uploader: FileUploader) {
        if (uploader.queue.length) {
            if (uploader.queue[uploader.queue.length - 1]._file["size"] < 5242880) {
                uploader.queue.map(function (item) {
                    item.withCredentials = false;
                });
                uploader.uploadAll();
            } else {
                this.message = "文件上传不能大于5M";
            }
        }
        uploader.onCompleteItem = ((item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
            let data = JSON.parse(response);
            if (status === 200 && data.Result) {
                let access = JSON.parse(data.Data);
                this.attachList.push(new DelayAttachment(access[0].AccessoryID, access[0].AccessoryName, this.serverAddress + access[0].AccessoryURL))
                this.message = "上传成功";
            } else {
                this.message = "上传失败";
            }
        });
    }

    //删除附件
    onRemoveFile(item) {
        this.removeByValue(this.attachList, item);
    }

    //删除数组元素
    removeByValue(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    //附件信息
    public reAccessory(e) {
        this.attachList = e;
    }

    //获取审批人
    getApprovers = function (applyItcode) {
        let url = this.javaurl + 'invoice/delay-apply/approver/' + applyItcode;
        this.http.get(url)
            .map(res => res.json())
            .subscribe(res => {
                let approveUser = res.item;
                let approverArray = [];
                approveUser.forEach(function (item, index) {
                    let obj = {};
                    let list = [];
                    let pList = item.personList;
                    pList.forEach(function (m, i) {
                        let person = JSON.parse("{}");
                        person = {
                            id: "1",
                            name: m["name"],
                            itcode: m["itcode"]
                        }
                        list.push(new Person(person));
                    });
                    obj = {
                        nodeName: item.nodeName,
                        personList: list
                    };
                    approverArray.push(obj);
                })
                this.approverList = approverArray;
            });
    }
}