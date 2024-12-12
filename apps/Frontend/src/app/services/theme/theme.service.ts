import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = {
  name: string;
  file: string;
};

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themes: Theme[] = [
    { name: 'Light Blue', file: 'bootstrap4-light-blue' },
    { name: 'Dark Blue', file: 'bootstrap4-dark-blue' },
    { name: 'Light Green', file: 'saga-green' },
    { name: 'Dark Green', file: 'arya-green' },
  ];

  private currentTheme = new BehaviorSubject<Theme>(this.themes[0]);

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const theme = this.themes.find((t) => t.file === savedTheme);
      if (theme) {
        this.setTheme(theme);
      }
    }
  }

  getCurrentTheme() {
    return this.currentTheme.asObservable();
  }

  getThemes() {
    return this.themes;
  }

  setTheme(theme: Theme) {
    const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = `node_modules/primeng/resources/themes/${theme.file}/theme.css`;
    } else {
      const link = document.createElement('link');
      link.id = 'app-theme';
      link.rel = 'stylesheet';
      link.href = `node_modules/primeng/resources/themes/${theme.file}/theme.css`;
      document.head.appendChild(link);
    }
    localStorage.setItem('theme', theme.file);
    this.currentTheme.next(theme);
  }
}
