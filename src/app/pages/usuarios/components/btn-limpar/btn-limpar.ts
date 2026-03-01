import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-btn-limpar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './btn-limpar.html',
  styleUrl: './btn-limpar.scss',
})
export class BtnLimpar {
  @Output() limpar = new EventEmitter<void>();

  onClick(): void {
    this.limpar.emit();
  }
}
