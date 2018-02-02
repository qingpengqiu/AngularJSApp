import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export class Demo {
  constructor(public id: number, public name: string) { }
}

let DemoES: Demo[] = [
  new Demo(11, 'Mr. Nice'),
  new Demo(12, 'Narco'),
  new Demo(13, 'Bombasto'),
  new Demo(14, 'Celeritas'),
  new Demo(15, 'Magneta'),
  new Demo(16, 'RubberMan')
];

const FETCH_LATENCY = 500;

@Injectable()
export class DemoService {
  constructor(){};

  getDemoes() {

    return new Promise<Demo[]>(resolve => {
      setTimeout(() => { resolve(DemoES); }, FETCH_LATENCY);
    });
  }

  getDemo(id: number | string) {
    return this.getDemoes()
      .then(Demoes => Demoes.find(Demo => Demo.id === +id));
  }

}
