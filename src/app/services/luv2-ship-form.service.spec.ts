import { TestBed } from '@angular/core/testing';

import { Luv2ShipFormService } from './luv2-ship-form.service';

describe('Luv2ShipFormService', () => {
  let service: Luv2ShipFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Luv2ShipFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
