import { Component } from '@angular/core';
import { WindowService } from 'app/core';

export class Params {
    message: string
    type: string
    timeout: number
}
@Component({
    templateUrl: 'window.component.html'
})
export class WindowComponent {
    constructor( private WindowService:WindowService){};
    private options = new Params
    private alert(option) {
        this.WindowService.alert(option);
    }
    private confirm(option) {
        this.WindowService.confirm(option);
    }
}
