import { Injectable, AfterViewInit, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollRevealService implements AfterViewInit, OnDestroy {
  private intersectionObserver: IntersectionObserver | null = null;

  constructor() {}

  ngAfterViewInit(): void {
    this.initObserver();
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  initObserver(): void {
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
