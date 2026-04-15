import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { UiInputComponent } from '../ui-input.component';

describe('UiInputComponent', () => {
  let component: UiInputComponent;
  let fixture: ComponentFixture<UiInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
