import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { StatsV2Component } from '../stats-v2.component';

describe('StatsV2Component', () => {
  let component: StatsV2Component;
  let fixture: ComponentFixture<StatsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsV2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
