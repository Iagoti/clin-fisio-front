import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../core/theme/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent {
  private auth = inject(AuthService);
  theme = inject(ThemeService);

  user = computed(() => this.auth.getCurrentUser());
  podeVerUsuarios = computed(() => this.auth.hasPermission('USUARIO_LISTAR'));
  podeVerRoles = computed(() => this.auth.hasPermission('ROLE_LISTAR'));
  podeVerFinanceiro = computed(() => this.auth.hasPermission('FINANCEIRO_RELATORIO_VISUALIZAR'));

  toggleTheme(): void {
    this.theme.toggle();
  }

  logout(): void {
    this.auth.logout();
    window.location.href = '/login';
  }
}
