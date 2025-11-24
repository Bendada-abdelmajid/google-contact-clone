import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePicker } from './profile-picker';

describe('ProfilePicker', () => {
  let component: ProfilePicker;
  let fixture: ComponentFixture<ProfilePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
