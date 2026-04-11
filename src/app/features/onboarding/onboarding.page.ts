import { CommonModule } from '@angular/common';
import type { OnDestroy, OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding.page.html',
})
export class OnboardingPage implements OnInit, OnDestroy {
  private router = inject(Router);

  step = 0;

  interval?: number | null;
  progressInterval?: number | null;

  progress = 0; // autoplay progress (0-100)

  slides = [
    {
      title: 'Organize your thoughts',
      desc: 'Capture ideas instantly and keep everything structured.',
      emoji: '🧠',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Work faster',
      desc: 'A clean and fast experience designed for productivity.',
      emoji: '⚡',
      color: 'from-blue-500 to-cyan-400',
    },
    {
      title: 'Always synced',
      desc: 'Access your notes anywhere, anytime.',
      emoji: '📱',
      color: 'from-emerald-500 to-teal-400',
    },
  ];

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.clearAutoPlay();
    this.clearProgress();
  }

  // =========================
  // AUTO PLAY
  // =========================

  private startAutoPlay() {
    this.clearAutoPlay();
    this.startProgress();

    this.interval = window.setInterval(() => {
      this.next(true);
      this.startProgress();
    }, 3500);
  }

  private clearAutoPlay() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private resetAutoPlay() {
    this.startAutoPlay();
  }

  // =========================
  // PROGRESS (SLIDE TIMER)
  // =========================

  private startProgress() {
    this.clearProgress();

    const duration = 3500;
    const start = Date.now();

    this.progressInterval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      this.progress = Math.min((elapsed / duration) * 100, 100);

      if (this.progress >= 100) {
        this.progress = 0;
      }
    }, 30);
  }

  private clearProgress() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  // =========================
  // NAVIGATION
  // =========================

  next(fromAuto = false) {
    if (this.step < this.slides.length - 1) {
      this.step++;
    } else {
      this.finish();
      return;
    }

    if (!fromAuto) {
      this.resetAutoPlay();
    }
  }

  prev() {
    if (this.step > 0) {
      this.step--;
    }
    this.resetAutoPlay();
  }

  finish() {
    this.clearAutoPlay();
    this.clearProgress();

    // localStorage.setItem('onboarding_done', 'true');
    void this.router.navigateByUrl('/auth/login');
  }

  // =========================
  // TOTAL PROGRESS
  // =========================

  get totalProgress() {
    return ((this.step + 1) / this.slides.length) * 100;
  }
}
