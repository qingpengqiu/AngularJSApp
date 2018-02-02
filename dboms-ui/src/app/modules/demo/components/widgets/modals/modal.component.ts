import { Component, ViewChild,OnInit } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { date,tab, modalService } from './modal.service';

@Component({
  selector: 'demo-modal-auto-shown',
  templateUrl: './modal.component.html',
  styleUrls:['./modal.scss']
})
export class DemoAutoShownModalComponent implements OnInit {
  constructor(private modalService:modalService){}
  @ViewChild('autoShownModal') public autoShownModal:ModalDirective;
  public isModalShown:boolean = false;
  public DBFlag=false;
  public showModal():void {
    this.isModalShown = true;
  }
 //选择项
  // public DBSelect(e){
  //   for (var i = 0; i < e.length; i++) {
  //     e[i].select = !e[i].select;
  //   }
  // }
  // public DBItemSelect(a,b){
  //   b.select=!b.select
  //   for (var i = 0; i < a.length; i++) {
  //     if(a[i].select==false){
  //       this.DBFlag=false;
  //       console.log(a[i].select)
  //     }else {
  //       this.DBFlag=!this.DBFlag;
  //     }
  //   }
  // }
 
  public hideModal():void {
    this.autoShownModal.hide();
  }
  public onHidden():void {
    this.isModalShown = false;
  }
  public table=[];
  public head=[];
  public getKeys(items){ return Object.keys(items); }
  ngOnInit(){
    this.table=this.modalService.getTable()
    this.head=this.modalService.getHead()
  }
}