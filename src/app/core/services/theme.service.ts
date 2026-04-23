import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'tradeflow_theme';
  private isDarkModeSubject = new BehaviorSubject<boolean>(true);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  toggleTheme(): void {
    const isDark = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(isDark);
    this.applyTheme(isDark);
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      this.isDarkModeSubject.next(isDark);
      this.applyTheme(isDark);
    } else {
      // Default to dark
      this.applyTheme(true);
    }
  }

  private applyTheme(isDark: boolean): void {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
      localStorage.setItem(this.THEME_KEY, 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem(this.THEME_KEY, 'light');
    }
  }
}
