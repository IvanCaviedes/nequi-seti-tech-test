import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-note-filters',
  templateUrl: './note-filters.component.html',
  imports: [IonIcon, CommonModule],
})
export class NoteFilterComponent {}
