import { Component,OnInit,OnChanges,Input,Output,EventEmitter} from '@angular/core';
import { UserImageHeadComponent } from './user-image-head.component';
import { PersonService,Person } from 'app/shared/services/person.service';

@Component({
  selector: '[user-image]',
  templateUrl: 'user-image.component.html'
})
export class UserImageComponent implements OnInit,OnChanges {
  constructor(private personService:PersonService) {  }
  @Input('url') url:string;
  @Input('user') user:Person|string;

  @Input()
  hasClose:boolean;
  @Input() hasImg: boolean = true;
  @Output()
  onClose = new EventEmitter();
  Obj:Person;

  closeClick(){
    this.onClose.emit();
  }
  initPerson(){
    if(typeof this.user === 'string'&& this.user){
      this.personService.get(this.user).subscribe((p) => {
        this.Obj=p;
      });
    }else{
      this.Obj=<Person>this.user;
    }
  }
  ngOnChanges(){
    this.initPerson();
  }
  ngOnInit(){
  }
}
