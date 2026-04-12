/* eslint-disable @typescript-eslint/unbound-method */
import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  IonCheckbox,
  IonIcon,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';

import { AuthFacade } from '../../facade/auth.facade';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    IonRouterLink,
    IonContent,
    IonInput,
    IonItem,
    IonButton,
    IonCheckbox,
    IonIcon,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './login.page.html',
})
export class LoginPage implements OnInit {
  private auth = inject(AuthFacade);
  private fb = inject(NonNullableFormBuilder);

  state$ = this.auth.state$;

  showPassword = false;
  submitted = false;

  form = this.fb.group({
    email: this.fb.control('test@test.com', [Validators.required, Validators.email]),
    password: this.fb.control('123456', [Validators.required, Validators.minLength(6)]),
    remember: this.fb.control(false),
  });

  // 🔥 ERROR MAP ESCALABLE
  private errorMap: Record<string, string> = {
    required: 'Required field',
    email: 'Invalid email',
    minlength: 'Too short',
  };

  ngOnInit() {
    addIcons({
      'eye-outline': eyeOutline,
      'eye-off-outline': eyeOffOutline,
    });

    this.restoreRememberedEmail();
  }

  // =========================
  // UX ACTIONS
  // =========================

  togglePassword = () => {
    this.showPassword = !this.showPassword;
  };

  toggleRemember = () => {
    const control = this.form.controls.remember;
    control.setValue(!control.value);
  };

  // =========================
  // VALIDATION HELPERS
  // =========================

  getControlState = (controlName: keyof LoginForm) => {
    const c = this.form.controls[controlName];

    return {
      invalid: c.invalid && (c.touched || this.submitted),
      valid: c.valid && (c.touched || this.submitted),
    };
  };

  getError = (controlName: keyof LoginForm): string | null => {
    const c = this.form.controls[controlName];

    if (!c.errors || !(c.touched || this.submitted)) {
      return null;
    }

    const firstError = Object.keys(c.errors)[0];
    return this.errorMap[firstError] || null;
  };

  // =========================
  // LOGIN FLOW
  // =========================

  submit = () => {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const { email, password, remember } = this.form.getRawValue();

    this.persistRemember(email, remember);

    this.auth.login(email, password, remember);
  };

  // =========================
  // REMEMBER ME
  // =========================

  private persistRemember(email: string, remember: boolean) {
    if (remember) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_EMAIL, email);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_EMAIL);
    }
  }

  private restoreRememberedEmail() {
    const email = localStorage.getItem(STORAGE_KEYS.REMEMBER_EMAIL);

    if (email) {
      this.form.patchValue({
        email,
        remember: true,
      });
    }
  }
}
