import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanDetectionComponent } from './human-detection.component';

describe('HumanDetectionComponent', () => {
  let component: HumanDetectionComponent;
  let fixture: ComponentFixture<HumanDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HumanDetectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
