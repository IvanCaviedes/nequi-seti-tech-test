import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { of, throwError, delay } from 'rxjs';

import { STORAGE_KEYS } from 'src/app/core/constants/storage-keys';
import { StorageService } from 'src/app/core/services/storage.service';

type User = {
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user: { email: string };
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storage = inject(StorageService);

  constructor() {
    this.seedUsers();
  }

  private seedUsers() {
    const users = this.getUsers();

    if (users.length === 0) {
      const defaultUser = {
        email: 'test@test.com',
        password: this.hash('123456'),
      };

      this.saveUsers([defaultUser]);
    }
  }

  private getUsers(): User[] {
    return this.storage.get(STORAGE_KEYS.USERS) ?? [];
  }

  private saveUsers(users: User[]) {
    this.storage.set(STORAGE_KEYS.USERS, users);
  }

  private hash(password: string): string {
    return btoa(password); // ⚠️ solo para mock
  }

  register(email: string, password: string): Observable<AuthResponse> {
    const users = this.getUsers();

    const exists = users.find((u) => u.email === email);

    if (exists) {
      return throwError(() => new Error('Email already in use'));
    }

    if (password.length < 6) {
      return throwError(() => new Error('Password too weak'));
    }

    const newUser: User = {
      email,
      password: this.hash(password),
    };

    users.push(newUser);
    this.saveUsers(users);

    return of({
      token: this.generateToken(email),
      user: { email },
    }).pipe(delay(800));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const users = this.getUsers();

    const user = users.find((u) => u.email === email);

    if (!user || user.password !== this.hash(password)) {
      return throwError(() => new Error('Invalid credentials'));
    }

    return of({
      token: this.generateToken(email),
      user: { email },
    }).pipe(delay(800));
  }

  private generateToken(email: string): string {
    const payload = {
      email,
      exp: Date.now() + 1000 * 60 * 60, // 1h
    };

    return btoa(JSON.stringify(payload));
  }

  getCurrentUser(): { email: string } | null {
    const token =
      localStorage.getItem(STORAGE_KEYS.AUTH) || sessionStorage.getItem(STORAGE_KEYS.AUTH);

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token)) as { email: string; exp: number };

      if (Date.now() > payload.exp) {
        this.logout();
        return null;
      }

      return { email: payload.email };
    } catch {
      return null;
    }
  }

  logout() {
    this.storage.remove(STORAGE_KEYS.AUTH);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  }
}
