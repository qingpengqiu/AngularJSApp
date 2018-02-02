import { XcModalService, XcBaseModal, XcModalRef} from 'app/shared/modules/xc-modal-module/index';

import {SomeThing } from "../../../index";

import { Component, OnInit, Type } from '@angular/core';

@Component({
  templateUrl: 'modal-page-modal1.component.html',
  styleUrls:['modal-page-modal1.component.scss']
})
export class ModalPageModal1Component implements XcBaseModal , OnInit {
  selected = false;
  passData = {};
  something = {};
  modal;

  close() {
    //关闭，关闭后再次打开会保留原属性
    let data = { "title": "传回的数据" };
    this.modal.hide(data);
  }
  destroy() {
    //销毁，销毁后就没了
    let data = { "title": "传回的数据" };
    this.modal.destroy(data);
  }
  constructor(private xcModalService: XcModalService) {
    this.something = new SomeThing();
  }

  ngOnInit() {
    //获取对话框对象,不能放constructor里面
    this.modal = this.xcModalService.getInstance(this);
  }

  stopClick(e){
    e.stopPropagation();
  }

  //在内部打开窗体
    index = 0;
    private modalList = [];
    private add(n?:Number){
      let m = ModalPageModal1Component;

      if(n && n == 2){
        m = ModalPageModal2Component;
      }
      return this.addComponent(m);
    }
    addAndShow(n?:Number) {
      let modal = this.add(n);
      modal.show();
    }
    private addComponent(x:Type<XcBaseModal>): XcModalRef {
      let data = { "passData":{"title": "传入的对象","time":new Date().getTime()} };
      this.index++;
      let modal = this.xcModalService.createModal(x, data);
      let item = {"cf":x,"id":this.index,"modal":modal};
      this.modalList.push(item);

      let list = this.modalList;
      modal.onShow().subscribe((x) => console.log("show", x));
      modal.onDestroy().subscribe((x) => {
        console.log("descroy", x);
        let index = list.indexOf(item);
        list.splice(index, 1);
      });
      modal.onHide().subscribe((x) => console.log("hide", x));
      return modal;
    }
    show(modal) {
      modal.show();
    }
}

@Component({
  templateUrl: 'modal-page-modal2.component.html',
  styleUrls:['modal-page-modal2.component.scss']
})
export class ModalPageModal2Component extends ModalPageModal1Component implements OnInit {

}

@Component({
  templateUrl: 'modal-page.component.html',
})
export class ModalPageComponent implements OnInit {
  constructor(private xcModalService: XcModalService) { }

  ngOnInit() { }

  index = 0;
  private modalList = [];
  private add(n?:Number){
    let m = ModalPageModal1Component;
    if(n && n == 2){
      m = ModalPageModal2Component;
    }
    return this.addComponent(m);
  }
  addAndShow(n?:Number) {
    let modal = this.add(n);
    modal.show();
  }
  private addComponent(x:Type<XcBaseModal>): XcModalRef {
    let data = { "passData":{"title": "传入的1对象","time":new Date().getTime()} };

    this.index++;
    let modal = this.xcModalService.createModal(x, data);


    let item = {"cf":x,"id":this.index,"modal":modal};
    this.modalList.push(item);

    let list = this.modalList;
    modal.onShow().subscribe((x) => console.log("show", x));
    modal.onDestroy().subscribe((x) => {
      console.log("descroy", x);
      let index = list.indexOf(item);
      list.splice(index, 1);
    });

    modal.onHide().subscribe((x) => console.log("hide", x));
    return modal;
  }
  show(modal) {
    modal.show();
  }
}
