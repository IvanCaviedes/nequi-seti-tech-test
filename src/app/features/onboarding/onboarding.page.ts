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
  private interval?: number | null;

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
  }

  private startAutoPlay() {
    this.clearAutoPlay();

    this.interval = setInterval(() => {
      this.next(true);
    }, 3500); // ⏱ cada 3.5s
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
    // localStorage.setItem('onboarding_done', 'true');
    // this.router.navigateByUrl('/auth/login');
  }
}
