import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { HttpServer } from 'app/shared/services/db.http.server';

export class PageNo { }
@Component({
    templateUrl: 'prepareApply-deal.component.html',
    styleUrls: ['prepareApply-deal.component.scss']
})
export class PrepareApplyDealComponent implements OnInit {
    constructor(
        private dbHttp: HttpServer
    ) { }

    ngOnInit() {
       
    }
}