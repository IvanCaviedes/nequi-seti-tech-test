import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

import { ButtonLogoutComponent } from '../../../auth/components/button-logout/button-logout.component';
import { NoteFilterComponent } from '../../components/note-filters/note-filters.component';
import { NoteListComponent } from '../../components/note-list/note-list.component';
import { NoteListV2Component } from '../../components/note-list-v2/note-list-v2.component';
import { StatsComponent } from '../../components/stats/stats.component';
import { StatsV2Component } from '../../components/stats-v2/stats-v2.component';
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
    NoteListV2Component,
    StatsV2Component,
  ],
})
export class NotePage {
  private facade = inject(NotesFecade);
  notes$ = this.facade.notesVM$;
  enableNewUI$ = this.facade.enableNewUI$;
}
