// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs/Subject';
//
// @Injectable()
// export class WindowService {
//     private alertSubject
//     private confirmSubject
//     constructor () {
//         this.alertSubject = new Subject();
//         this.confirmSubject = new Subject();
//     }
//
//     getAlertSubject(){
//       return this.alertSubject;
//     }
//     getConfirmSubject(){
//       return this.confirmSubject;
//     }
//
//     alert = (p) =>{
//         this.alertSubject.next(p);
//     }
//     confirm = (p) =>{
//         this.confirmSubject.next(p);
//     }
// }


import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

/**
window弹框服务

class Option {
 type: string
 message: string
}

*/
@Injectable()
export class WindowService {
  private _windowSubject;
  private _closeSubject;
  constructor() {
    this._windowSubject = new Subject();
  }
  //关闭的subject，方便关闭之后回调
  get closeSubject() {
    return this._closeSubject;
  }
  //弹出服务的内部subject
  get windowSubject() {
    return this._windowSubject;
  }
  show(param) {
    if (this._closeSubject) {
      return this._closeSubject;
    }
    this._closeSubject = new Subject();
    this._closeSubject.subscribe(() => {
      //延迟，如果有其他订阅者，先执行其他订阅者方法，再complete
      setTimeout(()=>{
        this._closeSubject.complete();
        this._closeSubject = null;
      });
    })
    this._windowSubject.next(param);
    return this._closeSubject;
  }
  close(v?) {
    if (this._closeSubject) {
      this._closeSubject.next(v);
    }
  }
  //alert调用
  alert(p): Observable<any> {
    return this.show({
      type: "alert",
      option: p
    });
  }
  //确认 调用
  confirm(p): Observable<any> {
    return this.show({
      type: "confirm",
      option: p
    });
  }
}
