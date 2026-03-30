import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { PreferencesService } from '../../core/preferences.service';

@Component({
  selector: 'app-certificaciones',
  standalone: true,
  imports: [NgIf],
  templateUrl: './certificaciones.html',
  styleUrl: './certificaciones.css',
})
export class Certificaciones {
  preferences = inject(PreferencesService);
  theme = this.preferences.theme;
}
