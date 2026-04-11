import { ChangeDetectorRef, Component, Injector, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BtnSalvarUsuario } from '../components/btn-salvar-usuario/btn-salvar-usuario';
import { BtnVoltar } from '../components/btn-voltar/btn-voltar';
import { BtnExcluirUsuario } from '../components/btn-excluir-usuario/btn-excluir-usuario';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { UsuarioRequest } from '../../../models/usuario/UsuarioRequest';
import { UsuarioResponse } from '../../../models/usuario/UsuarioResponse';
import { finalize } from 'rxjs/operators';

/** Snapshot dos campos ao estar em modo somente leitura (cancelar edição restaura isto). */
type UsuarioFormSnapshot = {
  nome: string;
  email: string;
  login: string;
  senha: string;
  stUsuario: number;
  tipoCodigo: number;
};

/** Valores iguais a `AtivoInativoEnum` no backend (1 = ATIVO, 2 = INATIVO). */
const STATUS_OPCOES = [
  { value: 1, label: 'Ativo' },
  { value: 2, label: 'Inativo' },
];

const TIPO_OPCOES = [
  { codigo: 1, descricao: 'Administrador' },
  { codigo: 2, descricao: 'Recepção' },
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
    MatSnackBarModule,
    BtnSalvarUsuario,
    BtnVoltar,
    BtnExcluirUsuario,
  ],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss',
})
export class UsuarioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private usuarioService = inject(UsuarioService);
  private snackBar = inject(MatSnackBar);
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  form!: FormGroup;
  loading = false;
  salvando = false;
  excluindo = false;
  mostrarSenha = false;
  /** Na edição, começa em visualização; "Editar" libera os campos. */
  somenteLeitura = false;
  private snapshotLeitura: UsuarioFormSnapshot | null = null;
  id: number | null = null;
  statusOpcoes = STATUS_OPCOES;
  tipoOpcoes = TIPO_OPCOES;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam && idParam !== 'novo' ? +idParam : null;
    this.buildForm();
    if (this.id != null) {
      const prefilled = this.prefillFromNavigationState();
      this.loading = !prefilled;
      if (prefilled) {
        this.entrarModoVisualizacao();
      }
      this.carregarUsuario(prefilled);
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

  private prefillFromNavigationState(): boolean {
    const st = this.location.getState() as { usuario?: UsuarioResponse; navigationId?: number };
    const u = st?.usuario;
    if (!u || this.id == null) return false;
    const rowId = u.cdUsuario ?? u.id;
    if (rowId !== this.id) return false;
    this.aplicarUsuarioNaForm(u);
    return true;
  }

  private aplicarUsuarioNaForm(u: UsuarioResponse): void {
    try {
      this.form.patchValue({
        nome: u.nmUsuario ?? '',
        email: u.email ?? '',
        login: u.login ?? '',
        senha: '',
        stUsuario: u.stUsuario?.codigo ?? 1,
        tipoCodigo: u.tpUsuario?.codigo ?? 1,
      });
    } catch (e) {
      console.error('Erro ao preencher formulário de usuário', e);
    }
  }

  private carregarUsuario(prefilled: boolean): void {
    if (this.id == null) return;
    this.usuarioService
      .obterPorId(this.id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (u: UsuarioResponse) => {
          this.aplicarUsuarioNaForm(u);
          this.entrarModoVisualizacao();
        },
        error: () => {
          if (!prefilled) {
            this.voltar();
          }
        },
      });
  }

  get isEdicao(): boolean {
    return this.id != null;
  }

  private entrarModoVisualizacao(): void {
    if (!this.isEdicao) return;
    this.somenteLeitura = true;
    this.form.disable({ emitEvent: false });
    this.snapshotLeitura = this.form.getRawValue() as UsuarioFormSnapshot;
  }

  iniciarEdicao(): void {
    if (!this.isEdicao || !this.somenteLeitura) return;
    this.somenteLeitura = false;
    this.form.enable({ emitEvent: false });
  }

  private cancelarParaVisualizacao(): void {
    if (!this.snapshotLeitura) return;
    this.form.patchValue(this.snapshotLeitura, { emitEvent: false });
    this.entrarModoVisualizacao();
  }

  /** Cancelar na lista = sair; em edição ativa = voltar ao modo visualização. */
  cancelarOuVoltar(): void {
    if (this.isEdicao && !this.somenteLeitura) {
      this.cancelarParaVisualizacao();
    } else {
      this.voltar();
    }
  }

  private toRequest(senha: string): UsuarioRequest {
    const payload: UsuarioRequest = {
      nome: this.form.get('nome')?.value?.trim() ?? '',
      email: this.form.get('email')?.value?.trim() ?? '',
      login: this.form.get('login')?.value?.trim() ?? '',
      stUsuario: Number(this.form.get('stUsuario')?.value),
      tipo: Number(this.form.get('tipoCodigo')?.value),
    };
    if (this.id != null) {
      payload.cdUsuario = this.id;
    }
    if (senha) payload.senha = senha;
    return payload;
  }

  salvar(): void {
    if (this.isEdicao && this.somenteLeitura) {
      return;
    }
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
      ? this.usuarioService.atualizar(body)
      : this.usuarioService.salvar(body);
    req.pipe(
      finalize(() => {
        this.salvando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        const msg = this.isEdicao
          ? 'Usuário atualizado com sucesso.'
          : 'Usuário cadastrado com sucesso.';
        this.snackBar.open(msg, 'Fechar', {
          duration: 5000,
          panelClass: ['snackbar-sucesso'],
        });
        this.voltar();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao salvar usuário', err);
        const msg = this.mensagemErroSalvar(err);
        this.snackBar.open(msg, 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  private mensagemErroSalvar(err: HttpErrorResponse): string {
    const body = err.error;
    if (body && typeof body === 'object' && 'message' in body) {
      return String((body as { message: string }).message);
    }
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    return err.message || 'Não foi possível salvar o usuário.';
  }

  excluir(): void {
    if (this.id == null || this.somenteLeitura) return;
    if (!isPlatformBrowser(this.platformId)) return;
    void this.abrirConfirmacaoExclusao();
  }

  /** `import()` no browser evita falha de módulo no SSR/hidratação com MatDialog/CDK Overlay. */
  private async abrirConfirmacaoExclusao(): Promise<void> {
    try {
      const [{ MatDialog }, { ConfirmarExclusaoUsuarioDialog }] = await Promise.all([
        import('@angular/material/dialog'),
        import('../components/confirmar-exclusao-usuario-dialog/confirmar-exclusao-usuario-dialog'),
      ]);
      const dialog = this.injector.get(MatDialog);
      dialog
        .open(ConfirmarExclusaoUsuarioDialog, {
          width: 'min(420px, calc(100vw - 32px))',
          autoFocus: 'first-tabbable',
          closeOnNavigation: true,
        })
        .afterClosed()
        .subscribe((confirmado) => {
          if (confirmado === true) {
            this.executarExclusao();
          }
        });
    } catch (e) {
      console.error('Erro ao abrir confirmação de exclusão', e);
      this.snackBar.open('Não foi possível abrir a confirmação. Tente novamente.', 'Fechar', {
        duration: 5000,
        panelClass: ['snackbar-erro'],
      });
    }
  }

  private executarExclusao(): void {
    if (this.id == null) return;
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
