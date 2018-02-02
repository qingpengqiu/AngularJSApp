import { Component, OnInit } from '@angular/core';
import { CustomSettingService } from 'app/core';

@Component({
  templateUrl: 'public-service-page.component.html',
})
export class PublicServicePageComponent implements OnInit {
  constructor(private customSettingService: CustomSettingService) { }
  setting: any;
  pageSize: number;

  private initSetting() {
    this.setting = this.customSettingService.getSetting();
    this.pageSize = this.setting.pageSize;
  }

  ngOnInit() {
    this.initSetting();
  }
  saveSetting() {
    this.customSettingService.set("pageSize", this.setting.pageSize);
    this.initSetting();
  }
}
