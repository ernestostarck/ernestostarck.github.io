import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./pages/home/home').then((page) => page.Home) },
	{ path: 'sobre-mi', loadComponent: () => import('./pages/sobre-mi/sobre-mi').then((page) => page.SobreMi) },
	{ path: 'proyectos', loadComponent: () => import('./pages/proyectos/proyectos').then((page) => page.Proyectos) },
	{ path: 'certificaciones', loadComponent: () => import('./pages/certificaciones/certificaciones').then((page) => page.Certificaciones) },
	{ path: 'contacto', loadComponent: () => import('./pages/contacto/contacto').then((page) => page.Contacto) },
	{ path: '**', redirectTo: '' },
];
