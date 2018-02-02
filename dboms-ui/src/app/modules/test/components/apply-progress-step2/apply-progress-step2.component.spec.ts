import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyProgressStep2Component } from './apply-progress-step2.component';

describe('ApplyProgressStep2Component', () => {
  let component: ApplyProgressStep2Component;
  let fixture: ComponentFixture<ApplyProgressStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyProgressStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyProgressStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
