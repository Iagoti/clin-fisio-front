import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
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
  {
    control: 'posturaOmbros',
    label: 'Alinhamento dos Ombros',
    options: ['Normal', 'Elevação à Dir', 'Elevação à Esq', 'Elevado Dir', 'Muscular Esq'],
  },
  {
    control: 'posturaCinturaEscapular',
    label: 'Alinhamento da Cintura Escapular',
    options: ['Normal', 'Abduzida', 'Aduzida', 'Elevadas', 'Deprimidas'],
  },
  {
    control: 'posturaCurvaturasColuna',
    label: 'Curvaturas da Coluna Vertebral',
    options: [
      'Escoliose Torácica Direita',
      'Escoliose Torácica Esquerda',
      'Escoliose em S Toraco Lombar',
      'Escoliose Lombar Direita',
      'Escoliose Lombar Esquerda',
    ],
  },
  {
    control: 'posturaTrianguloTales',
    label: 'Alinhamento Triângulo de Tales',
    options: ['Normal', 'Direita', 'Esquerda'],
  },
  {
    control: 'posturaQuadril',
    label: 'Alinhamento do Quadril',
    options: ['Alinhado', 'Inclinação à Dir', 'Inclinação à Esq', 'Rotação à Dir', 'Rotação à Esq'],
  },
  {
    control: 'posturaLinhaPoplitea',
    label: 'Alinhamento da Linha Poplítea',
    options: ['Alinhada', 'Direita Elevada', 'Esquerda Elevada'],
  },
  {
    control: 'posturaTornozelo',
    label: 'Alinhamento do Tornozelo - TC',
    options: ['Normal', 'Varo', 'Valgo'],
  },
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
const TIPOS_ARQUIVO_TERMO_PERMITIDOS = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
const TAMANHO_MAXIMO_ARQUIVO_TERMO = 8 * 1024 * 1024;

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
  modoVisualizacao = false;
  statusOpcoes = STATUS_OPCOES;
  avaliacaoOpcoes = AVALIACAO_OPCOES;
  anamneseCamposDestaque = ANAMNESE_CAMPOS.slice(0, 2);
  anamneseCamposGrid = ANAMNESE_CAMPOS.slice(2);
  posturalCampos = POSTURAL_CAMPOS;
  pilatesCampos = PILATES_CAMPOS;
  testesAvaliacaoFisica = TESTES_AVALIACAO_FISICA;

  arquivoTermoSelecionado: File | null = null;
  arquivoTermoBase64: string | null = null;
  arquivoTermoNomeExistente: string | null = null;
  arquivoTermoErro: string | null = null;
  visualizandoArquivoTermo = false;

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

  get resumoDados(): { label: string; value: string }[] {
    const d = this.dadosGroup.getRawValue();
    return [
      { label: 'Nome completo', value: d.nome || '-' },
      { label: 'CPF', value: d.cpf || '-' },
      { label: 'Celular', value: d.celular || '-' },
      { label: 'E-mail', value: d.email || '-' },
      { label: 'Endereço', value: d.endereco || '-' },
      { label: 'Bairro', value: d.bairro || '-' },
      { label: 'Cidade', value: d.cidade || '-' },
      { label: 'Estado', value: d.estado || '-' },
      { label: 'CEP', value: d.cep || '-' },
      { label: 'Status', value: this.statusOpcoes.find(s => s.value === Number(d.stPaciente))?.label ?? '-' },
      { label: 'Data de admissão', value: this.formatarData(d.dataAdmissao) },
      { label: 'Data de pagamento', value: this.formatarData(d.dataPagamento) },
      { label: 'Valor da mensalidade', value: this.formatarMoeda(d.valorMensalidade) },
    ];
  }

  get resumoAnamnese(): { label: string; value: string }[] {
    const a = this.anamneseGroup.getRawValue();
    return [
      { label: 'Data da avaliação', value: this.formatarData(a.dataAvaliacaoAnamnese) },
      ...this.anamneseCamposDestaque.concat(this.anamneseCamposGrid).map(campo => ({
        label: campo.label,
        value: a[campo.control] || '-',
      })),
    ];
  }

  get resumoFisica(): { label: string; value: string }[] {
    const f = this.fisicaGroup.getRawValue();
    return [
      { label: 'Data da avaliação', value: this.formatarData(f.dataAvaliacaoFisica) },
      { label: 'Comentários adicionais', value: f.comentariosFisica || '-' },
      { label: 'Assinatura do profissional', value: f.assinaturaFisica || '-' },
    ];
  }

  get resumoTestesFisicos(): { teste: string; nota: string; observacao: string }[] {
    return this.fisicaTestes
      .getRawValue()
      .filter((item: { nota?: string; observacao?: string }) => item.nota?.trim() || item.observacao?.trim());
  }

  get resumoPostural(): { label: string; value: string }[] {
    const p = this.posturalGroup.getRawValue();
    return [
      { label: 'Data da avaliação', value: this.formatarData(p.dataAvaliacaoPostural) },
      ...this.posturalCampos.map(campo => ({ label: campo.label, value: p[campo.control] || '-' })),
    ];
  }

  get resumoPilates(): { label: string; value: string }[] {
    const pi = this.pilatesGroup.getRawValue();
    return [
      { label: 'Data da avaliação', value: this.formatarData(pi.dataAvaliacaoPilates) },
      ...this.pilatesCampos.map(campo => ({ label: campo.label, value: pi[campo.control] || '-' })),
      { label: 'Observações', value: pi.observacoesPilates || '-' },
      { label: 'Assinatura do profissional', value: pi.assinaturaPilates || '-' },
    ];
  }

  get resumoArquivoTermo(): string {
    if (this.arquivoTermoSelecionado) return this.arquivoTermoSelecionado.name;
    if (this.arquivoTermoNomeExistente) return this.arquivoTermoNomeExistente;
    return 'Nenhum arquivo anexado';
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

  habilitarEdicao(): void {
    this.modoVisualizacao = false;
    this.form.enable();
  }

  onArquivoTermoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.arquivoTermoErro = null;
    if (!file) return;

    if (!TIPOS_ARQUIVO_TERMO_PERMITIDOS.includes(file.type)) {
      this.arquivoTermoErro = 'Formato inválido. Envie um arquivo PDF ou imagem (PNG, JPG ou WEBP).';
      input.value = '';
      return;
    }
    if (file.size > TAMANHO_MAXIMO_ARQUIVO_TERMO) {
      this.arquivoTermoErro = 'Arquivo muito grande. O tamanho máximo permitido é 8MB.';
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.arquivoTermoBase64 = reader.result as string;
      this.arquivoTermoSelecionado = file;
      this.cdr.detectChanges();
    };
    reader.onerror = () => {
      this.arquivoTermoErro = 'Não foi possível ler o arquivo selecionado.';
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removerArquivoTermoSelecionado(): void {
    this.arquivoTermoSelecionado = null;
    this.arquivoTermoBase64 = null;
  }

  visualizarArquivoTermo(): void {
    if (this.id == null || this.visualizandoArquivoTermo) return;
    this.visualizandoArquivoTermo = true;
    this.pacienteService
      .baixarArquivoTermo(this.id)
      .pipe(
        finalize(() => {
          this.visualizandoArquivoTermo = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: blob => {
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
        },
        error: () => {
          this.snackBar.open('Não foi possível carregar o arquivo anexado.', 'Fechar', {
            duration: 5000,
            panelClass: ['snackbar-erro'],
          });
        },
      });
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
      termo: this.fb.group({}),
    });

    if (this.isEdicao) {
      this.modoVisualizacao = true;
      this.form.disable();
    }
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
    this.arquivoTermoNomeExistente = p.possuiArquivoTermo ? p.arquivoTermoNome ?? 'Arquivo anexado' : null;
    this.arquivoTermoSelecionado = null;
    this.arquivoTermoBase64 = null;
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
      arquivoTermoBase64: this.arquivoTermoBase64 ?? undefined,
      arquivoTermoNome: this.arquivoTermoSelecionado?.name,
      arquivoTermoTipo: this.arquivoTermoSelecionado?.type,
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

  private formatarData(value?: string): string {
    if (!value) return '-';
    const [ano, mes, dia] = value.split('-');
    if (!ano || !mes || !dia) return value;
    return `${dia}/${mes}/${ano}`;
  }

  private formatarMoeda(value: number | string | null | undefined): string {
    if (value == null || value === '') return '-';
    const numero = Number(value);
    if (Number.isNaN(numero)) return '-';
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
