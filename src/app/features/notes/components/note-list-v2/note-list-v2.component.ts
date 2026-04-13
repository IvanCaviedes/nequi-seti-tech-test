import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonIcon } from '@ionic/angular/standalone';

import { ROUTES } from 'src/app/core/constants/routes.constant';

import { NotesFecade } from '../../fecade/notes.fecade';
import type { NoteWithCategory } from '../../models/note.model';

@Component({
  selector: 'app-note-list-v2',
  standalone: true,
  imports: [IonIcon, CommonModule],
  templateUrl: './note-list-v2.component.html',
})
export class NoteListV2Component {
  private navCtrl = inject(NavController);
  readonly fecade = inject(NotesFecade);
  @Input() notes: NoteWithCategory[] = [];

  goToCreate() {
    void this.navCtrl.navigateForward('/app/' + ROUTES.APP.CATEGORIES);
  }

  toggleComplete(id: string) {
    this.fecade.toggleComplete(id);
  }

  toggleFavoriteNote(id: string) {
    this.fecade.toggleFavorite(id);
  }

  deleteTask(note: NoteWithCategory) {
    this.fecade.deleteNote(note.id);
    if (note.isFavorite) {
      this.toggleFavoriteNote(note.id);
    }
  }
}
