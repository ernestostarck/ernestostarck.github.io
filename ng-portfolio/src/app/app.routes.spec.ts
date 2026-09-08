import { routes } from './app.routes';

describe('application routes', () => {
  it('exposes the portfolio pages and a fallback route', () => {
    expect(routes.map((route) => route.path)).toEqual([
      '',
      'sobre-mi',
      'proyectos',
      'certificaciones',
      'contacto',
      '**',
    ]);
    expect(routes.at(-1)?.redirectTo).toBe('');
  });
});
