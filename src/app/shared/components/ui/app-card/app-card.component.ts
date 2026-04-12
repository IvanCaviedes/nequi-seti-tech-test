import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-card.component.html',
})
export class AppCardComponent {
  @Input() padding = 'px-6 py-10';
  @Input() class = '';
}
