import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, forkJoin, map, of, shareReplay, switchMap } from 'rxjs';

export interface GitHubRepository {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  topics: string[];
  updated_at: string;
  stargazers_count: number;
  fork: boolean;
  default_branch: string;
  size: number;
}

export interface GitHubProject {
  repository: GitHubRepository;
  title: string;
  context: string;
  problem: string;
  solution: string;
  technicalDecisions: string;
  impact: string;
  stack: string[];
}

@Injectable({ providedIn: 'root' })
export class GitHubRepositoriesService {
  private readonly http = inject(HttpClient);
  private readonly username = 'ernestostarck';
  private readonly excludedRepositories = new Set(['ernestostarck.github.io', 'ernestostarck']);
  private readonly featuredRepositories = ['zenith-flow', 'meddecide-cdss', 'automation-pipeline'];

  readonly repositories$ = this.http
    .get<GitHubRepository[]>(
      `https://api.github.com/users/${this.username}/repos?type=owner&sort=updated&per_page=100`,
    )
    .pipe(
      map((repositories) =>
        repositories.filter(
          (repository) => !repository.fork && this.isProjectRepository(repository),
        ),
      ),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  readonly featuredRepositories$ = this.repositories$.pipe(
    map((repositories) =>
      this.featuredRepositories
        .map((name) => repositories.find((repository) => repository.name === name))
        .filter((repository): repository is GitHubRepository => repository !== undefined),
    ),
  );

  readonly projects$ = this.repositories$.pipe(
    switchMap((repositories) =>
      forkJoin(repositories.slice(0, 12).map((repository) => this.createProject(repository))),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private createProject(repository: GitHubRepository) {
    const readmeUrl = `https://raw.githubusercontent.com/${this.username}/${repository.name}/${repository.default_branch}/README.md`;

    const languagesUrl = `https://api.github.com/repos/${this.username}/${repository.name}/languages`;

    return forkJoin({
      readme: this.http.get(readmeUrl, { responseType: 'text' }).pipe(catchError(() => of(''))),
      languages: this.http.get<Record<string, number>>(languagesUrl).pipe(catchError(() => of({}))),
    }).pipe(map(({ readme, languages }) => this.projectFromReadme(repository, readme, languages)));
  }

  private projectFromReadme(
    repository: GitHubRepository,
    readme: string,
    languages: Record<string, number>,
  ): GitHubProject {
    const readmeStack = this.readmeList(readme, [
      'stack',
      'stack técnico',
      'stack tecnico',
      'tech stack',
      'technologies',
      'tecnologías',
      'tecnologías y herramientas',
    ]);
    const languageStack = Object.keys(languages).sort((a, b) => languages[b] - languages[a]);
    const stack = [repository.language, ...languageStack, ...repository.topics, ...readmeStack].filter(
      (technology): technology is string => Boolean(technology),
    );
    const uniqueStack = [...new Set(stack)].slice(0, 8);
    const stackText = uniqueStack.join(' · ') || 'Stack no especificado en GitHub.';

    return {
      repository,
      title: this.readmeTitle(readme) || this.toProjectTitle(repository.name),
      context: this.readmeSection(readme, ['contexto', 'context', 'resumen ejecutivo', 'summary']) || this.readmeIntro(readme) || repository.description || 'Repositorio público de software.',
      problem: this.readmeSection(readme, ['problema', 'problem', 'qué resuelve', 'que resuelve', 'objetivo', 'goal', 'características', 'caracteristicas', 'features']) || this.readmeIntro(readme) || repository.description || 'Problema descrito en el README del repositorio.',
      solution: this.readmeSection(readme, ['qué resuelve', 'que resuelve', 'objetivo', 'goal', 'solución', 'solucion', 'solution', 'características', 'caracteristicas', 'features']) || `Implementación disponible en el repositorio con ${stackText}.`,
      technicalDecisions: this.readmeSection(readme, ['decisiones técnicas', 'decisiones tecnicas', 'technical decisions', 'principios de diseño', 'principios de diseno', 'arquitectura del sistema', 'arquitectura funcional', 'arquitectura tecnica', 'flujo funcional']) || 'La solución prioriza una estructura clara y adecuada al problema que aborda.',
      impact: this.readmeSection(readme, ['impacto', 'impact', 'objetivo', 'goal', 'estado actual y roadmap']) || 'La solución y su documentación están disponibles en GitHub.',
      stack: uniqueStack,
    };
  }

  private isProjectRepository(repository: GitHubRepository): boolean {
    return repository.size > 0 && !this.excludedRepositories.has(repository.name);
  }

  private cleanMarkdown(text: string): string {
    return text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/^\s*(?:mermaid|flowchart|graph)\s+.*$/gim, '')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[`*_]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private readmeTitle(readme: string): string | null {
    const title = readme.match(/^#\s+(.+)$/m)?.[1];
    return title ? this.cleanMarkdown(title) : null;
  }

  private toProjectTitle(repositoryName: string): string {
    return repositoryName
      .split(/[-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private readmeIntro(readme: string): string | null {
    const withoutTitle = readme.replace(/^#.*$/m, '').trim();
    const paragraph = withoutTitle.split(/\n\s*\n/).find((block) => !/^[#>\-*`]/.test(block.trim()));
    return paragraph ? this.cleanMarkdown(paragraph) : null;
  }

  private readmeList(readme: string, headings: string[]): string[] {
    const section = this.readmeRawSection(readme, headings);
    if (!section) {
      return [];
    }

    return section
      .split(/[\n·,]/)
      .map((item) => this.cleanMarkdown(item.replace(/^[-*\d.\s]+/, '').trim()))
      .filter((item) => item.length > 1 && item.length < 40)
      .slice(0, 8);
  }

  private readmeSection(readme: string, headings: string[]): string | null {
    const section = this.readmeRawSection(readme, headings);
    return section ? this.cleanMarkdown(section) : null;
  }

  private readmeRawSection(readme: string, headings: string[]): string | null {
    if (!readme) {
      return null;
    }

    const normalizedHeadings = headings.map((heading) => this.normalizeHeading(heading));
    const lines = readme.split(/\r?\n/);
    const start = lines.findIndex((line) => {
      const match = line.match(/^(#{2,4})\s+(.+)$/);
      if (!match) {
        return false;
      }

      const normalizedTitle = this.normalizeHeading(match[2]);
      return normalizedHeadings.some(
        (heading) => normalizedTitle === heading || normalizedTitle.startsWith(`${heading}y`),
      );
    });

    if (start < 0) {
      return null;
    }

    const content = [];
    for (let index = start + 1; index < lines.length; index += 1) {
      if (/^#{2,4}\s+/.test(lines[index])) {
        break;
      }
      content.push(lines[index]);
    }

    return content.join('\n').trim() || null;
  }

  private normalizeHeading(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }
}