import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyRedComponent } from './apply-red.component';

describe('ApplyRedComponent', () => {
  let component: ApplyRedComponent;
  let fixture: ComponentFixture<ApplyRedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyRedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
