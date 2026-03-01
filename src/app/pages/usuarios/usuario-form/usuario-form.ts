import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { UsuarioRequest } from '../../../models/usuario/UsuarioRequest';
import { UsuarioResponse } from '../../../models/usuario/UsuarioResponse';
import { finalize } from 'rxjs/operators';

const STATUS_OPCOES = [
  { value: 1, label: 'Ativo' },
  { value: 0, label: 'Inativo' },
];

const TIPO_OPCOES = [
  { codigo: 1, descricao: 'Administrador' },
  { codigo: 2, descricao: 'Usuário' },
];

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss',
})
export class UsuarioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);

  form!: FormGroup;
  loading = false;
  salvando = false;
  excluindo = false;
  mostrarSenha = false;
  id: number | null = null;
  statusOpcoes = STATUS_OPCOES;
  tipoOpcoes = TIPO_OPCOES;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam && idParam !== 'novo' ? +idParam : null;
    this.buildForm();
    if (this.id != null) {
      this.carregarUsuario();
    } else {
      this.form.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      login: ['', [Validators.required]],
      senha: ['', [Validators.minLength(6)]],
      stUsuario: [1, [Validators.required]],
      tipoCodigo: [1, [Validators.required]],
    });
  }

  private carregarUsuario(): void {
    if (this.id == null) return;
    this.loading = true;
    this.usuarioService.obterPorId(this.id).subscribe({
      next: (u: UsuarioResponse) => {
        this.form.patchValue({
          nome: u.nmUsuario,
          email: u.email,
          login: u.login,
          senha: '',
          stUsuario: u.stUsuario?.codigo ?? 1,
          tipoCodigo: u.tpUsuario?.codigo ?? 1,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.voltar();
      },
    });
  }

  get isEdicao(): boolean {
    return this.id != null;
  }

  private toRequest(senha: string): UsuarioRequest {
    const payload: UsuarioRequest = {
      nome: this.form.get('nome')?.value?.trim() ?? '',
      email: this.form.get('email')?.value?.trim() ?? '',
      login: this.form.get('login')?.value?.trim() ?? '',
      stUsuario: Number(this.form.get('stUsuario')?.value),
      tipo: Number(this.form.get('tipoCodigo')?.value),
    };
    if (senha) payload.senha = senha;
    return payload;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const senha = this.form.get('senha')?.value?.trim() ?? '';
    if (!this.isEdicao && !senha) {
      this.form.get('senha')?.setErrors({ required: true });
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    const body = this.toRequest(senha);
    const req = this.isEdicao
      ? this.usuarioService.atualizar(this.id!, body)
      : this.usuarioService.salvar(body);
    req.pipe(
      finalize(() => (this.salvando = false))
    ).subscribe({
      next: () => this.voltar(),
      error: (err) => {
        console.error('Erro ao salvar usuário', err);
        // TODO: exibir mensagem para o usuário (snackbar/toast)
      },
    });
  }

  excluir(): void {
    if (this.id == null) return;
    if (!confirm('Deseja realmente excluir este usuário?')) return;
    this.excluindo = true;
    this.usuarioService.excluir(this.id).subscribe({
      next: () => {
        this.excluindo = false;
        this.voltar();
      },
      error: () => {
        this.excluindo = false;
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/dashboard/usuarios']);
  }
}
