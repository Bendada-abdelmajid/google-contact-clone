import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyWrapper } from './copy-wrapper';

describe('CopyWrapper', () => {
  let component: CopyWrapper;
  let fixture: ComponentFixture<CopyWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
