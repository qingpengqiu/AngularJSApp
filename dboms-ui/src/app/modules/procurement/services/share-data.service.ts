import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { URLSearchParams, Headers, Http, RequestOptionsArgs, RequestOptions } from '@angular/http';
import { HttpServer } from 'app/shared/services/db.http.server';
import { Router } from "@angular/router";
import { WindowService } from 'app/core';
import { SubmitMessageService } from './submit-message.service';

@Injectable()
export class ShareDataService {

    constructor(private dbHttp: HttpServer,
         private router: Router,
         private WindowService: WindowService,
         private submitMessageService: SubmitMessageService) { }
    getPlatformSelectInfo() {//获取ngSelect格式的 平台列表数据
        return this.dbHttp.post("base/basedata/GetPlatform")
        .toPromise()
        .then(response => 
            this.submitMessageService.onTransSelectInfosOther(JSON.parse(response.Data), "platformcode", "platform")
        )
    }
    getCurrencySelectInfo() {//获取ngSelect格式的 币种列表数据
        return this.dbHttp.post("InitData/GetCurrencyInfo")
        .toPromise()
        .then(response => 
            this.submitMessageService.onTransSelectInfosOther(JSON.parse(response.Data),"currencycode", "currencyname")
        )
    }
    getTaxrateSelectInfo() {//获取ngSelect格式的 税率列表数据
        return this.dbHttp.post("InitData/GetTaxrateInfo")
        .toPromise()
        .then(response => 
            this.submitMessageService.onTransSelectInfos(JSON.parse(response.Data), "taxcode", "taxratename", "taxrate")
        )
    }
    getCurrentUserInfo() {//获取登录人信息
        let headers = new Headers({ 'Content-Type': 'application/json', 'ticket': localStorage.getItem('ticket') });
        let options = new RequestOptions({ headers: headers });
        return this.dbHttp.get("base/GetCurrentUserInfo", options)
        .toPromise()
        .then(response => 
            JSON.parse(response.Data)
        )
    }
}