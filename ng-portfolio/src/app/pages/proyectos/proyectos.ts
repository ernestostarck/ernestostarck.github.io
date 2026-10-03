import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitHubRepositoriesService } from '../../core/github-repositories.service';
import { ScrollRevealService } from '../../core/scroll-reveal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { defaultIfEmpty } from 'rxjs';

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
  useStaticProjects = false;
  private readonly staticProjectCount = 4;

  ngOnInit(): void {
    this.githubRepositories.    projects$.pipe(defaultIfEmpty([]), takeUntilDestroyed(this.destroyRef)).subscribe((projects) => {
          this.useStaticProjects = projects.length === 0;
          this.projectCount = this.useStaticProjects ? this.staticProjectCount : projects.length;
      this.projectIndexes = Array.from({ length: this.projectCount }, (_, index) => index);
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

  private static readonly techIcons: Record<string, string> = {
    python: 'python-plain', javascript: 'javascript-plain', typescript: 'typescript-plain',
    html: 'html5-plain', css: 'css3-plain', scss: 'sass-original', sass: 'sass-original',
    react: 'react-original', nodejs: 'nodejs-plain', 'node.js': 'nodejs-plain',
    express: 'express-original', nextjs: 'nextjs-plain', 'next.js': 'nextjs-plain',
    vue: 'vuejs-plain', angular: 'angularjs-plain', django: 'django-plain', flask: 'flask-original',
    fastapi: 'fastapi-plain', java: 'java-plain', kotlin: 'kotlin-plain', swift: 'swift-plain',
    dart: 'dart-plain', flutter: 'flutter-plain', go: 'go-original-wordmark', rust: 'rust-plain',
    php: 'php-plain', ruby: 'ruby-plain', c: 'c-plain', 'c++': 'cplusplus-plain', 'c#': 'csharp-plain',
    docker: 'docker-plain', dockerfile: 'docker-plain', git: 'git-plain', github: 'github-original',
    postgresql: 'postgresql-plain', postgres: 'postgresql-plain', mysql: 'mysql-plain',
    sqlite: 'sqlite-plain', mongodb: 'mongodb-plain', redis: 'redis-plain', oracle: 'oracle-original',
    bootstrap: 'bootstrap-plain', tailwindcss: 'tailwindcss-original', tailwind: 'tailwindcss-original',
    graphql: 'graphql-plain', pandas: 'pandas-original', numpy: 'numpy-original',
    jupyter: 'jupyter-plain', 'jupyter notebook': 'jupyter-plain', tensorflow: 'tensorflow-original',
    pytorch: 'pytorch-original', shell: 'bash-plain', bash: 'bash-plain', powershell: 'powershell-plain',
    azure: 'azure-plain', aws: 'amazonwebservices-original', linux: 'linux-plain',
  };

  techIcon(name: string): string {
    const key = name.trim().toLowerCase().replace(/\s+\d[\d.]*$/, '');
    const icon = Proyectos.techIcons[key];
    return icon ? `devicon-${icon} colored` : '';
  }}



