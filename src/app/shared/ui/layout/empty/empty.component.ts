import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-empty-layout',
  templateUrl: './empty.component.html',
  imports: [CommonModule, RouterOutlet],
})
export class EmptyLayoutComponent {}
