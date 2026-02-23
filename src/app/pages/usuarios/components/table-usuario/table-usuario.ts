import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioResponse } from '../../../../models/usuario/UsuarioResponse';
import { BtnEditarUsuario } from '../btn-editar-usuario/btn-editar-usuario';
import { BtnExcluirUsuario } from '../btn-excluir-usuario/btn-excluir-usuario';

@Component({
  selector: 'app-table-usuario',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, BtnEditarUsuario, BtnExcluirUsuario],
  templateUrl: './table-usuario.html',
  styleUrl: './table-usuario.scss',
})
export class TableUsuario {
  @Input() set usuarios(value: UsuarioResponse[]) {
    this.dataSource.data = value ?? [];
  }

  @Output() editar = new EventEmitter<UsuarioResponse>();
  @Output() excluir = new EventEmitter<UsuarioResponse>();

  dataSource = new MatTableDataSource<UsuarioResponse>([]);
  displayedColumns: string[] = ['nmUsuario', 'email', 'login', 'stUsuario', 'tpUsuario', 'dtCadastro', 'acao'];

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
