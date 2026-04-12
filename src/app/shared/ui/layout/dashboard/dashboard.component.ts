import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SideBarComponent } from 'src/app/shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, RouterOutlet, SideBarComponent],
})
export class DashboardLayoutComponent {}
