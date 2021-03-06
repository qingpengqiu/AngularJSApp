import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { TradeTicketInfo } from "../../../apply/invoice/invoice-info";
import { XcModalRef, XcModalService } from "../../../../../../shared/index";
import { TradeTicketService } from "../../../../services/tradeticket/tradeticket-apply.service";
import { InvoiceApplyService } from "../../../../services/invoice/invoice-apply.service";
import { WindowService } from "../../../../../../core/index";
import { CustomQueryComponent } from "../../../apply/invoice/customquery/custom-query.component";
import { ContractQueryComponent } from "../../../apply/invoice/contractquery/contract-query.component";
import { DebtQueryComponent } from "../../../index";
declare var window;
class TradeTicketAttachment {
    constructor(
        public fileId: string,
        public fileName: string,
        public filePath: string
    ) { }
}
@Component({
    templateUrl: './tradeticket-approve-edit.component.html',
    styleUrls:['./tradeticket-approve-edit.component.scss']
})

export class TradeTicketApproveEditComponent implements OnInit {

    tradeTicketInfo :TradeTicketInfo = new TradeTicketInfo();
    //平台下拉框
    platforms = new Array();
    YWFWDMList = new Array();
    peyeeList = new Array();
    bassinApproveList = new Array();//商务审批
    finaceApproveList = new Array();//财务审批    
    tradeticketId: string = "";
    submitFlag = true;
    serverAddress: string = "http://10.0.1.26:88";
    public upLoadECFile: FileUploader = new FileUploader({ url: "http://10.0.1.26:88/api/InvoiceRevise/UploadIRAccessories" });
    attachList = new Array();
    message: string = "";//附件上传失败提醒信息
    department:string = "";
    customForm:XcModalRef;
    contractForm:XcModalRef;
    debtForm: XcModalRef;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private invoiceApplyService: InvoiceApplyService,
        private tradeTicketService :TradeTicketService,
        private windowService :WindowService,
        private xcModalService: XcModalService
    ){}
     name = '商票申请'
    person = [];
    ngOnInit(): void{
        this.route.params.subscribe((params) => {
            this.tradeticketId = params['id'];
            this.tradeTicketService.getTradeticketById(this.tradeticketId).then(data => {
            this.tradeTicketInfo = data.item[0];
            this.attachList = data.item[3];
            let aperson = {
                        userID: data.item[0].applyItcode,
                        userEN: data.item[0].applyItcode.toLocaleLowerCase(),
                        userCN: data.item[0].applyUsername
                };
            this.person.push(aperson);
            this.getApprovals(data.item[0].platformCode);
        })
        });
        this.invoiceApplyService.getLoginUser().then(res => {
            this.department = res.baseDepartment==null?"云服务事业部":res.baseDepartment.bbmc;//所属本部          
            
        }); 
        this.getStorageList();
        this.initYWFWDM();
        this.getPayeeList();
        //客户
        this.customForm = this.xcModalService.createModal(CustomQueryComponent); 
        //合同
        this.contractForm = this.xcModalService.createModal(ContractQueryComponent); 
         //欠款金额
        this.debtForm = this.xcModalService.createModal(DebtQueryComponent); 
        

        //客户查询模型关闭时
        this.customForm.onHide().subscribe((data) => {
            if (data) {
                this.tradeTicketInfo.customCode = data.KUNNR;
                this.tradeTicketInfo.customName = data.NAME;
            }
        })

        //合同查询模型关闭时
        this.contractForm.onHide().subscribe((data) => {
            if (data) {
                this.tradeTicketInfo.contractNum = data.MainContractCode;
                this.tradeTicketInfo.contractAmount = data.ContractMoney
            }
        })

        //欠款金额查询模型关闭时
        this.debtForm.onHide().subscribe((data) => {
            if (data) {
                this.tradeTicketInfo.debtAmount = data.AMOUNT;
                this.tradeTicketInfo.voucherAmount = data.AMOUNT;
            }
        })
    } 
    changePerson(info?) {
        if (info) {
            this.tradeTicketInfo.applyItcode = info[0]["userEN"];
            this.tradeTicketInfo.applyUsername = info[0]["userCN"];
            this.tradeTicketInfo.applyPhone = info[0]["mobile"];
            this.invoiceApplyService.getUserByItcode(info[0]["userEN"]).subscribe(data => {
                  this.tradeTicketInfo.platformCode = data.item.flatCode;//申请人平台
                  this.tradeTicketInfo.platformName = data.item.flatName;//平台名称
                  this.tradeTicketInfo.applyDeptcode = data.item.deptNO;//部门名称
                  this.tradeTicketInfo.applyDeptname = data.item.deptName;//部门名称
                  this.tradeTicketInfo.businessScope = data.item.ywfwdm;//业务范围代码
                  this.getApprovals(data.item.flatCode);
            });

        }
    }
    getApprovals (plantformCode){
            this.invoiceApplyService.getApprovals(plantformCode,"ChequeBusinessPost").then(
                res =>{
                     let users=res.item.persons;
                        if(users){
                          this.bassinApproveList = [];
                          for(let user of users){
                               let tperson={
                                userEN:user.itcode,
                                userID:user.itcode.toLocaleLowerCase(),
                                userCN:user.name
                              }
                              this.bassinApproveList.push(tperson);
                          } 
                        }
                }
            );  
            this.invoiceApplyService.getApprovals(plantformCode,"ChequeFinanceApprove").then(
                res =>{
                     let users=res.item.persons;
                        if(users){
                          this.finaceApproveList = [];
                          for(let user of users){
                              let tperson={
                                userEN:user.itcode,
                                userID:user.itcode.toLocaleLowerCase(),
                                userCN:user.name
                              }
                              this.finaceApproveList.push(tperson);
                          } 
                        }
                }
            );
    }
    checkNumber(theObj) {
        let reg = /^\d+(?:\.\d{1,2})?$/;
        if (reg.test(theObj)) {
            return true;
        }
        return false;
    } 
    
    isDigital(invoiceNum){
        let reg = /^\d{8}$/;
        if (reg.test(invoiceNum)) {
            return true;
        }
        return false;
     }
     /**
     * 查询客户信息
     */
    toQueryCustom(){
        this.customForm.show(0);
    }

    /**
     * 查询合同编号
     */
    toQueryContract(){
        this.contractForm.show(0+"|"+this.department);
    }

    /**
     * 查询欠款金额
     */
    toQueryDept(){
        if(this.tradeTicketInfo.customCode=="" || this.tradeTicketInfo.customCode== undefined){
            this.windowService.alert({ message: "请先选择客户", type: 'warn' });
            return;
        }
        if(this.tradeTicketInfo.payee=="" || this.tradeTicketInfo.payee== undefined){
            this.windowService.alert({ message: "请先选择欠款公司代码", type: 'warn' });
            return;
        }
        this.debtForm.show(0+"|"+this.tradeTicketInfo.customCode+"|"+this.tradeTicketInfo.payee);
    }   

    /**
     * 重新提交申请，保存到数据库
     */
    updateTradeticket():void{
        //检查必填项
        if(this.tradeTicketInfo.tradeNumber===undefined){
            this.windowService.alert({ message: "商票号为必填", type: 'warn' });
            return;
        }
        if(!this.isDigital(this.tradeTicketInfo.tradeNumber)){
                 this.windowService.alert({ message: "商票号必须为8位数字", type: 'warn' });
        }
        if(this.tradeTicketInfo.tradeAmount===undefined){
            this.windowService.alert({ message: "商票金额为必填", type: 'warn' });
            return;
        }
        if(this.tradeTicketInfo.checkoutDate===undefined){
            this.windowService.alert({ message: "到期日期为必填", type: 'warn' });
            return;
        } 
        if (this.attachList.length < 1) {
            this.windowService.alert({ message: "请上传附件！", type: 'fail' });
            return;
        } 
        if(!this.checkTheDate(this.tradeTicketInfo.checkoutDate)){
            this.windowService.alert({ message: "到期日期不得小于9天前", type: 'fail' });
            return;
        }
        let tradeTickets = new Array<TradeTicketInfo>();
        tradeTickets.push(this.tradeTicketInfo);
        var data = {
            "tradeTicketList": tradeTickets,
            "attachList": this.attachList
        }
        this.windowService.confirm({message:'确定提交？'}).subscribe(r =>{
            if(r){
                 this.submitFlag = false;
                 this.tradeTicketService.updateTradeticket(data)
                 .then(res => {
                     if(res.success){
                        this.windowService.alert({message:'操作成功',type:'success'});
                        setTimeout(function() {
                            window.opener.document.getElementById('getQueryData').click();
                            window.close();    
                        }, 1000);
                     }else{
                         this.submitFlag = true;   
                         this.windowService.alert({ message: res.message, type: 'fail' });
                     }
                 })
            }
        })
    }


    //检查出票日期不得小于当前日期日9天
    checkTheDate(checkDate:Date): boolean{
        let day = new Date();
        if(day.getTime()-new Date(checkDate).getTime()>(9 * 24 * 60 * 60 * 1000)){
            return false;
        }else{
            return true;
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
                this.attachList.push(new TradeTicketAttachment(access[0].AccessoryID, access[0].AccessoryName, this.serverAddress + access[0].AccessoryURL))
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
    getPayeeList(){
        this.tradeTicketService.getPayee().then(
            data =>{
                this.peyeeList = JSON.parse(data.Data);
            }
        )
    }

    //获取可用平台列表
    getStorageList(){
        this.invoiceApplyService.getPlatforms().then(data => {
            this.platforms = data.list;
        })
    }

    //获取平台code和名称
    getPlatForms(event): void{
        let platform = event.target.value;
        this.tradeTicketInfo.platformCode = platform.split("|")[0];
        this.tradeTicketInfo.platformName = platform.split("|")[1];
        this.getApprovals(platform.split("|")[0]);
    }

    //获取可用业务范围代码列表
    initYWFWDM(){
        this.tradeTicketService.getYWFWDM().then(data => {
            this.YWFWDMList = JSON.parse(data.Data);
        })
    } 

    goback() {
        window.close();
    }
}
