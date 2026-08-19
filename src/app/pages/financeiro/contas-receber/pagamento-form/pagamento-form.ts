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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { PagamentoService } from '../../../../core/financeiro/pagamento.service';
import { PacienteService } from '../../../../core/paciente/paciente.service';
import { PagamentoResponse } from '../../../../models/financeiro/PagamentoResponse';
import { PacienteResponse } from '../../../../models/paciente/PacienteResponse';
import { AtivoInativoEnum } from '../../../../models/enums/ativo-inativo.enum';
import { FORMA_PAGAMENTO_OPCOES } from '../../../../models/enums/forma-pagamento.enum';
import { StatusPagamentoEnum } from '../../../../models/enums/status-pagamento.enum';

@Component({
  selector: 'app-pagamento-form',
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
    MatAutocompleteModule,
    MatSnackBarModule,
  ],
  templateUrl: './pagamento-form.html',
  styleUrl: './pagamento-form.scss',
})
export class PagamentoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private pagamentoService = inject(PagamentoService);
  private pacienteService = inject(PacienteService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  form!: FormGroup;
  loading = false;
  salvando = false;
  processando = false;
  id: number | null = null;
  status: StatusPagamentoEnum = StatusPagamentoEnum.PENDENTE;
  readonly statusEnum = StatusPagamentoEnum;
  formaOpcoes = FORMA_PAGAMENTO_OPCOES;
  pacientes: PacienteResponse[] = [];
  pacientesFiltrados: PacienteResponse[] = [];
  origemAgendamentoOuPacote = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam && idParam !== 'novo' ? +idParam : null;
    this.buildForm();
    this.carregarPacientes();
    if (this.id != null) {
      const prefilled = this.prefillFromNavigationState();
      this.loading = !prefilled;
      this.carregarPagamento(prefilled);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      pacienteNome: ['', [Validators.required]],
      cdPaciente: [null as number | null, [Validators.required]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      formaPagamento: [null],
      dtVencimento: [''],
      observacoes: [''],
    });
  }

  private carregarPacientes(): void {
    this.pacienteService.listar({ pacienteAtivo: AtivoInativoEnum.ATIVO }).subscribe({
      next: pacientes => {
        this.pacientes = pacientes;
        this.pacientesFiltrados = pacientes;
      },
      error: () => {
        this.snackBar.open('Não foi possível carregar a lista de pacientes.', 'Fechar', {
          duration: 5000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  filtrarPacientes(): void {
    this.form.patchValue({ cdPaciente: null }, { emitEvent: false });
    const termo = (this.form.get('pacienteNome')?.value ?? '').toString().trim().toLowerCase();
    this.pacientesFiltrados = !termo
      ? this.pacientes
      : this.pacientes.filter(p => (p.nmPaciente ?? '').toLowerCase().includes(termo));
  }

  selecionarPaciente(paciente: PacienteResponse): void {
    const id = paciente.cdPaciente ?? paciente.id;
    if (id == null) return;
    this.form.patchValue({ pacienteNome: paciente.nmPaciente ?? '', cdPaciente: id });
  }

  displayPaciente = (paciente: PacienteResponse | string | null): string => {
    if (!paciente) return '';
    if (typeof paciente === 'string') return paciente;
    return paciente.nmPaciente ?? '';
  };

  get isEdicao(): boolean {
    return this.id != null;
  }

  get podeEditar(): boolean {
    return !this.isEdicao || this.status === StatusPagamentoEnum.PENDENTE;
  }

  private prefillFromNavigationState(): boolean {
    const st = this.location.getState() as { pagamento?: PagamentoResponse };
    const p = st?.pagamento;
    if (!p || this.id == null || p.cdPagamento !== this.id) return false;
    this.aplicarNaForm(p);
    return true;
  }

  private aplicarNaForm(p: PagamentoResponse): void {
    this.status = p.status?.codigo ?? StatusPagamentoEnum.PENDENTE;
    this.origemAgendamentoOuPacote = p.cdAgendamento != null || p.cdPacote != null;
    this.form.patchValue({
      pacienteNome: p.nmPaciente,
      cdPaciente: p.cdPaciente,
      valor: p.valor,
      formaPagamento: p.formaPagamento?.codigo ?? null,
      dtVencimento: p.dtVencimento ?? '',
      observacoes: p.observacoes ?? '',
    });
    if (!this.podeEditar || this.origemAgendamentoOuPacote) {
      this.form.disable({ emitEvent: false });
    }
  }

  private carregarPagamento(prefilled: boolean): void {
    if (this.id == null) return;
    this.pagamentoService.obterPorId(this.id).pipe(
      finalize(() => (this.loading = false))
    ).subscribe({
      next: p => this.aplicarNaForm(p),
      error: () => {
        if (!prefilled) this.voltar();
      },
    });
  }

  salvar(): void {
    if (!this.podeEditar || this.origemAgendamentoOuPacote || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    const raw = this.form.getRawValue();
    const body = {
      cdPagamento: this.id ?? undefined,
      cdPaciente: Number(raw.cdPaciente),
      valor: Number(raw.valor),
      formaPagamento: raw.formaPagamento != null ? Number(raw.formaPagamento) : undefined,
      dtVencimento: raw.dtVencimento || undefined,
      observacoes: raw.observacoes?.trim() || undefined,
    };
    const req = this.isEdicao ? this.pagamentoService.atualizar(body) : this.pagamentoService.salvar(body);
    req.pipe(
      finalize(() => {
        this.salvando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Pagamento salvo com sucesso.', 'Fechar', { duration: 5000, panelClass: ['snackbar-sucesso'] });
        this.voltar();
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(this.mensagemErroHttp(err, 'Não foi possível salvar o pagamento.'), 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  baixar(): void {
    if (this.id == null) return;
    const forma = this.form.get('formaPagamento')?.value;
    this.processando = true;
    this.pagamentoService.baixar(this.id, { formaPagamento: forma != null ? Number(forma) : undefined }).pipe(
      finalize(() => { this.processando = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => {
        this.snackBar.open('Pagamento baixado com sucesso.', 'Fechar', { duration: 5000, panelClass: ['snackbar-sucesso'] });
        this.voltar();
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(this.mensagemErroHttp(err, 'Não foi possível dar baixa no pagamento.'), 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  cancelarPagamento(): void {
    if (this.id == null) return;
    this.processando = true;
    this.pagamentoService.cancelar(this.id).pipe(
      finalize(() => { this.processando = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => {
        this.snackBar.open('Pagamento cancelado.', 'Fechar', { duration: 5000, panelClass: ['snackbar-sucesso'] });
        this.voltar();
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(this.mensagemErroHttp(err, 'Não foi possível cancelar o pagamento.'), 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/dashboard/financeiro/contas-receber']);
  }

  private mensagemErroHttp(err: HttpErrorResponse, fallback: string): string {
    const body = err.error;
    if (body && typeof body === 'object' && 'message' in body) {
      return String((body as { message: string }).message);
    }
    return err.message || fallback;
  }
}
