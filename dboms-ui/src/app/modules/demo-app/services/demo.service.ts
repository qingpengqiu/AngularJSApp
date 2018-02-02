import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { iqHttpService, URLSearchParams, RequestOptions} from 'app/core/';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class Demo {
  id: string;
  name: string;
  age: number;
  gender: number;
  company: string;
  job: string;
  abc: string;
  constructor() { }
}

//let DemoES: Demo[] = [];

const FETCH_LATENCY = 500;

@Injectable()
export class DemoService {
  url = "api/customer";

  constructor(private http: iqHttpService) {

  }

  getDemoes(query?: URLSearchParams | String): Observable<Demo[]> {

    let requestOptions = new RequestOptions();
    if (query instanceof URLSearchParams) {
      requestOptions.search = query;
    } else if (typeof query === "string") {
      requestOptions.search = new URLSearchParams(query);
    }
    return this.http.get(this.url, requestOptions)
      //  .toPromise()
      .map(response => response.json() as Demo[])
  }

  getDemo(id: string) {
    //es6里面字符串全部用单引号
    return this.http.get(this.url + '/' + id)
      .toPromise()
      .then(response => response.json() as Demo)
      .catch(this.handleError);
    // return this.getDemoes()
    //   .then(Demoes => Demoes.find(Demo => Demo.id === +id));
  }

  saveDemo(demo: Demo) {

    return this.http.post(this.url, demo)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  editDemo(id: string, demo: Demo) {

    return this.http.put(this.url + '/' + id, demo)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
  deleteDemo(id: string) {
    return this.http.delete(this.url + '/' + id)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
