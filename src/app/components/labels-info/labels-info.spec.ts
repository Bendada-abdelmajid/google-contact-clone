import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelsInfo } from './labels-info';

describe('LabelsInfo', () => {
  let component: LabelsInfo;
  let fixture: ComponentFixture<LabelsInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelsInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelsInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
