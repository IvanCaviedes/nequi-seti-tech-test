import { CommonModule } from '@angular/common';
import type { OnInit, OnDestroy } from '@angular/core';
import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

import { AppCardComponent } from 'src/app/shared/components/ui/app-card/app-card.component';

import { SplashFacade } from '../facade/spash.facade';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  imports: [IonContent, CommonModule, AppCardComponent],
})
export class SplashPage implements OnInit, OnDestroy {
  private facade = inject(SplashFacade);
  state$ = this.facade.state$;

  ngOnInit() {
    this.facade.init();
  }

  ngOnDestroy() {
    this.facade.destroy();
  }
}
