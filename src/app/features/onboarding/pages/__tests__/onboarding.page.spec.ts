import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { OnboardingFacade } from '../../facade/onboarding.facade';
import { OnboardingPage } from '../onboarding.page';

describe('OnboardingPage', () => {
  let component: OnboardingPage;
  let fixture: ComponentFixture<OnboardingPage>;
  let facadeSpy: jasmine.SpyObj<OnboardingFacade>;

  beforeEach(async () => {
    facadeSpy = jasmine.createSpyObj<OnboardingFacade>('OnboardingFacade', [
      'init',
      'destroy',
      'next',
      'prev',
      'finish',
    ]);
    (facadeSpy as any).state$ = new BehaviorSubject({
      activeIndex: 0,
      isLast: false,
    }).asObservable();

    await TestBed.configureTestingModule({
      imports: [OnboardingPage],
      providers: [{ provide: OnboardingFacade, useValue: facadeSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingPage);
    component = fixture.componentInstance;
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener slides configurados', () => {
    expect(component.slides.length).toBeGreaterThan(0);
  });

  it('next() delega a facade.next()', () => {
    component.next();
    expect(facadeSpy.next).toHaveBeenCalled();
  });

  it('prev() delega a facade.prev()', () => {
    component.prev();
    expect(facadeSpy.prev).toHaveBeenCalled();
  });

  it('finish() delega a facade.finish()', () => {
    component.finish();
    expect(facadeSpy.finish).toHaveBeenCalled();
  });
});
