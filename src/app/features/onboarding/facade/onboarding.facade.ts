import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ROUTES } from 'src/app/core/constants/routes.constant';
import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';
import { StorageService } from 'src/app/core/services/storage.service';

import type { OnboardingState } from '../models/onboarding.model';

@Injectable({ providedIn: 'root' })
export class OnboardingFacade {
  storage = inject(StorageService);
  router = inject(Router);
  private destroy$ = new Subject<void>();

  private readonly duration = 3500;
  private readonly tick = 30;

  private stateSubject = new BehaviorSubject<OnboardingState>({
    step: 0,
    progress: 0,
    isLast: false,
  });

  state$ = this.stateSubject.asObservable();

  slidesLength = 3;

  init() {
    this.startProgress();
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // PROGRESS ENGINE
  // =========================

  private startProgress() {
    const increment = 100 / (this.duration / this.tick);

    interval(this.tick)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const state = this.stateSubject.value;

        let nextProgress = state.progress + increment;

        if (nextProgress >= 100) {
          this.next();
          nextProgress = 0;
        }

        this.patch({ progress: nextProgress });
      });
  }

  // =========================
  // ACTIONS
  // =========================

  next() {
    const state = this.stateSubject.value;

    if (state.step < this.slidesLength - 1) {
      this.patch({
        step: state.step + 1,
        progress: 0,
      });
    } else {
      this.finish();
    }
  }

  prev() {
    const state = this.stateSubject.value;

    if (state.step > 0) {
      this.patch({
        step: state.step - 1,
        progress: 0,
      });
    }
  }

  finish() {
    this.destroy();
    this.storage.set(STORAGE_KEYS.ONBOARDING_KEY, 'true');
    void this.router.navigateByUrl(ROUTES.AUTH.ROOT + '/' + ROUTES.AUTH.LOGIN);
  }

  // =========================
  // STATE
  // =========================

  private patch(partial: Partial<OnboardingState>) {
    const current = this.stateSubject.value;

    const next = {
      ...current,
      ...partial,
      isLast: (partial.step ?? current.step) === this.slidesLength - 1,
    };

    this.stateSubject.next(next);
  }
}
