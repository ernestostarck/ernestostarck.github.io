import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealService } from '../../core/scroll-reveal.service';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css',
})
export class Proyectos implements OnInit {
  private readonly scrollReveal = inject(ScrollRevealService);

  activeProjectIndex = 0;
  readonly projectCount = 4;
  readonly projectIndexes = [0, 1, 2, 3];

  ngOnInit(): void {
    // Initialize scroll reveal after view is rendered
    setTimeout(() => {
      this.initScrollReveal();
    }, 100);
  }

  private initScrollReveal(): void {
    // Add reveal class to cards for scroll animations
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card) => {
      if (!card.classList.contains('reveal')) {
        card.classList.add('reveal');
      }
    });

    // Animate project grid items
    const projectGrids = document.querySelectorAll('.project-grid');
    projectGrids.forEach((grid) => {
      if (!grid.classList.contains('reveal-list')) {
        grid.classList.add('reveal-list');
      }
    });

    this.scrollReveal.initOnPageLoad();
  }

  nextProject(): void {
    this.activeProjectIndex = (this.activeProjectIndex + 1) % this.projectCount;
  }

  prevProject(): void {
    this.activeProjectIndex = (this.activeProjectIndex - 1 + this.projectCount) % this.projectCount;
  }

  goToProject(index: number): void {
    if (index < 0 || index >= this.projectCount) {
      return;
    }

    this.activeProjectIndex = index;
  }
}

