import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams, Headers, Http, RequestOptionsArgs } from '@angular/http';
import { environment_java } from "environments/environment";
import {
  SelectOption,
  DeliveryAddress,BaseCityCounty} from '../../common/borrow-entitys';
@Component({
    selector: 'show-location',
    templateUrl: 'address.component.html'
})
export class AddressComponent implements OnInit {
    address:DeliveryAddress=new DeliveryAddress();
    constructor(private http:Http) {

    }
    @Input() tabledata;
    @Input() customerName;
    @Input() addressId;
    @Output() missData = new EventEmitter;
    @Output() addressData = new EventEmitter;
    public hideList() {
        this.missData.emit(false);
    }
    public saveBill() {
        this.address.province = this.selected.ReceivingProvince[0].text;
        this.address.city = this.selected.ReceivingCity[0].text;
        //this.addressPo.citycode = this.selected.ReceivingCity[0].id;
        this.address.area = this.selected.ReceivingCounty[0].text;
        
        // this.address.internalinvoiceno = this.tabledata[0].internalinvoiceno;
       
         //console.log("this.address=="+JSON.stringify(this.address));
         if(this.address.id){
            this.http.put(environment_java.server+"borrow/customer-address/" + this.addressId, this.address)
                .map(res => res.json())
                .subscribe(res => {
                    this.address =res.item;  
                     this.addressData.emit(this.address);
                        this.missData.emit(false);
                         console.log("res-id=e="+this.address.id);
                })
         }else{
        this.http.post(environment_java.server+"borrow/customer-address", this.address)
                .map(res => res.json())
                .subscribe(res => {
                    console.log("res-res=="+JSON.stringify(res));
                   this.address =res.item;  
                     this.addressData.emit(this.address);
                        this.missData.emit(false);
                         console.log("res-id=="+this.address.id);
                })
         }
      
                
      
    }
    // public address = {
    //     "SDF_NAME": "",
    //     "detailaddress": "",
    //     "province": "",
    //     "city": "",
    //     "citycode": "",
    //     "district": "",
    //     "zipcode": "",
    //     "connecter": "",
    //     "phone": "",
    //     "signstandard": "",
    //     // internalinvoiceno:''
    // }
    public selectInfo: SelectInfo;//下拉框数据
    public selected = {
        City: [],//城市
        County: [],//市区
        ReceivingProvince: [],//收货人省份
        ReceivingCity: [],//收货人市
        ReceivingCounty: []//收货人区/县
    };//下拉选中项数据
    //获取收货人地址下拉框数据
    public copyReceivingCityList = null;
    public copyReceivingDistrictList = null;
    public copyCountyList = [];
    //收货人地址
    public ReceivingProvinceList: Array<any> = [];
    public ReceivingCityList: Array<any> = [];
    public ReceivingDistrictList: Array<BaseCityCounty> = [];


    public onSelectCity(value) {
        let newArray = [];
        this.copyCountyList.forEach(function (element, index, array) {
            if (element.id.substring(0, 5) === value.id) {
                element.id = String(index);
                newArray.push(element);
            }
        });
        this.selectInfo['CountyList'] = newArray;
        this.selected.County = [];
    }

    //省份下拉框操作
    public onSelectReceivingProvince(value) {
 console.log("unclearMaterialItemLists=" +JSON.stringify(value));
  
           this.http.get(environment_java.server+"common/province-city/"+value.id).toPromise()
            .then(res => {
                let  list = res.json().list;
                  this.selectInfo.ReceivingCityList =list;
                console.log("CityList=="+list);
                   this.selected.ReceivingCity = [];
                   this.selected.ReceivingCounty = [];
                    this.address.zipCode="";
            }
            );
     
 
    }


    //市区下拉框
    public onSelectReceivingCity(value) {
        
        console.log("value.id=" +JSON.stringify(value.id));
  
         this.http.get(environment_java.server+"common/city-county/"+value.id).toPromise()
            .then(res => {
                let  list1 = res.json().list;
                // let subData = new Array<string>(list1.length);
                // console.log("quList=dddddd="+list1.length);
                //   for (let i = 0;i<list1.length;i++) {
                //         console.log("quList=ddd="+list1[i].countyName);
                //       subData[i]=list1[i].countyName;
                      
                     
                //    }
                  console.log("list1======="+JSON.stringify(list1));
            let newArray = [];

                 list1.forEach(function (element, index, array) {
                       console.log("quList=="+element.countyZipCode);
                  let bpo = new BaseCityCounty(); 
                  bpo.id=element.countyZipCode;
                  bpo.text=element.countyName;
                newArray.push(bpo);
        });
               this.selectInfo.ReceivingDistrictList=newArray;
               this.selected.ReceivingCounty = [];
                 this.address.zipCode="";
             console.log("quList=="+JSON.stringify(this.selectInfo.ReceivingDistrictList));
            }
            );
              //市区下拉框
    }



       public onSelectReceivingCounty (value) {
        this.address.zipCode=value.id;
        }

    public onGetReceivingSelectInfo() {


   
            this.http.get(environment_java.server+"common/province").toPromise()
            .then(res => {
                let  list = res.json().list;
                  this.selectInfo.ReceivingProvinceList =list;
                console.log("list=="+list);
            }
            );
    }
    public provinceActive = [];
    public cityActive = [];
    public districtActive = [];
    ngOnInit() {
        
        console.log("addressId ppp1=="+this.addressId);
        console.log("customerName=="+this.customerName);
        this.address.customerName=this.customerName;
        this.onGetReceivingSelectInfo();
        this.selectInfo = new SelectInfo(
            [], [], [], [], [], [], [], []
        );
        this.tabledata = [];
       
       if(this.addressId){
       console.log("addressId=1="+this.addressId);

        this.http.get(environment_java.server+"borrow/customer-address/"+this.addressId).toPromise()
            .then(res => {
                this.address= res.json().item;
                // this.selected.ReceivingProvince[0]=[this.address.province,this.address.province];
               this.provinceActive.push(
                {
                    id: this.address.province,
                    text:  this.address.province
                }
            )
            this.cityActive.push(
                {
                    id:  this.address.city,
                    text:  this.address.city
                }
            )
            this.districtActive.push(
                {
                    id:  this.address.zipCode,
                    text: this.address.area
                }
            )
              this.selected.ReceivingProvince = this.provinceActive;
            this.selected.ReceivingCity = this.cityActive;
            this.selected.ReceivingCounty = this.districtActive;
                console.log("list=="+ JSON.stringify(this.address));
            }
            );


       }else{
        console.log("addressId=2="+this.addressId);
       }
    }
    //转换方法
    onTransSelectInfos(arr: Array<any>, id, text, extendAttr?) {
        let newArr = [];
        arr.map(function (item) {
            let newItem = {};
            newItem['id'] = item[id];
            newItem['text'] = item[text];
            if (extendAttr) {
                newItem['companycode'] = item[extendAttr];
            }
            newArr.push(newItem);
        });
        return newArr;
    }
    //数据转换方法
    public changeEventObject(a, b) {
        for (let i in a) {
            for (let n in b) {
                if (i == n) {
                    b[n] = a[i]
                }
            }
        }
    }
    //下拉框数据格式修改 -- 自定义id
    onTransSelectInfosForIdChange(arr: Array<any>, id, text, extendAttr?) {
        let newArr = [];
        let i: number = 0;
        arr.map(function (item) {
            let newItem = {};
            i++;
            newItem['id'] = item[id] + String(i);
            newItem['text'] = item[text];
            if (extendAttr) {
                newItem['companycode'] = item[extendAttr];
            }
            newArr.push(newItem);
        });
        return newArr;
    }
}
export class SelectInfo {
    constructor(
        public CompanyList: Array<any>,
        public TicketTypeList: Array<any>,
        public CityList: Array<any>,
        public CountyList: Array<any>,
        public Payment: Array<any>,
        public ReceivingProvinceList: Array<any>,
        public ReceivingCityList: Array<any>,
        public ReceivingDistrictList: Array<any>
    ) { }
}
export class Selected {
    constructor(
        public Seller: SelectItem[],//卖方
        public PaymentType: SelectItem[],//付款方式
        public PayType_Ticket_Type: SelectItem[],//买方交付的票据类型
        public PayType_OP_Ticket: SelectItem[],//OP票据类型
        public PayType_PP_Ticket: SelectItem[],//PP票据类型
        public City: SelectItem[],//城市
        public County: SelectItem[],//市区
        public ReceivingProvince: SelectItem[],//收货人省份
        public ReceivingCity: SelectItem[],//收货人市
        public ReceivingCounty: SelectItem[]//收货人区/县
    ) { }
}
export class SelectItem {
    constructor(
        public id: string,
        public text: string,
        public other?: string
    ) { }
}
