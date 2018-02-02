import { Component, OnInit } from '@angular/core';
import { ToolsService } from 'app/core';
import {ToastOptions, ToastData} from 'ng2-toasty';
import {Subject, Observable, Subscription} from 'rxjs/Rx';


// import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  templateUrl: 'toasty-page.component.html'
})
export class ToastyPageComponent implements OnInit {


  constructor(private toolsService: ToolsService) {
  }

  ngOnInit() { }

  types = [{
    name: 'Default',
    code: 'default',
  }, {
      name: 'Info',
      code: 'info'
    }, {
      name: 'Success',
      code: 'success'
    }, {
      name: 'Wait',
      code: 'wait'
    }, {
      name: 'Error',
      code: 'error'
    }, {
      name: 'Warning',
      code: 'warning'
    }];
  //
  positions = [{
    name: 'Top Left',
    code: 'top-left',
  }, {
      name: 'Top Center',
      code: 'top-center',
    }, {
      name: 'Top Right',
      code: 'top-right',
    }, {
      name: 'Bottom Left',
      code: 'bottom-left',
    }, {
      name: 'Bottom Center',
      code: 'bottom-center',
    }, {
      name: 'Bottom Right',
      code: 'bottom-right',
    }, {
      name: 'Center Center',
      code: 'center-center',
    }];
  private options = {
    title: 'Toast It!',
    msg: 'Mmmm, tasties...',
    showClose: true,
    timeout: 5000,
    theme:"bootstrap",
    type: this.types[0].code,
    position: this.positions[5].code
  };
  // position: string = this.positions[5].code;
  newToast() {
    let toastOptions: ToastOptions = {
      title: this.options.title,
      msg: this.options.msg,
      showClose: this.options.showClose,
      timeout: this.options.timeout,
      // position: this.options.position,
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
      },
      onRemove: function(toast: ToastData) {
        console.log('Toast ' + toast.id + ' has been removed!');
      }
    };
    this.toolsService.toasty(this.options.type, toastOptions);
    // switch (this.options.type) {
    //     case 'default': this.toastyService.default(toastOptions); break;
    //     case 'info': this.toastyService.info(toastOptions); break;
    //     case 'success': this.toastyService.success(toastOptions); break;
    //     case 'wait': this.toastyService.wait(toastOptions); break;
    //     case 'error': this.toastyService.error(toastOptions); break;
    //     case 'warning': this.toastyService.warning(toastOptions); break;
    // }
  }

  newCountdownToast() {
    let interval = 1000;
    let seconds = this.options.timeout / 1000;
    let subscription: Subscription;

    let toastOptions: ToastOptions = {
      title: this.options.title + ",倒数" + (seconds || 0),
      msg: this.options.msg + "，倒数" +(seconds || 0),
      showClose: this.options.showClose,
      // position: this.options.position,
      timeout: this.options.timeout,
      onAdd: (toast: ToastData) => {
        console.log('Toast ' + toast.id + ' has been added!');
        // Run the timer with 1 second iterval
        let observable = Observable.interval(interval).take(seconds);
        // Start listen seconds bit
        subscription = observable.subscribe((count: number) => {
          // Update title
          toast.title = this.options.title + ",倒数" + (seconds - count - 1 || 0);
          // Update message
          toast.msg = this.options.msg + "，倒数" +(seconds - count - 1 || 0);
        });

      },
      onRemove: function(toast: ToastData) {
        console.log('Toast ' + toast.id + ' has been removed!');
        // Stop listenning
        subscription.unsubscribe();
      }
    };

    this.toolsService.toasty(this.options.type, toastOptions);
    // switch (this.options.type) {
    //     case 'default': this.toastyService.default(toastOptions); break;
    //     case 'info': this.toastyService.info(toastOptions); break;
    //     case 'success': this.toastyService.success(toastOptions); break;
    //     case 'wait': this.toastyService.wait(toastOptions); break;
    //     case 'error': this.toastyService.error(toastOptions); break;
    //     case 'warning': this.toastyService.warning(toastOptions); break;
    // }
  }

  clearToasties() {
    this.toolsService.clearAllToasty();
  }
}
