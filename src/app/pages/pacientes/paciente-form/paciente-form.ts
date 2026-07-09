import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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
import { AtivoInativoEnum, ATIVO_INATIVO_OPCOES } from '../../../models/enums/ativo-inativo.enum';
import { TIPO_ATENDIMENTO_OPCOES } from '../../../models/enums/tipo-atendimento.enum';
import { AVALIACAO_PILATES_OPCOES } from '../../../models/enums/avaliacao-pilates.enum';
import { AlinhamentoQuadrilEnum, AlinhamentoVaroValgoEnum } from '../../../models/enums/alinhamento-comum.enum';
import {
  AlinhamentoCabecaEnum,
  AlinhamentoLinhaMamilarEnum,
  AlinhamentoOmbrosAnamneseEnum,
  AlinhamentoPesEnum,
} from '../../../models/enums/anamnese-opcoes.enum';
import {
  PosturaCinturaEscapularEnum,
  PosturaCurvaturasColunaEnum,
  PosturaLinhaPopliteaEnum,
  PosturaOmbrosEnum,
  PosturaTrianguloTalesEnum,
} from '../../../models/enums/avaliacao-postural-opcoes.enum';
import { TESTES_AVALIACAO_FISICA_OPCOES } from '../../../models/enums/teste-avaliacao-fisica.enum';

const STATUS_OPCOES = ATIVO_INATIVO_OPCOES;

const AVALIACAO_OPCOES = AVALIACAO_PILATES_OPCOES;
const ANAMNESE_CAMPOS = [
  {
    control: 'alinhamentoCabeca',
    label: 'Alinhamento da Cabeça',
    options: Object.values(AlinhamentoCabecaEnum),
  },
  {
    control: 'alinhamentoOmbros',
    label: 'Alinhamento dos Ombros',
    options: Object.values(AlinhamentoOmbrosAnamneseEnum),
  },
  {
    control: 'alinhamentoLinhaMamilar',
    label: 'Alinhamento da Linha Mamilar',
    options: Object.values(AlinhamentoLinhaMamilarEnum),
  },
  {
    control: 'alinhamentoQuadril',
    label: 'Alinhamento do Quadril',
    options: Object.values(AlinhamentoQuadrilEnum),
  },
  {
    control: 'alinhamentoJoelhos',
    label: 'Alinhamento dos Joelhos',
    options: Object.values(AlinhamentoVaroValgoEnum),
  },
  {
    control: 'alinhamentoPes',
    label: 'Alinhamento dos pés',
    options: Object.values(AlinhamentoPesEnum),
  },
];
const POSTURAL_CAMPOS = [
  {
    control: 'posturaOmbros',
    label: 'Alinhamento dos Ombros',
    options: Object.values(PosturaOmbrosEnum),
  },
  {
    control: 'posturaCinturaEscapular',
    label: 'Alinhamento da Cintura Escapular',
    options: Object.values(PosturaCinturaEscapularEnum),
  },
  {
    control: 'posturaCurvaturasColuna',
    label: 'Curvaturas da Coluna Vertebral',
    options: Object.values(PosturaCurvaturasColunaEnum),
  },
  {
    control: 'posturaTrianguloTales',
    label: 'Alinhamento Triângulo de Tales',
    options: Object.values(PosturaTrianguloTalesEnum),
  },
  {
    control: 'posturaQuadril',
    label: 'Alinhamento do Quadril',
    options: Object.values(AlinhamentoQuadrilEnum),
  },
  {
    control: 'posturaLinhaPoplitea',
    label: 'Alinhamento da Linha Poplítea',
    options: Object.values(PosturaLinhaPopliteaEnum),
  },
  {
    control: 'posturaTornozelo',
    label: 'Alinhamento do Tornozelo - TC',
    options: Object.values(AlinhamentoVaroValgoEnum),
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

const TESTES_AVALIACAO_FISICA = TESTES_AVALIACAO_FISICA_OPCOES;

const MAX_SESSOES_POR_SEMANA = 5;

/** Retorna a segunda-feira da semana à qual a data (yyyy-MM-dd) pertence. */
function inicioDaSemana(dataIso: string): Date {
  const data = new Date(`${dataIso}T00:00:00`);
  const diaSemana = data.getDay();
  const diffParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
  data.setDate(data.getDate() + diffParaSegunda);
  return data;
}

function chaveDaSemana(dataIso: string): string {
  return inicioDaSemana(dataIso).toISOString().slice(0, 10);
}

/** Garante que nenhuma semana tenha mais do que `MAX_SESSOES_POR_SEMANA` sessões agendadas. */
function maxSessoesPorSemanaValidator(control: AbstractControl): ValidationErrors | null {
  const array = control as FormArray;
  const contagemPorSemana = new Map<string, number>();
  array.controls.forEach(grupo => {
    const data = grupo.get('data')?.value;
    if (!data) return;
    const chave = chaveDaSemana(data);
    contagemPorSemana.set(chave, (contagemPorSemana.get(chave) ?? 0) + 1);
  });
  const semanaExcedida = [...contagemPorSemana.entries()].find(
    ([, quantidade]) => quantidade > MAX_SESSOES_POR_SEMANA
  );
  return semanaExcedida ? { maxSessoesPorSemana: { inicioSemana: semanaExcedida[0], quantidade: semanaExcedida[1] } } : null;
}

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
  tipoAtendimentoOpcoes = TIPO_ATENDIMENTO_OPCOES;
  avaliacaoOpcoes = AVALIACAO_OPCOES;
  anamneseCamposDestaque = ANAMNESE_CAMPOS.slice(0, 2);
  anamneseCamposGrid = ANAMNESE_CAMPOS.slice(2);
  posturalCampos = POSTURAL_CAMPOS;
  pilatesCampos = PILATES_CAMPOS;
  testesAvaliacaoFisica = TESTES_AVALIACAO_FISICA;

  readonly maxSessoesPorSemana = MAX_SESSOES_POR_SEMANA;

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

  get sessoesGroup(): FormGroup {
    return this.form.get('sessoes') as FormGroup;
  }

  get sessoesDatas(): FormArray {
    return this.sessoesGroup.get('datas') as FormArray;
  }

  get podeAdicionarSessao(): boolean {
    const quantidade = Number(this.sessoesGroup.get('quantidadeSessoes')?.value);
    if (!quantidade || Number.isNaN(quantidade)) return true;
    return this.sessoesDatas.length < quantidade;
  }

  get erroMaxSessoesPorSemana(): string | null {
    const erro = this.sessoesDatas.errors?.['maxSessoesPorSemana'];
    if (!erro) return null;
    const inicio = new Date(`${erro.inicioSemana}T00:00:00`);
    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + 6);
    const formatar = (d: Date) => d.toLocaleDateString('pt-BR');
    return `Limite de ${MAX_SESSOES_POR_SEMANA} sessões por semana excedido na semana de ${formatar(inicio)} a ${formatar(fim)} (${erro.quantidade} sessões).`;
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
      {
        label: 'Tipo de atendimento',
        value: this.tipoAtendimentoOpcoes.find(t => t.value === Number(d.tipoAtendimento))?.label ?? '-',
      },
      { label: 'Data de admissão', value: this.formatarData(d.dataAdmissao) },
    ];
  }

  get resumoSessoes(): { label: string; value: string }[] {
    const s = this.sessoesGroup.getRawValue();
    return [
      {
        label: 'Quantidade total de sessões',
        value: s.quantidadeSessoes != null && s.quantidadeSessoes !== '' ? String(s.quantidadeSessoes) : '-',
      },
      { label: 'Data de pagamento', value: this.formatarData(s.dataPagamento) },
      { label: 'Valor da mensalidade', value: this.formatarMoeda(s.valorMensalidade) },
    ];
  }

  get resumoSessoesAgendadas(): { data: string; horario: string }[] {
    return this.sessoesDatas
      .getRawValue()
      .filter((item: { data?: string; horario?: string }) => item.data)
      .map((item: { data: string; horario: string }) => ({
        data: this.formatarData(item.data),
        horario: item.horario || '-',
      }));
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

  adicionarSessao(): void {
    if (this.modoVisualizacao || !this.podeAdicionarSessao) return;
    this.sessoesDatas.push(this.criarSessao());
  }

  removerSessao(index: number): void {
    if (this.modoVisualizacao) return;
    this.sessoesDatas.removeAt(index);
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
        stPaciente: [AtivoInativoEnum.ATIVO, [Validators.required]],
        tipoAtendimento: [null, [Validators.required]],
      }),
      sessoes: this.fb.group({
        quantidadeSessoes: [null, [Validators.required, Validators.min(1)]],
        dataPagamento: [''],
        valorMensalidade: [null],
        datas: this.fb.array([], [maxSessoesPorSemanaValidator]),
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
        stPaciente: p.stPaciente?.codigo ?? AtivoInativoEnum.ATIVO,
        tipoAtendimento: p.tipoAtendimento?.codigo ?? null,
      },
      sessoes: {
        quantidadeSessoes: p.quantidadeSessoes ?? null,
        dataPagamento: p.dataPagamento ?? '',
        valorMensalidade: p.valorMensalidade ?? null,
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
    this.aplicarSessoesAgendadas(p.sessoesAgendadas);
  }

  private toRequest(): PacienteRequest {
    const dados = this.dadosGroup.getRawValue();
    const sessoes = this.sessoesGroup.getRawValue();
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
      stPaciente: Number(dados.stPaciente),
      tipoAtendimento: dados.tipoAtendimento != null ? Number(dados.tipoAtendimento) : undefined,
      dataPagamento: this.emptyToUndefined(sessoes.dataPagamento),
      valorMensalidade: sessoes.valorMensalidade,
      quantidadeSessoes:
        sessoes.quantidadeSessoes != null && sessoes.quantidadeSessoes !== '' ? Number(sessoes.quantidadeSessoes) : undefined,
      sessoesAgendadas: this.serializarSessoes(),
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

  private criarSessao(data = '', horario = ''): FormGroup {
    return this.fb.group({
      data: [data, [Validators.required]],
      horario: [horario, [Validators.required]],
    });
  }

  private serializarSessoes(): string | undefined {
    const linhas = this.sessoesDatas
      .getRawValue()
      .filter((item: { data?: string; horario?: string }) => item.data && item.horario)
      .map((item: { data: string; horario: string }) => `${item.data} ${item.horario}`);
    return linhas.length ? linhas.join('\n') : undefined;
  }

  private aplicarSessoesAgendadas(valor?: string): void {
    this.sessoesDatas.clear({ emitEvent: false });
    (valor ?? '')
      .split('\n')
      .map(linha => linha.trim())
      .filter(Boolean)
      .forEach(linha => {
        const [data, horario] = linha.split(' ');
        if (data) {
          this.sessoesDatas.push(this.criarSessao(data, horario ?? ''), { emitEvent: false });
        }
      });
    if (this.modoVisualizacao) {
      this.sessoesDatas.disable({ emitEvent: false });
    }
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
