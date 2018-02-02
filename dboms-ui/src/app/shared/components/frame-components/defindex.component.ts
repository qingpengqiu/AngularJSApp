import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  template: `
    <div class="lead-body">
      <div class="lead-link">
        <a routerLink="/reinvoice">冲红/退换货</a>
        <a routerLink="/borrow">借用</a>
        <a routerLink="/india">用印-销售合同</a>
        <a routerLink="/invoice">票据</a>
        <a routerLink="/mate">物料</a>
        <a routerLink="/procurement">采购</a>
        <a routerLink="/temporarysave">暂存</a>
        <a routerLink="/order">销售订单</a>
        <a routerLink="/supplier">供应商管理</a>
      </div>
    </div>
  `,
  styles: [`
    .lead-body {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #bdecf9;
    }
    .lead-link {
      width: 1000px;
      margin: 80px auto;
    }
    a{
      display: inline-block;
      width: 230px;
      height: 150px;
      margin: 0 8px 20px;
      line-height: 150px;
      background-color: #fff;
      border: 1px solid #fff;
      border-radius: 10px;
      color: #393939;
      font-size: 20px;
      letter-spacing: 4px;
      text-align:center;
      transition: box-shadow .5s linear;
    }
    a:active {
      border: none;
    }
    a:focus {
      outline: none;
      text-decoration: none;
    }
    a:hover {
      -webkit-box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
  `]
})
export class DefindexComponent {
  constructor(
    private http: Http
  ) {}

}
