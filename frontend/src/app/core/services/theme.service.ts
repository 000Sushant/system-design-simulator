import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkSubject = new BehaviorSubject<boolean>(false);
  isDark$ = this.isDarkSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sr-architect-darkmode');
      const isDark = stored !== null ? stored === 'true' : false;
      this.setDark(isDark);
    }
  }

  toggleTheme(): void {
    this.setDark(!this.isDarkSubject.value);
  }

  setDark(isDark: boolean): void {
    this.isDarkSubject.next(isDark);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sr-architect-darkmode', String(isDark));
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  }

  get isDark(): boolean {
    return this.isDarkSubject.value;
  }
}
