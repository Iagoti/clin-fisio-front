import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SHARED_INPUT_IMPORTS } from '../../../../shared/input-modules';

@Component({
  selector: 'app-filtro-nome-usuario',
  standalone: true,
  imports: [...SHARED_INPUT_IMPORTS],
  templateUrl: './filtro-nome-usuario.html',
  styleUrl: './filtro-nome-usuario.scss',
})
export class FiltroNomeUsuario {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  @Input() label = 'Nome';
  @Input() placeholder = 'Digite o nome para buscar';

  onInput(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }
}
