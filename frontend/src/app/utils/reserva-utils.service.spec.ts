import { TestBed } from '@angular/core/testing';

import { ReservaUtilsService } from './reserva-utils.service';

describe('ReservaUtilsService', () => {
  let service: ReservaUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
