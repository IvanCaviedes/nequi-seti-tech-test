import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize } from 'rxjs';

import { ROUTES } from 'src/app/core/constants/routes.constant';
import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';

import { AuthService } from '../services/auth.service';

type AuthState = {
  loading: boolean;
  error: string | null;
  user: { email: string } | null;
};

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private authService = inject(AuthService);
  private router = inject(Router);

  private state = new BehaviorSubject<AuthState>({
    loading: false,
    error: null,
    user: null,
  });

  readonly state$ = this.state.asObservable();

  constructor() {
    this.restoreSession();
  }

  // =========================
  // STATE HELPERS
  // =========================

  private patch(partial: Partial<AuthState>) {
    this.state.next({
      ...this.state.value,
      ...partial,
    });
  }

  private setToken(token: string, remember: boolean) {
    if (remember) {
      localStorage.setItem(STORAGE_KEYS.AUTH, token);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.AUTH, token);
    }
  }

  // =========================
  // SESSION
  // =========================

  private restoreSession() {
    const user = this.authService.getCurrentUser();

    if (user) {
      this.patch({ user });
    }
  }

  isAuthenticated(): boolean {
    return !!this.state.value.user;
  }

  // =========================
  // LOGIN
  // =========================

  login(email: string, password: string, remember: boolean) {
    this.patch({ loading: true, error: null });

    this.authService
      .login(email, password)
      .pipe(finalize(() => this.patch({ loading: false })))
      .subscribe({
        next: (res) => {
          this.setToken(res.token, remember);

          this.patch({
            user: res.user,
          });

          void this.router.navigateByUrl('/app/' + ROUTES.APP.ROOT);
        },
        error: (err: unknown) => {
          const errorMessage = err instanceof Error ? err.message : 'Login failed';
          this.patch({
            error: errorMessage,
          });
        },
      });
  }

  // =========================
  // REGISTER
  // =========================

  register(email: string, password: string) {
    this.patch({ loading: true, error: null });

    this.authService
      .register(email, password)
      .pipe(finalize(() => this.patch({ loading: false })))
      .subscribe({
        next: (res) => {
          // 🔥 auto-login
          this.setToken(res.token, true);

          this.patch({
            user: res.user,
          });

          void this.router.navigateByUrl('/app/' + ROUTES.APP.ROOT);
        },
        error: (err: unknown) => {
          const errorMessage = err instanceof Error ? err.message : 'Register failed';
          this.patch({
            error: errorMessage,
          });
        },
      });
  }

  // =========================
  // LOGOUT
  // =========================

  logout() {
    this.authService.logout();

    this.patch({
      user: null,
      error: null,
      loading: false,
    });

    void this.router.navigateByUrl('/auth/login');
  }
}
