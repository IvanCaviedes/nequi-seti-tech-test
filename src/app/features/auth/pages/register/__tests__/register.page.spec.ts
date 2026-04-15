import { APP_BASE_HREF } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AuthFacade } from '../../../facade/auth.facade';
import { RegisterPage } from '../register.page';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let authFacadeSpy: jasmine.SpyObj<AuthFacade>;

  const mockState$ = new BehaviorSubject<{ loading: boolean; error: string | null; user: any }>({
    loading: false,
    error: null,
    user: null,
  });

  beforeEach(async () => {
    authFacadeSpy = jasmine.createSpyObj<AuthFacade>('AuthFacade', ['register']);
    (authFacadeSpy as any).state$ = mockState$.asObservable();

    await TestBed.configureTestingModule({
      imports: [RegisterPage],
      providers: [
        provideRouter([]),
        { provide: AuthFacade, useValue: authFacadeSpy },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
  });

  describe('Form Validation', () => {
    it('debe marcar inválido si no se aceptan los términos', () => {
      component.form.patchValue({ acceptTerms: false });
      expect(component.form.invalid).toBeTrue();
    });

    it('debe marcar inválido si las contraseñas NO coinciden (passwordMismatch)', () => {
      component.form.patchValue({
        password: 'password123',
        confirmPassword: 'different123',
      });
      // Como usamos form.group() y la validación es a nivel group:
      expect(component.form.errors?.['passwordMismatch']).toBeTrue();
      expect(component.form.invalid).toBeTrue();
    });

    it('toggle password and confirmPassword function', () => {
      expect(component.showPassword).toBeFalse();
      expect(component.showConfirmPassword).toBeFalse();

      component.togglePassword();
      component.toggleConfirmPassword();

      expect(component.showPassword).toBeTrue();
      expect(component.showConfirmPassword).toBeTrue();
    });

    it('toggleTerms debe invertir el checkbox de términos', () => {
      component.form.patchValue({ acceptTerms: false });
      component.toggleTerms();
      expect(component.form.controls.acceptTerms.value).toBeTrue();
    });
  });

  describe('Submit', () => {
    it('NO debe delegar registro al auth facade si el formulario es inválido', () => {
      component.form.patchValue({ email: '' });
      component.submit();

      expect(component.submitted).toBeTrue();
      expect(authFacadeSpy.register).not.toHaveBeenCalled();
    });

    it('DEBE llamar a register en authFacade con email y password si todo es válido', () => {
      // Seteo para hacerlo válido!
      component.form.patchValue({
        name: 'ivan valid',
        email: 'ivan2@test.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptTerms: true,
      });

      component.submit();

      expect(authFacadeSpy.register).toHaveBeenCalledWith('ivan2@test.com', 'password123');
    });
  });

  describe('Errors Map', () => {
    it('getFormError debe retornar el map error si passwordMismatch y submitted/touched', () => {
      component.form.patchValue({
        password: 'a',
        confirmPassword: 'b',
      });
      // Simulamos submit y force verification
      component.submitted = true;
      expect(component.getFormError()).toBe('Passwords do not match');
    });

    it('getError debe retornar el string apropiado si required falla', () => {
      component.form.patchValue({ acceptTerms: false });
      component.submitted = true;
      expect(component.getError('acceptTerms')).toBe('Required field');
    });
  });
});
