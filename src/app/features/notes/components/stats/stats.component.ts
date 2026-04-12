import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

import { NotesFecade } from '../../fecade/notes.fecade';

@Component({
  selector: 'app-stats-notes',
  templateUrl: './stats.component.html',
  imports: [IonIcon, CommonModule],
})
export class StatsComponent {
  private facade = inject(NotesFecade);
  notes$ = this.facade.$notes;
  stats$ = this.facade.$stats;
}
