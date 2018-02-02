import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
// import { Pager } from 'app/shared/index';
// import { billBackService } from '../services/bill-back.service'

export class PageNo { }
@Component({
    templateUrl: 'temporarysave-app.component.html',
    styleUrls: ['temporarysave-app.component.scss']
})
export class TemporarysaveAppComponent  {
	public myApplyShow = true;
	public myApplyEmpty=false;
	public myApproveShow = false;
	public myApproveEmpty = false;
	public switchtype = false;
	public pageindex = 1;

	public switch(){
		this.switchtype=!this.switchtype;
	}

	public pagechange(num){
		this.pageindex=num;
	}
}