import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPredictionComponent } from './payment-prediction.component';

describe('PaymentPredictionComponent', () => {
  let component: PaymentPredictionComponent;
  let fixture: ComponentFixture<PaymentPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentPredictionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
