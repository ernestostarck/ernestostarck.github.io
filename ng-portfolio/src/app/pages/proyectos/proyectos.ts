import { Component, OnInit, inject } from '@angular/core';
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
export class Proyectos implements OnInit {
  private readonly scrollReveal = inject(ScrollRevealService);
  private swiper: Swiper | null = null;

  ngOnInit(): void {
    // Initialize scroll reveal after view is rendered
    setTimeout(() => {
      this.initScrollReveal();
      this.initSwiper();
    }, 0);
  }

  private initScrollReveal(): void {
    // Add reveal class to cards for scroll animations
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card) => {
      if (!card.classList.contains('reveal')) {
        card.classList.add('reveal');
      }
      this.scrollReveal.observe(card as HTMLElement);
    });

    // Animate project grid items
    const projectGrids = document.querySelectorAll('.project-grid');
    projectGrids.forEach((grid) => {
      if (!grid.classList.contains('reveal-list')) {
        grid.classList.add('reveal-list');
      }
    });
  }

  private initSwiper(): void {
    const swiperElement = document.querySelector('.projects-swiper');
    if (swiperElement) {
      this.swiper = new Swiper(swiperElement as any, {
        modules: [Navigation, Pagination, A11y],
        slidesPerView: 1,
        spaceBetween: 30,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        a11y: {
          enabled: true,
          prevSlideMessage: 'Proyecto anterior',
          nextSlideMessage: 'Siguiente proyecto',
          firstSlideMessage: 'Este es el primer proyecto',
          lastSlideMessage: 'Este es el último proyecto',
          roleDescription: 'carrusel',
        },
        breakpoints: {
          768: {
            slidesPerView: 1.2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 1.3,
            spaceBetween: 50,
          },
        },
      });
    }
  }
}

