import { APP_BASE_HREF } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';

import { AuthFacade } from '../../../facade/auth.facade';
import { LoginPage } from '../login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authFacadeSpy: jasmine.SpyObj<AuthFacade>;

  const mockState$ = new BehaviorSubject<{ loading: boolean; error: string | null; user: any }>({
    loading: false,
    error: null,
    user: null,
  });

  beforeEach(async () => {
    authFacadeSpy = jasmine.createSpyObj<AuthFacade>('AuthFacade', ['login']);
    // Mock the state$ observable exposed by facade
    (authFacadeSpy as any).state$ = mockState$.asObservable();

    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [LoginPage], // Standalone
      providers: [
        provideRouter([]),
        { provide: AuthFacade, useValue: authFacadeSpy },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta ngOnInit
  });

  it('debe crearse e iniciar con el formulario cargado', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    // Inicia con valores del formbuilder en falso (remember: false)
    expect(component.form.value.remember).toBeFalse();
  });

  it('debe restaurar email guardado si localStorage tiene la key REMEMBER_EMAIL', () => {
    localStorage.setItem(STORAGE_KEYS.REMEMBER_EMAIL, 'remembered@test.com');
    // Creamos una nueva instancia para forzar ngOnInit denuevo
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.form.value.email).toBe('remembered@test.com');
    expect(component.form.value.remember).toBeTrue();
  });

  describe('Form Validation', () => {
    it('debe marcar el form como inválido si el email está vacío', () => {
      component.form.patchValue({ email: '' });
      expect(component.form.invalid).toBeTrue();
    });

    it('debe marcar el form como inválido si el password tiene < 6 chars', () => {
      component.form.patchValue({ password: '123' });
      expect(component.form.invalid).toBeTrue();
    });

    it('togglePassword debe cambiar la visibilidad', () => {
      expect(component.showPassword).toBeFalse();
      component.togglePassword();
      expect(component.showPassword).toBeTrue();
    });

    it('toggleRemember debe invertir el valor del control', () => {
      component.form.patchValue({ remember: false });
      component.toggleRemember();
      expect(component.form.controls.remember.value).toBeTrue();
    });
  });

  describe('Submit', () => {
    it('NO debe delegar evento de auth si el formulario es inválido', () => {
      component.form.patchValue({ email: '' });
      component.submit();

      expect(component.submitted).toBeTrue();
      expect(authFacadeSpy.login).not.toHaveBeenCalled();
    });

    it('debe llamar a login en authFacade con email, password y remember', () => {
      component.form.patchValue({
        email: 'test@ok.com',
        password: 'password123',
        remember: true,
      });

      component.submit();

      expect(authFacadeSpy.login).toHaveBeenCalledWith('test@ok.com', 'password123', true);
    });

    it('debe persistir el email en localStorage si remember es true', () => {
      component.form.patchValue({ email: 'mi@email.com', remember: true });
      component.submit();
      expect(localStorage.getItem(STORAGE_KEYS.REMEMBER_EMAIL)).toBe('mi@email.com');
    });

    it('debe borrar el email de localStorage si remember es false', () => {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_EMAIL, 'old@email.com');
      component.form.patchValue({ remember: false });
      component.submit();
      expect(localStorage.getItem(STORAGE_KEYS.REMEMBER_EMAIL)).toBeNull();
    });
  });

  describe('Errors Map', () => {
    it('getError debe retornar el error correcto del mapa cuando tocado', () => {
      component.form.controls.email.setValue('invalid');
      component.form.controls.email.markAsTouched();

      expect(component.getError('email')).toBe('Invalid email');
    });

    it('getError debe retornar null si NO está tocado y NO enviado', () => {
      component.form.controls.email.setValue('');
      expect(component.getError('email')).toBeNull();
    });
  });
});
