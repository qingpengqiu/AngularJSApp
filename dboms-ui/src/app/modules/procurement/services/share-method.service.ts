import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { HttpServer } from 'app/shared/services/db.http.server';
import { Router } from "@angular/router";
import { WindowService } from 'app/core';

@Injectable()
export class ShareMethodService {

    constructor(private dbHttp: HttpServer,
         private router: Router,
         private WindowService: WindowService) { }
    getRateConvertPrice(forAmount,currency) {//输入 外币金额 根据最新汇率 计算总额
        let myDate = new Date();
        let myDateStr = myDate.getFullYear() + "/" + myDate.getMonth() + '/' + myDate.getDay();
        let body = {
            "foreignAmount":forAmount,
            "foreignCurrency": "0",
            "localCurrency": "1",
            "dateTime": myDateStr
        }
        if (currency == '美元') {
            body.foreignCurrency = '0'
        }
        if (currency == '港元') {
            body.foreignCurrency = '2'
        }
        if (currency == '欧元') {
            body.foreignCurrency = '4'
        }
        let url = "material/rateconvert";
        return this.dbHttp.post(url, body)
        .toPromise()
        .then(response => 
            response.data.localAmount
        )
    }
}