import { TestBed } from '@angular/core/testing';

import { ResetService } from './reset.service';

describe('ResetService', () => {
  let service: ResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
