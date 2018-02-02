import { Component, OnInit } from '@angular/core';
import { HeaderBadgeService } from 'app/core/services/header.service';
import { AuthenticationService } from 'app/shared/services/authentication.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'iq-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    private headerBadgeService: HeaderBadgeService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
  }

  html = `<ul>
    <li>个人中心</li>
    <li>设&emsp;&emsp;置</li>
    <li>注&emsp;&emsp;销</li>
  </ul>`;
  title = "标题";

  badge = {};
  nbadge = {};

  changeBadge(_badge) {
    this.badge["bell"] = _badge.bell;
    this.badge["star"] = _badge.star;
  }
  ngOnInit() {
    //订阅导航标题服务
    this.headerBadgeService.observeBadge()
      .subscribe(x => {
        this.changeBadge(x)
      })
  }

  //登出
  logout(){
    this.authenticationService.logoutjava()
      .subscribe(
      data => {
        localStorage.removeItem('ticket');
        this.router.navigate(['/login']);
      },
      error => {
        console.log(error);
      });
  }

}
