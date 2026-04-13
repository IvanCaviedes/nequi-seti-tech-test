import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

import { ButtonLogoutComponent } from '../../../auth/components/button-logout/button-logout.component';
import { NoteFilterComponent } from '../../components/note-filters/note-filters.component';
import { NoteListComponent } from '../../components/note-list/note-list.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { TopBarComponent } from '../../components/topbar/topbar.component';
import { NotesFecade } from '../../fecade/notes.fecade';

@Component({
  selector: 'app-note',
  templateUrl: 'note-list.page.html',
  imports: [
    IonContent,
    CommonModule,
    ButtonLogoutComponent,
    TopBarComponent,
    StatsComponent,
    NoteListComponent,
    NoteFilterComponent,
  ],
})
export class NotePage {
  private facade = inject(NotesFecade);
  notes$ = this.facade.notesVM$;
}
