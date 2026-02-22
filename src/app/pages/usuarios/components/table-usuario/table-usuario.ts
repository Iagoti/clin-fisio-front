import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  dataSource = new MatTableDataSource<UsuarioResponse>([]);
  displayedColumns: string[] = ['nmUsuario', 'email', 'login', 'stUsuario', 'tpUsuario', 'dtCadastro'];

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
