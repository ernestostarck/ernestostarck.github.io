import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollRevealService implements OnDestroy {
  private intersectionObserver: IntersectionObserver | null = null;
  private isInitialized = false;

  constructor() {
    this.initObserver();
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private initObserver(): void {
    if (this.isInitialized) return;

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('reveal-in');
          this.intersectionObserver?.unobserve(entry.target);
        }
      });
    }, options);

    this.isInitialized = true;
  }

  initOnPageLoad(): void {
    // Call this method when the page or component has loaded
    if (!this.isInitialized) {
      this.initObserver();
    }
    
    // Observe all elements with the 'reveal' class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((element) => {
      this.intersectionObserver?.observe(element);
    });

    // Also observe reveal-list containers
    const revealLists = document.querySelectorAll('.reveal-list');
    revealLists.forEach((list) => {
      this.intersectionObserver?.observe(list);
    });
  }

  // Manual method to observe specific elements
  observe(element: HTMLElement): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }
  }
}
