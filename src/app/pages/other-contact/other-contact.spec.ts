import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherContact } from './other-contact';

describe('OtherContact', () => {
  let component: OtherContact;
  let fixture: ComponentFixture<OtherContact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherContact]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherContact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
