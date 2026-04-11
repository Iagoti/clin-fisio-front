import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-btn-excluir-usuario',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './btn-excluir-usuario.html',
  styleUrl: './btn-excluir-usuario.scss',
})
export class BtnExcluirUsuario {
  @Input({ required: true }) excluindo!: boolean;
  @Output() excluir = new EventEmitter<void>();

  onClick(): void {
    this.excluir.emit();
  }
}
