import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputEmail } from './components/input-email/input-email';
import { InputSenha } from './components/input-senha/input-senha';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    InputEmail,
    InputSenha,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loading = signal(false);
  form: FormGroup;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    public theme: ThemeService
  ) {
    this.form = this.fb.group({
      credentials: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
      }),
    });
  }

  get credentialsGroup(): FormGroup {
    return this.form.get('credentials') as FormGroup;
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, senha } = this.credentialsGroup.value as { email: string; senha: string };

    this.loading.set(true);
    this.auth.login({ email, senha }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/dashboard'); // ajuste
      },
      error: () => {
        this.loading.set(false);
        // TODO: mostrar snackbar/toast com erro do backend
      },
    });
  }
}
