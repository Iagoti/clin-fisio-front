import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { finalize } from 'rxjs/operators';
import { RelatorioFinanceiroService } from '../../../core/financeiro/relatorio-financeiro.service';
import { DashboardFinanceiroResponse, FluxoCaixaPontoResponse } from '../../../models/financeiro/RelatorioFinanceiro';

type PresetPeriodo = '7d' | '30d' | 'mes';

interface SeriePonto {
  x: number;
  y: number;
}

const MARGIN = { top: 16, right: 16, bottom: 28, left: 56 };
const CHART_WIDTH = 760;
const CHART_HEIGHT = 260;

@Component({
  selector: 'app-financeiro-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './financeiro-dashboard.html',
  styleUrl: './financeiro-dashboard.scss',
})
export class FinanceiroDashboardComponent {
  private relatorioService = inject(RelatorioFinanceiroService);
  private cdr = inject(ChangeDetectorRef);

  readonly chartWidth = CHART_WIDTH;
  readonly chartHeight = CHART_HEIGHT;
  readonly innerLeft = MARGIN.left;
  readonly innerTop = MARGIN.top;
  readonly innerWidth = CHART_WIDTH - MARGIN.left - MARGIN.right;
  readonly innerHeight = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

  carregandoDashboard = false;
  carregandoFluxo = false;
  dashboard: DashboardFinanceiroResponse | null = null;
  pontos: FluxoCaixaPontoResponse[] = [];
  periodoAtivo: PresetPeriodo = '30d';
  mostrarTabela = false;
  hoverIndex: number | null = null;

  // Geometria pré-computada para o template (evita recalcular em cada change detection)
  yTicks: { y: number; label: string }[] = [];
  xTicks: { x: number; label: string }[] = [];
  entradasPath = '';
  saidasPath = '';
  saldoPath = '';
  zeroY = 0;
  pontosGeom: { x: number; entradasY: number; saidasY: number; saldoY: number }[] = [];

  constructor() {
    this.carregarDashboard();
    this.carregarFluxo(this.periodoAtivo);
  }

  private carregarDashboard(): void {
    this.carregandoDashboard = true;
    this.relatorioService.dashboard().pipe(
      finalize(() => { this.carregandoDashboard = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: d => (this.dashboard = d),
      error: () => (this.dashboard = null),
    });
  }

  selecionarPeriodo(periodo: PresetPeriodo): void {
    this.periodoAtivo = periodo;
    this.carregarFluxo(periodo);
  }

  private intervaloPara(periodo: PresetPeriodo): { inicio: string; fim: string } {
    const hoje = new Date();
    const fim = this.formatarData(hoje);
    let inicio: Date;
    if (periodo === '7d') {
      inicio = new Date(hoje);
      inicio.setDate(inicio.getDate() - 6);
    } else if (periodo === 'mes') {
      inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    } else {
      inicio = new Date(hoje);
      inicio.setDate(inicio.getDate() - 29);
    }
    return { inicio: this.formatarData(inicio), fim };
  }

  private formatarData(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private carregarFluxo(periodo: PresetPeriodo): void {
    const { inicio, fim } = this.intervaloPara(periodo);
    this.carregandoFluxo = true;
    this.relatorioService.fluxoCaixa(inicio, fim).pipe(
      finalize(() => { this.carregandoFluxo = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: pontos => {
        this.pontos = pontos ?? [];
        this.construirGrafico();
      },
      error: () => {
        this.pontos = [];
        this.construirGrafico();
      },
    });
  }

  private construirGrafico(): void {
    this.hoverIndex = null;
    if (!this.pontos.length) {
      this.entradasPath = this.saidasPath = this.saldoPath = '';
      this.pontosGeom = [];
      this.yTicks = [];
      this.xTicks = [];
      return;
    }

    const valores = this.pontos.flatMap(p => [p.entradas, p.saidas, p.saldoAcumulado]);
    let yMin = Math.min(0, ...valores);
    let yMax = Math.max(0, ...valores);
    if (yMin === yMax) {
      yMax = yMin + 100;
    }
    const pad = (yMax - yMin) * 0.1 || 10;
    yMin -= pad;
    yMax += pad;

    const n = this.pontos.length;
    const xScale = (i: number) => this.innerLeft + (n === 1 ? this.innerWidth / 2 : (i / (n - 1)) * this.innerWidth);
    const yScale = (v: number) => this.innerTop + this.innerHeight - ((v - yMin) / (yMax - yMin)) * this.innerHeight;

    this.zeroY = yScale(0);

    const entradasPts: SeriePonto[] = [];
    const saidasPts: SeriePonto[] = [];
    const saldoPts: SeriePonto[] = [];
    this.pontosGeom = this.pontos.map((p, i) => {
      const x = xScale(i);
      const entradasY = yScale(p.entradas);
      const saidasY = yScale(p.saidas);
      const saldoY = yScale(p.saldoAcumulado);
      entradasPts.push({ x, y: entradasY });
      saidasPts.push({ x, y: saidasY });
      saldoPts.push({ x, y: saldoY });
      return { x, entradasY, saidasY, saldoY };
    });

    this.entradasPath = this.toPath(entradasPts);
    this.saidasPath = this.toPath(saidasPts);
    this.saldoPath = this.toPath(saldoPts);

    // Eixo Y: 4 marcações limpas
    this.yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => {
      const v = yMin + (yMax - yMin) * t;
      return { y: yScale(v), label: this.formatarMoedaCompacta(v) };
    });

    // Eixo X: até 6 rótulos de data, espaçados
    const passo = Math.max(1, Math.ceil(n / 6));
    this.xTicks = this.pontos
      .map((p, i) => ({ x: xScale(i), label: this.formatarDataCurta(p.data), i }))
      .filter(t => t.i % passo === 0 || t.i === n - 1);
  }

  private toPath(pts: SeriePonto[]): string {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  }

  onHover(index: number): void {
    this.hoverIndex = index;
  }

  onLeave(): void {
    this.hoverIndex = null;
  }

  get pontoHover(): FluxoCaixaPontoResponse | null {
    return this.hoverIndex != null ? this.pontos[this.hoverIndex] ?? null : null;
  }

  get geomHover(): { x: number; entradasY: number; saidasY: number; saldoY: number } | null {
    return this.hoverIndex != null ? this.pontosGeom[this.hoverIndex] ?? null : null;
  }

  toggleTabela(): void {
    this.mostrarTabela = !this.mostrarTabela;
  }

  formatarDataCurta(iso: string): string {
    if (!iso) return '';
    const [, m, d] = iso.split('-');
    return `${d}/${m}`;
  }

  formatarMoedaCompacta(v: number): string {
    const abs = Math.abs(v);
    if (abs >= 1000) return `${v < 0 ? '-' : ''}R$ ${(abs / 1000).toFixed(1)}K`;
    return `R$ ${v.toFixed(0)}`;
  }
}
