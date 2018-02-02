import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment_java } from '../../../../../../environments/environment';

export class Query {
  queryStr: string = '';
  pageSize: number = 10;
  pageNo: number = 1;
}


@Injectable()
export class JIqSelectService {

  constructor(private http: Http){}

  //获取下拉框列表
  getOptionList(api: string, query: any){
   
    return this.http.post(environment_java.server + api, query)
                    .toPromise()
                    .then(response => response.json())
  }
}