import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { codeGuard } from './code.guard';

describe('codeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => codeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
