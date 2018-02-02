import { Component, forwardRef, ViewChild, OnInit, Input, Output, ElementRef, ComponentRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor,NG_VALUE_ACCESSOR, DefaultValueAccessor } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { XcBaseModal, XcModalService, XcModalRef } from 'app/shared/modules/xc-modal-module/index';
import { Query, JIqSelectService } from './j-iq-select.service';
import { JIqSelectDialogComponent } from './j-iq-select-dialog.component';
declare var $;

@Component({
  selector: "j-iq-select",
  templateUrl: './j-iq-select.component.html',
  styleUrls: ['./j-iq-select.component.scss'],
  providers: [
    JIqSelectService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JIqSelectComponent),
      multi: true
    }
  ]
})
export class JIqSelectComponent implements OnInit, ControlValueAccessor {
  constructor(
    private el: ElementRef, 
    private xcModalService: XcModalService,
    private jIqSelectService: JIqSelectService) {}

  selectedItem: any;//被选项
  optionShow: boolean;//下拉框出现
  resetEvent: any;//重置
  modal: XcModalRef;//弹出框模型
  query: Query;
  optionList: any[] = [];
  itemString: boolean = false;

  searchStream = new Subject<string>();


  private onChangeCallback:any={};
  private onTouchedCallback:any={};

  @Input() listApi: string;//下拉列表选项api
  @Input() dataModal: any = {};//data数据模型
  @Input() placeHolder: string;
  @Input() modalShow: boolean = true;//弹出框出现
  @Input() noSearch: boolean = false;//隐藏搜索框
  //@Input() multi: boolean = false;//多选
  @Input() disabled: boolean = false;//禁用
  @Input() queryParams: any = {};//额外的查询参数
  @Input() required: boolean = false;
  @Input() itemIndex: number = 0;//被选项的位置
  @Input() itemValue: number = 0;//ngModel绑定值的位置

  @Output() onSelect = new EventEmitter();
  
  ngOnInit(){
    this.query = new Query();

    if(this.disabled){
      return;
    }
    
    if(this.modalShow){
      this.modal = this.xcModalService.createModal(JIqSelectDialogComponent);
      this.modal.onHide().subscribe((data?) => {
        if (data){
          this.selectedItem = data[this.itemIndex];
          this.onChangeCallback(data[this.itemValue]);
          this.onSelect.emit(data);
        }
      });
    }else{
      let $dom = $(this.el.nativeElement);//获得当前元素

      this.resetEvent = () => this.resetSearch();

      //阻止冒泡
      $dom.on("mousedown",($event)=>{
        $event.stopPropagation();
      });

      $("body").on("mousedown", this.resetEvent);

      this.searchStream
        .debounceTime(500)
        .distinctUntilChanged()
        .subscribe((keyWord: string) => {
          if(keyWord !== undefined){
            this.getOptionList();
          }
        });
    }
  }

  getOptionList(){//获取下拉列表项
    this.query.queryStr = this.query.queryStr || "";

    let tmpObj = {};
    
    if(!!this.queryParams.queryStr){
      tmpObj[this.queryParams.queryStr] = this.query.queryStr;
    }

    this.jIqSelectService.getOptionList(this.listApi, Object.assign(JSON.parse(JSON.stringify(this.query)), this.queryParams, tmpObj)).then(result => {
      
      this.dataModal.item.forEach(item => {

        result = result[item];

        if(typeof result == 'string'){
          result = JSON.parse(result);
        }

      });

      this.optionList = result.map(item => typeof item == 'string' ? item : Object.keys(item).map(i => item[i]));
      this.itemString = typeof this.optionList[0] == 'string';
    })
  }

  ngOnDestroy(){
    if(!this.modalShow){
      $("body").off("mousedown", this.resetEvent);
    }
  }

  toggle(){
    if(this.disabled){
      return;
    }

    if(this.modalShow){
      this.modal.show({api: this.listApi, queryParams: this.queryParams, dataModal: this.dataModal, noSearch: this.noSearch});
      return;
    }

    this.optionShow = !this.optionShow;

    if(this.optionShow){
      this.getOptionList();
    }
  }

  //搜索
  search(keyWord){
    this.searchStream.next(keyWord);
  }

  resetSearch(){//重置搜索条件
    this.optionShow = false;
    this.query.queryStr = "";
    this.optionList.length = 0;
  }

  chooseItem(item){//选择下拉选项
    this.selectedItem = item[this.itemValue];
    this.onChangeCallback(item[this.itemValue]);
    this.onSelect.emit(item);
    this.resetSearch();
  }

  writeValue(value) {
    this.selectedItem = value;
  }

  registerOnChange(fn) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn) {
    this.onTouchedCallback = fn;
  }

}
