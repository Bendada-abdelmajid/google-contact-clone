import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trush } from './trush';

describe('Trush', () => {
  let component: Trush;
  let fixture: ComponentFixture<Trush>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trush]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Trush);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
