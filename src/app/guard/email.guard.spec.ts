import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { emailGuard } from './email.guard';

describe('emailGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => emailGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
