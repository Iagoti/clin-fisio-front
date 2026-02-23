import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioResponse } from '../../../../models/usuario/UsuarioResponse';

@Component({
  selector: 'app-btn-excluir-usuario',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './btn-excluir-usuario.html',
  styleUrl: './btn-excluir-usuario.scss',
})
export class BtnExcluirUsuario {
  @Input() usuario!: UsuarioResponse;
  @Output() excluir = new EventEmitter<UsuarioResponse>();

  onClick(): void {
    this.excluir.emit(this.usuario);
  }
}
