import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { HttpServer } from 'app/shared/services/db.http.server';

export class PageNo { }
@Component({
    templateUrl: 'stockApply-submit.component.html',
    styleUrls: ['stockApply-submit.component.scss']
})
export class StockApplySubmitComponent implements OnInit {
    constructor(
        private dbHttp: HttpServer
    ) { }

    ngOnInit() {
       
    }
}