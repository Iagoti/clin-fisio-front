import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { catchError, startWith, switchMap } from 'rxjs/operators';
import { PacienteResponse } from '../../models/paciente/PacienteResponse';
import { PacienteFiltro, PacienteService } from '../../core/paciente/paciente.service';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.scss',
})
export class PacientesComponent {
  filtroNome = '';
  filtroCpf = '';
  filtroAtivo = true;
  pacientes: Observable<PacienteResponse[]>;
  displayedColumns = ['nmPaciente', 'cpf', 'celular', 'cidade', 'stPaciente', 'dtCadastro'];

  private filtro$ = new Subject<PacienteFiltro>();

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.pacientes = this.filtro$.pipe(
      startWith(this.getFiltroAtual()),
      switchMap(filtro =>
        this.pacienteService.listar(filtro).pipe(
          catchError(err => {
            console.error('Erro ao listar pacientes', err);
            this.snackBar.open('Não foi possível listar os pacientes.', 'Fechar', {
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
    this.filtroCpf = '';
    this.filtroAtivo = true;
    this.pesquisar();
  }

  abrirPaciente(paciente: PacienteResponse): void {
    const id = paciente.cdPaciente ?? paciente.id;
    if (id == null) return;
    this.router.navigate(['/dashboard/pacientes', id], { state: { paciente } });
  }

  formatarData(iso?: string): string {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('pt-BR');
  }

  private getFiltroAtual(): PacienteFiltro {
    return {
      nmPaciente: this.filtroNome.trim() || undefined,
      cpf: this.filtroCpf.trim() || undefined,
      pacienteAtivo: this.filtroAtivo ? 1 : undefined,
    };
  }
}
