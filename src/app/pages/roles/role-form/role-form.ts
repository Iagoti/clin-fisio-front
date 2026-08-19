import { ChangeDetectorRef, Component, Injector, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { RoleService } from '../../../core/role/role.service';
import { RoleRequest } from '../../../models/role/RoleRequest';
import { RoleResponse } from '../../../models/role/RoleResponse';
import { PermissaoResponse } from '../../../models/role/PermissaoResponse';
import { AtivoInativoEnum, ATIVO_INATIVO_OPCOES } from '../../../models/enums/ativo-inativo.enum';

interface GrupoPermissao {
  modulo: string;
  permissoes: PermissaoResponse[];
}

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './role-form.html',
  styleUrl: './role-form.scss',
})
export class RoleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private roleService = inject(RoleService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);

  form!: FormGroup;
  loading = false;
  salvando = false;
  excluindo = false;
  id: number | null = null;
  /** Perfil de sistema (ADMINISTRADOR/RECEPCAO) — o backend bloqueia edição/exclusão. */
  flSistema = false;
  statusOpcoes = ATIVO_INATIVO_OPCOES;
  grupos: GrupoPermissao[] = [];
  private selecionadas = new Set<number>();

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam && idParam !== 'novo' ? +idParam : null;
    this.buildForm();
    this.carregarPermissoes();
    if (this.id != null) {
      this.carregarRole();
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      nmRole: ['', [Validators.required]],
      dsRole: [''],
      stRole: [AtivoInativoEnum.ATIVO, [Validators.required]],
    });
  }

  get isEdicao(): boolean {
    return this.id != null;
  }

  private carregarPermissoes(): void {
    this.roleService.listarPermissoes().subscribe({
      next: (permissoes) => {
        const porModulo = new Map<string, PermissaoResponse[]>();
        for (const p of permissoes) {
          const lista = porModulo.get(p.nmModulo) ?? [];
          lista.push(p);
          porModulo.set(p.nmModulo, lista);
        }
        this.grupos = Array.from(porModulo.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([modulo, lista]) => ({ modulo, permissoes: lista }));
      },
      error: () => {
        this.snackBar.open('Não foi possível carregar as permissões.', 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  private carregarRole(): void {
    if (this.id == null) return;
    this.loading = true;
    this.roleService
      .obterPorId(this.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (r) => this.aplicarRoleNaForm(r),
        error: () => this.voltar(),
      });
  }

  private aplicarRoleNaForm(r: RoleResponse): void {
    this.flSistema = r.flSistema;
    this.form.patchValue({
      nmRole: r.nmRole ?? '',
      dsRole: r.dsRole ?? '',
      stRole: r.stRole?.codigo ?? AtivoInativoEnum.ATIVO,
    });
    this.selecionadas = new Set((r.permissoes ?? []).map((p) => p.cdPermissao));
    if (this.flSistema) {
      this.form.disable({ emitEvent: false });
    }
  }

  isSelecionada(cdPermissao: number): boolean {
    return this.selecionadas.has(cdPermissao);
  }

  toggle(cdPermissao: number): void {
    if (this.flSistema) return;
    if (this.selecionadas.has(cdPermissao)) {
      this.selecionadas.delete(cdPermissao);
    } else {
      this.selecionadas.add(cdPermissao);
    }
  }

  private toRequest(): RoleRequest {
    const payload: RoleRequest = {
      nmRole: this.form.get('nmRole')?.value?.trim() ?? '',
      dsRole: this.form.get('dsRole')?.value?.trim() ?? '',
      stRole: Number(this.form.get('stRole')?.value),
      cdPermissoes: Array.from(this.selecionadas),
    };
    if (this.id != null) payload.cdRole = this.id;
    return payload;
  }

  salvar(): void {
    if (this.flSistema) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    const body = this.toRequest();
    const req = this.isEdicao ? this.roleService.atualizar(body) : this.roleService.salvar(body);
    req
      .pipe(
        finalize(() => {
          this.salvando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          const msg = this.isEdicao ? 'Perfil atualizado com sucesso.' : 'Perfil cadastrado com sucesso.';
          this.snackBar.open(msg, 'Fechar', { duration: 5000, panelClass: ['snackbar-sucesso'] });
          this.voltar();
        },
        error: (err: HttpErrorResponse) => {
          const msg = this.mensagemErroHttp(err, 'Não foi possível salvar o perfil.');
          this.snackBar.open(msg, 'Fechar', { duration: 6000, panelClass: ['snackbar-erro'] });
        },
      });
  }

  onSolicitarExclusao(): void {
    if (!isPlatformBrowser(this.platformId) || this.id == null || this.flSistema) return;
    void this.abrirConfirmacaoExclusao();
  }

  private async abrirConfirmacaoExclusao(): Promise<void> {
    try {
      const [{ MatDialog }, { ConfirmarExclusaoUsuarioDialog }] = await Promise.all([
        import('@angular/material/dialog'),
        import('../../usuarios/components/confirmar-exclusao-usuario-dialog/confirmar-exclusao-usuario-dialog'),
      ]);
      const dialog = this.injector.get(MatDialog);
      dialog
        .open(ConfirmarExclusaoUsuarioDialog, {
          width: 'min(420px, calc(100vw - 32px))',
          autoFocus: 'first-tabbable',
          closeOnNavigation: true,
          data: {
            titulo: 'Excluir perfil',
            mensagem:
              'Deseja realmente excluir este perfil? Não é possível excluir perfis vinculados a usuários.',
          },
        })
        .afterClosed()
        .subscribe((confirmado) => {
          if (confirmado === true) this.executarExclusao();
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
    this.roleService
      .excluir(this.id)
      .pipe(
        finalize(() => {
          this.excluindo = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Perfil excluído com sucesso.', 'Fechar', {
            duration: 5000,
            panelClass: ['snackbar-sucesso'],
          });
          this.voltar();
        },
        error: (err: HttpErrorResponse) => {
          const msg = this.mensagemErroHttp(err, 'Não foi possível excluir o perfil.');
          this.snackBar.open(msg, 'Fechar', { duration: 6000, panelClass: ['snackbar-erro'] });
        },
      });
  }

  private mensagemErroHttp(err: HttpErrorResponse, fallback: string): string {
    const body = err.error;
    if (body && typeof body === 'object' && 'message' in body) {
      return String((body as { message: string }).message);
    }
    if (typeof body === 'string' && body.trim()) return body;
    return err.message || fallback;
  }

  voltar(): void {
    this.router.navigate(['/dashboard/roles']);
  }
}
