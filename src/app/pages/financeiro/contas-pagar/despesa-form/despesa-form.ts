import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
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
import { finalize } from 'rxjs/operators';
import { DespesaService } from '../../../../core/financeiro/despesa.service';
import { CategoriaDespesaService } from '../../../../core/financeiro/categoria-despesa.service';
import { DespesaResponse } from '../../../../models/financeiro/DespesaResponse';
import { CategoriaDespesaResponse } from '../../../../models/financeiro/CategoriaDespesaResponse';
import { StatusDespesaEnum } from '../../../../models/enums/status-despesa.enum';

@Component({
  selector: 'app-despesa-form',
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
  ],
  templateUrl: './despesa-form.html',
  styleUrl: './despesa-form.scss',
})
export class DespesaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private despesaService = inject(DespesaService);
  private categoriaService = inject(CategoriaDespesaService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  form!: FormGroup;
  loading = false;
  salvando = false;
  processando = false;
  id: number | null = null;
  status: StatusDespesaEnum = StatusDespesaEnum.PENDENTE;
  readonly statusEnum = StatusDespesaEnum;
  categorias: CategoriaDespesaResponse[] = [];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam && idParam !== 'novo' ? +idParam : null;
    this.buildForm();
    this.carregarCategorias();
    if (this.id != null) {
      const prefilled = this.prefillFromNavigationState();
      this.loading = !prefilled;
      this.carregarDespesa(prefilled);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      cdCategoriaDespesa: [null, [Validators.required]],
      descricao: ['', [Validators.required]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      dtVencimento: ['', [Validators.required]],
      observacoes: [''],
    });
  }

  private carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: categorias => (this.categorias = categorias ?? []),
      error: () => {
        this.snackBar.open('Não foi possível carregar as categorias.', 'Fechar', {
          duration: 5000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  get isEdicao(): boolean {
    return this.id != null;
  }

  get podeEditar(): boolean {
    return !this.isEdicao || this.status === StatusDespesaEnum.PENDENTE;
  }

  private prefillFromNavigationState(): boolean {
    const st = this.location.getState() as { despesa?: DespesaResponse };
    const d = st?.despesa;
    if (!d || this.id == null || d.cdDespesa !== this.id) return false;
    this.aplicarNaForm(d);
    return true;
  }

  private aplicarNaForm(d: DespesaResponse): void {
    this.status = d.status?.codigo ?? StatusDespesaEnum.PENDENTE;
    this.form.patchValue({
      cdCategoriaDespesa: d.cdCategoriaDespesa,
      descricao: d.descricao,
      valor: d.valor,
      dtVencimento: d.dtVencimento,
      observacoes: d.observacoes ?? '',
    });
    if (!this.podeEditar) {
      this.form.disable({ emitEvent: false });
    }
  }

  private carregarDespesa(prefilled: boolean): void {
    if (this.id == null) return;
    this.despesaService.obterPorId(this.id).pipe(
      finalize(() => (this.loading = false))
    ).subscribe({
      next: d => this.aplicarNaForm(d),
      error: () => {
        if (!prefilled) this.voltar();
      },
    });
  }

  salvar(): void {
    if (!this.podeEditar || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    const body = {
      cdDespesa: this.id ?? undefined,
      cdCategoriaDespesa: Number(this.form.get('cdCategoriaDespesa')?.value),
      descricao: this.form.get('descricao')?.value?.trim() ?? '',
      valor: Number(this.form.get('valor')?.value),
      dtVencimento: this.form.get('dtVencimento')?.value,
      observacoes: this.form.get('observacoes')?.value?.trim() || undefined,
    };
    const req = this.isEdicao ? this.despesaService.atualizar(body) : this.despesaService.salvar(body);
    req.pipe(
      finalize(() => {
        this.salvando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Despesa salva com sucesso.', 'Fechar', { duration: 5000, panelClass: ['snackbar-sucesso'] });
        this.voltar();
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(this.mensagemErroHttp(err, 'Não foi possível salvar a despesa.'), 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  baixar(): void {
    if (this.id == null) return;
    this.processando = true;
    this.despesaService.baixar(this.id, {}).pipe(
      finalize(() => { this.processando = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => {
        this.snackBar.open('Despesa baixada com sucesso.', 'Fechar', { duration: 5000, panelClass: ['snackbar-sucesso'] });
        this.voltar();
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(this.mensagemErroHttp(err, 'Não foi possível dar baixa na despesa.'), 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  cancelarDespesa(): void {
    if (this.id == null) return;
    this.processando = true;
    this.despesaService.cancelar(this.id).pipe(
      finalize(() => { this.processando = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => {
        this.snackBar.open('Despesa cancelada.', 'Fechar', { duration: 5000, panelClass: ['snackbar-sucesso'] });
        this.voltar();
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(this.mensagemErroHttp(err, 'Não foi possível cancelar a despesa.'), 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  excluir(): void {
    if (this.id == null || !confirm('Deseja realmente excluir esta despesa?')) return;
    this.processando = true;
    this.despesaService.excluir(this.id).pipe(
      finalize(() => { this.processando = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => {
        this.snackBar.open('Despesa excluída.', 'Fechar', { duration: 5000, panelClass: ['snackbar-sucesso'] });
        this.voltar();
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(this.mensagemErroHttp(err, 'Não foi possível excluir a despesa.'), 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/dashboard/financeiro/contas-pagar']);
  }

  private mensagemErroHttp(err: HttpErrorResponse, fallback: string): string {
    const body = err.error;
    if (body && typeof body === 'object' && 'message' in body) {
      return String((body as { message: string }).message);
    }
    return err.message || fallback;
  }
}
