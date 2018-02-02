import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyProgressStep1Component } from './apply-progress-step1.component';

describe('ApplyProgressStep1Component', () => {
  let component: ApplyProgressStep1Component;
  let fixture: ComponentFixture<ApplyProgressStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyProgressStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyProgressStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
