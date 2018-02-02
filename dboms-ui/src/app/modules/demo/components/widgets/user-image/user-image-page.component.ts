import { Component, ViewChild, ViewContainerRef, ComponentFactory,
  ComponentRef, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { HoverPageComponent } from './hover-page.component';

@Component({
  templateUrl: 'user-image-page.component.html'
})
export class UserImagePageComponent implements OnDestroy {

  private id="8a81e6ab5b7ebe30015b7ec60f900002";
  private id1="8a81e6ab5b7ebe30015b7ec663d90002";
  private person={
    userCN:'哇哈哈',
    userEN:'wahaha',
    userID:'8a81e6ab5b4730e4015b473be1970004'
  }

  componentRef: ComponentRef<HoverPageComponent>;

  @ViewChild("hoverPageContainer", { read: ViewContainerRef }) container: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) { }

  createComponent(type: string) {
    this.container.clear();
    const factory: ComponentFactory<HoverPageComponent> =
      this.resolver.resolveComponentFactory(HoverPageComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.type = type;
    this.componentRef.instance.output.subscribe((msg: string) => console.log(msg));
  }

  ngOnDestroy() {
    if(this.componentRef){
      this.componentRef.destroy();
    }
  }
}
