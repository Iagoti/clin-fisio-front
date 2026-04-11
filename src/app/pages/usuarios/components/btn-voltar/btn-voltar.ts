import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-btn-voltar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './btn-voltar.html',
  styleUrl: './btn-voltar.scss',
})
export class BtnVoltar {
  @Input() ariaLabel = 'Voltar';
  @Output() voltar = new EventEmitter<void>();

  onClick(): void {
    this.voltar.emit();
  }
}
