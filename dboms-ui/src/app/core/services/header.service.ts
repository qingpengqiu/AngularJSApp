import { Injectable } from '@angular/core';


import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HeaderBadgeService {

  private badgeSubject:Subject<any>;
  private badge ={};

  constructor() {
    this.badgeSubject = new Subject();
  }

  changeBadge = (k:string,v:number)=>{
    this.badge[k] = v;
    this.badgeSubject.next(this.badge);
  }

  observeBadge = function(){
    return this.badgeSubject;
  }
}
