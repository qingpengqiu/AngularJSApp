import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ExtendMaterl, MaterielExtendMaterielService } from '../../services/materiel-extendMateriel.service';
import { dbomsPath, environment } from "environments/environment";

@Component({
  templateUrl: 'edit-materiel-extendMateriel.component.html',
  styleUrls:['edit-materiel-extendMateriel.component.scss']
})
export class EditMaterielExtendMaterielComponent implements OnInit {

  extendType: string;
  extendList: any[] = [];

  title: string = '编辑';//标题
  materielCode: string;//物料编号
  isAddingMateriel: boolean;//添加物料，防止重复添加
  factoryValid: boolean;//工厂合法
  hasError: boolean;//提交结果有错误
  hasSubmited: boolean;//已经提交过
  fileUploadApi: string;//文件导入api
  loading: boolean;//加载效果
  codeError: string = "";//物料编号错误信息

  isSeeDetail:boolean;//是否能够继续添加，显示或者隐藏提交按钮

  unSubmit:boolean=true;//是否点击提交按钮
 
  @ViewChild('form') form: NgForm;

  constructor(
    private activatedRoute: ActivatedRoute,
    private materielExtendMaterielService: MaterielExtendMaterielService) { }

  ngOnInit() {
    this.fileUploadApi = environment.server + "material/extension/import"

    let id = this.activatedRoute.snapshot.params['id'];

    if(id == '0'){
      this.title = '新建';
      this.isSeeDetail=true;
      return;
    }else{
       this.isSeeDetail=false;
    }

    this.materielExtendMaterielService.getMaterielDetail(id).then(result => {
      this.extendType = result.data.list[0].ExtendType.toString();
      this.extendList = result.data.list;
      this.extendList.forEach(item => {
        item.isSucceed = true;
      });
      this.hasSubmited = true;
    })
  }

  //添加一行物料
  addMateriel(){
    if(this.isAddingMateriel){return};//防止连续点击
    this.isAddingMateriel = true;//正在请求物料序列号
    this.materielExtendMaterielService.getSerialNumber(this.materielCode).then(result => {
      if(result.success){
        this.extendList.push(new ExtendMaterl(result.data.data));
      }else{
        this.codeError = result.message;
      }
      this.isAddingMateriel = false;//请求完成
    });
  }

  //删除该行扩展
  removeExtend(i){
    if(this.extendList[i].isSucceed){return};
    this.extendList.splice(i, 1);
    this.hasError = this.extendList.some(item => !item.isSucceed);
  }

  //下载模板
  download(et: string){
    switch (et) {
      case "0":
        window.open(dbomsPath+'assets/downloadtpl/扩展工厂模板.xlsx')
        break;
      case "1":
        window.open(dbomsPath+'assets/downloadtpl/扩展批次模板.xlsx')
        break;
      case "2":
        window.open(dbomsPath+'assets/downloadtpl/扩展库存地模板.xlsx')
        break;
      
      default:
        // code...
        break;
    }
  }

  //导入
  fileUpSuccess(data){
    console.log(data);
    this.hasSubmited = true;
    data.forEach(item => {
      item.editAble = true;
    });
    this.extendList = this.extendList.concat(data);
  }

  //保存
  save(){
    
    this.extendList.forEach(item => {
      item.ExtendType = this.extendType;
      //item.valid = !!item.ReferFactory && !!item.ExtendFactory && item.ReferFactory.slice(-2) == item.ExtendFactory.slice(-2);
    });

    let arrTmp = this.extendList.filter(item => !item.isSucceed);//过滤出未提交成功的项
    if(arrTmp.length == 0){return};

    this.loading = true;
    this.materielExtendMaterielService.saveExtend(arrTmp).then(data => {
      console.log(data);
      this.loading = false;
      this.hasSubmited = true;
      this.hasError = !data.success;
      
      this.extendList.forEach(item => {
        item.isSucceed = true;
        item.editAble = false;
      });

      this.unSubmit=false;

      if(!data.success){
        this.extendList.forEach(item => {
          JSON.parse(data.message).forEach(obj => {
            if(obj.SN == item.SerialNumber){
              item.isSucceed = false;
              item.errorMsg = obj.Error;
            }
          })
        })
      }else{
        this.isSeeDetail=false;
      }
    })
  }

  //修改
  modify(){
    this.extendList.forEach(item => {
      item.editAble = !item.isSucceed;
    })
    //this.hasError=false;
  }

  //取消
  cancel(){
    window.close();
  }
}