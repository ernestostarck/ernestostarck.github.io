import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-sobre-mi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sobre-mi.html',
  styleUrl: './sobre-mi.css',
})
export class SobreMi {
  readonly experienceYears = [2021, 2022, 2023, 2024, 2025, 2026];
  readonly selectedExperienceYear = signal(2026);

  selectExperienceYear(year: number): void {
    this.selectedExperienceYear.set(year);
  }
}
