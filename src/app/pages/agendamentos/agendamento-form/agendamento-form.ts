import { ChangeDetectorRef, Component, Injector, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BtnVoltar } from '../../usuarios/components/btn-voltar/btn-voltar';
import { AgendamentoService } from '../../../core/agendamento/agendamento.service';
import { PacienteService } from '../../../core/paciente/paciente.service';
import { PacoteService } from '../../../core/financeiro/pacote.service';
import { AgendamentoRequest } from '../../../models/agendamento/AgendamentoRequest';
import { AgendamentoResponse } from '../../../models/agendamento/AgendamentoResponse';
import { PacienteResponse } from '../../../models/paciente/PacienteResponse';
import { PacoteResponse } from '../../../models/financeiro/PacoteResponse';
import { AtivoInativoEnum } from '../../../models/enums/ativo-inativo.enum';
import { TIPO_ATENDIMENTO_OPCOES, TipoAtendimentoEnum } from '../../../models/enums/tipo-atendimento.enum';
import { STATUS_AGENDAMENTO_OPCOES, StatusAgendamentoEnum } from '../../../models/enums/status-agendamento.enum';
import { StatusPacoteEnum } from '../../../models/enums/status-pacote.enum';
import { finalize } from 'rxjs/operators';

const TIPOS_ARQUIVO_ATESTADO_PERMITIDOS = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
const TAMANHO_MAXIMO_ARQUIVO_ATESTADO = 8 * 1024 * 1024;

type AgendamentoFormSnapshot = {
  pacienteNome: string;
  cdPaciente: number | null;
  tipoAtendimento: number;
  dataAgendamento: string;
  horaAgendamento: string;
  status: number;
  valor: number | null;
  observacoes: string;
};

@Component({
  selector: 'app-agendamento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatSnackBarModule,
    BtnVoltar,
  ],
  templateUrl: './agendamento-form.html',
  styleUrl: './agendamento-form.scss',
})
export class AgendamentoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private agendamentoService = inject(AgendamentoService);
  private pacienteService = inject(PacienteService);
  private pacoteService = inject(PacoteService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);

  form!: FormGroup;
  loading = false;
  salvando = false;
  excluindo = false;
  somenteLeitura = false;
  private snapshotLeitura: AgendamentoFormSnapshot | null = null;
  id: number | null = null;
  tipoOpcoes = TIPO_ATENDIMENTO_OPCOES;
  statusOpcoes = STATUS_AGENDAMENTO_OPCOES;
  pacientes: PacienteResponse[] = [];
  pacientesFiltrados: PacienteResponse[] = [];
  readonly tipoFisioterapia = TipoAtendimentoEnum.FISIOTERAPIA;
  readonly statusFaltou = StatusAgendamentoEnum.FALTOU;

  // Pacote de fisioterapia do paciente selecionado
  pacoteAtivo: PacoteResponse | null = null;
  carregandoPacote = false;
  iniciandoPacote = false;

  // Falta / atestado
  registrandoFalta = false;
  comAtestado = false;
  arquivoAtestadoBase64: string | null = null;
  arquivoAtestadoSelecionado: File | null = null;
  arquivoAtestadoErro: string | null = null;

  // Reposição
  criandoReposicao = false;
  formReposicao!: FormGroup;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam && idParam !== 'novo' ? +idParam : null;
    this.buildForm();
    this.carregarPacientes();
    if (this.id != null) {
      const prefilled = this.prefillFromNavigationState();
      this.loading = !prefilled;
      if (prefilled) {
        this.entrarModoVisualizacao();
        this.carregarPacoteSeFisioterapia();
      }
      this.carregarAgendamento(prefilled);
    }
    this.form.get('tipoAtendimento')?.valueChanges.subscribe(() => this.carregarPacoteSeFisioterapia());
    this.form.get('cdPaciente')?.valueChanges.subscribe(() => this.carregarPacoteSeFisioterapia());
  }

  private buildForm(): void {
    this.form = this.fb.group({
      pacienteNome: ['', [Validators.required]],
      cdPaciente: [null as number | null, [Validators.required]],
      tipoAtendimento: [null, [Validators.required]],
      dataAgendamento: ['', [Validators.required]],
      horaAgendamento: ['', [Validators.required]],
      status: [StatusAgendamentoEnum.AGENDADO, [Validators.required]],
      valor: [null],
      observacoes: [''],
    });
    this.formReposicao = this.fb.group({
      dataAgendamento: ['', [Validators.required]],
      horaAgendamento: ['', [Validators.required]],
      observacoes: [''],
    });
  }

  /** Mostra sessões restantes do pacote ativo quando o tipo selecionado é fisioterapia. */
  private carregarPacoteSeFisioterapia(): void {
    const tipo = Number(this.form.get('tipoAtendimento')?.value);
    const cdPaciente = this.form.get('cdPaciente')?.value;
    this.pacoteAtivo = null;
    if (tipo !== this.tipoFisioterapia || !cdPaciente) return;

    this.carregandoPacote = true;
    this.pacoteService.listar({ cdPaciente, status: StatusPacoteEnum.ATIVO }).pipe(
      finalize(() => { this.carregandoPacote = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: pacotes => {
        this.pacoteAtivo = pacotes.find(p => p.sessoesRestantes > 0) ?? pacotes[0] ?? null;
      },
      error: () => { this.pacoteAtivo = null; },
    });
  }

  iniciarNovoPacote(): void {
    const cdPaciente = this.form.get('cdPaciente')?.value;
    if (!cdPaciente) return;
    this.iniciandoPacote = true;
    this.pacoteService.iniciar({ cdPaciente }).pipe(
      finalize(() => { this.iniciandoPacote = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: pacote => {
        this.pacoteAtivo = pacote;
        this.snackBar.open('Pacote de fisioterapia iniciado — pagamento de R$ 100,00 gerado em Contas a Receber.', 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-sucesso'],
        });
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(this.mensagemErroHttp(err, 'Não foi possível iniciar o pacote.'), 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  onArquivoAtestadoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.arquivoAtestadoErro = null;
    if (!file) return;

    if (!TIPOS_ARQUIVO_ATESTADO_PERMITIDOS.includes(file.type)) {
      this.arquivoAtestadoErro = 'Formato inválido. Envie um PDF ou imagem (PNG, JPG ou WEBP).';
      input.value = '';
      return;
    }
    if (file.size > TAMANHO_MAXIMO_ARQUIVO_ATESTADO) {
      this.arquivoAtestadoErro = 'Arquivo muito grande. Tamanho máximo: 8MB.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.arquivoAtestadoBase64 = reader.result as string;
      this.arquivoAtestadoSelecionado = file;
      this.cdr.detectChanges();
    };
    reader.onerror = () => {
      this.arquivoAtestadoErro = 'Não foi possível ler o arquivo selecionado.';
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  registrarFalta(): void {
    if (this.id == null) return;
    this.registrandoFalta = true;
    this.agendamentoService.registrarFalta({
      cdAgendamento: this.id,
      comAtestado: this.comAtestado,
      arquivoAtestadoBase64: this.arquivoAtestadoBase64 ?? undefined,
      nomeArquivoAtestado: this.arquivoAtestadoSelecionado?.name,
      tipoArquivoAtestado: this.arquivoAtestadoSelecionado?.type,
    }).pipe(
      finalize(() => { this.registrandoFalta = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: a => {
        this.aplicarAgendamentoNaForm(a);
        this.entrarModoVisualizacao();
        this.snackBar.open('Falta registrada.', 'Fechar', { duration: 5000, panelClass: ['snackbar-sucesso'] });
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(this.mensagemErroHttp(err, 'Não foi possível registrar a falta.'), 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  criarReposicao(): void {
    if (this.id == null || this.formReposicao.invalid) {
      this.formReposicao.markAllAsTouched();
      return;
    }
    this.criandoReposicao = true;
    const raw = this.formReposicao.getRawValue();
    this.agendamentoService.criarReposicao({
      cdAgendamentoOrigemFalta: this.id,
      dataAgendamento: raw.dataAgendamento,
      horaAgendamento: raw.horaAgendamento,
      observacoes: raw.observacoes?.trim() || undefined,
    }).pipe(
      finalize(() => { this.criandoReposicao = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: reposicao => {
        this.snackBar.open('Reposição criada com sucesso.', 'Fechar', { duration: 5000, panelClass: ['snackbar-sucesso'] });
        this.router.navigate(['/dashboard/agendamentos', reposicao.cdAgendamento], { state: { agendamento: reposicao } });
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(this.mensagemErroHttp(err, 'Não foi possível criar a reposição.'), 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
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
    if (!this.somenteLeitura) {
      this.form.patchValue({ cdPaciente: null }, { emitEvent: false });
    }
    const termo = (this.form.get('pacienteNome')?.value ?? '').toString().trim().toLowerCase();
    if (!termo) {
      this.pacientesFiltrados = this.pacientes;
      return;
    }
    this.pacientesFiltrados = this.pacientes.filter(p =>
      (p.nmPaciente ?? '').toLowerCase().includes(termo)
    );
  }

  selecionarPaciente(paciente: PacienteResponse): void {
    const id = paciente.cdPaciente ?? paciente.id;
    if (id == null) return;
    this.form.patchValue({
      pacienteNome: paciente.nmPaciente ?? '',
      cdPaciente: id,
    });
  }

  displayPaciente = (paciente: PacienteResponse | string | null): string => {
    if (!paciente) return '';
    if (typeof paciente === 'string') return paciente;
    return paciente.nmPaciente ?? '';
  };

  private prefillFromNavigationState(): boolean {
    const st = this.location.getState() as { agendamento?: AgendamentoResponse; navigationId?: number };
    const agendamento = st?.agendamento;
    if (!agendamento || this.id == null) return false;
    if (agendamento.cdAgendamento !== this.id) return false;
    this.aplicarAgendamentoNaForm(agendamento);
    return true;
  }

  private aplicarAgendamentoNaForm(a: AgendamentoResponse): void {
    this.form.patchValue({
      pacienteNome: a.nmPaciente ?? '',
      cdPaciente: a.cdPaciente ?? null,
      tipoAtendimento: a.tipoAtendimento?.codigo ?? null,
      dataAgendamento: a.dataAgendamento ?? '',
      horaAgendamento: a.horaAgendamento?.slice(0, 5) ?? '',
      status: a.status?.codigo ?? StatusAgendamentoEnum.AGENDADO,
      valor: a.valor ?? null,
      observacoes: a.observacoes ?? '',
    });
  }

  private carregarAgendamento(prefilled: boolean): void {
    if (this.id == null) return;
    this.agendamentoService
      .obterPorId(this.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: agendamento => {
          this.aplicarAgendamentoNaForm(agendamento);
          this.entrarModoVisualizacao();
        },
        error: () => {
          if (!prefilled) this.voltar();
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
    this.snapshotLeitura = this.form.getRawValue() as AgendamentoFormSnapshot;
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

  cancelarOuVoltar(): void {
    if (this.isEdicao && !this.somenteLeitura) {
      this.cancelarParaVisualizacao();
    } else {
      this.voltar();
    }
  }

  private toRequest(): AgendamentoRequest {
    const raw = this.form.getRawValue();
    const payload: AgendamentoRequest = {
      cdPaciente: Number(raw.cdPaciente),
      tipoAtendimento: Number(raw.tipoAtendimento),
      dataAgendamento: raw.dataAgendamento,
      horaAgendamento: raw.horaAgendamento,
      status: Number(raw.status),
      valor: raw.valor != null && raw.valor !== '' ? Number(raw.valor) : undefined,
      observacoes: raw.observacoes?.trim() || undefined,
    };
    if (this.id != null) {
      payload.cdAgendamento = this.id;
    }
    return payload;
  }

  salvar(): void {
    if (this.isEdicao && this.somenteLeitura) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    const body = this.toRequest();
    const req = this.isEdicao
      ? this.agendamentoService.atualizar(body)
      : this.agendamentoService.salvar(body);
    req.pipe(
      finalize(() => {
        this.salvando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        const msg = this.isEdicao
          ? 'Agendamento atualizado com sucesso.'
          : 'Agendamento criado com sucesso.';
        this.snackBar.open(msg, 'Fechar', {
          duration: 5000,
          panelClass: ['snackbar-sucesso'],
        });
        this.voltar();
      },
      error: (err: HttpErrorResponse) => {
        const msg = this.mensagemErroHttp(err, 'Não foi possível salvar o agendamento.');
        this.snackBar.open(msg, 'Fechar', {
          duration: 6000,
          panelClass: ['snackbar-erro'],
        });
      },
    });
  }

  excluir(): void {
    if (this.id == null || !isPlatformBrowser(this.platformId)) return;
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
            titulo: 'Excluir agendamento',
            mensagem: 'Deseja realmente excluir este agendamento? Esta ação não pode ser desfeita.',
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
    this.agendamentoService
      .excluir(this.id)
      .pipe(
        finalize(() => {
          this.excluindo = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Agendamento excluído com sucesso.', 'Fechar', {
            duration: 5000,
            panelClass: ['snackbar-sucesso'],
          });
          this.voltar();
        },
        error: (err: HttpErrorResponse) => {
          const msg = this.mensagemErroHttp(err, 'Não foi possível excluir o agendamento.');
          this.snackBar.open(msg, 'Fechar', {
            duration: 6000,
            panelClass: ['snackbar-erro'],
          });
        },
      });
  }

  voltar(): void {
    this.router.navigate(['/dashboard/agendamentos']);
  }

  private mensagemErroHttp(err: HttpErrorResponse, fallback: string): string {
    const body = err.error;
    if (body && typeof body === 'object' && 'message' in body) {
      return String((body as { message: string }).message);
    }
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    return err.message || fallback;
  }
}
