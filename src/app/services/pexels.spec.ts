import { TestBed } from '@angular/core/testing';

import { Pexels } from './pexels';

describe('Pexels', () => {
  let service: Pexels;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pexels);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
