import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealService } from '../../core/scroll-reveal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private readonly scrollReveal = inject(ScrollRevealService);

  ngOnInit(): void {
    // Initialize scroll reveal after view is rendered
    setTimeout(() => {
      this.initScrollReveal();
    }, 100);
  }

  private initScrollReveal(): void {
    // Add reveal class to home cards for scroll animations
    const homeCards = document.querySelectorAll('.home-card');
    homeCards.forEach((card) => {
      if (!card.classList.contains('reveal')) {
        card.classList.add('reveal');
      }
    });

    // Animate the executive summary
    const executiveSummary = document.querySelector('.executive-summary');
    if (executiveSummary && !executiveSummary.classList.contains('reveal')) {
      executiveSummary.classList.add('reveal');
    }

    // Initialize the observer with all reveal elements
    this.scrollReveal.initOnPageLoad();
  }
}}

