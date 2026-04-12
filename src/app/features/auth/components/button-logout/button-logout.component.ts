import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AuthFacade } from '../../facade/auth.facade';

@Component({
  selector: 'app-auth-logout',
  templateUrl: 'button-logout.component.html',
  imports: [CommonModule],
})
export class ButtonLogoutComponent {
  private auth = inject(AuthFacade);

  logout() {
    this.auth.logout();
  }
}
