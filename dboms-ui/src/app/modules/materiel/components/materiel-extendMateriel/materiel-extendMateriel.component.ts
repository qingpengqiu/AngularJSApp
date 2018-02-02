import { Component,OnInit } from '@angular/core';
import { Pager } from 'app/shared/index';
import { WindowService } from 'app/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import { dbomsPath } from "environments/environment";

import { 
  Query,
  MaterielInfo,
  MaterielExtendMaterielService
} from '../../services/materiel-extendMateriel.service';


@Component({
  templateUrl: 'materiel-extendMateriel.component.html',
  styleUrls: ['materiel-extendMateriel.component.scss']
})
export class ExtendMaterielComponent implements OnInit {
  fullChecked = false;//全选状态
  fullCheckedIndeterminate = false;//半选状态
  checkedNum = 0;//已选项数
  query: Query;
  pagerData = new Pager();

  materielList: MaterielInfo[] = [];

  isSearch: boolean = false;//是否为搜索
  loading: boolean = true;//加载中效果

  constructor(
    private materielExtendMaterielService: MaterielExtendMaterielService,
    private windowService:WindowService) {
  }

  ngOnInit(){
    this.query = new Query();

  }

  //检查是否全选
  CheckIndeterminate(v) {
    this.fullCheckedIndeterminate = v;
  }

  onChangePager(e: any){
    this.query.PageNo = e.pageNo;
    this.query.PageSize = e.pageSize;

    this.initData(this.query);
  }

  initData(query: Query){
    this.fullChecked = false;
    this.fullCheckedIndeterminate = false;
    this.checkedNum = 0;

    this.materielExtendMaterielService.getMaterielList(query).then(result => {
      this.materielList = result.data.list;
      //设置分页器
      this.pagerData.set(result.data.pager);
      this.loading = false;
    })
  }

  //搜索
  search(){
    let startDate = this.query.BeginDate,
        endDate = this.query.EndDate;

    if(!!startDate && typeof startDate != 'string'){
      this.query.BeginDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
    }
    if(!!endDate && typeof endDate != 'string'){
      this.query.EndDate = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;
    }

    this.isSearch = !!this.query.MaterialCode || !!this.query.ExtendType || !!this.query.ApplyName || !!this.query.BeginDate || !!this.query.EndDate;
    this.loading = true;
    this.initData(this.query);
  }

  //重置搜索条件
  reset(){
    this.query = new Query();
  }

  //新建申请
  addApply(){
    window.open(dbomsPath+'mate/edit-extendMateriel/0');
  }

  //编辑扩展物料
  editMateriel(sn: string){
    window.open(dbomsPath+'mate/edit-extendMateriel/' + sn);
  }

  //删除扩展物料
  deleteMateriel(param: any){
    let callback = data => {
      if(data.success){
        this.fullChecked = false;
        this.fullCheckedIndeterminate = false;
        this.query.PageNo = 1;
        this.initData(this.query);
        this.windowService.alert({message:data.message,type:"success"});
      }else{
        this.windowService.alert({message:data.message,type:"fail"})
      }
    }

    if(typeof param == "string"){//删除单条数据
      this.windowService.confirm({message:"确定删除？"}).subscribe({
        next: (v) => {
          if(v){
            this.materielExtendMaterielService.deleteMateriel([param]).then(callback);
          }
        }
      });
    }else{//删除多条数据
      this.windowService.confirm({message:`确定删除您选中的${this.checkedNum}项？`}).subscribe(v => {
        if(v){
          let deleteArr = param.filter(item => item.checked === true).map(item => item.SerialNumber);
          this.materielExtendMaterielService.deleteMateriel(deleteArr).then(callback);
        }
      })
    }
  }

}