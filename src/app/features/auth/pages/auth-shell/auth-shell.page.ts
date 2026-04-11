import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-shell',
  templateUrl: './auth-shell.page.html',
  imports: [CommonModule, RouterOutlet],
})
export class AuthShellPage {}
