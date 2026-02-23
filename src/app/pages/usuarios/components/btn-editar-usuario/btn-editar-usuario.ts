import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioResponse } from '../../../../models/usuario/UsuarioResponse';

@Component({
  selector: 'app-btn-editar-usuario',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './btn-editar-usuario.html',
  styleUrl: './btn-editar-usuario.scss',
})
export class BtnEditarUsuario {
  @Input() usuario!: UsuarioResponse;
  @Output() editar = new EventEmitter<UsuarioResponse>();

  onClick(): void {
    this.editar.emit(this.usuario);
  }
}
