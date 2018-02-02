import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
// import { Pager } from 'app/shared/index';
// import { billBackService } from '../services/bill-back.service'

export class PageNo { }
@Component({
    templateUrl: 'outwarehousemanage.html',
    styleUrls: ['outwarehousemanage.scss']
})
export class OutWarehouseManageComponent  {
	
	public myApplyShow = false;
	public myApplyEmpty=false;
	public myApproveShow = true;
	public myApproveEmpty = true;
	public applyType = 1;
	public approveType = 1;

	public datalist=[{
		date:'2017-08-12',
		applyorder:'R201705123309',
		usernamecn:'张浩 ',
		usernameen:'zhanghao',
		company:'移动',
		zc_class:'销售型暂存',
		zc_reason:'reason reason reason',
		facnum:'北京库房',
		fac:'21RM',
		simplenum:'12341234',
		status:'未核销',
	}];
	// 申请、审批大标签页切换
	public getapply(e) {
        this.myApproveShow = false;
        this.myApplyShow = true;
    }
    public getapprove(e) {
        this.myApplyShow = false;
        this.myApproveShow = true;
    }
    
	// 小标签页的切换
    public changeapplytype(num){
    	this.applyType=num;
    }
    public changeapprovetype(num){
    	this.approveType=num;
    }
}
