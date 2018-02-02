import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpServer } from 'app/shared/services/db.http.server';
import { ModalDirective } from "ngx-bootstrap";
import { WindowService } from 'app/core';
declare var window: any;

@Component({
  selector: 'db-wfadp',
  templateUrl: './db-wfadp.component.html',
  styleUrls: ['./db-wfadp.component.scss']
})
export class DbWfadpComponent implements OnInit {

  constructor(
    private dbHttp: HttpServer,
    private WindowService:WindowService) { }

  @ViewChild('smModal') smModal: ModalDirective;
  opinions: string = "";//审批意见
  message: string;//提示信息
  isClick: boolean = false;//防止重复点击
  @Input()
  public adpAppParms = {
    apiUrl: "",
    taskid: ""
  }
  ngOnInit() { }

  onApproval() {
    if (this.isClick) {
      this.WindowService.alert({ message: '任务处理中或已处理,请勿多次点击 ', type: "fail" });
      return;
    }
    if (this.adpAppParms instanceof Object && !!this.adpAppParms.apiUrl) {
      let parms = {
        taskid: this.adpAppParms.taskid,
        opinions: this.opinions || "同意"
      }
      //接口参数
      this.dbHttp.post(this.adpAppParms.apiUrl, parms).subscribe(data => {
        if (data.Result) {
          this.appConfirm();
        } else {
          this.isClick = true;
          this.WindowService.alert({ message: '审批出错 '+ data.Message, type: "fail" });
        }
      });
    } else {
      this.WindowService.alert({ message: '接口地址不能为空！ ', type: "fail" });
      return;
    }
  }

  appConfirm(){
    this.WindowService.confirm({ message: "审批成功,是否关闭页面？" }).subscribe({
      next: (v) => {
        if (v) {
          window.close();
        }
      }
    });
  }

  //返回
  goBack() {
    window.close();
  }

}
