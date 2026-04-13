import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

import { NotesFecade } from '../../fecade/notes.fecade';

@Component({
  selector: 'app-stats-v2-notes',
  templateUrl: './stats-v2.component.html',
  imports: [IonIcon, CommonModule],
})
export class StatsV2Component {
  private facade = inject(NotesFecade);
  notes$ = this.facade.$notes;
  stats$ = this.facade.$stats;
}
