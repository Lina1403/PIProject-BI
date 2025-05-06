import { TestBed } from '@angular/core/testing';

import { HumanDetectionService } from './human-detection.service';

describe('HumanDetectionService', () => {
  let service: HumanDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HumanDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
