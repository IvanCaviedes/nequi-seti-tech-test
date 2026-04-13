import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';

import { AuthFacade } from 'src/app/features/auth/facade/auth.facade';

interface SidebarItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [IonIcon, CommonModule],
})
export class SideBarComponent {
  private router = inject(Router);
  private auth = inject(AuthFacade);

  menu: SidebarItem[] = [{ label: 'Dashboard', icon: 'grid-outline', route: '/app/dashboard' }];

  go(route: string) {
    void this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    this.auth.logout();
  }
}
