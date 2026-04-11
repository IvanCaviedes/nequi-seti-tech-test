import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

import type { ButtonSize, ButtonVariant } from './ui-button.types';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [IonIcon, CommonModule, IonButton],
  templateUrl: './ui-button.component.html',
})
export class UiButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() full = false;
  @Input() icon?: string;
}
