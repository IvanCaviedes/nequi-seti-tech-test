import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, interval, timer } from 'rxjs';
import { map, takeUntil, takeWhile } from 'rxjs/operators';

import { ROUTES } from 'src/app/core/constants/routes.constant';
import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';
import { StorageService } from 'src/app/core/services/storage.service';

import { AuthFacade } from '../../auth/facade/auth.facade';
import type { SplashState } from '../models/splash.model';

@Injectable({ providedIn: 'root' })
export class SplashFacade {
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private storage = inject(StorageService);
  private auth = inject(AuthFacade);

  private stateSubject = new BehaviorSubject<SplashState>({
    loading: 0,
    dots: '',
    status: 'loading',
  });

  state$ = this.stateSubject.asObservable();

  // =========================
  // INIT FLOW
  // =========================

  init() {
    this.startLoading();
    this.startDots();
    this.startNavigation();
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // LOADING STREAM
  // =========================

  private startLoading() {
    const duration = 2400;
    const stepTime = 80;
    const increment = 100 / (duration / stepTime);

    interval(stepTime)
      .pipe(
        takeUntil(this.destroy$),
        map((i) => Math.min(100, (i + 1) * increment)),
        takeWhile((v) => v <= 100),
      )
      .subscribe((value) => {
        this.patch({ loading: value });
      });
  }

  // =========================
  // DOTS STREAM
  // =========================

  private startDots() {
    interval(400)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const current = this.stateSubject.value.dots;
        const next = current.length >= 3 ? '' : current + '.';

        this.patch({ dots: next });
      });
  }

  // =========================
  // NAVIGATION FLOW
  // =========================

  private startNavigation() {
    timer(1600)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.patch({ status: 'navigating' });
        const nextRoute = this.resolveNextRoute();
        timer(400)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            void this.router.navigateByUrl(nextRoute, { replaceUrl: true });
          });
      });
  }

  // =========================
  // STATE PATCH
  // =========================

  private patch(partial: Partial<SplashState>) {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...partial,
    });
  }

  private resolveNextRoute(): string {
    if (!this.storage.get(STORAGE_KEYS.ONBOARDING_KEY)) {
      return '/onboarding';
    }

    if (!this.auth.isAuthenticated()) {
      return '/auth/login';
    }

    return '/app/' + ROUTES.APP.ROOT;
  }
}
