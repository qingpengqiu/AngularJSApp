import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { Location } from '@angular/common';
import { Http } from '@angular/http';
import { WindowService } from 'app/core';

@Component({
  selector: 'borrow-file',
  templateUrl: './borrowFileUp.component.html'
})
export class BorrowFileUpComponent implements OnInit {
  @Output() upflie = new EventEmitter();
  @Input() accessoryExamine;

  constructor(private location: Location, private WindowService: WindowService, private http: Http) {

  }
  public upLoadECFile: FileUploader = new FileUploader({ url: "http://10.0.1.26:88/api/InvoiceRevise/UploadIRAccessories" });
  public checkUrlFlag;//是否查看页面
  public removeItem(e) {
    for (let i = 0, len = this.accessoryExamine.length; i < len; i++) {
      if (e.AccessoryName == this.accessoryExamine[i].AccessoryName) {
        this.accessoryExamine.splice(i, 1);
      }
    }
    this.upflie.emit(this.accessoryExamine);
  }
  // public accessoryArray = [];//附件数据
  public accessory: accessory;

  //上传附件
  onUploadFiles(uploader: FileUploader) {
    uploader.queue.map(function (item) {
      item.withCredentials = false;
    });
    uploader.uploadAll();
    uploader.onCompleteItem = ((item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {

      let data = JSON.parse(response);

      if (status === 200 && data.Result) {
        // if (response.Message == "出现错误。") {

        // }
        console.info(data.Data);
        let access = JSON.parse(data.Data);
        if (this.accessoryExamine == undefined) {
          this.accessoryExamine = [];
        }
        this.accessoryExamine.push(
          new accessory(
            0,
            access[0].AccessoryName,
            access[0].AccessoryURL
          )
        );
      } else {
        console.log("false")
        this.WindowService.alert({ message: '文件上传失败,请检查文件大小及格式，不可超过5M', type: 'success' });;
      }

      this.upflie.emit(this.accessoryExamine);
    });
  }
  ngOnInit() {
  }
}
export class accessory {
  constructor(
    public AccessoryID: number,
    public fileName: any,
    public filePath: any,
    //public fileName
  ) { }
};