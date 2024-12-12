import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.css',
})
export class ThemeSwitcherComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        icon: 'pi pi-sun text-blue-500',
        command: () => this.changeTheme('bootstrap4-light-blue'),
        tooltip: 'Light Blue',
      },
      {
        icon: 'pi pi-moon text-blue-500',
        command: () => this.changeTheme('bootstrap4-dark-blue'),
        tooltip: 'Dark Blue',
      },
      {
        icon: 'pi pi-sun text-green-500',
        command: () => this.changeTheme('saga-green'),
        tooltip: 'Light Green',
      },
      {
        icon: 'pi pi-moon text-green-500',
        command: () => this.changeTheme('arya-green'),
        tooltip: 'Dark Green',
      },
    ];
  }

  changeTheme(theme: string) {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = `assets/themes/${theme}/theme.css`;
    }
    localStorage.setItem('theme', theme);
  }
}
