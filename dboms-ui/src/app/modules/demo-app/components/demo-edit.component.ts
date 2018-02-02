import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location }               from '@angular/common';

import { Demo, DemoService } from '../services/demo.service';

import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  templateUrl:'./demo-edit.component.html'
})
export class DemoEditComponent implements OnInit {

  //服务注入
  constructor(
    private route: ActivatedRoute,
    private demoService: DemoService,
    private location : Location,
    private toastyConfig: ToastyConfig,
    private toastyService:ToastyService) {
    this.toastyConfig.theme = 'bootstrap';
   }

  demo: Demo;
  id : string;

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.demoService.getDemo(this.id).then(demo0 => {
        this.demo = demo0;
      });
    }else{
      this.demo = new Demo();
    }
  }

  //component中的操作
  saveDemo() {
    if(this.id){
      this.demoService.editDemo(this.id,this.demo).then((a)=>{
        this.toastyService.default('操作成功');
        var toastOptions:ToastOptions = {
           title: "My title",
           msg: "The message",
           showClose: true,
           timeout: 5000,
           theme: 'default',
           onAdd: (toast:ToastData) => {
               console.log('Toast ' + toast.id + ' has been added!');
           },
           onRemove: function(toast:ToastData) {
               console.log('Toast ' + toast.id + ' has been removed!');
           }
       };
       // Add see all possible types in one shot
       this.toastyService.info(toastOptions);
        this.location.back();
      });
    }else{
      this.demoService.saveDemo(this.demo).then((a)=>{
        this.toastyService.default('操作成功');
        this.location.back();
      });
    }
  }
  back(){
    this.location.back();
  }
}
