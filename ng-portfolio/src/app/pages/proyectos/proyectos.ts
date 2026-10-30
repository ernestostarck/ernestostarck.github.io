import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitHubProject, GitHubRepositoriesService } from '../../core/github-repositories.service';
import { PROJECT_CASES, PROJECT_CATEGORIES, ProjectCase } from '../../core/project-cases';
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
  projects: GitHubProject[] = [];
  filter = 'all';
  projectCount = 0;
  projectIndexes: number[] = [];
  useStaticProjects = false;
  private readonly staticProjectCount = 4;

  ngOnInit(): void {
    this.githubRepositories.projects$
      .pipe(defaultIfEmpty([] as GitHubProject[]), takeUntilDestroyed(this.destroyRef))
      .subscribe((projects) => {
        this.projects = projects;
        this.useStaticProjects = projects.length === 0;
        this.syncCarousel();
      });

    // Initialize scroll reveal after view is rendered
    setTimeout(() => {
      this.initScrollReveal();
    }, 100);
  }


  private static readonly categoryRules: [string, RegExp][] = [
    ['ai', /\b(ai|ia|ml|nlp|llm|cdss|machine learning|clinical|cl[ií]nic\w*|decision\w*|decisi[oó]n\w*|inteligencia)\b/],
    ['data', /(data|datos|dashboard|analytic|an[aá]lisis|market|insight|pandas|etl)/],
    ['automation', /(automat|pipeline|xlsx|apps script|workflow|flujo|sheet)/],
  ];

  readonly filterOptions = [
    { key: 'all', es: 'Todos', en: 'All' },
    { key: 'software', es: 'Software', en: 'Software' },
    { key: 'data', es: 'Data', en: 'Data' },
    { key: 'automation', es: 'Automatización', en: 'Automation' },
    { key: 'ai', es: 'IA', en: 'AI' },
  ];

  get visibleProjects(): GitHubProject[] {
    return this.filter === 'all' ? this.projects : this.projects.filter((p) => this.categoryOf(p) === this.filter);
  }

  get demoCount(): number {
    return this.projects.filter((p) => p.liveDemoUrl).length;
  }

  get languageCount(): number {
    return new Set(this.projects.map((p) => p.repository.language).filter(Boolean)).size;
  }

  categoryOf(project: GitHubProject): string {
    const name = project.repository.name.toLowerCase();
    if (PROJECT_CATEGORIES[name]) return PROJECT_CATEGORIES[name];
    const text = `${name} ${project.title} ${project.stack.join(' ')}`.toLowerCase();
    return Proyectos.categoryRules.find(([, rule]) => rule.test(text))?.[0] ?? 'software';
  }

  countFor(key: string): number {
    return key === 'all' ? this.projects.length : this.projects.filter((p) => this.categoryOf(p) === key).length;
  }

  setFilter(key: string): void {
    this.filter = key;
    this.activeProjectIndex = 0;
    this.syncCarousel();
  }

  statusOf(project: GitHubProject): 'demo' | 'active' | 'repo' {
    if (project.liveDemoUrl) return 'demo';
    const months = (Date.now() - new Date(project.repository.updated_at).getTime()) / 2_629_800_000;
    return months < 4 ? 'active' : 'repo';
  }

  statusLabel(project: GitHubProject, lang: 'es' | 'en'): string {
    const labels = {
      demo: { es: 'Demo en vivo', en: 'Live demo' },
      active: { es: 'En desarrollo', en: 'In development' },
      repo: { es: 'Código abierto', en: 'Open source' },
    };
    return labels[this.statusOf(project)][lang];
  }


  caseText(project: GitHubProject, field: keyof ProjectCase, lang: 'es' | 'en'): string {
    const curated = PROJECT_CASES[project.repository.name.toLowerCase()]?.[lang][field];
    if (curated) return curated;
    const generated: Record<string, string> = {
      title: project.title,
      summary: project.repository.description || project.context,
      context: project.context,
      problem: project.problem,
      solution: project.solution,
      decisions: project.technicalDecisions,
      impact: project.impact,
    };
    const text = (generated[field] || '').replace(/\s+/g, ' ').trim();
    const looksLikeBadges = /\b(CI|License|Version|Security Scan|Build|Coverage)\b/.test(text) && text.length < 140;
    const isFiller = /^(Implementaci[oó]n disponible|La soluci[oó]n prioriza|Problema descrito|Repositorio p[uú]blico)/i.test(text);
    return looksLikeBadges || isFiller ? '' : text;
  }

  short(text: string, max = 210): string {
    const clean = (text || '').replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    return clean.slice(0, clean.lastIndexOf(' ', max)).replace(/[,;:.\s]+$/, '') + '…';
  }

  private syncCarousel(): void {
    this.projectCount = this.useStaticProjects ? this.staticProjectCount : this.visibleProjects.length;
    this.projectIndexes = Array.from({ length: this.projectCount }, (_, index) => index);
    if (this.activeProjectIndex >= this.projectCount) {
      this.activeProjectIndex = 0;
    }
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



