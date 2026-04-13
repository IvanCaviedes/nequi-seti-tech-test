import { type Routes } from '@angular/router';

import { ROUTES } from './core/constants/routes.constant';
import { guestGuard } from './features/auth/guards/auth.guard';
import { authGuard } from './features/auth/guards/guest.guard';
import { DashboardLayoutComponent } from './shared/ui/layout/dashboard/dashboard.component';
import { EmptyLayoutComponent } from './shared/ui/layout/empty/empty.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTES.SPLASH,
    pathMatch: 'full',
  },
  {
    path: '',
    component: EmptyLayoutComponent,
    children: [
      {
        path: ROUTES.SPLASH,
        loadComponent: () => import('./features/spash/pages/splash.page').then((m) => m.SplashPage),
      },
      {
        path: ROUTES.ONBOARDING,
        loadComponent: () =>
          import('./features/onboarding/pages/onboarding.page').then((m) => m.OnboardingPage),
      },
    ],
  },
  {
    path: ROUTES.AUTH.ROOT,
    component: EmptyLayoutComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        redirectTo: ROUTES.AUTH.LOGIN,
        pathMatch: 'full',
      },
      {
        path: ROUTES.AUTH.LOGIN,
        loadComponent: () =>
          import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: ROUTES.AUTH.REGISTER,
        loadComponent: () =>
          import('./features/auth/pages/register/register.page').then((m) => m.RegisterPage),
      },
    ],
  },
  {
    path: 'app',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: ROUTES.APP.ROOT,
        loadComponent: () =>
          import('./features/notes/pages/note-list/note-list.page').then((m) => m.NotePage),
      },
      {
        path: ROUTES.APP.CATEGORIES,
        loadComponent: () =>
          import('./features/notes/pages/select-categories/select-categories.page').then(
            (m) => m.SelectCategoriesPage,
          ),
      },
      {
        path: ROUTES.APP.NEW,
        loadComponent: () =>
          import('./features/notes/pages/new-note/new-note.page').then((m) => m.NewNotePage),
      },
    ],
  },
];
