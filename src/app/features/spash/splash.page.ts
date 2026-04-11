import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ROUTES } from 'src/app/core/constants/routes.constant';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  imports: [CommonModule],
})
export class SplashPage implements OnInit {
  private router = inject(Router);

  loading = 0;
  dots = '';

  ngOnInit() {
    this.animate();

    setTimeout(() => {
      //   const hasSession = !!localStorage.getItem('token');
      void this.router.navigateByUrl(ROUTES.ONBOARDING);
    }, 2600);
  }

  private animate() {
    // loading bar
    const interval = setInterval(() => {
      this.loading += Math.random() * 15;

      if (this.loading >= 100) {
        this.loading = 100;
        clearInterval(interval);
      }
    }, 120);

    // dots animation
    setInterval(() => {
      this.dots = this.dots.length >= 3 ? '' : this.dots + '.';
    }, 400);
  }
}
