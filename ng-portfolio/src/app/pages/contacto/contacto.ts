import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONTACT_EMAIL, CONTACT_FORM_ENDPOINT } from '../../core/contact-config';

const REASONS: Record<string, string> = {
  job: 'Oportunidad laboral',
  collab: 'Colaboración o proyecto',
  tech: 'Consulta técnica',
  other: 'Otro',
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  private readonly fb = inject(FormBuilder);
  readonly contactEmail = CONTACT_EMAIL;
  status = signal<Status>('idle');

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    reason: ['job'],
    message: ['', [Validators.required, Validators.minLength(10)]],
    botField: [''],
  });

  invalid(field: 'name' | 'email' | 'message'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  async submit(lang: 'es' | 'en', formElement: HTMLFormElement): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { botField } = this.form.getRawValue();
    if (botField) {
      this.status.set('sent');
      return;
    }

    this.status.set('sending');
    try {
      const payload = new URLSearchParams();
      for (const [key, value] of new FormData(formElement).entries()) {
        payload.append(key, typeof value === 'string' ? value : value.name);
      }
      payload.set('form-name', 'contact');
      payload.set('lang', lang);
      payload.set('reason', REASONS[this.form.controls.reason.value] ?? this.form.controls.reason.value);

      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });
      if (!response.ok) throw new Error(`Netlify form submission failed (${response.status})`);
      this.status.set('sent');
      this.form.reset({ reason: 'job', name: '', email: '', message: '', botField: '' });
    } catch {
      this.status.set('error');
    }
  }
}
