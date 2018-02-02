import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyProgressComponent } from './apply-progress.component';

describe('ApplyProgressComponent', () => {
  let component: ApplyProgressComponent;
  let fixture: ComponentFixture<ApplyProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
