import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type CardVariant = 'default' | 'soft' | 'outlined' | 'glow';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-card.component.html',
})
export class UiCardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';
  @Input() full = false;
}
