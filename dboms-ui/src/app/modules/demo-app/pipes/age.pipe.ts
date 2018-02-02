
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ 'name': 'pipe_age' })
export class AgePipe implements PipeTransform {
  transform(value: number): string {
    if(!value){
      return '';
    }
    if (value <= 13) {
      return '少年';
    }
    if (value > 13 && value <= 28) {
      return '青年';
    }
    if (value > 28 && value <= 40) {
      return '高级';
    }
    if (value > 40) {
      return '资深';
    }
  };
}
