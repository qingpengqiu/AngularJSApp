import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'app/core';
import { iqArrayRefactorPipe } from 'app/shared/pipes';
import { SomeThing } from 'app/modules/demo/index';


@Component({
  selector: 'app/demo/components/widgets/pipes',
  templateUrl: 'pipes-page.components.html'
})

export class PipesPageComponent implements OnInit {
  users:any[];
  expression:any[];
  sex:any[];
  num:any[];





  ngOnInit() {
    this.users=[{id:"id1",username:"xuchao1"},{id:"id2",username:"xuchao2"},{id:"id2",username:"xuchao2"}],
    this.expression=["true","false"],
    this.sex=["男","女","不祥"],
    this.num=['1','2','3'];



  }
}
