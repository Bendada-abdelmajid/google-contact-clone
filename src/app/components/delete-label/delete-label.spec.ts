import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLabel } from './delete-label';

describe('DeletLabel', () => {
  let component: DeleteLabel;
  let fixture: ComponentFixture<DeleteLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
