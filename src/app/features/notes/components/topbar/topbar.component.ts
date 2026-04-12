import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, interval } from 'rxjs';

@Component({
  selector: 'app-topbar-notes',
  templateUrl: './topbar.component.html',
  imports: [CommonModule],
})
export class TopBarComponent {
  private destroyRef = inject(DestroyRef);

  private baseMessages = [
    'Let’s get things done ⚡',
    'Stay focused 🎯',
    'Build something great 🚀',
    'One task at a time 🧠',
  ];

  private getTimeMessage(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning 🌤️';
    }
    if (hour < 18) {
      return 'Good afternoon ☀️';
    }
    return 'Good evening 🌙';
  }

  messages: string[] = [this.getTimeMessage(), ...this.baseMessages];

  private index = 0;

  text$ = new BehaviorSubject(this.messages[0]);

  animating = false;

  constructor() {
    interval(4000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changeText());
  }

  changeText() {
    this.animating = true;

    setTimeout(() => {
      this.index = (this.index + 1) % this.messages.length;

      this.text$.next(this.messages[this.index]);

      this.animating = false;
    }, 250);
  }
}
