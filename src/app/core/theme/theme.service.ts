import { ApplicationRef, Injectable, inject, isDevMode, signal, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'app_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);
  private appRef = inject(ApplicationRef);

  theme = signal<Theme>('light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.theme.set(this.getInitialTheme());
      this.apply(this.theme());
    }
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      if (isDevMode()) {
        console.warn('ThemeService: não foi possível salvar o tema no localStorage.');
      }
    }
    this.apply(next);
    this.appRef.tick();
  }

  private apply(theme: Theme): void {
    const doc = typeof document !== 'undefined' ? document : this.doc;
    const root = doc.documentElement;
    const body = doc.body;
    if (!root || !body) return;

    root.classList.toggle('dark', theme === 'dark');
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
  }

  private getInitialTheme(): Theme {
    try {
      const saved = this.doc.defaultView?.localStorage?.getItem(STORAGE_KEY) as Theme | null;
      if (saved === 'light' || saved === 'dark') return saved;
      const prefersDark = this.doc.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }
}