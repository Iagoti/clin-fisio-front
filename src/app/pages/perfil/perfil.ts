import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';
import { UsuarioService } from '../../core/usuario/usuario.service';
import { UsuarioResponse } from '../../models/usuario/UsuarioResponse';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class PerfilComponent implements OnInit {
  private auth = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  authUser = this.auth.getCurrentUser();
  usuario: UsuarioResponse | null = null;
  loading = true;
  erro = false;

  ngOnInit(): void {
    const id = this.authUser?.cdUsuario;
    if (id == null) {
      this.loading = false;
      this.erro = true;
      return;
    }
    this.usuarioService.obterPorId(id).subscribe({
      next: u => {
        this.usuario = u;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.erro = true;
      },
    });
  }

  get nomesRoles(): string {
    return (this.usuario?.roles ?? []).map(r => r.nmRole).join(', ') || '—';
  }
}
