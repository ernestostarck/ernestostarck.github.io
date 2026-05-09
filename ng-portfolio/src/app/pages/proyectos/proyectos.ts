import { Component, OnInit, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealService } from '../../core/scroll-reveal.service';
import { Swiper } from 'swiper';
import { Navigation, Pagination, A11y } from 'swiper/modules';

Swiper.use([Navigation, Pagination, A11y]);

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css',
})
export class Proyectos implements OnInit, AfterViewInit, OnDestroy {
  private readonly scrollReveal = inject(ScrollRevealService);
  private swipers: Swiper[] = [];

  ngOnInit(): void {
    // Initialize scroll reveal after view is rendered
    setTimeout(() => {
      this.initScrollReveal();
    }, 100);
  }

  ngAfterViewInit(): void {
    // Initialize Swiper after view is fully rendered
    setTimeout(() => {
      this.initSwiper();
    }, 200);
  }

  ngOnDestroy(): void {
    this.swipers.forEach((swiper) => swiper.destroy(true, true));
    this.swipers = [];
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

    // Initialize the observer with all reveal elements
    this.scrollReveal.initOnPageLoad();
  }

  private initSwiper(): void {
    const swiperElements = document.querySelectorAll<HTMLElement>('.projects-swiper');

    swiperElements.forEach((swiperElement) => {
      if (this.swipers.some((swiper) => swiper.el === swiperElement)) {
        return;
      }

      const swiper = new Swiper(swiperElement, {
        modules: [Navigation, Pagination, A11y],
        slidesPerView: 1,
        spaceBetween: 30,
        grabCursor: true,
        slidesPerGroup: 1,
        rewind: false,
        roundLengths: true,
        watchOverflow: true,
        navigation: {
          nextEl: swiperElement.querySelector('.swiper-button-next') as HTMLElement | null,
          prevEl: swiperElement.querySelector('.swiper-button-prev') as HTMLElement | null,
        },
        pagination: {
          el: swiperElement.querySelector('.swiper-pagination') as HTMLElement | null,
          clickable: true,
          dynamicBullets: false,
        },
        a11y: {
          enabled: true,
          prevSlideMessage: 'Proyecto anterior',
          nextSlideMessage: 'Siguiente proyecto',
          firstSlideMessage: 'Este es el primer proyecto',
          lastSlideMessage: 'Este es el último proyecto',
        },
        breakpoints: {
          768: {
            slidesPerView: 1,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 50,
          },
        },
        speed: 500,
        autoplay: false,
      });

      this.swipers.push(swiper);
    });
  }
}

