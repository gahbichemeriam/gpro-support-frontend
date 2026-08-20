import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly KEY = 'gpro_theme';
  private isDark = true;

  constructor() {
    // Lire le thème sauvegardé dans localStorage
    const saved = localStorage.getItem(this.KEY);
    this.isDark = saved !== 'light'; // dark par défaut
    this.appliquer();
  }

  toggle(): void {
    this.isDark = !this.isDark;
    localStorage.setItem(this.KEY, this.isDark ? 'dark' : 'light');
    this.appliquer();
  }

  isDarkMode(): boolean {
    return this.isDark;
  }

  private appliquer(): void {
    const body = document.body;
    if (this.isDark) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    }
  }
}
