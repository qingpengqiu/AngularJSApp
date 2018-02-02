import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
// import { Pager } from 'app/shared/index';
// import { billBackService } from '../services/bill-back.service'

export class PageNo { }
@Component({
    templateUrl: 'newapply.html',
    styleUrls: ['newapply.scss']
})
export class NewApplyComponent  implements OnInit {
    constructor() { }
    
  public mSAPcode=['1111','2222','3333','4444','5555'];
  public examineMoney=[{
    num:1,
    matenum:'000001',
    matename:'iphone6s',
    batch:'DNB031Z',
    Inventory:'库存地',
    goalnum:55,
    actualrnum:22,
    money:1222.00,
    weight:0.765,
    volume:3.702,
    allweight:0.11,
    allvolume:0.11,
    row:11,
  },{
    num:1,
    matenum:'000001',
    matename:'iphone6s',
    batch:'DNB031Z',
    Inventory:'库存地',
    goalnum:55,
    actualrnum:22,
    money:1222.00,
    weight:0.765,
    volume:3.702,
    allweight:0.11,
    allvolume:0.11,
    row:11,
  },{
    num:1,
    matenum:'000001',
    matename:'iphone6s',
    batch:'DNB031Z',
    Inventory:'库存地',
    goalnum:55,
    actualrnum:22,
    money:1222.00,
    weight:0.765,
    volume:3.702,
    allweight:0.11,
    allvolume:0.11,
    row:11,
  }]

  

    ngOnInit() {
     }
}