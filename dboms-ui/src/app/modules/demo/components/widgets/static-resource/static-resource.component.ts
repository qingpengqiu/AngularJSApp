import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'app/core';


@Component({
  templateUrl: 'static-resource.component.html'
})
export class StaticResourceComponent implements OnInit {
  toBottom(){
    //window.scrollTop = document.body.scrollHeight + 'px';
  };

  ngOnInit() {

  }

}
