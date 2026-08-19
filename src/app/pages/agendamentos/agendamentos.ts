import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { catchError, startWith, switchMap } from 'rxjs/operators';
import { AgendamentoResponse } from '../../models/agendamento/AgendamentoResponse';
import { AgendamentoFiltro, AgendamentoService } from '../../core/agendamento/agendamento.service';
import { TIPO_ATENDIMENTO_OPCOES } from '../../models/enums/tipo-atendimento.enum';
import { STATUS_AGENDAMENTO_OPCOES, StatusAgendamentoEnum } from '../../models/enums/status-agendamento.enum';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './agendamentos.html',
  styleUrl: './agendamentos.scss',
})
export class AgendamentosComponent {
  filtroNome = '';
  filtroData = '';
  filtroTipo: number | null = null;
  filtroStatus: number | null = null;
  agendamentos: Observable<AgendamentoResponse[]>;
  displayedColumns = ['nmPaciente', 'tipoAtendimento', 'dataAgendamento', 'horaAgendamento', 'status', 'valor'];
  tipoOpcoes = TIPO_ATENDIMENTO_OPCOES;
  statusOpcoes = STATUS_AGENDAMENTO_OPCOES;

  private filtro$ = new Subject<AgendamentoFiltro>();

  constructor(
    private agendamentoService: AgendamentoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.agendamentos = this.filtro$.pipe(
      startWith(this.getFiltroAtual()),
      switchMap(filtro =>
        this.agendamentoService.listar(filtro).pipe(
          catchError(err => {
            console.error('Erro ao listar agendamentos', err);
            this.snackBar.open('Não foi possível listar os agendamentos.', 'Fechar', {
              duration: 6000,
              panelClass: ['snackbar-erro'],
            });
            return of([]);
          })
        )
      )
    );
  }

  pesquisar(): void {
    this.filtro$.next(this.getFiltroAtual());
  }

  limpar(): void {
    this.filtroNome = '';
    this.filtroData = '';
    this.filtroTipo = null;
    this.filtroStatus = null;
    this.pesquisar();
  }

  abrirAgendamento(agendamento: AgendamentoResponse): void {
    const id = agendamento.cdAgendamento;
    if (id == null) return;
    this.router.navigate(['/dashboard/agendamentos', id], { state: { agendamento } });
  }

  formatarData(iso?: string): string {
    if (!iso) return '-';
    const [ano, mes, dia] = iso.split('-');
    if (!ano || !mes || !dia) return iso;
    return `${dia}/${mes}/${ano}`;
  }

  formatarHorario(hora?: string): string {
    if (!hora) return '-';
    return hora.slice(0, 5);
  }

  formatarMoeda(valor?: number): string {
    if (valor == null) return '-';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  statusClasse(status?: { codigo?: number }): string {
    switch (status?.codigo) {
      case StatusAgendamentoEnum.CONFIRMADO:
        return 'status-badge status-confirmado';
      case StatusAgendamentoEnum.CONCLUIDO:
        return 'status-badge status-concluido';
      case StatusAgendamentoEnum.CANCELADO:
        return 'status-badge status-cancelado';
      default:
        return 'status-badge status-agendado';
    }
  }

  private getFiltroAtual(): AgendamentoFiltro {
    return {
      nmPaciente: this.filtroNome.trim() || undefined,
      dataAgendamento: this.filtroData || undefined,
      tipoAtendimento: this.filtroTipo ?? undefined,
      status: this.filtroStatus ?? undefined,
    };
  }
}
