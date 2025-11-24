import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPrint } from './contact-print';

describe('ContactPrint', () => {
  let component: ContactPrint;
  let fixture: ComponentFixture<ContactPrint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactPrint]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactPrint);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
