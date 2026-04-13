import { CommonModule } from '@angular/common';
import type { OnDestroy, OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

import { OnboardingFacade } from '../facade/onboarding.facade';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [IonContent, CommonModule],
  templateUrl: './onboarding.page.html',
})
export class OnboardingPage implements OnInit, OnDestroy {
  facade = inject(OnboardingFacade);
  state$ = this.facade.state$;

  slides = [
    {
      title: 'Organize your thoughts',
      desc: 'Capture ideas instantly and keep everything structured.',
      emoji: '🧠',
    },
    {
      title: 'Work faster',
      desc: 'A clean and fast experience designed for productivity.',
      emoji: '⚡',
    },
    {
      title: 'Always synced',
      desc: 'Access your notes anywhere, anytime.',
      emoji: '📱',
    },
  ];

  ngOnInit() {
    this.facade.init();
  }

  ngOnDestroy() {
    this.facade.destroy();
  }

  next() {
    this.facade.next();
  }

  prev() {
    this.facade.prev();
  }

  finish() {
    this.facade.finish();
  }
}
