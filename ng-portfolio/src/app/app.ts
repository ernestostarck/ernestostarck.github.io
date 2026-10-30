import { NgIf } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  currentYear = new Date().getFullYear();
  showScrollTop = false;
  navOpen = false;

  constructor() {
    this.preferences.init();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateMetadata(event.urlAfterRedirects));
    this.updateMetadata(this.router.url);
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
    this.updateMetadata(this.router.url);
  }

  private updateMetadata(url: string): void {
    const path = url.split('?')[0].replace(/^\/+|\/+$/g, '');
    const pages: Record<string, { es: [string, string]; en: [string, string] }> = {
      '': {
        es: ['Portafolio de Ernesto Starck | Ingeniería de software y datos', 'Portafolio profesional de Ernesto Starck: desarrollo de software, análisis de datos y automatización.'],
        en: ['Ernesto Starck Portfolio | Software and Data Engineering', 'Professional portfolio of Ernesto Starck: software development, data analytics and automation.'],
      },
      'sobre-mi': {
        es: ['Sobre mí | Ernesto Starck', 'Conoce la experiencia, habilidades y enfoque profesional de Ernesto Starck.'],
        en: ['About | Ernesto Starck', 'Learn about Ernesto Starck’s experience, skills and professional approach.'],
      },
      proyectos: {
        es: ['Proyectos | Ernesto Starck', 'Proyectos de software, datos y automatización desarrollados por Ernesto Starck.'],
        en: ['Projects | Ernesto Starck', 'Software, data and automation projects by Ernesto Starck.'],
      },
      certificaciones: {
        es: ['Certificaciones | Ernesto Starck', 'Certificaciones y formación profesional de Ernesto Starck.'],
        en: ['Certifications | Ernesto Starck', 'Professional certifications and training completed by Ernesto Starck.'],
      },
      contacto: {
        es: ['Contacto | Ernesto Starck', 'Contacta a Ernesto Starck para oportunidades profesionales, proyectos y colaboraciones.'],
        en: ['Contact | Ernesto Starck', 'Contact Ernesto Starck about professional opportunities, projects and collaborations.'],
      },
    };
    const [title, description] = (pages[path] ?? pages[''])[this.language];
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
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
