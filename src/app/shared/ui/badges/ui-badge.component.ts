import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import type { BadgeVariant, BadgeSize } from './ui-badge.types';

@Component({
  selector: 'app-ui-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-badge.component.html',
})
export class UiBadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'md';
}
