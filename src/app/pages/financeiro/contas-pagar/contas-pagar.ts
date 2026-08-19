import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { catchError, startWith, switchMap } from 'rxjs/operators';
import { DespesaService, DespesaFiltro } from '../../../core/financeiro/despesa.service';
import { DespesaResponse } from '../../../models/financeiro/DespesaResponse';
import { STATUS_DESPESA_OPCOES, StatusDespesaEnum } from '../../../models/enums/status-despesa.enum';

@Component({
  selector: 'app-contas-pagar',
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
  templateUrl: './contas-pagar.html',
  styleUrl: './contas-pagar.scss',
})
export class ContasPagarComponent {
  private despesaService = inject(DespesaService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  statusOpcoes = STATUS_DESPESA_OPCOES;
  readonly statusPago = StatusDespesaEnum.PAGO;
  readonly statusCancelado = StatusDespesaEnum.CANCELADO;

  form: FormGroup;
  dataSource = new MatTableDataSource<DespesaResponse>([]);
  displayedColumns = ['descricao', 'nmCategoria', 'valor', 'dtVencimento', 'status'];

  private filtro$ = new Subject<DespesaFiltro>();

  constructor() {
    this.form = this.fb.group({ status: [null] });
    this.despesaService
      .listar()
      .pipe(
        switchMap(() => this.filtro$.pipe(startWith({} as DespesaFiltro))),
        switchMap(f => this.despesaService.listar(f).pipe(catchError(() => of([]))))
      )
      .subscribe(despesas => (this.dataSource.data = despesas ?? []));
  }

  filtrar(): void {
    const status = this.form.get('status')?.value;
    this.filtro$.next({ status: status != null ? Number(status) : undefined });
  }

  limpar(): void {
    this.form.reset();
    this.filtro$.next({});
  }

  onRowClick(row: DespesaResponse): void {
    this.router.navigate(['/dashboard/financeiro/contas-pagar', row.cdDespesa], { state: { despesa: row } });
  }
}
