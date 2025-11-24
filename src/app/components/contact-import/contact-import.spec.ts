import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactImport } from './contact-import';

describe('ContactImport', () => {
  let component: ContactImport;
  let fixture: ComponentFixture<ContactImport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactImport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactImport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
