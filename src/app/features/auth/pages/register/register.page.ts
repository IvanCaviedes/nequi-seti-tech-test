import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.page.html',
  imports: [CommonModule, FormsModule],
})
export class RegisterPage {
  private router = inject(Router);

  name = '';
  email = '';
  password = '';

  register() {
    setTimeout(() => {}, 1200);
  }
}
