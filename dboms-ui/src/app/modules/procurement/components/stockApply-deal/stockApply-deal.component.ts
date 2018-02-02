import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { HttpServer } from 'app/shared/services/db.http.server';

export class PageNo { }
@Component({
    templateUrl: 'stockApply-deal.component.html',
    styleUrls: ['stockApply-deal.component.scss']
})
export class StockApplyDealComponent implements OnInit {
    constructor(
        private dbHttp: HttpServer
    ) { }

    ngOnInit() {
       
    }
}