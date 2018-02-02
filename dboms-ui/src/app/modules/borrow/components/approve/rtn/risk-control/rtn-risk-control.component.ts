import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WindowService } from 'app/core';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { RtnApproveService } from './../../../../services/rtn-approve.service';
import { DbWfviewComponent } from 'app/shared/index';
import { Person } from 'app/shared/services/index';
import { 
   RtnTransport,
   RtnMaterielApp,
   BorrowReturnApply,
   QualityTestReport,
   RtnMateriel,
   RtnTransportPo,
   BorrowReturnApplyPo,
   QualityTestReportPo,
   BorrowReturnListService
   } from './../../../../services/rtn-list.service';
@Component({
    templateUrl: './rtn-risk-control.component.html',
    styleUrls: ['./rtn-risk-control.component.scss'],
     providers: [RtnApproveService],
  
})
export class RtnApproveRiskControlComponent implements OnInit {
    public applyId: string;
    public applyPage:string;//是否审批页面
    public rtnAppPo:BorrowReturnApplyPo=new BorrowReturnApplyPo();
    public currAppFlag:boolean=false;//是否审批状态
    public zjCurrAppFlag:boolean=false;//是否质检岗审批状态
    public materialFlag:boolean=false;//器材岗审批标识
    public  rptTestPo:QualityTestReportPo=new QualityTestReportPo();
    public remark: string;
    public flowCurrPerFlag:boolean;
    public unRtnMaterielAppList:RtnMateriel[]=[];
     public saleRole:boolean =true;//非销售员角色
         userInfo = new Person();//申请人
         notChange: boolean = false;//等到人员信息有了再带入头像
    @ViewChild('wfview')
    wfView: DbWfviewComponent;//展示流程图
    wfData = {
        wfHistoryData: null,//流程日志列表数据
        wfprogress: null//流程图数据
    };
      constructor(private route: ActivatedRoute,  private rtnApproveService: RtnApproveService, private location: Location, private windowService: WindowService) {

    }
    name = '借用实物归还申请';
    ngOnInit() {
 //判断是否是销售员角色
          this.rtnApproveService.getUserRole().then(data=>{
            let roleCodes = data.item;
               // console.log("roleCodes=" +roleCodes);
                if(roleCodes.indexOf("0000000001")>=0||roleCodes.indexOf("0000000002")>=0){
                 this.saleRole = false;
                 }
            });

         //获取是审批页面还是查看页面  
        this.route.params.subscribe(params => { this.applyId = params["id"];this.applyPage=params["applypage"]; });
         //查询申请单信息
        this.rtnApproveService.queryApplyformDetail(this.applyId)
            .then(res => {
                 console.log("res222=" +JSON.stringify(res));
                        this.currAppFlag=res.currAppFlag;//是否当前审批人
                        if(this.currAppFlag&&this.applyPage==="1"){
                         this.currAppFlag=true;   
                        }else{
                          this.currAppFlag=false;     
                        }
                      
                        this.rtnAppPo=res.item as BorrowReturnApplyPo;

                             this.userInfo.userEN = this.rtnAppPo.borrowReturnApply.applyItCode;
                             this.userInfo.userID = this.rtnAppPo.borrowReturnApply.applyItCode.toLocaleLowerCase();
                             this.userInfo.userCN = this.rtnAppPo.borrowReturnApply.applyUserName;
                              this.notChange=true;
                          console.log("flowCurrNodeId=" +this.rtnAppPo.borrowReturnApply.flowCurrNodeId);

                          

                          //器材岗审批

                          if(this.rtnAppPo.borrowReturnApply.flowCurrNodeId==='node5'||this.rtnAppPo.borrowReturnApply.flowCurrNodeId==='node6'){
                            this.materialFlag=true;
                          }

                          if(this.currAppFlag&&this.rtnAppPo.borrowReturnApply.flowCurrNodeId==='node2'){//是否质检岗审批
                            this.zjCurrAppFlag=true;

    //                 this.rtnApproveService.getUnClearItemByReservationNo(this.rtnAppPo.borrowReturnApply.reservationNo).then(data => {

    //              console.log("res=" +JSON.stringify(data));
    //            if (data.list.length>0) {
               

                
    //             for (let i = 0; i < data.list.length; i++) {
    //             let unClearItemPo = data.list[i];
              
    //             let maters= new Array<RtnMaterielApp>(unClearItemPo.unclearMaterialItemList.length);
    //             this.unRtnMaterielAppList=[];
    //              for(let j=0; j < unClearItemPo.unclearMaterialItemList.length; j++){
    //                let mater = unClearItemPo.unclearMaterialItemList[j];
    //                 maters[j]=new RtnMaterielApp();
    //                 maters[j].unclearMaterialId=mater.unclearMaterialId;
    //                 maters[j].unRtnCount=mater.count;
    //                this.unRtnMaterielAppList.push(maters[j])
    //              }
    //            }
    //         }
           
    //      console.log("unRtnMaterielAppList=" +JSON.stringify(this.unRtnMaterielAppList));
    // });
                          
                        }
                            //console.info("res==="+res.rtnTransportPoList);
                           console.log("currApprAuthorsItcode=" +this.rtnAppPo.borrowReturnApply.currApprUserIds);  
                          
                        for(let i=0;i<this.rtnAppPo.rtnTransportPoList.length;i++){
                             console.log("res=" +JSON.stringify(this.rtnAppPo.rtnTransportPoList[i]));
                             for(let j=0;j<this.rtnAppPo.rtnTransportPoList[i].rtnMaterielAppList.length;j++){
                                 let mater =this.rtnAppPo.rtnTransportPoList[i].rtnMaterielAppList[j];
                                 let materVo=new RtnMateriel();
                                 materVo.applyId=mater.applyId;
                                 materVo.batch=mater.batch;
                                 materVo.count=mater.count;
                                 materVo.meterialNo=mater.meterialNo;
                                 materVo.meterialMemo=mater.meterialMemo;
                                 materVo.unit=mater.unit;
                                 materVo.totalAmount=mater.totalAmount;
                                 materVo.price=mater.price;
                                 materVo.unclearMaterialId=mater.unclearMaterialId;
                                 this.rptTestPo.rtnMaterielList.push(materVo);
                                 materVo.unRtnCount=mater.count;
                                 this.unRtnMaterielAppList.push(materVo);
                             }

                        }
               console.log("tota借用审批-风控lAmount="+this.rtnAppPo.borrowReturnApply.instId);
                  
                  if(this.rtnAppPo.borrowReturnApply.instId){
                //查询审批日志和流程图
                this.rtnApproveService.queryLogHistoryAndProgress(this.rtnAppPo.borrowReturnApply.instId)
                    .then(data => {
                          console.log("wfData====="+JSON.stringify(data));
                        this.wfData = data;
                        this.wfView.onInitData(this.wfData.wfprogress);
                    })

                    if(this.rtnAppPo.borrowReturnApply.flowCurrNodeId!='node2'){
                        
                         this.rtnApproveService.queryQualityTestReport(this.rtnAppPo.borrowReturnApply.applyId)
                    .then(data => {
                        if(data){
                            this.rptTestPo = data;
                        }
                        console.log("fffffffffffff=="+JSON.stringify(data));
                        
                         console.log("fffffffffffff=11="+this.rptTestPo.qualityTestReport.outerPackTest);
                    })

                }
                }
            });
            
              
            //判断当前登陆人是否为当前审批人
            // if(currPer.eq(this.rtnAppPo.borrowReturnApply.currApprAuthorsItcode){
                
            // }

    console.log("tota借用审批-风控lAmount=");
    }


public rtnInStoreChange(item:RtnMateriel){
   for(let materiel of this.rptTestPo.rtnMaterielList){
       materiel.rtnInStore=item.rtnInStore;
      
     }
}
 public validateFormData(){

    

     for(let materiel of this.rptTestPo.rtnMaterielList){
        if(typeof(materiel.rtnInStore)=='undefined'||materiel.rtnInStore==''){
                    this.windowService.alert({ message:"物料建议还入库不能为空", type: "fail" });
                    return false;
        }
     //  console.log("match=="+ /^[0-9]+.?[0-9]*$/.test(materiel.rtnInStore)+"======"+materiel.rtnInStore);
       //  console.log("match=="+ /\w{4}/.test(materiel.rtnInStore)+"======"+materiel.rtnInStore);
        if(!(/\w{4}/.test(materiel.rtnInStore))){
                this.windowService.alert({ message:"物料建议还入库输入有误", type: "fail" });
                    return false;
        }
      
     }
     return true;

 }
   agree() {
       if(this.validateFormData()){
        this.rtnApproveService.agree(this.applyId, this.remark,this.rptTestPo,this.rtnAppPo).then(data => {
            console.info("res==ffff="+this.remark);
            if (data.success) {
                this.windowService.alert({ message: "操作成功", type: "success" });
            } else {
                this.windowService.alert({ message: data.message, type: "fail" });
            }
        })
       }
        
    }

  reject() {
        this.rtnApproveService.reject(this.applyId, this.remark, "node1").then(data => {
            if (data.success) {
                this.windowService.alert({ message: "操作成功", type: "success" });
            } else {
                this.windowService.alert({ message: data.message, type: "fail" });
            }
        });
    }
     goback() {
        this.location.back();
    }


    noapplySubmit(){
        

         this.rtnApproveService.noapplySubmit(this.applyId).then(data => {
            console.info("res==ffff="+this.remark);
            if (data.success) {
                this.windowService.alert({ message: "操作成功", type: "success" });
            } else {
                this.windowService.alert({ message: data.message, type: "fail" });
            }
        })
    }
    addRtnMateriel(rtnMateriel:RtnMateriel){
        
        console.info("rtnMateriel==ffff="+rtnMateriel);
        let materVo:RtnMateriel=new RtnMateriel();
         
         materVo.batch=rtnMateriel.batch;
        
         materVo.meterialNo=rtnMateriel.meterialNo;
         materVo.meterialMemo=rtnMateriel.meterialMemo;
         materVo.unit=rtnMateriel.unit;
         materVo.totalAmount=0;
         materVo.price=rtnMateriel.price;
        materVo.unclearMaterialId=rtnMateriel.unclearMaterialId;
        this.rptTestPo.rtnMaterielList.push(materVo);
       
    }
    delRtnMateriel(i){
        this.rptTestPo.rtnMaterielList.splice(i,1);
        this.rtnAppPo.borrowReturnApply.returnTotalAmount=this.totalBorrowApplyRtnAmount();
         //borrowTotalAmount
    }

     materielNumberChange(item:RtnMateriel){
            if(item.count>0){
            let inCount=0;
            let checkCount=0;

            //获取输入的总数量
             for (let i of this.rptTestPo.rtnMaterielList) {
               
                   if(item.unclearMaterialId==i.unclearMaterialId){
                    inCount+=i.count;
                    
                  }
             
                  
            }

            //获取应该归还的总数据
             for (let mater of this.unRtnMaterielAppList) {
                  if(item.unclearMaterialId==mater.unclearMaterialId){
                    checkCount=mater.unRtnCount;
                    break;  
                  }
        }

          if(inCount>checkCount){
               this.windowService.alert({ message:"物料编号为"+item.meterialNo+"数量不能大于申请归还的数量"+checkCount, type: "fail" }); 
               item.count=0;
           }
                         item.totalAmount=item.price*item.count;
                         console.log("totalAmount=" + item.totalAmount);
                          this.rtnAppPo.borrowReturnApply.returnTotalAmount=this.totalBorrowApplyRtnAmount();
        }else{
          this.windowService.alert({ message:"物料编号为"+item.meterialNo+"数量必须大于0", type: "fail" });    
        }                  
    }

    //计算归还总金额
    totalBorrowApplyRtnAmount():number{
        try {
            let totalAmount=0;
            for (let i of this.rptTestPo.rtnMaterielList) {
               
                    totalAmount+=i.totalAmount;
             
                  
            }
            return totalAmount;
        } catch (error) {
            console.error(error);
        }
        
    }
}
