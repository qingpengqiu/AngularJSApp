import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { date,tab, modalService } from './modal.service';

@Component({
  selector: 'iq-financeinfo',
  templateUrl: './financeinfo.component.html',
  styleUrls: ['./financeinfo.component.scss'],
  providers:[modalService]
})
export class FinanceinfoComponent implements OnInit {

  constructor(private modalService:modalService){}
  @ViewChild('autoShownModal') public autoShownModal:ModalDirective;
  public isModalShown:boolean = false;
 
  public showModal():void {
    this.isModalShown = true;
  }
 
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
