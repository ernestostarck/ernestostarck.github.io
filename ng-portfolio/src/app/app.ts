import { NgIf } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppLanguage, PreferencesService } from './core/preferences.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly preferences = inject(PreferencesService);

  currentYear = new Date().getFullYear();
  showScrollTop = false;
  navOpen = false;

  constructor() {
    this.preferences.init();
  }

  get theme(): 'dark' | 'light' {
    return this.preferences.theme();
  }

  get language(): AppLanguage {
    return this.preferences.language();
  }

  get isSpanish(): boolean {
    return this.language === 'es';
  }

  toggleNav(): void {
    this.navOpen = !this.navOpen;
  }

  toggleTheme(): void {
    this.preferences.toggleTheme();
  }

  setLanguage(language: AppLanguage): void {
    this.preferences.setLanguage(language);
  }

  t(esText: string, enText: string): string {
    return this.isSpanish ? esText : enText;
  }

  closeNav(): void {
    this.navOpen = false;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop = window.scrollY > 260;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
