import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { AuthFacade } from '../../../facade/auth.facade';
import { ButtonLogoutComponent } from '../button-logout.component';

describe('ButtonLogoutComponent', () => {
  let component: ButtonLogoutComponent;
  let fixture: ComponentFixture<ButtonLogoutComponent>;
  let authFacadeSpy: jasmine.SpyObj<AuthFacade>;

  beforeEach(async () => {
    authFacadeSpy = jasmine.createSpyObj<AuthFacade>('AuthFacade', ['logout']);

    await TestBed.configureTestingModule({
      imports: [ButtonLogoutComponent],
      providers: [{ provide: AuthFacade, useValue: authFacadeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar a authFacade.logout() cuando se ejecuta el método logout()', () => {
    component.logout();
    expect(authFacadeSpy.logout).toHaveBeenCalled();
  });
});
