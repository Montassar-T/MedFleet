import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { resetGuard } from './reset.guard';

describe('resetGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => resetGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
