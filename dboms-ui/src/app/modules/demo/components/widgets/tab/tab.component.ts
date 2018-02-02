import { Component, ChangeDetectionStrategy,OnInit,Inject} from '@angular/core';
import { date,tab, tabService } from './tab.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'demo-tabs-dynamic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab.component.html'
})
export class DemoTabsBasicComponent implements OnInit {
  public tabs:Array<any>;
  public head:Array<any>;
  public table:Array<any>;
  public tabId:number;
  constructor(
    private tabService: tabService,
    @Inject(ActivatedRoute) private router: ActivatedRoute
    ) { }//注入服务

  ngOnInit() {
    // console.log(this.router)
    this.tabs = this.tabService.getTabs();
  }
  public selectTab($event){
    let id = $event.heading;
    this.table = this.tabService.getTable(id);
    this.head = this.tabService.getHead(id);
    if(id==11){
      this.tabId=11;
      console.log(this.table);
    }else if(id==12){
      this.tabId=12;
    }else if(id==13){
      this.tabId=13;
    }
  }
  public setActiveTab(index: number): void {
    this.tabs[index].active = true;
  }
  public removeItems(e){
    this.tabService.removeItems(e);
  }
  public addItems(e){
     this.tabService.addItems(e);
  }
  public getKeys(items){ return Object.keys(items); }
}