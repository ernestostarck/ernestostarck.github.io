import { TestBed } from '@angular/core/testing';
import { PreferencesService } from './preferences.service';

describe('PreferencesService', () => {
  let service: PreferencesService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-lang');
    document.documentElement.lang = '';
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreferencesService);
  });

  it('restores stored preferences and applies them to the document', () => {
    localStorage.setItem('portfolio.theme', 'light');
    localStorage.setItem('portfolio.lang', 'en');

    service.init();

    expect(service.theme()).toBe('light');
    expect(service.language()).toBe('en');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-lang')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('persists and applies a toggled theme', () => {
    localStorage.setItem('portfolio.theme', 'dark');
    service.init();

    service.toggleTheme();

    expect(service.theme()).toBe('light');
    expect(localStorage.getItem('portfolio.theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('persists and applies the selected language', () => {
    service.init();

    service.setLanguage('en');

    expect(service.language()).toBe('en');
    expect(localStorage.getItem('portfolio.lang')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });
});
