import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filtro-usuario-ativo',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
  templateUrl: './filtro-usuario-ativo.html',
  styleUrl: './filtro-usuario-ativo.scss',
})
export class FiltroUsuarioAtivo {
  @Input() value = true;
  @Output() valueChange = new EventEmitter<boolean>();

  @Input() label = 'Somente ativos';

  onChange(checked: boolean): void {
    this.value = checked;
    this.valueChange.emit(checked);
  }
}
