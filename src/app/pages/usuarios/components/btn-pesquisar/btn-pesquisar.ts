import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-btn-pesquisar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './btn-pesquisar.html',
  styleUrl: './btn-pesquisar.scss',
})
export class BtnPesquisar {
  @Output() pesquisar = new EventEmitter<void>();

  onClick(): void {
    this.pesquisar.emit();
  }
}
