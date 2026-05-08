import { Component, OnInit, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { PreferencesService } from '../../core/preferences.service';
import { ScrollRevealService } from '../../core/scroll-reveal.service';

@Component({
  selector: 'app-certificaciones',
  standalone: true,
  imports: [NgIf],
  templateUrl: './certificaciones.html',
  styleUrl: './certificaciones.css',
})
export class Certificaciones implements OnInit {
  preferences = inject(PreferencesService);
  theme = this.preferences.theme;
  private readonly scrollReveal = inject(ScrollRevealService);

  ngOnInit(): void {
    // Initialize scroll reveal after view is rendered
    setTimeout(() => {
      this.initScrollReveal();
    }, 100);
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

