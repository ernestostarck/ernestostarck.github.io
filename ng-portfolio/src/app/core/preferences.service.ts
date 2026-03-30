import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';
export type AppLanguage = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly themeKey = 'portfolio.theme';
  private readonly langKey = 'portfolio.lang';

  readonly theme = signal<ThemeMode>('dark');
  readonly language = signal<AppLanguage>('es');

  init(): void {
    this.theme.set(this.resolveInitialTheme());
    this.language.set(this.resolveInitialLanguage());
    this.applyDocumentState();
  }

  toggleTheme(): void {
    const nextTheme: ThemeMode = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    localStorage.setItem(this.themeKey, nextTheme);
    this.applyDocumentState();
  }

  setLanguage(language: AppLanguage): void {
    this.language.set(language);
    localStorage.setItem(this.langKey, language);
    this.applyDocumentState();
  }

  private applyDocumentState(): void {
    document.documentElement.setAttribute('data-theme', this.theme());
    document.documentElement.setAttribute('data-lang', this.language());
    document.documentElement.lang = this.language();
  }

  private resolveInitialTheme(): ThemeMode {
    const storedTheme = localStorage.getItem(this.themeKey);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  private resolveInitialLanguage(): AppLanguage {
    const storedLang = localStorage.getItem(this.langKey);
    if (storedLang === 'es' || storedLang === 'en') {
      return storedLang;
    }

    const browserLang = navigator.language?.toLowerCase() ?? '';
    return browserLang.startsWith('es') ? 'es' : 'en';
  }
}
