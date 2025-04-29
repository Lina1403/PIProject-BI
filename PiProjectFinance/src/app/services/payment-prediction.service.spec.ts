import { TestBed } from '@angular/core/testing';

import { PaymentPredictionService } from './payment-prediction.service';

describe('PaymentPredictionService', () => {
  let service: PaymentPredictionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentPredictionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
