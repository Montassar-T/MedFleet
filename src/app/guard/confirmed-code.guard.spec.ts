import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { confirmedCodeGuard } from './confirmed-code.guard';

describe('confirmedCodeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => confirmedCodeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
