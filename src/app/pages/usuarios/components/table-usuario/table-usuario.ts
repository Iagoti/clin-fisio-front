import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioResponse } from '../../../../models/usuario/UsuarioResponse';

@Component({
  selector: 'app-table-usuario',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule],
  templateUrl: './table-usuario.html',
  styleUrl: './table-usuario.scss',
})
export class TableUsuario {
  @Input() set usuarios(value: UsuarioResponse[]) {
    this.dataSource.data = value ?? [];
  }

  @Output() rowClick = new EventEmitter<UsuarioResponse>();

  dataSource = new MatTableDataSource<UsuarioResponse>([]);
  displayedColumns: string[] = ['nmUsuario', 'email', 'login', 'stUsuario', 'tpUsuario', 'dtCadastro'];

  constructor(private router: Router) {}

  onRowClick(row: UsuarioResponse): void {
    const id = row.cdUsuario ?? row.id;
    if (id != null) {
      this.router.navigate(['/dashboard/usuarios', id], {
        state: { usuario: row },
      });
    } else {
      this.rowClick.emit(row);
    }
  }

  formatarData(iso: string): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
