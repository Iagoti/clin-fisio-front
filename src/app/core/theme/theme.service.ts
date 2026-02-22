import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'app_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);

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
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.doc.defaultView?.localStorage?.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage indisponível (ex.: modo privado)
      }
      this.apply(next);
    }
  }

  private apply(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const root = this.doc.documentElement;
    const body = this.doc.body;
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