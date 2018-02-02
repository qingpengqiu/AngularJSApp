import { Component, ChangeDetectionStrategy,OnInit,Input} from '@angular/core';

@Component({
  selector: 'demo-table',
  templateUrl: './table.component.html'
})
export class DemoTableComponent implements OnInit {
  @Input() date;  
  
  ngOnInit(){
      console.log(this.date);
  }
}