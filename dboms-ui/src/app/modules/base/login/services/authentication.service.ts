import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { environment,environment_java } from "environments/environment";

@Injectable()
export class AuthenticationService {

  constructor( private http: Http ) { }

  login(username: string, password: string) {
    let url = environment.server+'/Account/Login';
    return this.http.post(url, { ITCode: username, PassWord: password }).map(res => res.json());
  }

  loginjava(username: string) {
    let urljava = environment_java.server+'login/test?itcode='+username;
    return this.http.get(urljava, null).map(res => res.json());
  }

  getUserInfoByItCode(itcode: string) {
    let url = environment.server+'/base/GetUserByITCode/' + itcode;
    return this.http.post(url,null).map(res => res.json());
  }

  removeUserinfo(){
    localStorage.removeItem('UserInfo');
  }

  logout() {
    localStorage.removeItem('ticket');
  }
}
