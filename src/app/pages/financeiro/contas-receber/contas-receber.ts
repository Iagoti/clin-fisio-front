import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PagamentoService, PagamentoFiltro } from '../../../core/financeiro/pagamento.service';
import { PagamentoResponse } from '../../../models/financeiro/PagamentoResponse';
import { STATUS_PAGAMENTO_OPCOES, StatusPagamentoEnum } from '../../../models/enums/status-pagamento.enum';

@Component({
  selector: 'app-contas-receber',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './contas-receber.html',
  styleUrl: './contas-receber.scss',
})
export class ContasReceberComponent {
  private pagamentoService = inject(PagamentoService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  statusOpcoes = STATUS_PAGAMENTO_OPCOES;
  readonly statusPago = StatusPagamentoEnum.PAGO;
  readonly statusCancelado = StatusPagamentoEnum.CANCELADO;

  form: FormGroup;
  dataSource = new MatTableDataSource<PagamentoResponse>([]);
  displayedColumns = ['nmPaciente', 'valor', 'dtVencimento', 'formaPagamento', 'status'];

  constructor() {
    this.form = this.fb.group({ status: [null] });
    this.carregar();
  }

  private carregar(filtro: PagamentoFiltro = {}): void {
    this.pagamentoService
      .listar(filtro)
      .pipe(catchError(() => of([])))
      .subscribe(pagamentos => (this.dataSource.data = pagamentos ?? []));
  }

  filtrar(): void {
    const status = this.form.get('status')?.value;
    this.carregar({ status: status != null ? Number(status) : undefined });
  }

  limpar(): void {
    this.form.reset();
    this.carregar();
  }

  onRowClick(row: PagamentoResponse): void {
    this.router.navigate(['/dashboard/financeiro/contas-receber', row.cdPagamento], { state: { pagamento: row } });
  }
}
