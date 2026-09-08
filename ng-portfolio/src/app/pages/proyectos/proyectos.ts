import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitHubRepositoriesService } from '../../core/github-repositories.service';
import { ScrollRevealService } from '../../core/scroll-reveal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css',
})
export class Proyectos implements OnInit {
  private readonly scrollReveal = inject(ScrollRevealService);
  private readonly destroyRef = inject(DestroyRef);
  readonly githubRepositories = inject(GitHubRepositoriesService);

  activeProjectIndex = 0;
  projectCount = 0;
  projectIndexes: number[] = [];

  ngOnInit(): void {
    this.githubRepositories.projects$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((projects) => {
      this.projectCount = projects.length;
      this.projectIndexes = projects.map((_, index) => index);
      if (this.activeProjectIndex >= this.projectCount) {
        this.activeProjectIndex = 0;
      }
    });

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

