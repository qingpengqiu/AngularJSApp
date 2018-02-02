import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyapplyReadyComponent } from './myapply-ready.component';

describe('MyapplyReadyComponent', () => {
  let component: MyapplyReadyComponent;
  let fixture: ComponentFixture<MyapplyReadyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyapplyReadyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyapplyReadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
