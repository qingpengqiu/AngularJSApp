import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
// import { Pager } from 'app/shared/index';
// import { billBackService } from '../services/bill-back.service'

export class PageNo { }
@Component({
    templateUrl: 'materielstockfind.html',
    styleUrls: ['materielstockfind.scss']
})
export class MaterielStockFindComponent  {
	public myApplyShow = true;
	public myApplyEmpty=false;
	public myApproveShow = false;
	public myApproveEmpty = false;
	public liLive = true;
}