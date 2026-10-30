import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesService } from '../../core/preferences.service';
import { ScrollRevealService } from '../../core/scroll-reveal.service';

@Component({
  selector: 'app-certificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificaciones.html',
  styleUrl: './certificaciones.css',
})
export class Certificaciones implements OnInit {
  preferences = inject(PreferencesService);
  theme = this.preferences.theme;
  private readonly scrollReveal = inject(ScrollRevealService);

  activeIndexes: Record<string, number> = {
    data: 0,
    ai: 0,
    software: 0,
    general: 0,
  };

  certCounts: Record<string, number> = {
    data: 2,
    ai: 1,
    software: 0,
    general: 1,
  };

  filter = 'all';
  stats: Record<string, { total: number; links: number; areas: number }> = {
    es: { total: 0, links: 0, areas: 0 },
    en: { total: 0, links: 0, areas: 0 },
  };
  filters: Record<string, { key: string; label: string; count: number }[]> = { es: [], en: [] };

  setFilter(key: string): void {
    this.filter = key;
    this.applyFilter();
  }

  private applyFilter(): void {
    document.querySelectorAll('.cert-area-group').forEach((group) => {
      const key = this.areaKey(group);
      (group as HTMLElement).style.display = this.filter === 'all' || this.filter === key ? '' : 'none';
    });
  }

  private areaKey(group: Element): string {
    return /(?:^|\s)area-(?!group)([a-z]+)/.exec(group.className)?.[1] ?? '';
  }

  private buildSummary(): void {
    (['es', 'en'] as const).forEach((lang) => {
      const section = document.querySelector(`.lang-${lang}`);
      if (!section) return;
      const groups = Array.from(section.querySelectorAll('.cert-area-group'));
      this.filters[lang] = groups
        .map((g) => ({
          key: this.areaKey(g),
          label: g.querySelector('h4')?.textContent?.trim() ?? '',
          count: g.querySelectorAll('.cert-completado').length,
        }))
        .filter((f) => f.count > 0);
      this.stats[lang] = {
        total: section.querySelectorAll('.cert-completado').length,
        links: section.querySelectorAll('.cert-completado .cert-card-link a').length,
        areas: this.filters[lang].length,
      };
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.updateCertCounts();
      this.buildSummary();
      this.initScrollReveal();
    }, 100);
  }

  private cleanKey(area: string): string {
    return area.replace(/-en$/, '').replace(/^area-/, '');
  }

  private updateCertCounts(): void {
    if (typeof document === 'undefined') return;
    const areas = ['data', 'ai', 'software', 'general'];
    areas.forEach((area) => {
      const el = document.getElementById(`area-${area}`) || document.getElementById(`area-${area}-en`);
      if (el) {
        const slides = el.querySelectorAll('.swiper-slide');
        if (slides.length > 0) {
          this.certCounts[area] = slides.length;
        }
      }
    });
  }

  nextCert(area: string): void {
    const key = this.cleanKey(area);
    const count = this.certCounts[key] || 1;
    this.activeIndexes[key] = ((this.activeIndexes[key] || 0) + 1) % count;
  }

  prevCert(area: string): void {
    const key = this.cleanKey(area);
    const count = this.certCounts[key] || 1;
    this.activeIndexes[key] = ((this.activeIndexes[key] || 0) - 1 + count) % count;
  }

  goToCert(area: string, index: number): void {
    const key = this.cleanKey(area);
    this.activeIndexes[key] = index;
  }

  getActiveIndex(area: string): number {
    const key = this.cleanKey(area);
    return this.activeIndexes[key] || 0;
  }

  getBullets(area: string): number[] {
    const key = this.cleanKey(area);
    const count = this.certCounts[key] || 0;
    return Array.from({ length: count }, (_, i) => i);
  }

  private initScrollReveal(): void {
    // Add reveal class to cert cards for scroll animations
    const certCards = document.querySelectorAll('.cert-card');
    certCards.forEach((card) => {
      if (!card.classList.contains('reveal')) {
        card.classList.add('reveal');
      }
    });

    // Animate cert note
    const certNote = document.querySelector('.cert-note');
    if (certNote && !certNote.classList.contains('reveal')) {
      certNote.classList.add('reveal');
    }

    // Animate conversion CTA
    const conversionCta = document.querySelector('.conversion-cta');
    if (conversionCta && !conversionCta.classList.contains('reveal')) {
      conversionCta.classList.add('reveal');
    }

    // Initialize the observer with all reveal elements
    this.scrollReveal.initOnPageLoad();
  }
}
