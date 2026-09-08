import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, of, shareReplay } from 'rxjs';

export interface GitHubRepository {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  topics: string[];
  updated_at: string;
  stargazers_count: number;
  fork: boolean;
}

@Injectable({ providedIn: 'root' })
export class GitHubRepositoriesService {
  private readonly http = inject(HttpClient);
  private readonly username = 'ernestostarck';
  private readonly excludedRepositories = new Set(['ernestostarck.github.io']);
  private readonly featuredRepositories = ['zenith-flow', 'meddecide-cdss', 'automation-pipeline'];

  readonly repositories$ = this.http
    .get<GitHubRepository[]>(
      `https://api.github.com/users/${this.username}/repos?type=owner&sort=updated&per_page=100`,
    )
    .pipe(
      map((repositories) =>
        repositories.filter(
          (repository) => !repository.fork && !this.excludedRepositories.has(repository.name),
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
}