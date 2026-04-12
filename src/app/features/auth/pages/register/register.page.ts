/* eslint-disable @typescript-eslint/unbound-method */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import type { AbstractControl, ValidationErrors } from '@angular/forms';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonRouterLink,
  IonButton,
  IonInput,
  IonIcon,
  IonCheckbox,
} from '@ionic/angular/standalone';

import { AuthFacade } from '../../facade/auth.facade';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

@Component({
  selector: 'app-register-page',
  templateUrl: './register.page.html',
  imports: [
    IonIcon,
    IonButton,
    IonRouterLink,
    IonContent,
    CommonModule,
    FormsModule,
    RouterModule,
    IonInput,
    ReactiveFormsModule,
    IonCheckbox,
  ],
})
export class RegisterPage {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthFacade);

  state$ = this.auth.state$;

  showPassword = false;
  showConfirmPassword = false;
  submitted = false;

  // =========================
  // VALIDATORS
  // =========================

  passwordMatchValidator = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value as string | undefined;
    const confirm = form.get('confirmPassword')?.value as string | undefined;

    return password === confirm ? null : { passwordMismatch: true };
  };

  form = this.fb.group(
    {
      name: this.fb.control('ivan', [Validators.required, Validators.minLength(4)]),
      email: this.fb.control('ivan@test.com', [Validators.required, Validators.email]),
      password: this.fb.control('123456', [Validators.required, Validators.minLength(6)]),
      confirmPassword: this.fb.control('', [Validators.required]),
      acceptTerms: this.fb.control(false, [Validators.requiredTrue]),
    },
    {
      validators: [this.passwordMatchValidator],
    },
  );

  private errorMap: Record<string, string> = {
    required: 'Required field',
    email: 'Invalid email',
    minlength: 'Min 6 characters',
    requiredTrue: 'You must accept terms',
    passwordMismatch: 'Passwords do not match',
  };

  // =========================
  // UX
  // =========================

  togglePassword = () => {
    this.showPassword = !this.showPassword;
  };

  toggleConfirmPassword = () => {
    this.showConfirmPassword = !this.showConfirmPassword;
  };

  toggleTerms = () => {
    const c = this.form.controls.acceptTerms;
    c.setValue(!c.value);
  };

  // =========================
  // VALIDATION HELPERS
  // =========================

  getControlState = (control: keyof RegisterForm) => {
    const c = this.form.controls[control];

    return {
      invalid: c.invalid && (c.touched || this.submitted),
      valid: c.valid && (c.touched || this.submitted),
    };
  };

  getError = (control: keyof RegisterForm): string | null => {
    const c = this.form.controls[control];

    if (!c.errors || !(c.touched || this.submitted)) {
      return null;
    }

    const key = Object.keys(c.errors)[0];
    return this.errorMap[key] || null;
  };

  getFormError(): string | null {
    if (
      this.form.errors?.['passwordMismatch'] &&
      (this.form.controls.confirmPassword.touched || this.submitted)
    ) {
      return this.errorMap['passwordMismatch'];
    }

    return null;
  }

  // =========================
  // SUBMIT
  // =========================

  submit = () => {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.auth.register(email, password);
  };
}
