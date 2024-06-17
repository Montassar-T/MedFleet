import { TestBed } from '@angular/core/testing';

import { NotifcationsService } from './notifcations.service';

describe('NotifcationsService', () => {
  let service: NotifcationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifcationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
