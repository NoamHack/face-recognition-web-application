import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  items: MenuItem[];

  constructor(private router: Router) {
    this.items = [
      {
        label: 'Add Solider',
        icon: 'pi pi-user-plus',
        command: () => {
          AuthGuard.AccessUrlNavigation();
          this.router.navigate(['/add'], {
            skipLocationChange: true,
          });
        },
      },
      {
        label: 'Video',
        icon: 'pi pi-video',
        command: () => {
          AuthGuard.AccessUrlNavigation();
          this.router.navigate(['/video'], {
            skipLocationChange: true,
          });
        },
      },
    ];
  }
}
