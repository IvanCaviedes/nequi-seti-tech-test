import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from '@ionic/angular/standalone';

import type { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [IonIcon, IonItemOption, IonItemOptions, IonItemSliding, IonItem, CommonModule],
  templateUrl: './note-list.component.html',
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
}
