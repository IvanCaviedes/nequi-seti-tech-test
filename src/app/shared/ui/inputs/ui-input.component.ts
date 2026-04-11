import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

import type { InputSize, InputVariant } from './ui-input.types';

@Component({
  selector: 'app-ui-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ui-input.component.html',
})
export class UiInputComponent {
  @Input() value = '';
  @Input() placeholder = '';

  @Input() type: 'text' | 'email' | 'password' | 'search' = 'text';

  @Input() size: InputSize = 'md';
  @Input() variant: InputVariant = 'default';

  @Input() disabled = false;
  @Input() error = false;

  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.valueChange.emit(value);
  }
}
