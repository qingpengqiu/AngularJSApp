import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Http, URLSearchParams, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class Query {
  queryStr: string = '';
  tabName: number;
  applyType:number;
  pageSize: number = 10;
  pageNo: number = 1;

  constructor(tab, apply){
    this.tabName =  tab;
    this.applyType = apply;
  }
}

@Injectable()
export class SelectSearchService {

  constructor(private http: Http){}

  //获取下拉框列表
  getOptionList(query: Query){
    //console.log(query);
    return this.http.post(environment.server+ 'material/basedata/get', query)
                    .toPromise()
                    .then(response => response.json())
  }

  searchTax(query:Query){
    return this.http.post(environment.server+ 'material/basedata/Tax', query)
    .toPromise()
    .then(response => response.json())
  }

}
