import { Component } from '@angular/core';

export class Hero{
  id:number;
  name:string;
}
const HEROES:Hero[]=[
  {id:11,name:'Mr Zhang'},
  {id:12,name:'Jacke'},
  {id:13,name:'Lesile'},
  {id:14,name:'HanMeiMei'},
  {id:15,name:'Lijian'},
  {id:16,name:'Andy'},
  {id:17,name:'Lucy'},
  {id:18,name:'Bottle'},
  {id:19,name:'Book'}
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tour of Heroes';
  heroes = HEROES;
  selectedHero: Hero;
 
  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
}
