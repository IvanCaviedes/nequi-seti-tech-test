import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { SplashFacade } from '../../facade/spash.facade';
import { SplashPage } from '../splash.page';

describe('SplashPage', () => {
  let component: SplashPage;
  let fixture: ComponentFixture<SplashPage>;
  let facadeSpy: jasmine.SpyObj<SplashFacade>;

  beforeEach(async () => {
    facadeSpy = jasmine.createSpyObj<SplashFacade>('SplashFacade', ['init', 'destroy']);
    (facadeSpy as any).state$ = new BehaviorSubject({ progress: 0 }).asObservable();

    await TestBed.configureTestingModule({
      imports: [SplashPage],
      providers: [{ provide: SplashFacade, useValue: facadeSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SplashPage);
    component = fixture.componentInstance;
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar a facade.init en ngOnInit', () => {
    fixture.detectChanges(); // Ejecuta ngOnInit
    expect(facadeSpy.init).toHaveBeenCalled();
  });

  it('debe llamar a facade.destroy en ngOnDestroy', () => {
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(facadeSpy.destroy).toHaveBeenCalled();
  });
});
