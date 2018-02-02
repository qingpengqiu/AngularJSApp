import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
// import { Pager } from 'app/shared/index';
// import { billBackService } from '../services/bill-back.service'

export class PageNo { }
@Component({
    templateUrl: 'inorderfind.html',
    styleUrls: ['inorderfind.scss']
})
export class InOrderFindComponent implements OnInit{
	constructor() {

    }
	public beyond1='空';
	public beyond2='50';
	public selectclassid;
	public resjson={
		user:'',
		career:'',
		belongdepartment:'',
		simpleorder:'',
		seldimension:1,//查询维度 1申请单	2物料
		expected:true,//预期
		materorder:'',//物料号
	};
	public originalresjson;//重置用
	public data=[{
		id:1,
		value:'采购暂存',
	},{
		id:2,
		value:'销售型暂存',
	},{
		id:3,
		value:'销售回货暂存',
	},{
		id:4,
		value:'DOA类暂存',
	},{
		id:5,
		value:'物流原因暂存',
	},{
		id:6,
		value:'其他暂存',
	},{
		id:7,
		value:'超额销售性暂存',
	},]
	public seach(){
		alert('搜索');
	}
	public reset(){
		this.resjson=this.originalresjson;
	}
	public export(){
		alert('导出excel');
	}

	//获取选中暂存类别
	public selectchange(ev){
		this.selectclassid=ev;
		if (ev==1) {
			this.resjson={
				user:'zhanghao',
				career:'事业部',
				belongdepartment:'所属本部',
				simpleorder:'单据号',
				seldimension:1,//查询维度 1申请单	2物料
				expected:true,//预期
				materorder:'12341234',//物料号
			};
		}else if(ev==2){
			this.resjson={
				user:'zhanghao2222',
				career:'事业部aaa',
				belongdepartment:'所属本部222',
				simpleorder:'单据号222',
				seldimension:1,//查询维度 1申请单	2物料
				expected:true,//预期
				materorder:'12341qwe234',//物料号
			};
		}else if(ev==3){
			this.resjson={
				user:'zhanghao333',
				career:'事业部33',
				belongdepartment:'所属本部33',
				simpleorder:'单据号33',
				seldimension:1,//查询维度 1申请单	2物料
				expected:true,//预期
				materorder:'11123234',//物料号
			};
		}else{
			this.resjson={
				user:'zhanghao444',
				career:'事业部444',
				belongdepartment:'所属本部444',
				simpleorder:'单据号444',
				seldimension:1,//查询维度 1申请单	2物料
				expected:true,//预期
				materorder:'444',//物料号
			};
		}
	}

	//掉接口获取数据
	public getdata(){
		
	}
	// 超期天数交换
	public rechange(){
		let x;
		x=this.beyond1;
		this.beyond1=this.beyond2;
		this.beyond2=x;
	}
	ngOnInit() {
        console.log('ngOnInit被Angular调用');
        this.originalresjson=this.resjson;
    }

}