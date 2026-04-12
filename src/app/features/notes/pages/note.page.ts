import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import {
  IonContent,
  IonItemSliding,
  IonItemOption,
  IonItem,
  IonItemOptions,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  documentTextOutline,
  fitnessOutline,
  flagOutline,
  menuOutline,
  pricetagOutline,
  timeOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-note',
  templateUrl: 'note.page.html',
  imports: [IonItemOptions, IonItem, IonItemOption, IonItemSliding, IonContent, CommonModule],
})
export class NotePage implements OnInit {
  ngOnInit() {
    addIcons({
      'menu-outline': menuOutline,
      'time-outline': timeOutline,
      'pricetag-outline': pricetagOutline,
      'fitness-outline': fitnessOutline,
      'add-circle-outline': addCircleOutline,
      'flag-outline': flagOutline,
      'document-text-outline': documentTextOutline,
    });
  }
  // private facade = inject(NotesFecade);
  // notes$ = this.facade.$notes;
  // categories$ = this.facade.$categories;
  // stats$ = this.facade.$stats;
  // addNote(): void {
  //   this.facade.addNote({
  //     title: 'New Note',
  //     content: 'This is a new note.',
  //     status: 'active',
  //     isFavorite: false,
  //   });
  // }
  // toggleFavorite(id: string): void {
  //   this.facade.toggleFavorite(id);
  // }
  // deleteNote(id: string): void {
  //   this.facade.deleteNote(id);
  // }
  // trackById(index: number, item: Note) {
  //   return item.id;
  // }
}
