import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { finalize } from 'rxjs/operators';
import { PacienteService } from '../../../core/paciente/paciente.service';
import { PacienteRequest } from '../../../models/paciente/PacienteRequest';
import { PacienteResponse } from '../../../models/paciente/PacienteResponse';
import { BtnVoltar } from '../../usuarios/components/btn-voltar/btn-voltar';

const STATUS_OPCOES = [
  { value: 1, label: 'Ativo' },
  { value: 2, label: 'Inativo' },
];

const AVALIACAO_OPCOES = ['Adequado', 'Parcialmente adequado', 'Inadequado'];
const ANAMNESE_CAMPOS = [
  {
    control: 'alinhamentoCabeca',
    label: 'Alinhamento da Cabeça',
    options: ['Normal', 'Rotação à Dir', 'Rotação à Esq', 'Inclinação à Dir', 'Inclinação à Esq'],
  },
  {
    control: 'alinhamentoOmbros',
    label: 'Alinhamento dos Ombros',
    options: ['Normal', 'Elevação à Dir', 'Elevação à Esq', 'Muscular Dir', 'Muscular Esq'],
  },
  {
    control: 'alinhamentoLinhaMamilar',
    label: 'Alinhamento da Linha Mamilar',
    options: ['Mamilos Alinhados', 'Elevação Dir', 'Elevação Esq', 'Muscular Dir', 'Muscular Esq'],
  },
  {
    control: 'alinhamentoQuadril',
    label: 'Alinhamento do Quadril',
    options: ['Alinhado', 'Inclinação à Dir', 'Inclinação à Esq', 'Rotação à Dir', 'Rotação à Esq'],
  },
  {
    control: 'alinhamentoJoelhos',
    label: 'Alinhamento dos Joelhos',
    options: ['Normal', 'Varo', 'Valgo'],
  },
  {
    control: 'alinhamentoPes',
    label: 'Alinhamento dos pés',
    options: ['Normal', 'Pé abduto', 'Pé aduto'],
  },
];
const POSTURAL_CAMPOS = [
  { control: 'posturaOmbros', label: 'Ombros' },
  { control: 'posturaCinturaEscapular', label: 'Cintura escapular' },
  { control: 'posturaCurvaturasColuna', label: 'Curvaturas da coluna' },
  { control: 'posturaTrianguloTales', label: 'Triângulo de Tales' },
  { control: 'posturaQuadril', label: 'Quadril' },
  { control: 'posturaLinhaPoplitea', label: 'Linha poplítea' },
  { control: 'posturaTornozelo', label: 'Tornozelo' },
];
const PILATES_CAMPOS = [
  { control: 'pilatesCinturaEscapular', label: 'Cintura escapular' },
  { control: 'pilatesControleRespiratorio', label: 'Controle respiratório' },
  { control: 'pilatesConscienciaCorporal', label: 'Consciência corporal' },
  { control: 'pilatesEstabilidadeGlobal', label: 'Estabilidade global' },
  { control: 'pilatesForcaGlobal', label: 'Força global' },
  { control: 'pilatesEquilibrio', label: 'Equilíbrio' },
  { control: 'pilatesFlexibilidadeMobilidade', label: 'Flexibilidade e mobilidade' },
  { control: 'pilatesAlinhamentoPostural', label: 'Alinhamento postural' },
];
const TESTES_AVALIACAO_FISICA = [
  'Flexão Lombar (Tocou nos pés)',
  'Extensão de Ombro (Atrás da cabeça)',
  'Rotação de Tronco (Sentado)',
  'Agachamento Profundo',
  'Elevação de Calcanhares (Unilateral)',
  'Prancha (Tempo de Sustentação)',
  'Flexão de Braço (Número de Repetições)',
  'Abdominal (Número de Repetições)',
  'Mobilidade de Quadril (Rotação Externa)',
  'Mobilidade de Tornozelo (Dorsiflexão)',
];

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatStepperModule,
    BtnVoltar,
  ],
  templateUrl: './paciente-form.html',
  styleUrl: './paciente-form.scss',
})
export class PacienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private pacienteService = inject(PacienteService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  form!: FormGroup;
  id: number | null = null;
  loading = false;
  salvando = false;
  statusOpcoes = STATUS_OPCOES;
  avaliacaoOpcoes = AVALIACAO_OPCOES;
  anamneseCamposDestaque = ANAMNESE_CAMPOS.slice(0, 2);
  anamneseCamposGrid = ANAMNESE_CAMPOS.slice(2);
  posturalCampos = POSTURAL_CAMPOS;
  pilatesCampos = PILATES_CAMPOS;
  testesAvaliacaoFisica = TESTES_AVALIACAO_FISICA;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam && idParam !== 'novo' ? +idParam : null;
    this.buildForm();
    if (this.id != null) {
      const prefilled = this.prefillFromNavigationState();
      this.loading = !prefilled;
      this.carregarPaciente(prefilled);
    }
  }

  get isEdicao(): boolean {
    return this.id != null;
  }

  get dadosGroup(): FormGroup {
    return this.form.get('dados') as FormGroup;
  }

  get anamneseGroup(): FormGroup {
    return this.form.get('anamnese') as FormGroup;
  }

  get fisicaGroup(): FormGroup {
    return this.form.get('fisica') as FormGroup;
  }

  get fisicaTestes(): FormArray {
    return this.fisicaGroup.get('testes') as FormArray;
  }

  get posturalGroup(): FormGroup {
    return this.form.get('postural') as FormGroup;
  }

  get pilatesGroup(): FormGroup {
    return this.form.get('pilates') as FormGroup;
  }

  get termoGroup(): FormGroup {
    return this.form.get('termo') as FormGroup;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    const body = this.toRequest();
    const req = this.isEdicao ? this.pacienteService.atualizar(body) : this.pacienteService.salvar(body);
    req.pipe(
      finalize(() => {
        this.salvando = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdicao ? 'Paciente atualizado com sucesso.' : 'Paciente cadastrado com sucesso.',
          'Fechar',
          { duration: 5000, panelClass: ['snackbar-sucesso'] }
        );
        this.voltar();
      },
      error: (err: HttpErrorResponse) => {
        const msg = this.mensagemErroHttp(err, 'Não foi possível salvar o paciente.');
        this.snackBar.open(msg, 'Fechar', { duration: 6000, panelClass: ['snackbar-erro'] });
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/dashboard/pacientes']);
  }

  private buildForm(): void {
    this.form = this.fb.group({
      dados: this.fb.group({
        nome: ['', [Validators.required]],
        cpf: [''],
        celular: [''],
        email: ['', [Validators.email]],
        endereco: [''],
        bairro: [''],
        cidade: [''],
        estado: [''],
        cep: [''],
        dataAdmissao: [''],
        dataPagamento: [''],
        valorMensalidade: [null],
        stPaciente: [1, [Validators.required]],
      }),
      anamnese: this.fb.group({
        dataAvaliacaoAnamnese: [''],
        alinhamentoCabeca: [''],
        alinhamentoOmbros: [''],
        alinhamentoLinhaMamilar: [''],
        alinhamentoQuadril: [''],
        alinhamentoJoelhos: [''],
        alinhamentoPes: [''],
        alinhamentoPelve: [''],
      }),
      fisica: this.fb.group({
        dataAvaliacaoFisica: [''],
        testes: this.fb.array(TESTES_AVALIACAO_FISICA.map(teste => this.criarTesteFisico(teste))),
        mobilidadeForcaNotas: [''],
        mobilidadeForcaObservacoes: [''],
        comentariosFisica: [''],
        assinaturaFisica: [''],
      }),
      postural: this.fb.group({
        dataAvaliacaoPostural: [''],
        posturaOmbros: [''],
        posturaCinturaEscapular: [''],
        posturaCurvaturasColuna: [''],
        posturaTrianguloTales: [''],
        posturaQuadril: [''],
        posturaLinhaPoplitea: [''],
        posturaTornozelo: [''],
      }),
      pilates: this.fb.group({
        dataAvaliacaoPilates: [''],
        pilatesCinturaEscapular: [''],
        pilatesControleRespiratorio: [''],
        pilatesConscienciaCorporal: [''],
        pilatesEstabilidadeGlobal: [''],
        pilatesForcaGlobal: [''],
        pilatesEquilibrio: [''],
        pilatesFlexibilidadeMobilidade: [''],
        pilatesAlinhamentoPostural: [''],
        observacoesPilates: [''],
        assinaturaPilates: [''],
      }),
      termo: this.fb.group({
        aceitouTermo: [false, [Validators.requiredTrue]],
        localTermo: [''],
        dataTermo: [''],
        assinaturaTermo: [''],
      }),
    });
  }

  private prefillFromNavigationState(): boolean {
    const st = this.location.getState() as { paciente?: PacienteResponse; navigationId?: number };
    const paciente = st?.paciente;
    if (!paciente || this.id == null) return false;
    const rowId = paciente.cdPaciente ?? paciente.id;
    if (rowId !== this.id) return false;
    this.aplicarPacienteNaForm(paciente);
    return true;
  }

  private carregarPaciente(prefilled: boolean): void {
    if (this.id == null) return;
    this.pacienteService
      .obterPorId(this.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: paciente => this.aplicarPacienteNaForm(paciente),
        error: () => {
          if (!prefilled) this.voltar();
        },
      });
  }

  private aplicarPacienteNaForm(p: PacienteResponse): void {
    this.form.patchValue({
      dados: {
        nome: p.nmPaciente ?? '',
        cpf: p.cpf ?? '',
        celular: p.celular ?? '',
        email: p.email ?? '',
        endereco: p.endereco ?? '',
        bairro: p.bairro ?? '',
        cidade: p.cidade ?? '',
        estado: p.estado ?? '',
        cep: p.cep ?? '',
        dataAdmissao: p.dataAdmissao ?? '',
        dataPagamento: p.dataPagamento ?? '',
        valorMensalidade: p.valorMensalidade ?? null,
        stPaciente: p.stPaciente?.codigo ?? 1,
      },
      anamnese: p,
      fisica: {
        dataAvaliacaoFisica: p.dataAvaliacaoFisica ?? '',
        comentariosFisica: p.comentariosFisica ?? '',
        assinaturaFisica: p.assinaturaFisica ?? '',
      },
      postural: p,
      pilates: p,
      termo: p,
    });
    this.aplicarTestesFisicos(p);
  }

  private toRequest(): PacienteRequest {
    const dados = this.dadosGroup.getRawValue();
    const fisica = this.fisicaGroup.getRawValue();
    const payload: PacienteRequest = {
      cdPaciente: this.id ?? undefined,
      nome: this.trim(dados.nome) ?? '',
      cpf: this.trim(dados.cpf),
      celular: this.trim(dados.celular),
      email: this.trim(dados.email),
      endereco: this.trim(dados.endereco),
      bairro: this.trim(dados.bairro),
      cidade: this.trim(dados.cidade),
      estado: this.trim(dados.estado),
      cep: this.trim(dados.cep),
      dataAdmissao: this.emptyToUndefined(dados.dataAdmissao),
      dataPagamento: this.emptyToUndefined(dados.dataPagamento),
      valorMensalidade: dados.valorMensalidade,
      stPaciente: Number(dados.stPaciente),
      ...this.cleanGroup(this.anamneseGroup),
      dataAvaliacaoFisica: this.emptyToUndefined(fisica.dataAvaliacaoFisica),
      mobilidadeForcaNotas: this.serializarNotasFisicas(),
      mobilidadeForcaObservacoes: this.serializarObservacoesFisicas(),
      comentariosFisica: this.emptyToUndefined(fisica.comentariosFisica),
      assinaturaFisica: this.emptyToUndefined(fisica.assinaturaFisica),
      ...this.cleanGroup(this.posturalGroup),
      ...this.cleanGroup(this.pilatesGroup),
      ...this.cleanGroup(this.termoGroup),
    };
    return payload;
  }

  private criarTesteFisico(teste: string): FormGroup {
    return this.fb.group({
      teste: [teste],
      nota: [''],
      observacao: [''],
    });
  }

  private serializarNotasFisicas(): string | undefined {
    const linhas = this.fisicaTestes.getRawValue()
      .filter((item: { nota?: string }) => item.nota?.trim())
      .map((item: { teste: string; nota: string }) => `${item.teste}: ${item.nota.trim()}`);
    return linhas.length ? linhas.join('\n') : undefined;
  }

  private serializarObservacoesFisicas(): string | undefined {
    const linhas = this.fisicaTestes.getRawValue()
      .filter((item: { observacao?: string }) => item.observacao?.trim())
      .map((item: { teste: string; observacao: string }) => `${item.teste}: ${item.observacao.trim()}`);
    return linhas.length ? linhas.join('\n') : undefined;
  }

  private aplicarTestesFisicos(p: PacienteResponse): void {
    const notas = this.parseLinhasPorTeste(p.mobilidadeForcaNotas);
    const observacoes = this.parseLinhasPorTeste(p.mobilidadeForcaObservacoes);
    this.fisicaTestes.controls.forEach(control => {
      const grupo = control as FormGroup;
      const teste = grupo.get('teste')?.value as string;
      grupo.patchValue({
        nota: notas.get(teste) ?? '',
        observacao: observacoes.get(teste) ?? '',
      });
    });
  }

  private parseLinhasPorTeste(valor?: string): Map<string, string> {
    const map = new Map<string, string>();
    if (!valor) return map;
    valor.split('\n').forEach(linha => {
      const [teste, ...restante] = linha.split(':');
      if (teste && restante.length) {
        map.set(teste.trim(), restante.join(':').trim());
      }
    });
    return map;
  }

  private cleanGroup(group: FormGroup): Record<string, string | boolean | undefined> {
    return Object.entries(group.getRawValue()).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: typeof value === 'string' ? this.emptyToUndefined(value) : value }),
      {}
    );
  }

  private trim(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined;
    return this.emptyToUndefined(value.trim());
  }

  private emptyToUndefined(value: string): string | undefined {
    return value?.trim() ? value : undefined;
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
