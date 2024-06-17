import { TestBed } from '@angular/core/testing';

import { AccidentService } from './accident.service';

describe('AccidentService', () => {
  let service: AccidentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccidentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
