import { Component, OnInit } from '@angular/core';
import { Pager } from 'app/shared/index';

import { WindowService } from "app/core";
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from "@angular/router";

import { MaterielChangeService,Query,ApprovalListData } from '../../services/materiel-materielChange.service';

import { dbomsPath } from "environments/environment";

@Component({
  templateUrl: 'materiel-materielChange-myapproval.component.html',
  styleUrls:['materiel-materielChange-myapproval.component.scss','../../scss/materiel.component.scss']
})
export class MaterielChangeMyApprovalComponent implements OnInit {
  //checked:any;
  //fullChecked = false;//全选状态
  //fullCheckedIndeterminate = false;//半选状态
  //checkedNum = 0;//已选项数
  pagerData = new Pager();
  query:Query=new Query();
  approvalListData:ApprovalListData=new ApprovalListData();//初始化查询列表数据

  highSearchShow: boolean = false;//高级搜索

  isHide:boolean=true;//显示或者隐藏缺省页面或者搜索列表页面

  searchList:any;//用于存储搜索结果列表

  isChangeColor:boolean=false;//是否改变字体颜色

  constructor(
    private materielChangeService: MaterielChangeService,
    private windowService:WindowService,
    private router:ActivatedRoute) { }

    //  ngOnInit() {

    //      let that=this;
    //      window.addEventListener("focus",()=>{
    //          that.initData(that.approvalListData);
    //          console.log(1);
    //        });
    //     //this.initData(this.approvalListData);
    //     window.removeEventListener("focus", ()=>{
    //       that.initData(that.approvalListData);
    //     });
       
     // }

  ngOnInit() { 
    this.isHide=true;

    let foo = () => {this.initData(this.approvalListData);};
    window.addEventListener("focus",foo);
   // window.removeEventListener("focus", foo);

  }

  //检查是否全选
  // CheckIndeterminate(v) {
  //   this.fullCheckedIndeterminate = v;
  // }

  //打开高级搜索
  openSearch(){
    this.highSearchShow = true;
  }

  //收起高级搜索
  closeSearch(){
    this.highSearchShow = false;
  }

  onTab(e){//切换选项（全部，审批中，已完成，草稿）
   let liType=document.querySelectorAll(".m-state li");

   for(let i=0;i<liType.length;i++){
     liType[i].className="";
   }
    e.target.className="active";

    switch (e.target.getAttribute("data-state")) {
      case "myExamine":
        this.approvalListData.TaskStatus = "0";
        break;
      case "endExamine":
        this.approvalListData.TaskStatus = "1";
        break;
      case "sFinish":
        this.approvalListData.TaskStatus = "2";
        break;
      default:
        break;
    }

    //this.isHide = true;//显示搜索列表页 
    // this.query.PageNo=1;
     this.initData(this.approvalListData);
  
   
  }

  search() {//点击搜索按钮的搜索
    //this.isHide = true;//显示搜索列表页
    // if (this.approvalListData.BeginDate != "") {
    //   //this.query.BeginDate = new Date(this.query.BeginDate).toLocaleDateString();
    //   console.log(this.approvalListData.BeginDate)
    // }

    // if (this.approvalListData.EndDate != "") {
    //   this.query.EndDate = new Date(this.query.EndDate).toLocaleDateString();
    // }
    this.initData(this.approvalListData);
  }

  reset() {//重置搜索数据
    let nowState =  this.approvalListData.TaskStatus;//保存当前处的tab状态（全部，审核中，已完成，草稿）
    this.approvalListData = new ApprovalListData;
    this.isChangeColor=false;//重置审批环节下拉选框的字体颜色
    this.approvalListData.TaskStatus = nowState;
    //this.query.PageSize = 10;
    this.query.PageNo=1;
  }


  deleteList(param: any) {//删除列表数据
    
            // let callback = data => {
    
            //     if (data.success) {
            //         this.fullChecked = false;
            //         this.fullCheckedIndeterminate = false;
            //         this.initData(this.query);
            //         this.windowService.alert({ message: data.message, type: "success" });
            //     } else {
            //         this.windowService.alert({ message: data.message, type: "fail" })
            //     }
            // }
    
            // if (typeof param == "string") {//删除单条数据
            //     this.windowService.confirm({ message: "确定删除？" }).subscribe({
            //         next: (v) => {
            //             if (v) {      
            //                     console.log(1);              
            //                     this.materielChangeService.deleteDataMaterielChange([param]).then(callback);
            //                     console.log(param);
            //                 }
                            
            //         }
            //     });
            // } else {//删除多条数据
            //     this.windowService.confirm({ message: `确定删除您选中的${this.checkedNum}项？` }).subscribe(v => {
            //         if (v) {
            //             let ObList = [];
            //             param.filter(item => item.checked === true ).forEach(item => {
            //               if(item.ApproveSection!=2){
            //                  ObList.push(this.materielChangeService.deleteDataMaterielChange([item.ID]));
            //               }else{
            //                 this.windowService.alert({message:"审批中，不能删除",type:"fail"});
            //               }
                            
            //             });
            //             Observable.merge.apply(null, ObList).toPromise().then(callback);
            //         }
            //     });
            // }
    
        }

  onChangePager(e: any) {//分页代码
        //this.reqSearchData.Keyword = this.reqSearchData.Keyword || "";
        this.approvalListData.PageNo = e.pageNo;
        //console.log(this.query.PageNo);
        this.approvalListData.PageSize = e.pageSize;

        this.initData(this.approvalListData);
    }

    initData(approvalListData: ApprovalListData) {//向数据库发送请求
        // this.fullChecked = false;
        // this.fullCheckedIndeterminate = false;
        // this.checkedNum = 0;

        this.materielChangeService.approvalList(this.approvalListData).then(data => {

            //设置分页器
            this.pagerData.set(data.data.pager);
            //this.loading = false;      
            this.searchList = data.data.list;
            console.log(this.searchList);
            if(this.searchList==""){//判断如果查询列表为空，则显示缺省页面
               this.isHide = false;//显示缺省页面 
            }else{
              this.isHide=true;
            }
            
        });
    }

    getDetail(ID,I){//查看详情
      let taskId=this.searchList[I].TaskId;
      let nodeid= this.searchList[I].TempNodeId;
      let ADP;
      let instanceid=this.searchList[I].InstItemId;

      let urlLink=this.searchList[I].CopyLink;
      if(urlLink.search("ADP")!=-1){//判断是否是加签审批
        ADP="1";//值为1表示加签审批
      }else{
        ADP="0";//值为零表示正常审批
      }
      //let arrUrlValue=urlLink.split("&");

      // if(arrUrlValue.some(item=>{item.split("=")[0]!=""})){
      //   ADP="1";
      //   console.log("lalalal");
      // }
      
      //console.log(arrUrlValue);

      let taskState:string;
      if(this.searchList[I].TaskState=="已处理"){
        taskState="1";
      }else{
        taskState="0";
      }
      
      this.router.params.subscribe(params=>{//获取路由传过来的值
        window.open(dbomsPath+"mate/edit-amc/"+params.id+ID+`?taskId=${taskId}&nodeid=${nodeid}&taskState=${taskState}&ADP=${ADP}&instanceid=${instanceid}`);
      });
        
    }

    changeFontColor(){//改变select选择后字体的颜色
      this.isChangeColor=true;
    }


}