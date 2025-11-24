import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicatGroup } from './duplicat-group';

describe('DuplicatGroup', () => {
  let component: DuplicatGroup;
  let fixture: ComponentFixture<DuplicatGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicatGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicatGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
