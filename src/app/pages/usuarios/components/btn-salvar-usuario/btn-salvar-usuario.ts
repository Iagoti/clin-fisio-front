import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-btn-salvar-usuario',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './btn-salvar-usuario.html',
  styleUrl: './btn-salvar-usuario.scss',
})
export class BtnSalvarUsuario {
  @Input({ required: true }) salvando!: boolean;
  @Input({ required: true }) isEdicao!: boolean;
}
