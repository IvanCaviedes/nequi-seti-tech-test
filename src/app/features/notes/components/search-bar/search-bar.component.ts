import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UiInputComponent } from 'src/app/shared/ui/inputs/ui-input.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, UiInputComponent],
  templateUrl: './search-bar.component.html',
})
export class SearchBarComponent {
  @Input() placeholder = 'Search...';
  @Input() value = '';

  @Output() valueChange = new EventEmitter<string>();

  onChange(value: string) {
    this.value = value;
    this.valueChange.emit(value);
  }
}
